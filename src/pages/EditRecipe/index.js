import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import recipeService from '../../shared/services/recipeService';
import BackButton from '../../shared/components/BackButton';
import Loading from '../../shared/components/Loading';
import RecipeDetailsForm from '../AddRecipe/components/RecipeDetailsForm';
import IngredientsSectionForm from '../AddRecipe/components/IngredientsSectionForm';
import EmptyState from '../../shared/components/EmptyState';
import StepsSectionForm from '../AddRecipe/components/StepsSectionForm';
import Button from '../../shared/components/Button';

function EditRecipe() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    prep_time: '',
    cook_time: '',
  });
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);

  // Fetch recipe details
  useEffect(() => {
    const loadRecipe = async () => {
      setLoading(true);
      try {
        const recipeData = await recipeService.fetchRecipeDetails(id);
        setFormData({
          title: recipeData.title,
          description: recipeData.description,
          prep_time: recipeData.prep_time,
          cook_time: recipeData.cook_time,
        });
        setIngredients(recipeData.ingredients);
        setSteps(recipeData.steps);
      } catch (error) {
        alert('Failed to fetch recipe details.');
      } finally {
        setLoading(false);
      }
    };

    loadRecipe();
  }, [id]);

  const handleFormChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value
    }));
  };

  const handleIngredientAdded = (updatedIngredients) => {
    setIngredients(updatedIngredients);
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
    const step = {
      id: 0,
      instruction,
      recipe_id: id,
      step_number: steps.length + 1
    }
    setSteps((prev) => [...prev, step]);
  };

  const handleStepEdited = (updatedStep) => {
    setSteps((prev) =>
      prev.map((step) => (step.id === updatedStep.id ? updatedStep : step))
    );
  };

  const handleStepDeleted = (stepId) => {
    setSteps((prev) => prev.filter((step) => step.id !== stepId));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      await recipeService.updateRecipe(id, {
        ...formData,
        ingredients,
        steps
      });
      alert('Recipe updated successfully.');
    } catch (error) {
      console.error('Error updating recipe:', error.message);
      alert('Failed to update recipe.');
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="w-full flex justify-between items-center mb-4">
        <BackButton url={`/recipe/${id}`} />
        <Button isLoading={saveLoading} onClick={handleSave}>Save</Button>
      </div>
      <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">Edit Recipe</h1>
        {loading ? (
          <Loading />
        ) : (
          <>
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
              stepDeleted={handleStepDeleted}
            >
              {!(steps?.length > 0) && (
                <EmptyState message="No steps added yet. Add some to get started!" />
              )}
            </StepsSectionForm>
          </>

        )}
      </div>
    </div>
  );
}

export default EditRecipe;