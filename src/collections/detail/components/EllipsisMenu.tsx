import { useState, useEffect } from "react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom";
import { ShareCollectionService } from "./ShareCollectionService";
import { useToast } from "@shared/components/Toast";
import { useModalManager, DeleteConfirmationModal, ShareModal } from "@shared/components/Modals";
import CollectionService from "@shared/services/CollectionService";
import { Collection } from "@shared/models/Collection";
import DropdownButton, { DropdownOption } from "@shared/components/Buttons/DropdownButton";

const EllipsisMenu: React.FC<{collection: Collection}> = ({ collection }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const { openModal, closeModal } = useModalManager();
  const [isPublic, setIsPublic] = useState(collection.is_public || false);
  const [sharedUsers, setSharedUsers] = useState<any[]>([]);

  const handleEditClick = () => {
    navigate(`/collections/${collection.id}/edit`, { state: { collection } });
  };

  const handleDeleteClick = () =>
    openModal(
      <DeleteConfirmationModal
        label="collection"
        onCancelDelete={closeModal}
        onDelete={deleteCollection}
      />
    );

  useEffect(() => {
    const fetchData = async () => {
      if (collection.id) {
        setSharedUsers(await ShareCollectionService.fetchSharedUsers(collection.id));
      }
    }
    fetchData();
  }, [collection.id]);

  const handleTogglePublicShare = async () => {
    try {
      if (!collection.id) {
        throw new Error('No Collection id found.');
      }

      const newStatus = await ShareCollectionService.togglePublicShare(
        collection.id,
        !!collection.is_public
      );
      setIsPublic(newStatus);
      toast.success(`Collection is now ${newStatus ? "public" : "private"}!`);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleShareWithUser = async (email: string, permission: string) => {
    if (!email) return toast.error("Please enter a valid email.");
    if (!collection.id) return toast.error();;

    try {
      const user = await ShareCollectionService.findUserByEmail(email);
      await ShareCollectionService.shareCollectionWithUser(collection.id, user.id, permission);
      toast.success(
        `Collection shared with ${user.display_name} as ${permission}.`
      );
      setSharedUsers(await ShareCollectionService.fetchSharedUsers(collection.id));
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleRevokeAccess = async (shareId: string) => {
    if (!collection.id) return toast.error();
    try {
      await ShareCollectionService.revokeUserAccess(shareId);
      toast.success("Access revoked.");
      setSharedUsers(await ShareCollectionService.fetchSharedUsers(collection.id));
    } catch (error: any) {
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
      if (!collection.id) return toast.error();
      await CollectionService.deleteCollection(collection.id);
      toast.success("Collection deleted successfully!");
      closeModal();
      navigate("/");
    } catch (error: any) {
      toast.error("Failed to delete collection. Please try again.");
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
