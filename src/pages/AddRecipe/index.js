import React, { useState } from 'react';
import RecipeDetailsForm from './components/RecipeDetailsForm';
import IngredientsSectionForm from './components/IngredientsSectionForm';
import StepsSectionForm from './components/StepsSectionForm';
import EmptyState from '../../shared/components/EmptyState';
import recipeService from '../../shared/services/recipeService';
import { supabase } from '../../shared/services/supabase';
import BackButton from '../../shared/components/BackButton';
import Button from '../../shared/components/Button';

function AddRecipe() {

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    prep_time: '',
    cook_time: '',
  });

  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(false);

  // Update form data
  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle recipe submission
  const handleAddRecipe = async (e) => {
    e.preventDefault();
    setLoading(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      alert('You need to be logged in to add a recipe.');
      setLoading(false);
      return;
    }

    const userId = session.user.id;

    try {
      // Create recipe
      const recipe = await recipeService.createRecipe({
        title: formData.title,
        description: formData.description,
        prep_time: parseInt(formData.prep_time, 10),
        cook_time: parseInt(formData.cook_time, 10),
        userId,
      });

      // Add ingredients and steps
      await recipeService.addIngredients(recipe.id, ingredients);
      await recipeService.addSteps(recipe.id, steps);

      alert('Recipe added successfully!');
      setFormData({ title: '', description: '', prep_time: '', cook_time: '' });
      setIngredients([]);
      setSteps([]);
    } catch (error) {
      console.error('Error adding recipe:', error.message);
      alert('Failed to add recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleIngredientAdded = (ingredient) => {
    setIngredients((prev) => [...prev, ingredient]);
  };

  const handleIngredientEdited = (updatedIngredient, index) => {
    setIngredients((prev) => {
      const newIngredients = [...prev];
      newIngredients[index] = updatedIngredient;
      return newIngredients;
    });
  };

  const handleIngredientDeleted = (index) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  const handleStepAdded = (instruction) => {
    setSteps((prev) => [...prev, instruction]);
  };

  const handleStepEdited = (updatedStep) => {
    setSteps((prev) =>
      prev.map((step) => (step.id === updatedStep.id ? updatedStep : step))
    );
  };

  const handleStepDeleted = (stepId) => {
    setSteps((prev) => prev.filter((step) => step.id !== stepId));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center">
        <BackButton />
        <Button onClick={handleAddRecipe} isLoading={loading}>Add</Button>
      </div>
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">Add a New Recipe</h1>
        <RecipeDetailsForm formData={formData} onFormChange={handleFormChange} />

        <IngredientsSectionForm
          ingredients={ingredients}
          setIngredients={handleIngredientAdded}
          onEditIngredient={handleIngredientEdited}
          onDeleteIngredient={handleIngredientDeleted}

        >
          {!(ingredients?.length > 0) && (
            <EmptyState message="No ingredients added yet. Add some to get started!" />
          )}
        </IngredientsSectionForm>

        <StepsSectionForm
          steps={steps}
          stepAdded={handleStepAdded}
          stepsReordered={setSteps}
          stepUpdated={handleStepEdited}
          stepDeleted={handleStepDeleted}>
          {!(steps?.length > 0) && (
            <EmptyState message="No steps added yet. Add some to get started!" />
          )}
        </StepsSectionForm>
      </div>
    </div>
  );
}

export default AddRecipe;
