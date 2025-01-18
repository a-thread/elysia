import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import RecipeDetails from './components/RecipeDetails';
import IngredientsSection from './components/IngredientsSection';
import StepsSection from './components/StepsSection';
import recipeService from '../../shared/services/recipeService';
import Loading from '../../shared/components/Loading';
import EmptyState from '../../shared/components/EmptyState';
import { BackButton, Button, FavoriteButton, TrashButton } from '../../shared/components/Buttons';
import DeleteConfirmationModal from '../../shared/components/DeleteConfirmationModal';
import { useModalManager } from '../../shared/services/modalManager';
import { useAuth } from '../../shared/contexts/AuthContext';
import { useToast } from '../../shared/services/toastManager';

function Recipe() {
  const { id } = useParams();
  const { user } = useAuth();
  const { displayToast } = useToast();
  const { openModal, closeModal } = useModalManager();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch recipe details
  useEffect(() => {
    const loadRecipe = async () => {
      setLoading(true);
      try {
        const recipeData = await recipeService.fetchRecipeDetails(id, user?.id);
        setRecipe(recipeData);
      } catch (error) {
        console.error('Error fetching recipe details:', error.message);
        displayToast('Failed to fetch recipe details.', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadRecipe();
  }, [id, user?.id, displayToast]);

  const deleteRecipe = async () => {
    try {
      await recipeService.deleteRecipe(id);
      displayToast('Recipe deleted successfully!');
      closeModal();
      navigate('/');
    } catch (error) {
      console.error('Error deleting recipe:', error.message);
      displayToast('Failed to delete recipe. Please try again.', 'error');
    }
  }

  const toggleFavorite = async () => {
    try {
      await recipeService.toggleFavorite(id, recipe.is_favorited, user?.id);
      setRecipe((prevRecipe) => ({
        ...prevRecipe,
        is_favorited: !prevRecipe.is_favorited,
      }));
      displayToast('Favorite toggled successfully!');
    } catch (error) {
      console.error('Error toggling favorite:', error.message);
      displayToast('Failed to toggle favorite. Please try again.', 'error');
    }
  }

  const handleDeleteClick = () => openModal(
    <DeleteConfirmationModal onCancelDelete={closeModal} onDelete={deleteRecipe} />
  );

  return (
    <div className="max-w-4xl mx-auto mt-4">
      <div className="w-full flex justify-between items-center mb-4">
        <BackButton />
        <div className="flex justify-end gap-2">
          <FavoriteButton
            onToggle={toggleFavorite}
            isFavorited={recipe?.is_favorited}
          />
          <TrashButton onDelete={handleDeleteClick} />
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
