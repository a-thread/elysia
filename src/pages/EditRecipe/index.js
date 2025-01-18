import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import recipeService from '../../shared/services/recipeService';
import Loading from '../../shared/components/Loading';
import RecipeDetailsForm from '../../shared/components/RecipeDetailsForm';
import IngredientsSectionForm from '../../shared/components/IngredientsSectionForm';
import EmptyState from '../../shared/components/EmptyState';
import StepsSectionForm from '../../shared/components/StepsSectionForm';
import { Button } from '../../shared/components/Buttons';
import PhotoUpload from '../../shared/components/PhotoUpload';
import { useAuth } from '../../shared/contexts/AuthContext';
import { useToast } from '../../shared/services/toastManager';

function EditRecipe() {
  const { id } = useParams();
  const { user } = useAuth();
  const { displayToast } = useToast();
    const navigate = useNavigate();

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
        const recipeData = await recipeService.fetchRecipeDetails(id, user?.id);
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
        displayToast('Failed to fetch recipe details.', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadRecipe();
  }, [id, user?.id, displayToast]);

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
      displayToast('Recipe updated successfully!');
      navigate(`/recipe/${id}`);
    } catch (error) {
      console.error('Error updating recipe:', error.message);
      displayToast('Failed to update recipe. Please try again.', 'error');
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-4">
      <div className="w-full flex justify-end items-center mb-4 gap-4">
        <Link to={`/recipe/${id}`}>
          <Button btnType="dismissable">Cancel</Button>
        </Link>
        <Button isLoading={saveLoading} onClick={onSave}>Save</Button>
      </div>
      {loading ? (
        <Loading />
      ) : (
        <>
          <PhotoUpload imgUrl={formData.img_url} onImgUrlChange={(url) => onFormChange('img_url', url)} />
          <div className={`bg-white dark:bg-gray-900 p-6 rounded-b-lg shadow-md ${!formData.img_url?.length && 'rounded-t-lg'}`}>
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
          </div>
        </>
      )}
    </div>
  );
}

export default EditRecipe;