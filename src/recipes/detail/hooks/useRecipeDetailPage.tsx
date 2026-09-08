import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@shared/contexts/AuthContext";
import { useToast } from "@shared/components/Toast";
import { useModalManager, DeleteConfirmationModal } from "@shared/components/Modals";
import RecipeService from "@recipes/services/RecipeService";
import generateRecipePDF from "@recipes/utils/PdfGenerator";
import { useShareableEntity } from "@shared/hooks/useShareableEntity";
import { useRecipeDetails } from "./useRecipeDetails";
import AddTagsToRecipeModal from "../components/AddTagsToRecipeModal";
import AddRecipeToCollectionsModal from "../components/AddRecipeToCollections";

/**
 * Composed recipe detail page hook.
 * Centralizes recipe data, sharing, and actions for the detail screen.
 */
export const useRecipeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();
  const { openModal, closeModal } = useModalManager();

  const { recipe, loading, fetchRecipe } = useRecipeDetails(id, user?.id);

  const share = useShareableEntity({
    entityId: recipe?.id,
    entityLabel: "Recipe",
    initialIsPublic: recipe?.is_public ?? false,
    initialPublicPermission: recipe?.public_permission ?? "read",
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
    canEdit: recipe?.can_edit ?? false,
    isOwner: recipe?.is_owner ?? false,
    editRecipe,
    confirmDelete,
    addTags,
    addToCollection,
    exportRecipe,
    ...share,
  };
};
