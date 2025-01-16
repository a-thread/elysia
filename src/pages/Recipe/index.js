import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import RecipeDetails from './components/RecipeDetails';
import IngredientsSection from './components/IngredientsSection';
import StepsSection from './components/StepsSection';
import recipeService from '../../shared/services/recipeService';
import Loading from '../../shared/components/Loading';
import EmptyState from '../../shared/components/EmptyState';
import BackButton from '../../shared/components/BackButton';
import DeleteConfirmationModal from '../../shared/components/DeleteConfirmationModal';
import { useModalManager } from '../../shared/services/modalManager';
import Button from '../../shared/components/Button';

function Recipe() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const { openModal, closeModal } = useModalManager();
  const navigate = useNavigate();

  // Fetch recipe details
  useEffect(() => {
    const loadRecipe = async () => {
      setLoading(true);
      try {
        const recipeData = await recipeService.fetchRecipeDetails(id);
        setRecipe(recipeData);
      } catch (error) {
        console.error('Error fetching recipe details:', error.message);
        alert('Failed to fetch recipe details.');
      } finally {
        setLoading(false);
      }
    };

    loadRecipe();
  }, [id]);

  const deleteRecipe = async () => {
    try {
      await recipeService.deleteRecipe(id);
      alert('Recipe deleted successfully.');
      closeModal();
      navigate('/');
    } catch (error) {
      console.error('Error deleting recipe:', error.message);
      alert('Failed to delete recipe.');
    }
  }

  const handleDeleteClick = () => openModal(
    <DeleteConfirmationModal onCancelDelete={closeModal} onDelete={deleteRecipe} />
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="w-full flex justify-between items-center mb-4">
        <BackButton />
        <div className="flex justify-end gap-4">
          <Button btnType="delete" onClick={handleDeleteClick}>
            Delete
          </Button>
          <Link to={`/recipe/${id}/edit`}>
            <Button>
              Edit
            </Button>
          </Link>
        </div>
      </div>
      {recipe?.img_url?.length && (
          <div className="relative">
            <img
              src={recipe.img_url}
              alt={recipe.title}
              className="w-full h-64 object-cover rounded-t-lg"
            />
          </div>
      )}
      <div className={`p-6 bg-white dark:bg-gray-900 rounded-b-lg shadow-md ${!recipe?.img_url && 'rounded-t-lg'}`}>
        {loading ? (
          <Loading />
        ) : !recipe ? (
          <EmptyState message="Recipe not found." />
        ) : (
          <>
            <RecipeDetails recipe={recipe} />
            <IngredientsSection
              ingredients={recipe.ingredients}
            />
            <StepsSection
              steps={recipe.steps}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default Recipe;
