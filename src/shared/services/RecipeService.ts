import { Recipe } from "../models/Recipe";
import { supabaseWithAbort } from "./SupabaseWithAbort";
import { TableNames } from "./TableNames";
import { StepIngredientDto } from "@shared/models/StepIngredientDto";

const getList = async (
  currentSkip: number,
  currentPageSize: number,
  searchTerm: string = "",
  userId?: string
) => {
  return await supabaseWithAbort.request("fetchRecipeList", async (client) => {
    let query = client
      .from(TableNames.RECIPE_SEARCH)
      .select("*", { count: "exact" });

    // Only filter by user permissions if a user is logged in
    if (userId) {
      query = query.or(
          `is_public.eq.true,user_permissions.cs.["${userId}"],user_id.eq.${userId}`
      );
    } else {
      // If no user, only show public recipes
      query = query.eq("is_public", true);
    }

    if (searchTerm) {
      query = query.or(
        `title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,ingredients_text.ilike.%${searchTerm}%`
      );
    }

    const { data, count, error } = await query.range(
      currentSkip,
      currentSkip + currentPageSize - 1
    );

    if (error) throw new Error("Failed to fetch recipes.");
    return { data, count };
  });
};


const getListWithTags = async (
  currentSkip: number,
  currentPageSize: number,
  searchTerm: string = "",
  userId?: string // User ID is now optional
) => {
  return await supabaseWithAbort.request(
    "fetchRecipeListWithTags",
    async (client) => {
      let query = client
        .from(TableNames.RECIPE_SEARCH)
        .select("*", { count: "exact" });

      // Only filter by user permissions if a user is logged in
      if (userId) {
        query = query.or(
          `is_public.eq.true,user_permissions.cs.[${userId}],user_id.eq.${userId}`
        );
      } else {
        // If no user, only show public recipes
        query = query.eq("is_public", true);
      }

      if (searchTerm) {
        query = query.or(
          `title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,ingredients_text.ilike.%${searchTerm}%,tags_text.ilike.%${searchTerm}%`
        );
      }

      const { data, count, error } = await query.range(
        currentSkip,
        currentSkip + currentPageSize - 1
      );

      if (error) throw new Error("Failed to fetch recipes.");
      return { data, count };
    }
  );
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
      ingredients!left(id, sort_number, value),
      steps!left(id, sort_number, value),
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
          .insert([{ ...updatedRecipe, user_id: userId }])
          .select()
          .single();
        if (error)
          throw new Error(`Failed to insert new recipe: ${error.message}`);
        recipeId = data.id;
      } else {
        const { error } = await client
          .from(TableNames.RECIPES)
          .update(updatedRecipe)
          .eq("id", recipeId);
        if (error) throw new Error(`Failed to update recipe: ${error.message}`);
      }
      return { success: true, recipeId };
    }
  );
};

const deleteIngredients = async (
  idsToDelete: string[]
) => {
  return await supabaseWithAbort.request(
    `deleteIngredients`,
    async (client) => {
      const { error } = await client
        .from(TableNames.INGREDIENTS)
        .delete()
        .in("id", idsToDelete);
      if (error)
        throw new Error(`Failed to delete ingredients: ${error.message}`);
    }
  );
};

const upsertIngredients = async (
  ingredientsToUpsert: StepIngredientDto[]
) => {
  return await supabaseWithAbort.request(
    `upsertIngredients`,
    async (client) => {
      const { error } = await client
        .from(TableNames.INGREDIENTS)
        .upsert(ingredientsToUpsert, { onConflict: "id" });
      if (error)
        throw new Error(`Failed to upsert ingredients: ${error.message}`);
    }
  );
};

const deleteSteps = async (
  idsToDelete: string[]
) => {
  return await supabaseWithAbort.request(
    `deleteSteps`,
    async (client) => {
      const { error } = await client
        .from(TableNames.STEPS)
        .delete()
        .in("id", idsToDelete);
      if (error)
        throw new Error(`Failed to delete steps: ${error.message}`);
    }
  );
};

const upsertSteps = async (
  stepsToUpsert: StepIngredientDto[]
) => {
  return await supabaseWithAbort.request(
    `upsertSteps`,
    async (client) => {
      const { error } = await client
        .from(TableNames.STEPS)
        .upsert(stepsToUpsert, { onConflict: "id" });
      if (error)
        throw new Error(`Failed to delete steps: ${error.message}`);
    }
  );
};

const deleteById = async (recipeId: string | undefined) => {
  return await supabaseWithAbort.request(
    `deleteRecipe-${recipeId}`,
    async (client) => {
      const { error } = await client
        .from(TableNames.RECIPES)
        .delete()
        .eq("id", recipeId);
      if (error) throw new Error("Failed to delete recipe.");
    }
  );
};

const addOneToManyCollections = async (
  recipeId: string,
  collectionIds: string[]
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

const removeManyFromCollection = async (
  collection_id: string,
  recipes: Recipe[]
) => {
  const recipeIds = recipes.map((recipe) => recipe.id);

  return await supabaseWithAbort.request(
    `removeManyFromCollection-${collection_id}`,
    async (client) => {
      const { error } = await client
        .from(TableNames.COLLECTION_TO_RECIPES)
        .delete()
        .eq("collection_id", collection_id)
        .in("recipe_id", recipeIds);

      if (error) throw new Error("Failed to remove recipes from collection.");
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
  return await supabaseWithAbort.request(
    `togglePublicShare-${recipeId}`,
    async (client) => {
      const { error } = await client
        .from(TableNames.RECIPES)
        .update({ is_public: !isPublic })
        .eq("id", recipeId);

      if (error) {
        throw new Error("Failed to update public status.");
      }
      return !isPublic;
    }
  );
};

const shareWithUser = async (
  recipeId: string | undefined,
  userId: string,
  permission: string
) => {
  return await supabaseWithAbort.request(
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
};

const revokeAccess = async (shareId: string) => {
  return await supabaseWithAbort.request(
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
};

const RecipeService = {
  getList,
  getListWithTags,
  getDetail,
  upsert,
  upsertIngredients,
  deleteIngredients,
  upsertSteps,
  deleteSteps,
  deleteById,
  addOneToManyCollections,
  addManyToOneCollection,
  removeManyFromCollection,
  getSharedUsers,
  getIsPublic,
  setIsPublic,
  shareWithUser,
  revokeAccess,
};

export default RecipeService;
