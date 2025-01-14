import React, { useEffect, useState } from 'react';
import RecipeDetailsForm from './components/RecipeDetailsForm';
import IngredientsSectionForm from './components/IngredientsSectionForm';
import StepsSectionForm from './components/StepsSectionForm';
import EmptyState from '../../shared/components/EmptyState';
import recipeService from '../../shared/services/recipeService';
import BackButton from '../../shared/components/BackButton';
import Button from '../../shared/components/Button';
import { useAuth } from '../../shared/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

function AddRecipe() {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    prep_time: '',
    cook_time: '',
  });
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const existingRecipe = location.state.recipe;
    if (existingRecipe) {
      setFormData({
        title: existingRecipe.title || '',
        description: existingRecipe.description || '',
        prep_time: existingRecipe.prep_time || '',
        cook_time: existingRecipe.cook_time || '',
      });
      setIngredients(existingRecipe.ingredients || []);
      setSteps(existingRecipe.steps || []);
    }
  }, [location.state.recipe]);

  const onFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const onAddClick = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const recipe = await recipeService.createRecipe({
        title: formData.title,
        description: formData.description,
        prep_time: parseInt(formData.prep_time, 10),
        cook_time: parseInt(formData.cook_time, 10),
        userId: user.id,
      });

      await recipeService.addIngredients(recipe.id, ingredients);
      await recipeService.addSteps(recipe.id, steps);

      alert('Recipe added successfully!');
      navigate(`/recipe/${recipe.id}`);
    } catch (error) {
      console.error('Error adding recipe:', error.message);
      alert('Failed to add recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center">
        <BackButton />
        <Button onClick={onAddClick} isLoading={loading}>Add</Button>
      </div>
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">Add a New Recipe</h1>
        <RecipeDetailsForm formData={formData} onFormChange={onFormChange} />

        <IngredientsSectionForm
          ingredients={ingredients}
          setIngredients={setIngredients}
        >
          {!(ingredients?.length > 0) && (
            <EmptyState message="No ingredients added yet. Add some to get started!" />
          )}
        </IngredientsSectionForm>

        <StepsSectionForm
          steps={steps}
          setSteps={setSteps}>
          {!(steps?.length > 0) && (
            <EmptyState message="No steps added yet. Add some to get started!" />
          )}
        </StepsSectionForm>
      </div>
    </div>
  );
}

export default AddRecipe;
