import { useState } from "react";
import { FaEllipsisV, FaLayerGroup, FaTags } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useToast } from "@shared/components/Toast";
import {
  DeleteConfirmationModal,
  ShareModal,
  useModalManager,
} from "@shared/components/Modals";
import RecipeService from "@shared/services/RecipeService";
import { Recipe } from "@shared/models/Recipe";
import DropdownButton, {
  DropdownOption,
} from "@shared/components/Buttons/DropdownButton";
import { UserService } from "@shared/services/UserService";
import generateRecipePDF from "@shared/services/PdfGenerator";
import { useAuth } from "@shared/contexts/AuthContext";
import AddTagsToRecipeModal from "../AddTagsToRecipeModal";
import AddRecipeToCollectionsModal from "../AddRecipeToCollections";

interface EllipsisMenuProps {
  recipe: Recipe;
  /** Called after tags or collections are added, so the caller can refetch the recipe. */
  onRecipeUpdated?: () => void;
}

const EllipsisMenu: React.FC<EllipsisMenuProps> = ({ recipe, onRecipeUpdated }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const { isAuthenticated } = useAuth();
  const { openModal, closeModal } = useModalManager();
  const [sharedUsers, setSharedUsers] = useState<any[]>([]);
  const [isPublic, setIsPublic] = useState(recipe.is_public!);

  const updateSharedUsers = async () => {
    try {
      const users = await RecipeService.getSharedUsers(recipe.id);
      setSharedUsers(users || []);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleEditClick = () =>
    navigate(`/recipes/${recipe.id}/edit`, { state: { recipe } });

  const handleAddTagsClick = () =>
    openModal(
      <AddTagsToRecipeModal
        recipeId={recipe.id}
        tagAdded={() => onRecipeUpdated?.()}
      />
    );

  const handleAddToCollectionClick = () =>
    openModal(
      <AddRecipeToCollectionsModal
        recipeId={recipe.id}
        collectionAdded={() => onRecipeUpdated?.()}
      />
    );

  const handleDeleteClick = () =>
    openModal(
      <DeleteConfirmationModal
        label="recipe"
        onCancelDelete={closeModal}
        onDelete={deleteRecipe}
      />
    );

  const handleTogglePublicShare = async () => {
    try {
      const newStatus = !isPublic;
      await RecipeService.setIsPublic(recipe.id, newStatus);
      setIsPublic(newStatus);
      toast.success(`Recipe is now ${newStatus ? "public" : "private"}!`);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleShareWithUser = async (email: string, permission: string) => {
    if (!email) return toast.error("Please enter a valid email.");

    try {
      const user = await UserService.findByEmail(email);
      if (!user) throw new Error("User not found");
      await RecipeService.shareWithUser(recipe.id, user.id!, permission);
      toast.success(
        `Recipe shared with ${user.display_name} as ${permission}.`
      );
      updateSharedUsers();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleRevokeAccess = async (shareId: string) => {
    try {
      await RecipeService.revokeAccess(shareId);
      toast.success("Access revoked.");
      updateSharedUsers();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Public link copied!");
  };

  const handleShareClick = () =>
    openModal(
      <ShareModal
        typeOfShare="Recipe"
        sharedUsers={sharedUsers}
        isPublic={isPublic}
        onTogglePublicShare={handleTogglePublicShare}
        shareWithUser={handleShareWithUser}
        onRevokeAccess={handleRevokeAccess}
        onCopyLink={handleCopyLink}
        onClose={closeModal}
      />
    );

  const deleteRecipe = async () => {
    try {
      await RecipeService.deleteById(recipe.id);
      toast.success("Recipe deleted successfully!");
      closeModal();
      navigate("/recipes");
    } catch (error: any) {
      toast.error("Failed to delete recipe. Please try again.");
    }
  };

  const handleExportClick = async () => {
    try {
      await generateRecipePDF([recipe]);
    } catch (error: any) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to export recipe. Please try again.");
    }
  };

  const options: DropdownOption[] = [
    ...(isAuthenticated
      ? [
          { label: "Edit", onClick: handleEditClick },
          { label: "Delete", onClick: handleDeleteClick },
          { label: "Share", onClick: handleShareClick },
          {
            label: "Add Tags",
            icon: <FaTags aria-hidden="true" />,
            dividerBefore: true,
            onClick: handleAddTagsClick,
          },
          {
            label: "Add to Collection",
            icon: <FaLayerGroup aria-hidden="true" />,
            onClick: handleAddToCollectionClick,
          },
        ]
      : []),
    { label: "Export", onClick: handleExportClick, dividerBefore: isAuthenticated },
  ];

  return (
    <DropdownButton
      options={options}
      icon={
        <FaEllipsisV className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      }
    />
  );
};

export default EllipsisMenu;
