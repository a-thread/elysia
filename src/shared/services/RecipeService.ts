import { Recipe } from "../models/Recipe";
import { StepIngredient } from "../models/StepIngredient";
import { supabase } from "./supabase";

const fetchRecipeList = async (currentSkip: number, currentPageSize: number, searchTerm: string = '') => {
  try {
    let query = supabase
      .from("recipe_search")
      .select("*", { count: "exact" })
      .range(currentSkip, currentSkip + currentPageSize - 1);

    if (searchTerm) {
      query = query.or(
        `title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,ingredients_text.ilike.%${searchTerm}%`
      );
    }

    const { data, count, error } = await query;

    if (error) throw new Error("Failed to fetch recipes.");

    return { data, count };
  } catch (error) {
    // console.error("Error fetching recipe list:", error.message);
    return null;
  }
};



const fetchRecipeDetails = async (recipeId: string | undefined, userId: string | undefined) => {
  try {
    let query = supabase
      .from("recipes")
      .select(
        `
          *,
          ingredients(id, sort_number, value),
          steps(id, sort_number, value),
          recipe_to_users(permission)
        `
      )
      .eq("id", recipeId);

    if (userId) {
      query = query.or(`is_public.eq.true,user_id.eq.${userId}`);
    } else {
      query = query.eq("is_public", true);
    }

    const { data, error } = await query.maybeSingle(); // Use `maybeSingle()` to avoid errors if no data is returned

    if (error) throw new Error("Failed to fetch recipe details.");

    return {
      ...data,
      total_time: data.prep_time + data.cook_time || 0,
      ingredients: data.ingredients
        .sort((a: StepIngredient, b: StepIngredient) => a.sort_number - b.sort_number)
        .map((ingredient: StepIngredient) => ({
          ...ingredient,
          isActive: true,
        })),
      steps: data.steps
        .sort((a: StepIngredient, b: StepIngredient) => a.sort_number - b.sort_number)
        .map((step: StepIngredient) => ({
          ...step,
          isActive: true,
        })),
      can_edit:
        data.user_id === userId ||
        (data.recipe_to_users && data.recipe_to_users.permission === "edit"),
    };
  } catch (error: any) {
    console.error("Error fetching recipe details:", error.message);
    return null;
  }
};

const upsertRecipe = async (recipeId: string | undefined, updatedRecipe: Partial<Recipe>, userId?: string | undefined) => {
  try {
    let newRecipeId = recipeId;

    // If it's a new recipe, insert it first
    if (!recipeId) {
      const { data, error: insertError } = await supabase
        .from("recipes")
        .insert([
          {
            title: updatedRecipe.title,
            description: updatedRecipe.description,
            servings: updatedRecipe.servings,
            prep_time: updatedRecipe.prep_time,
            cook_time: updatedRecipe.cook_time,
            img_url: updatedRecipe.img_url,
            original_recipe_url: updatedRecipe.img_url,
            user_id: userId,
          },
        ])
        .select()
        .single();

      if (insertError)
        throw new Error(`Failed to insert new recipe: ${insertError.message}`);
      newRecipeId = data.id;
    } else {
      // If updating, create the update payload
      const updatePayload: Partial<Recipe> = {};
      ([
        "title",
        "description",
        "prep_time",
        "cook_time",
        "img_url",
        "original_recipe_url",
      ] as (keyof Recipe)[]).forEach((field) => {
        if (updatedRecipe[field]) updatePayload[field] = updatedRecipe[field] as any;
      });

      if (Object.keys(updatePayload).length > 0) {
        const { error: updateError } = await supabase
          .from("recipes")
          .update(updatePayload)
          .eq("id", recipeId);

        if (updateError)
          throw new Error(`Failed to update recipe: ${updateError.message}`);
      }
    }

    // Process ingredients
    const promises = [];

    const ingredientsToDelete =
      updatedRecipe.ingredients?.filter((i: StepIngredient) => !i.isActive).map((i: any) => i.id) ||
      [];
    const ingredientsToUpsert =
      updatedRecipe.ingredients
        ?.filter((i: StepIngredient) => i.isActive)
        .map((ingredient: StepIngredient, index: number) => ({
          id: ingredient.id,
          sort_number: index + 1,
          recipe_id: newRecipeId,
          value: ingredient.value,
        })) || [];

    if (ingredientsToDelete.length) {
      promises.push(
        supabase.from("ingredients").delete().in("id", ingredientsToDelete)
      );
    }

    if (ingredientsToUpsert.length) {
      promises.push(
        supabase
          .from("ingredients")
          .upsert(ingredientsToUpsert, { onConflict: "id" })
      );
    }

    // Process steps
    const stepsToDelete =
      updatedRecipe.steps?.filter((s: StepIngredient) => !s.isActive).map((step: StepIngredient) => step.id) ||
      [];
    const stepsToUpsert =
      updatedRecipe.steps
        ?.filter((s: StepIngredient) => s.isActive)
        .map((step: StepIngredient, index: number) => ({
          id: step.id,
          recipe_id: newRecipeId,
          sort_number: index + 1,
          value: step.value,
        })) || [];

    if (stepsToDelete.length) {
      promises.push(supabase.from("steps").delete().in("id", stepsToDelete));
    }

    if (stepsToUpsert.length) {
      promises.push(
        supabase.from("steps").upsert(stepsToUpsert, { onConflict: "id" })
      );
    }

    await Promise.all(promises);
    return { success: true, recipeId: newRecipeId };
  } catch (error: any) {
    console.error("Error updating or inserting recipe:", error.message);
    throw error;
  }
};

// Delete a recipe
const deleteRecipe = async (recipeId: string | undefined) => {
  try {
    const { error } = await supabase
      .from("recipes")
      .delete()
      .eq("id", recipeId);
    if (error) throw new Error("Failed to delete recipe.");
  } catch (error: any) {
    console.error("Error deleting recipe:", error.message);
    throw error;
  }
};

const RecipeService = {
  fetchRecipeList,
  fetchRecipeDetails,
  upsertRecipe,
  deleteRecipe,
};

export default RecipeService;
