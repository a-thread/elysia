import { useState, useRef, useEffect } from "react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom";
import { ShareCollectionService } from "./ShareCollectionService";
import { useToast } from "../../../shared/services/toastManager";
import { useModalManager } from "../../../shared/services/modalManager";
import DeleteConfirmationModal from "../../../shared/components/DeleteConfirmationModal";
import CollectionService from "../../../shared/services/CollectionService";
import { IconButton } from "../../../shared/components/Buttons";
import ShareModal from "../../../shared/components/ShareModal";

const EllipsisMenu = ({ collection }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const toast = useToast();
  const { openModal, closeModal } = useModalManager();
  const [isPublic, setIsPublic] = useState(collection.isPublic);
  const [sharedUsers, setSharedUsers] = useState([]);

  const handleEditClick = () => {
    navigate(`/collections/${collection.id}/edit`, { state: { collection } });
    setIsOpen(false);
  };

  const handleDeleteClick = () =>
    openModal(
      <DeleteConfirmationModal
        onCancelDelete={closeModal}
        onDelete={deleteCollection}
      />
    );

  useEffect(() => {
    const fetchData = async () =>
      setSharedUsers(await ShareCollectionService.fetchSharedUsers(collection.id));
    fetchData();
  }, [collection.id]);

  const handleTogglePublicShare = async () => {
    try {
      const newStatus = await ShareCollectionService.togglePublicShare(
        collection.id,
        collection.is_public
      );
      setIsPublic(newStatus);
      toast.success(`Collection is now ${newStatus ? "public" : "private"}!`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleShareWithUser = async (email, permission) => {
    if (!email) return toast.error("Please enter a valid email.");

    try {
      const user = await ShareCollectionService.findUserByEmail(email);
      await ShareCollectionService.shareCollectionWithUser(collection.id, user.id, permission);
      toast.success(
        `Collection shared with ${user.display_name} as ${permission}.`
      );
      setSharedUsers(await ShareCollectionService.fetchSharedUsers(collection.id));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleRevokeAccess = async (shareId) => {
    try {
      await ShareCollectionService.revokeUserAccess(shareId);
      toast.success("Access revoked.");
      setSharedUsers(await ShareCollectionService.fetchSharedUsers(collection.id));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleCopyLink = () => {
    const publicUrl = `${window.location.origin}/collections/${collection.id}`;
    navigator.clipboard.writeText(publicUrl);
    toast.success("Public link copied!");
  };

  const handleShareClick = () => {
    openModal(
      <ShareModal
        typeOfShare="Collection"
        collectionId={collection.id}
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

  const deleteCollection = async () => {
    try {
      await CollectionService.deleteCollection(collection.id);
      toast.success("Collection deleted successfully!");
      closeModal();
      navigate("/");
    } catch (error) {
      toast.error("Failed to delete collection. Please try again.");
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
