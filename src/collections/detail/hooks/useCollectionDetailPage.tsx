import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@shared/contexts/AuthContext";
import { useToast } from "@shared/components/Toast";
import { useModalManager, DeleteConfirmationModal } from "@shared/components/Modals";
import CollectionService from "@shared/services/CollectionService";
import { useShareableEntity } from "@shared/hooks/useShareableEntity";
import { useCollectionDetails } from "./useCollectionDetails";

/**
 * Composed page hook for the collection detail screen — the single place
 * `collections/detail/index.tsx` reads state and intents from. Fetches the
 * collection, owns the share flow, and owns edit/delete navigation, so child
 * components (the ellipsis menu) receive everything via props instead of
 * fetching independently.
 */
export const useCollectionDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const toast = useToast();
  const { openModal, closeModal } = useModalManager();

  const { collection, loading } = useCollectionDetails(id, user?.id);

  const share = useShareableEntity({
    entityId: collection?.id,
    entityLabel: "Collection",
    initialIsPublic: collection?.is_public ?? false,
    fetchSharedUsers: CollectionService.fetchSharedUsers,
    setIsPublic: CollectionService.setIsPublic,
    share: CollectionService.share,
    revokeAccess: CollectionService.revokeAccess,
  });

  const editCollection = () => {
    if (!collection) return;
    navigate(`/collections/${collection.id}/edit`, { state: { collection } });
  };

  const deleteCollection = async () => {
    if (!collection) return;
    try {
      await CollectionService.deleteById(collection.id);
      toast.success("Collection deleted successfully!");
      closeModal();
      navigate("/collections");
    } catch {
      toast.error("Failed to delete collection. Please try again.");
    }
  };

  const confirmDelete = () =>
    openModal(
      <DeleteConfirmationModal
        label="collection"
        onCancelDelete={closeModal}
        onDelete={deleteCollection}
      />
    );

  return {
    collection,
    loading,
    showMenu: !!user?.id,
    editCollection,
    confirmDelete,
    ...share,
  };
};
