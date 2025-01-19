import { supabase } from "./supabase";

const fetchRecipeDetails = async (recipeId, userId) => {
  try {
    const { data, error } = await supabase
      .from("recipes")
      .select(
        `
          *,
          ingredients(id, value),
          steps(id, sort_number, value),
          favorites!left(id)
        `
      )
      .eq("id", recipeId)
      .eq("favorites.user_id", userId)
      .single();

    if (error) throw new Error("Failed to fetch recipe details.");

    return {
      ...data,
      ingredients: data.ingredients
        .sort((a, b) => a.sort_number - b.sort_number)
        .map((ingredient) => ({
          ...ingredient,
          isActive: true,
        })),
      steps: data.steps
        .sort((a, b) => a.sort_number - b.sort_number)
        .map((step) => ({
          ...step,
          isActive: true,
        })),
      is_favorited: data.favorites.length > 0,
    };
  } catch (error) {
    console.error("Error fetching recipe details:", error.message);
    return null;
  }
};

const upsertRecipe = async (recipeId, updatedRecipe, userId = null) => {
  try {
    let newRecipeId = recipeId;

    // If it's a new recipe, insert it first
    if (!recipeId || recipeId === 0) {
      const { data, error: insertError } = await supabase
        .from("recipes")
        .insert([
          {
            title: updatedRecipe.title,
            description: updatedRecipe.description,
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
      const updatePayload = {};
      [
        "title",
        "description",
        "prep_time",
        "cook_time",
        "img_url",
        "original_recipe_url",
      ].forEach((field) => {
        if (updatedRecipe[field]) updatePayload[field] = updatedRecipe[field];
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
      updatedRecipe.ingredients?.filter((i) => !i.isActive).map((i) => i.id) ||
      [];
    const ingredientsToUpsert =
      updatedRecipe.ingredients
        ?.filter((i) => i.isActive)
        .map((ingredient, index) => ({
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
          .upsert(ingredientsToUpsert, { onConflict: ["id"] })
      );
    }

    // Process steps
    const stepsToDelete =
      updatedRecipe.steps?.filter((s) => !s.isActive).map((step) => step.id) ||
      [];
    const stepsToUpsert =
      updatedRecipe.steps
        ?.filter((s) => s.isActive)
        .map((step, index) => ({
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
        supabase.from("steps").upsert(stepsToUpsert, { onConflict: ["id"] })
      );
    }

    await Promise.all(promises);
    return { success: true, recipeId: newRecipeId };
  } catch (error) {
    console.error("Error updating or inserting recipe:", error.message);
    throw error;
  }
};

// Delete a recipe
const deleteRecipe = async (recipeId) => {
  try {
    const { error } = await supabase
      .from("recipes")
      .delete()
      .eq("id", recipeId);
    if (error) throw new Error("Failed to delete recipe.");
  } catch (error) {
    console.error("Error deleting recipe:", error.message);
    throw error;
  }
};

// Toggle favorite status
const toggleFavorite = async (recipeId, isFavorited, userId) => {
  try {
    if (isFavorited) {
      await supabase.from("favorites").delete().eq("recipe_id", recipeId);
    } else {
      await supabase
        .from("favorites")
        .insert([{ recipe_id: recipeId, user_id: userId }]);
    }
  } catch (error) {
    console.error("Error toggling favorite:", error.message);
    throw error;
  }
};

// File upload helpers
const sanitizeFileName = (fileName) => {
  const extension = fileName.split(".").pop();
  const baseName = fileName
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9_\-.]/g, "")
    .replace(/\s+/g, "_");
  return `${baseName}_${Date.now()}_${Math.floor(
    Math.random() * 10000
  )}.${extension}`;
};

const addPhoto = async (file) => {
  try {
    const safeName = sanitizeFileName(file.name);
    const { error } = await supabase.storage
      .from("elysia_recipe_photo")
      .upload(safeName, file, { cacheControl: "3600", upsert: true });
    if (error) throw new Error(`Error uploading file: ${error.message}`);
    return getPhotoUrl(safeName);
  } catch (error) {
    console.error("Error in addPhoto:", error.message);
    throw error;
  }
};

const getPhotoUrl = (filePath) => {
  const { data, error } = supabase.storage
    .from("elysia_recipe_photo")
    .getPublicUrl(filePath);
  if (error) throw new Error("Failed to get public URL");
  return data.publicUrl;
};

const deletePhoto = async (imgUrl) => {
  const filePath = imgUrl.split("/").slice(-1)[0];
  return await supabase.storage.from("elysia_recipe_photo").remove([filePath]);
};

// Export recipe service
const recipeService = {
  fetchRecipeDetails,
  updateRecipe: upsertRecipe,
  deleteRecipe,
  toggleFavorite,
  addPhoto,
  deletePhoto,
};

export default recipeService;
