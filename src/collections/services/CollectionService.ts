import { supabaseWithAbort } from "@shared/services/SupabaseWithAbort";
import { Collection } from "@collections/models/Collection";
import { TableNames } from "@shared/services/TableNames";
import { Permission } from "@shared/models/Permission";

const getList = async (
  currentSkip: number,
  currentPageSize: number,
  searchTerm: string,
  userId?: string,
) => {
  return await supabaseWithAbort.request("getList", async (client) => {
    let query = client
      .from(TableNames.COLLECTIONS)
      .select("*", { count: "exact" });

    // If userId is provided, fetch both public collections and those owned by the user.
    if (userId) {
      query = query.or(`is_public.eq.true,user_id.eq.${userId}`);
    } else {
      query = query.eq("is_public", true);
    }

    if (searchTerm) {
      query = query.or(
        `title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`,
      );
    }
    const { data, count, error } = await query.range(
      currentSkip,
      currentSkip + currentPageSize - 1,
    );
    if (error) throw new Error("Failed to fetch collections.");
    return { data, count };
  });
};

/**
 * Dedupes recipes by id. A recipe can be linked to a collection directly or via a shared tag.
 */
export const mergeCollectionRecipes = (data: {
  collection_to_recipes?: { recipes: any }[] | null;
  collection_to_tags?: { tags: any }[] | null;
}) => {
  const directRecipes =
    data.collection_to_recipes?.flatMap((item) => {
      const recipe = item.recipes;
      return {
        ...recipe,
        tags: recipe?.recipe_to_tags?.map((tag: any) => tag.tags) || [],
      };
    }) || [];

  const taggedRecipes =
    data.collection_to_tags?.flatMap((item) => {
      return (
        item.tags?.recipe_to_tags?.map((taggedRecipe: any) => ({
          ...taggedRecipe.recipes,
          tags:
            taggedRecipe.recipes?.recipe_to_tags?.map((tag: any) => tag.tags) ||
            [],
        })) || []
      );
    }) || [];

  const recipeMap = new Map();
  [...directRecipes, ...taggedRecipes].forEach((recipe) => {
    recipeMap.set(recipe.id, recipe);
  });
  return Array.from(recipeMap.values());
};

const getDetail = async (collectionId: string, userId: string | undefined) => {
  return await supabaseWithAbort.request(
    `getDetail-${collectionId}`,
    async (client) => {
      let query = client
        .from(TableNames.COLLECTIONS)
        .select(
          `
          id, title, description, img_url, is_public, user_id, public_permission,
          collection_to_recipes!left(
            recipes!inner(
              id, title, description, img_url, user_id, is_public,
              recipe_to_tags!left(tags!inner(id, title))
            )
          ),
          collection_to_tags!left(tags!inner(id, title, recipe_to_tags!left(recipes!inner(id, title, description, img_url, user_id, is_public)))) ,
          collection_to_users!left(permission)
          `,
        )
        .eq("id", collectionId);

      if (userId) {
        query = query.or(`is_public.eq.true,user_id.eq.${userId}`);
      } else {
        query = query.eq("is_public", true);
      }

      const { data, error } = await query.maybeSingle();
      if (error) throw new Error("Failed to fetch collection details.");
      if (!data) throw new Error("No data returned.");

      const collectionTags =
        data.collection_to_tags?.flatMap((item) => item.tags) || [];

      const isOwner = data.user_id === userId;

      return {
        ...data,
        recipes: mergeCollectionRecipes(data),
        tags: collectionTags,
        is_owner: isOwner,
        can_edit:
          isOwner ||
          (data.collection_to_users?.some(
            (share) => share.permission === "edit",
          ) ??
            false) ||
          (data.is_public && data.public_permission === "edit" && !!userId),
      };
    },
  );
};

const upsert = async (
  collectionId: string,
  simpleValues: Partial<Collection>,
  userId?: string,
) => {
  return await supabaseWithAbort.request(
    `upsert-${collectionId || "new"}`,
    async (client) => {
      let newCollectionId = collectionId;
      if (!collectionId) {
        const { data, error } = await client
          .from(TableNames.COLLECTIONS)
          .insert([
            {
              title: simpleValues.title,
              description: simpleValues.description,
              img_url: simpleValues.img_url,
              is_public: simpleValues.is_public,
              user_id: userId,
            },
          ])
          .select()
          .single();
        if (error)
          throw new Error(`Failed to insert new collection: ${error.message}`);
        newCollectionId = data.id;
      } else {
        const { error } = await client
          .from(TableNames.COLLECTIONS)
          .update(simpleValues)
          .eq("id", collectionId);
        if (error)
          throw new Error(`Failed to update collection: ${error.message}`);
      }
      return { success: true, collectionId: newCollectionId };
    },
  );
};

const deleteById = async (collectionId: string) => {
  return await supabaseWithAbort.request(
    `deleteById-${collectionId}`,
    async (client) => {
      const { error } = await client
        .from(TableNames.COLLECTIONS)
        .delete()
        .eq("id", collectionId);
      if (error) throw new Error("Failed to delete collection.");
    },
  );
};

const setIsPublic = async (
  collectionId: string,
  isPublic: boolean,
  publicPermission: Permission = "read",
) => {
  return await supabaseWithAbort.request(
    `setIsPublic-${collectionId}`,
    async (client) => {
      const { error } = await client
        .from(TableNames.COLLECTIONS)
        .update({ is_public: isPublic, public_permission: publicPermission })
        .eq("id", collectionId);

      if (error) {
        throw new Error("Failed to update public status.");
      }
      return isPublic;
    },
  );
};

const fetchSharedUsers = async (collectionId: string) => {
  return await supabaseWithAbort.request(
    `fetchSharedUsers-${collectionId}`,
    async (client) => {
      const { data, error } = await client
        .from(TableNames.COLLECTION_TO_USERS)
        .select("id, user_id, permission, users(email)")
        .eq("collection_id", collectionId);

      if (error) {
        console.error("Error fetching shared users:", error);
        return [];
      }
      return data || [];
    },
  );
};

const share = async (
  collectionId: string,
  userId: string,
  permission: Permission,
) => {
  return await supabaseWithAbort.request(
    `share-${collectionId}-${userId}`,
    async (client) => {
      const { error } = await client
        .from(TableNames.COLLECTION_TO_USERS)
        .insert([{ collection_id: collectionId, user_id: userId, permission }]);

      if (error) {
        throw new Error("Failed to share collection.");
      }
    },
  );
};

const revokeAccess = async (shareId: string) => {
  return await supabaseWithAbort.request(
    `revokeAccess-${shareId}`,
    async (client) => {
      const { error } = await client
        .from(TableNames.COLLECTION_TO_USERS)
        .delete()
        .eq("id", shareId);

      if (error) {
        throw new Error("Failed to revoke access.");
      }
    },
  );
};

const getIsPublic = async (collectionId: string) => {
  return await supabaseWithAbort.request(
    `getIsPublic-${collectionId}`,
    async (client) => {
      const { data, error } = await client
        .from(TableNames.COLLECTIONS)
        .select("is_public")
        .eq("id", collectionId)
        .single();

      if (error) {
        console.error("Error fetching collection visibility:", error);
        return false;
      }
      return data.is_public;
    },
  );
};

const CollectionService = {
  getList,
  getDetail,
  upsert,
  deleteById,
  getIsPublic,
  setIsPublic,
  fetchSharedUsers,
  share,
  revokeAccess,
};

export default CollectionService;
