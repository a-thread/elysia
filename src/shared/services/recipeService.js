import { supabase } from './supabase';

const fetchRecipeDetails = async (recipeId) => {
  try {
    const { data, error } = await supabase
      .from('recipes')
      .select(
        `
          *,
          ingredients (
            id,
            name
          ),
          steps (
            id,
            recipe_id,
            step_number,
            instruction
          )
        `
      )
      .eq('id', recipeId)
      .single();

    if (error) {
      console.error('Error fetching recipe details:', error.message);
      throw new Error('Failed to fetch recipe details.');
    }

    // Format the response
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      prep_time: data.prep_time,
      cook_time: data.cook_time,
      ingredients: data.ingredients.map((ingredient) => ingredient.name),
      steps: data.steps.sort((a, b) => a.step_number - b.step_number),
    };
  } catch (error) {
    console.error('Error in fetchRecipeDetails:', error.message);
    alert('An error occurred while fetching the recipe.');
    return null;
  }
};


const createRecipe = async ({ title, description, prep_time, cook_time, userId }) => {
  const { data, error } = await supabase
    .from('recipes')
    .insert([
      {
        title,
        description,
        prep_time: parseInt(prep_time, 10),
        cook_time: parseInt(cook_time, 10),
        user_id: userId,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  return data;
};

const addIngredients = async (recipeId, ingredients) => {
  const updatedIngredients = ingredients.map((ingredient) => ({
    recipe_id: recipeId,
    name: ingredient.trim(),
  }));

  const { error: insertError } = await supabase
    .from('ingredients')
    .insert(updatedIngredients)
    .select();

  if (insertError) throw insertError;
};


const addSteps = async (recipeId, steps) => {
  const stepData = steps.map((step, index) => ({
    recipe_id: recipeId,
    step_number: index + 1,
    instruction: step.instruction,
  }));

  if (stepData.length > 0) {
    const { error } = await supabase.from('steps').insert(stepData);
    if (error) throw error;
  }
};

const editIngredient = async (recipeId, ingredient) => {
  return await supabase
    .from('ingredients')
    .update({
      quantity: ingredient.quantity,
    })
    .eq('recipe_id', recipeId)
    .eq('id', ingredient.id);
};

export const reorderSteps = async (reorderedSteps) => {
  try {
    const { error } = await supabase.from('steps').upsert(reorderedSteps);

    if (error) {
      throw new Error(`Failed to update step order: ${error.message}`);
    }

    // Return the updated list of steps
    return reorderedSteps.map((step, index) => ({
      ...step,
      step_number: index + 1, // Sync updated step numbers in the returned array
    }));
  } catch (error) {
    console.error('Error reordering steps:', error.message);
    throw error;
  }
};

export const updateRecipe = async (recipeId, updatedRecipe) => {
  try {
    // Update main recipe data
    const { title, description, prep_time, cook_time, ingredients, steps } = updatedRecipe;
    const { error: recipeError } = await supabase
      .from('recipes')
      .update({ title, description, prep_time, cook_time })
      .eq('id', recipeId);

    if (recipeError) throw recipeError;

    // Handle ingredients
    const newIngredients = ingredients.filter((ingredient) => ingredient.id === 0);
    const existingIngredients = ingredients.filter((ingredient) => ingredient.id !== 0);

    for (const ingredient of existingIngredients) {
      const { error: ingredientError } = await editIngredient(recipeId, ingredient);

      if (ingredientError) throw ingredientError;
    }

    if (newIngredients.length > 0) {
      await addIngredients(recipeId, newIngredients);
    }

    // Handle steps
    const newSteps = steps.filter((step) => step.id === 0);
    const existingSteps = steps.filter((step) => step.id !== 0);

    for (const step of existingSteps) {
      const { error: stepError } = await supabase
        .from('steps')
        .update({
          step_number: step.step_number,
          instruction: step.instruction,
        })
        .eq('id', step.id);

      if (stepError) throw stepError;
    }

    if (newSteps.length > 0) {
      await addSteps(recipeId, newSteps);
    }
  } catch (error) {
    console.error('Error updating recipe:', error.message);
    throw error;
  }
};

export const deleteRecipe = async (recipeId) => {
  try {
    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', recipeId)

    if (error) {
      throw new Error('Failed to delete recipe.');
    }
  } catch (error) {
    console.error('Error deleting recipe:', error.message);
    throw error;
  }
}

const recipeService = {
  fetchRecipeDetails,
  createRecipe,
  addIngredients,
  addSteps,
  reorderSteps,
  updateRecipe,
  deleteRecipe,
};

export default recipeService;
