import { useState, useEffect } from "react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom";
import { useToast } from "@shared/components/Toast";
import {
  DeleteConfirmationModal,
  ShareModal,
  useModalManager,
} from "@shared/components/Modals";
import { ShareService } from "./ShareRecipeService";
import RecipeService from "@shared/services/RecipeService";
import { Recipe } from "@shared/models/Recipe";
import DropdownButton, { DropdownOption } from "@shared/components/Buttons/DropdownButton";

const EllipsisMenu: React.FC<{ recipe: Recipe }> = ({ recipe }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const { openModal, closeModal } = useModalManager();
  const [isPublic, setIsPublic] = useState(recipe.is_public || false);
  const [sharedUsers, setSharedUsers] = useState<any[]>([]);

  const handleEditClick = () => {
    navigate(`/recipes/${recipe.id}/edit`, { state: { recipe } });
  };

  const handleDeleteClick = () =>
    openModal(
      <DeleteConfirmationModal
        onCancelDelete={closeModal}
        onDelete={deleteRecipe}
      />
    );

  useEffect(() => {
    const fetchData = async () =>
      setSharedUsers(await ShareService.fetchSharedUsers(recipe.id));
    fetchData();
  }, [recipe.id]);

  const handleTogglePublicShare = async () => {
    try {
      const newStatus = await ShareService.togglePublicShare(
        recipe.id,
        !!recipe.is_public
      );
      setIsPublic(newStatus);
      toast.success(`Recipe is now ${newStatus ? "public" : "private"}!`);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleShareWithUser = async (email: string, permission: string) => {
    if (!email) return toast.error("Please enter a valid email.");

    try {
      const user = await ShareService.findUserByEmail(email);
      await ShareService.shareRecipeWithUser(recipe.id, user.id, permission);
      toast.success(
        `Recipe shared with ${user.display_name} as ${permission}.`
      );
      setSharedUsers(await ShareService.fetchSharedUsers(recipe.id));
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleRevokeAccess = async (shareId: string) => {
    try {
      await ShareService.revokeUserAccess(shareId);
      toast.success("Access revoked.");
      setSharedUsers(await ShareService.fetchSharedUsers(recipe.id));
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleCopyLink = () => {
    const publicUrl = `${window.location.origin}/recipes/${recipe.id}`;
    navigator.clipboard.writeText(publicUrl);
    toast.success("Public link copied!");
  };

  const handleShareClick = () => {
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
  };

  const deleteRecipe = async () => {
    try {
      await RecipeService.deleteRecipe(recipe.id);
      toast.success("Recipe deleted successfully!");
      closeModal();
      navigate("/");
    } catch (error: any) {
      toast.error("Failed to delete recipe. Please try again.");
    }
  };

    const options: DropdownOption[] = [
      {label: "Edit", onClick: handleEditClick},
      {label: "Delete", onClick: handleDeleteClick},
      {label: "Share", onClick: handleShareClick},
    ];

  return (
    <DropdownButton
      options={options}
      icon={<EllipsisVerticalIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />}
    />
  );
};

export default EllipsisMenu;
