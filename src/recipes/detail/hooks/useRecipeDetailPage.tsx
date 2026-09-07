import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@shared/contexts/AuthContext";
import { useToast } from "@shared/components/Toast";
import { useModalManager, DeleteConfirmationModal } from "@shared/components/Modals";
import RecipeService from "@shared/services/RecipeService";
import generateRecipePDF from "@shared/services/PdfGenerator";
import { useShareableEntity } from "@shared/hooks/useShareableEntity";
import { useRecipeDetails } from "./useRecipeDetails";
import AddTagsToRecipeModal from "../components/AddTagsToRecipeModal";
import AddRecipeToCollectionsModal from "../components/AddRecipeToCollections";

/**
 * Composed page hook for the recipe detail screen — the single place
 * `recipes/detail/index.tsx` reads state and intents from. Fetches the
 * recipe, owns the share flow, and owns edit/delete/tag/collection/export
 * intents, so the ellipsis menu receives everything via props instead of
 * fetching independently.
 */
export const useRecipeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();
  const { openModal, closeModal } = useModalManager();

  const { recipe, loading, fetchRecipe } = useRecipeDetails(id, user?.id);

  const share = useShareableEntity({
    entityId: recipe?.id,
    entityLabel: "Recipe",
    initialIsPublic: recipe?.is_public ?? false,
    fetchSharedUsers: RecipeService.getSharedUsers,
    setIsPublic: RecipeService.setIsPublic,
    share: RecipeService.shareWithUser,
    revokeAccess: RecipeService.revokeAccess,
  });

  const editRecipe = () => {
    if (!recipe) return;
    navigate(`/recipes/${recipe.id}/edit`, { state: { recipe } });
  };

  const deleteRecipe = async () => {
    if (!recipe) return;
    try {
      await RecipeService.deleteById(recipe.id);
      toast.success("Recipe deleted successfully!");
      closeModal();
      navigate("/recipes");
    } catch {
      toast.error("Failed to delete recipe. Please try again.");
    }
  };

  const confirmDelete = () =>
    openModal(
      <DeleteConfirmationModal
        label="recipe"
        onCancelDelete={closeModal}
        onDelete={deleteRecipe}
      />
    );

  const addTags = () => {
    if (!recipe) return;
    openModal(
      <AddTagsToRecipeModal recipeId={recipe.id} tagAdded={fetchRecipe} />
    );
  };

  const addToCollection = () => {
    if (!recipe) return;
    openModal(
      <AddRecipeToCollectionsModal
        recipeId={recipe.id}
        collectionAdded={fetchRecipe}
      />
    );
  };

  const exportRecipe = async () => {
    if (!recipe) return;
    try {
      await generateRecipePDF([recipe]);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to export recipe. Please try again.");
    }
  };

  return {
    recipe,
    loading,
    isAuthenticated,
    editRecipe,
    confirmDelete,
    addTags,
    addToCollection,
    exportRecipe,
    ...share,
  };
};
