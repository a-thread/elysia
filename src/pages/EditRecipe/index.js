import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import recipeService from '../../shared/services/recipeService';
import BackButton from '../../shared/components/BackButton';
import Loading from '../../shared/components/Loading';
import RecipeDetailsForm from '../../shared/components/RecipeDetailsForm';
import IngredientsSectionForm from '../../shared/components/IngredientsSectionForm';
import EmptyState from '../../shared/components/EmptyState';
import StepsSectionForm from '../../shared/components/StepsSectionForm';
import Button from '../../shared/components/Button';
import PhotoUpload from '../../shared/components/PhotoUpload';

function EditRecipe() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    img_url: '',
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
          img_url: recipeData.img_url,
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

  const onFormChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value
    }));
  };

  const onIngredientAdded = (updatedIngredients) => {
    setIngredients(updatedIngredients);
  };

  const onIngredientEdited = (updatedIngredient, index) => {
    setIngredients((prev) => {
      const newIngredients = [...prev];
      newIngredients[index] = updatedIngredient;
      return newIngredients;
    });
  };

  const onIngredientDeleted = (index) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  const onSave = async (e) => {
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
        <Button isLoading={saveLoading} onClick={onSave}>Save</Button>
      </div>
      <PhotoUpload imgUrl={formData.img_url} onImgUrlChange={(url) => onFormChange('img_url', url)} />
      <div className={`bg-white dark:bg-gray-900 p-6 rounded-b-lg shadow-md ${!formData.img_url?.length && 'rounded-t-lg'}`}>
        {loading ? (
          <Loading />
        ) : (
          <>
            <RecipeDetailsForm formData={formData} onFormChange={onFormChange} />
            <IngredientsSectionForm
              ingredients={ingredients}
              setIngredients={onIngredientAdded}
              onEditIngredient={onIngredientEdited}
              onDeleteIngredient={onIngredientDeleted}
            >
              {!(ingredients?.length > 0) && (
                <EmptyState message="No ingredients added yet. Add some to get started!" />
              )}
            </IngredientsSectionForm>
            <StepsSectionForm
              steps={steps}
              setSteps={setSteps}
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