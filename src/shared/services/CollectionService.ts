import { supabaseWithAbort } from "./SupabaseWithAbort";
import { Collection } from "@shared/models/Collection";
import { TableNames } from "./TableNames";

const getList = async (
  currentSkip: number,
  currentPageSize: number,
  searchTerm: string
) => {
  return await supabaseWithAbort.request("getList", async (client) => {
    let query = client
      .from(TableNames.COLLECTIONS)
      .select("*", { count: "exact" });
    if (searchTerm) {
      query = query.or(
        `title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`
      );
    }
    const { data, count, error } = await query.range(
      currentSkip,
      currentSkip + currentPageSize - 1
    );
    if (error) throw new Error("Failed to fetch collections.");
    return { data, count };
  });
};

const getDetail = async (collectionId: string, userId: string) => {
  return await supabaseWithAbort.request(
    `getDetail-${collectionId}`,
    async (client) => {
      let query = client
        .from(TableNames.COLLECTIONS)
        .select(
          `
          id, title, description, img_url, is_public, user_id,
          collection_to_recipes!left(
            recipes!inner(
              id, title, description, img_url, user_id, is_public, 
              recipe_to_tags!left(tags!inner(id, title))
            )
          ),
          collection_to_tags!left(tags!inner(id, title, recipe_to_tags!left(recipes!inner(id, title, description, img_url, user_id, is_public)))) ,
          collection_to_users!left(permission)
          `
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

      // Extract collection-level tags
      const collectionTags = data?.collection_to_tags?.flatMap((item) => item.tags) || [];
      
      // Extract recipes directly associated with the collection
      const directRecipes = data?.collection_to_recipes?.flatMap((item) => {
        const recipe = item.recipes;
        return { ...recipe, tags: (recipe as any).recipe_to_tags?.map((tag: any) => tag.tags) || [] };
      }) || [];
      
      // Extract recipes associated with tags linked to the collection
      const taggedRecipes = (data as any)?.collection_to_tags?.flatMap((item: any) => {
        return item.tags.recipe_to_tags?.map((taggedRecipe: any) => {
          return { ...taggedRecipe.recipes, tags: taggedRecipe.recipes.recipe_to_tags?.map((tag: any) => tag.tags) || [] };
        }) || [];
      }) || [];
      
      // Merge recipes, ensuring uniqueness
      const recipeMap = new Map();
      [...directRecipes, ...taggedRecipes].forEach((recipe) => {
        recipeMap.set(recipe.id, recipe);
      });
      
      return {
        ...data,
        recipes: Array.from(recipeMap.values()),
        tags: collectionTags,
        can_edit:
          data.user_id === userId ||
          (data.collection_to_users &&
            data.collection_to_users.some((share) => share.permission === "edit")),
      };
    }
  );
};

const upsert = async (
  collectionId: string,
  simpleValues: Partial<Collection>,
  userId?: string
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
    }
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
    }
  );
};

const setIsPublic = async (collectionId: string, isPublic: boolean) => {
  return await supabaseWithAbort.request(
    `setIsPublic-${collectionId}`,
    async (client) => {
      const { error } = await client
        .from(TableNames.COLLECTIONS)
        .update({ is_public: !isPublic })
        .eq("id", collectionId);

      if (error) {
        throw new Error("Failed to update public status.");
      }
      return !isPublic;
    }
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
    }
  );
};

const share = async (
  collectionId: string,
  userId: string,
  permission: string
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
    }
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
    }
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
    }
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
