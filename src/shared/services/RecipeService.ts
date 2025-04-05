import { Recipe } from "../models/Recipe";
import { supabaseWithAbort } from "./SupabaseWithAbort";
import { TableNames } from "./TableNames";
import { IdTitle } from "@shared/models/Tag";

const getRecipeList = async (
  currentSkip: number,
  currentPageSize: number,
  searchTerm: string = "",
  userId?: string,
  selectedTags: IdTitle[] = []
) => {
  return await supabaseWithAbort.request("fetchRecipeList", async (client) => {
    let query = client
      .from("recipes")
      .select("*", { count: "exact" });

    // 🔐 Visibility filtering
    if (userId) {
      query = query.or(`is_public.eq.true,user_id.eq.${userId}`);
    } else {
      query = query.eq("is_public", true);
    }

    // 🔍 Full-text search
    if (searchTerm) {
      query = query.or(
        `title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,ingredients_text.ilike.%${searchTerm}%,tags_text.ilike.%${searchTerm}%`
      );
    }

    // 🏷️ Tag filtering (broad match via tags_text)
    if (selectedTags.length) {
      selectedTags.forEach((tag) => {
        query = query.or(`tags_text.ilike.%${tag.title}%`);
      });
    }

    const { data, count, error } = await query.range(
      currentSkip,
      currentSkip + currentPageSize - 1
    );

    if (error) throw new Error("Failed to fetch recipes.");
    return { data, count };
  });
};


const getDetail = async (
  recipeId: string | undefined,
  userId: string | undefined
) => {
  return await supabaseWithAbort.request(
    `fetchRecipeDetails-${recipeId}`,
    async (client) => {
      let query = client
        .from(TableNames.RECIPES)
        .select(
          `
      id, title, description, img_url, user_id, is_public, servings, prep_time, cook_time, original_recipe_url,
      ingredients,
      steps,
      recipe_to_users!left(permission),
      collection_to_recipes!left(collections!inner(id, title)),
      recipe_to_tags!left(tags!inner(id, title))
    `
        )
        .eq("id", recipeId);

      if (userId) {
        query = query.or(`is_public.eq.true,user_id.eq.${userId}`);
      } else {
        query = query.eq("is_public", true);
      }

      const { data, error } = await query.maybeSingle();
      if (error) throw new Error("Failed to fetch recipe details.");
      if (!data) throw new Error("No data returned for the given recipe.");

      return data;
    }
  );
};

const upsert = async (
  recipeId: string | undefined,
  updatedRecipe: Partial<Recipe>,
  userId?: string | undefined
) => {
  return await supabaseWithAbort.request(
    `upsertRecipe-${recipeId || "new"}`,
    async (client) => {
      if (!recipeId) {
        const { data, error } = await client
          .from(TableNames.RECIPES)
          .insert([{
            title: updatedRecipe.title,
            prep_time: updatedRecipe.prep_time,
            cook_time: updatedRecipe.cook_time,
            servings: updatedRecipe.servings,
            original_recipe_url: updatedRecipe.original_recipe_url,
            ingredients: updatedRecipe.ingredients,
            steps: updatedRecipe.steps,
            is_public: updatedRecipe.is_public,
            description: updatedRecipe.description,
            img_url: updatedRecipe.img_url,
            user_id: userId
          }])
          .select()
          .single();
        if (error)
          throw new Error(`Failed to insert new recipe: ${error.message}`);
        recipeId = data.id;
      } else {
        const { error } = await client
          .from(TableNames.RECIPES)
          .update({
            title: updatedRecipe.title,
            prep_time: updatedRecipe.prep_time,
            cook_time: updatedRecipe.cook_time,
            servings: updatedRecipe.servings,
            original_recipe_url: updatedRecipe.original_recipe_url,
            ingredients: updatedRecipe.ingredients,
            steps: updatedRecipe.steps,
            is_public: updatedRecipe.is_public,
            description: updatedRecipe.description,
            img_url: updatedRecipe.img_url,
            user_id: userId
          })
          .eq("id", recipeId);
        if (error) throw new Error(`Failed to update recipe: ${error.message}`);
      }
      return { success: true, recipeId };
    }
  );
};

const deleteById = async (recipeId: string | undefined) => {
  await supabaseWithAbort.request(
    `deleteRecipe-${recipeId}`,
    async (client) => {
      const { error } = await client
        .from(TableNames.RECIPES)
        .delete()
        .eq("id", recipeId);
      if (error) throw new Error("Failed to delete recipe.");
    }
  );
  return await refreshRecipeSearch();
};

const addOneToManyCollections = async (
  recipeId: string,
  collectionIds: (string | undefined)[]
) => {
  const upsertItems = collectionIds.map((id) => ({
    recipe_id: recipeId,
    collection_id: id,
  }));
  return await supabaseWithAbort.request(
    `addOneToManyCollections-${recipeId}`,
    async (client) => {
      const { error } = await client
        .from(TableNames.COLLECTION_TO_RECIPES)
        .insert(upsertItems);
      if (error) throw new Error("Failed to delete collection.");
    }
  );
};

const addManyToOneCollection = async (
  collection_id: string,
  recipes: Recipe[]
) => {
  const upsertItems = recipes.map((recipe) => ({
    recipe_id: recipe.id,
    collection_id: collection_id,
  }));
  return await supabaseWithAbort.request(
    `addManyToOneCollection-${collection_id}`,
    async (client) => {
      const { error } = await client
        .from(TableNames.COLLECTION_TO_RECIPES)
        .insert(upsertItems);
      if (error) throw new Error("Failed to delete collection.");
    }
  );
};

const removeManyFromManyCollections = async (
  collectionIds: string[],
  recipeIds: string[]
) => {
  return await supabaseWithAbort.request(
    `removeManyFromManyCollections`,
    async (client) => {
      const { error } = await client
        .from(TableNames.COLLECTION_TO_RECIPES)
        .delete()
        .in("collection_id", collectionIds)
        .in("recipe_id", recipeIds);

      if (error)
        throw new Error("Failed to remove recipes from collection(s).");
    }
  );
};

const getSharedUsers = async (recipeId: string | undefined) => {
  return await supabaseWithAbort.request(
    `fetchSharedUsers-${recipeId}`,
    async (client) => {
      const { data, error } = await client
        .from(TableNames.RECIPE_TO_USERS)
        .select("id, user_id, permission, users(email)")
        .eq("recipe_id", recipeId);

      if (error) {
        console.error("Error fetching shared users:", error);
        return [];
      }
      return data || [];
    }
  );
};

const getIsPublic = async (recipeId: string | undefined) => {
  return await supabaseWithAbort.request(
    `fetchRecipeVisibility-${recipeId}`,
    async (client) => {
      const { data, error } = await client
        .from(TableNames.RECIPES)
        .select("is_public")
        .eq("id", recipeId)
        .single();

      if (error) {
        console.error("Error fetching recipe visibility:", error);
        return false;
      }
      return data.is_public;
    }
  );
};

const setIsPublic = async (recipeId: string | undefined, isPublic: boolean) => {
  await supabaseWithAbort.request(
    `togglePublicShare-${recipeId}`,
    async (client) => {
      const { error } = await client
        .from(TableNames.RECIPES)
        .update({ is_public: isPublic })
        .eq("id", recipeId);

      if (error) {
        throw new Error("Failed to update public status.");
      }
      return !isPublic;
    }
  );
  return await refreshRecipeSearch();
};

const shareWithUser = async (
  recipeId: string | undefined,
  userId: string,
  permission: string
) => {
  await supabaseWithAbort.request(
    `shareRecipe-${recipeId}-${userId}`,
    async (client) => {
      const { error } = await client
        .from(TableNames.RECIPE_TO_USERS)
        .insert([{ recipe_id: recipeId, user_id: userId, permission }]);

      if (error) {
        throw new Error("Failed to share recipe.");
      }
    }
  );
  return await refreshRecipeSearch();
};

const revokeAccess = async (shareId: string) => {
  await supabaseWithAbort.request(
    `revokeUserAccess-${shareId}`,
    async (client) => {
      const { error } = await client
        .from(TableNames.RECIPE_TO_USERS)
        .delete()
        .eq("id", shareId);

      if (error) {
        throw new Error("Failed to revoke access.");
      }
    }
  );
  return await refreshRecipeSearch();
};

const refreshRecipeSearch = async () => {
  await supabaseWithAbort.request(`refreshSearch`, async (client) => {
    const { error } = await client.rpc("refresh_recipe_search");
    if (error) {
      throw new Error("Failed to refresh search.");
    }
  });
};

const RecipeService = {
  getRecipeList,
  getDetail,
  upsert,
  deleteById,
  addOneToManyCollections,
  addManyToOneCollection,
  removeManyFromManyCollections,
  getSharedUsers,
  getIsPublic,
  setIsPublic,
  shareWithUser,
  revokeAccess,
  refreshRecipeSearch,
};

export default RecipeService;
