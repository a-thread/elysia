import { useState, useRef, useEffect } from "react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../../shared/services/toastManager";
import { useModalManager } from "../../../../shared/services/modalManager";
import recipeService from "../../../../shared/services/recipeService";
import DeleteConfirmationModal from "../../../../shared/components/DeleteConfirmationModal";
import { IconButton } from "../../../../shared/components/Buttons";
import ShareRecipeButton from "./ShareRecipeButton";

const ProfileButton = ({ recipe }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const toast = useToast();
  const { openModal, closeModal } = useModalManager();

  const handleEditClick = () => {
    navigate(`/recipe/${recipe.id}/edit`, { state: { recipe } });
    setIsOpen(false);
  };

  const handleDeleteClick = () =>
    openModal(
      <DeleteConfirmationModal
        onCancelDelete={closeModal}
        onDelete={deleteRecipe}
      />
    );

  const deleteRecipe = async () => {
    try {
      await recipeService.deleteRecipe(recipe.id);
      toast.success("Recipe deleted successfully!");
      closeModal();
      navigate("/");
    } catch (error) {
      console.error("Error deleting recipe:", error.message);
      toast.error("Failed to delete recipe. Please try again.");
    }
  };

  // Close the menu if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
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
      {/* Ellipsis Button with Dark Mode Support */}
      <IconButton
        icon={
          <EllipsisVerticalIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        }
        onClick={() => setIsOpen(!isOpen)}
        title="More Options"
      />

      {/* Dropdown Menu */}
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
              <ShareRecipeButton recipe={recipe} />
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileButton;
