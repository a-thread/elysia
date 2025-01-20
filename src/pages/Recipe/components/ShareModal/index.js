import { useState, useEffect } from "react";
import { ShareService } from "./shareService";
import { Button, TrashButton } from "../../../../shared/components/Buttons";
import { useToast } from "../../../../shared/services/toastManager";
import ShareWithUser from "./ShareWithUser";
import { CheckIcon } from "@heroicons/react/20/solid";

const ShareModal = ({ recipeId, onClose }) => {
  const [sharedUsers, setSharedUsers] = useState([]);
  const [isPublic, setIsPublic] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setSharedUsers(await ShareService.fetchSharedUsers(recipeId));
      setIsPublic(await ShareService.fetchRecipeVisibility(recipeId));
    };
    fetchData();
  }, [recipeId]);

  const handleTogglePublicShare = async () => {
    try {
      const newStatus = await ShareService.togglePublicShare(
        recipeId,
        isPublic
      );
      setIsPublic(newStatus);
      toast.success(`Recipe is now ${newStatus ? "public" : "private"}!`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleRevokeAccess = async (shareId) => {
    try {
      await ShareService.revokeUserAccess(shareId);
      toast.success("Access revoked.");
      setSharedUsers(await ShareService.fetchSharedUsers(recipeId));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const copyLink = () => {
    const publicUrl = `${window.location.origin}/recipes/${recipeId}`;
    navigator.clipboard.writeText(publicUrl);
    toast.success("Public link copied!");
  };

  return (
    <>
      <h2 className="text-lg font-semibold mb-4 min-w-[300px]">Share Recipe</h2>

      {/* Toggle Public Access */}
      <div className="flex items-center justify-between mb-4">
        <label className="text-sm">Make Public</label>
        <input
          type="checkbox"
          checked={isPublic}
          onChange={handleTogglePublicShare}
          className="peer hidden"
          id="custom-checkbox"
        />
        <label
          htmlFor="custom-checkbox"
          className="w-5 h-5 flex items-center justify-center border-2 border-gray-400 rounded-md cursor-pointer transition-all 
  peer-checked:bg-blue-500 peer-checked:border-blue-500 
  dark:border-gray-600 dark:peer-checked:bg-blue-400 dark:peer-checked:border-blue-400"
        >
          {/* Checkmark SVG */}
          <CheckIcon className={`w-4 h-4 text-white peer-checked:block ${!isPublic && 'hidden'}`} />
        </label>
      </div>

      {isPublic && (
        <Button btnType="secondary" onClick={copyLink} className="w-full">
          Copy Public Link
        </Button>
      )}

      <hr className="border-gray-700 my-4" />

      {/* Share with a Specific User */}
      <ShareWithUser sharedUsers={setSharedUsers} />

      <hr className="border-gray-700 my-4" />

      {/* List of Shared Users */}
      <h3 className="text-sm font-medium mb-2">Shared Users</h3>
      <ul className="space-y-2 mb-4">
        {sharedUsers.map((user) => (
          <li
            key={user.id}
            className="flex justify-between items-center bg-white dark:bg-gray-800 rounded gap-2"
          >
            <span className="text-gray-700 dark:text-gray-200 text-sm">
              {user.users.email} - {user.permission}
            </span>
            <TrashButton onClick={() => handleRevokeAccess(user.id)} />
          </li>
        ))}
      </ul>

      <Button onClick={onClose} className="w-full">
        Close
      </Button>
    </>
  );
};

export default ShareModal;
