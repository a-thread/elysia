import { useState, useRef, useEffect } from "react";
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
import { IconButton } from "@shared/components/Buttons";
import { Recipe } from "@shared/models/Recipe";

const EllipsisMenu: React.FC<{ recipe: Recipe }> = ({ recipe }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const toast = useToast();
  const { openModal, closeModal } = useModalManager();
  const [isPublic, setIsPublic] = useState(recipe.is_public);
  const [sharedUsers, setSharedUsers] = useState<any[]>([]);

  const handleEditClick = () => {
    navigate(`/recipes/${recipe.id}/edit`, { state: { recipe } });
    setIsOpen(false);
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
        isPublic={!!isPublic}
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block" ref={menuRef}>
      <IconButton
        icon={
          <EllipsisVerticalIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        }
        onClick={() => setIsOpen(!isOpen)}
        title="More Options"
      />

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 z-50">
          <ul className="py-2 text-gray-700 dark:text-gray-200">
            <li>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={handleEditClick}
              >
                Edit
              </button>
            </li>
            <li>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={handleDeleteClick}
              >
                Delete
              </button>
            </li>
            <li>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={handleShareClick}
              >
                Share
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default EllipsisMenu;
