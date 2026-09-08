import { useCallback, useEffect, useState } from "react";
import { useToast } from "@shared/components/Toast";
import { UserService } from "@shared/services/UserService";
import type { SharedUser } from "@shared/components/Modals/ShareModal";
import type { Permission } from "@shared/models/Permission";

const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : undefined;

interface UseShareableEntityArgs {
  entityId: string | undefined;
  /** Used in toast copy, e.g. "Recipe" or "Collection". */
  entityLabel: string;
  initialIsPublic: boolean;
  initialPublicPermission: Permission;
  fetchSharedUsers: (entityId: string) => Promise<unknown>;
  setIsPublic: (
    entityId: string,
    isPublic: boolean,
    publicPermission: Permission,
  ) => Promise<unknown>;
  share: (
    entityId: string,
    userId: string,
    permission: Permission,
  ) => Promise<unknown>;
  revokeAccess: (shareId: string) => Promise<unknown>;
}

/**
 * Shared sharing controls for recipe and collection menus.
 * Fetches shared users so callers can pass the hook's output to their UI.
 */
export const useShareableEntity = ({
  entityId,
  entityLabel,
  initialIsPublic,
  initialPublicPermission,
  fetchSharedUsers,
  setIsPublic,
  share,
  revokeAccess,
}: UseShareableEntityArgs) => {
  const toast = useToast();
  const [isPublic, setIsPublicState] = useState(initialIsPublic);
  const [publicPermission, setPublicPermissionState] = useState<Permission>(
    initialPublicPermission,
  );
  const [sharedUsers, setSharedUsers] = useState<SharedUser[]>([]);

  const refreshSharedUsers = useCallback(async () => {
    if (!entityId) return;
    const users = await fetchSharedUsers(entityId);
    setSharedUsers((users as SharedUser[] | null | undefined) || []);
  }, [entityId, fetchSharedUsers]);

  useEffect(() => {
    if (!entityId) return;
    // Sync when the entity changes, without overwriting an in-flight toggle.
    setIsPublicState(initialIsPublic);
    setPublicPermissionState(initialPublicPermission);
    refreshSharedUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityId]);

  const toggleIsPublic = async () => {
    if (!entityId) return;
    try {
      const newStatus = !isPublic;
      await setIsPublic(entityId, newStatus, publicPermission);
      setIsPublicState(newStatus);
      toast.success(
        `${entityLabel} is now ${newStatus ? "public" : "private"}!`,
      );
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  const setPublicPermission = async (permission: Permission) => {
    if (!entityId) return;
    try {
      await setIsPublic(entityId, isPublic, permission);
      setPublicPermissionState(permission);
      toast.success(
        `${entityLabel} is now ${
          permission === "edit" ? "editable by" : "read-only for"
        } signed-in users.`,
      );
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  const shareWithUser = async (email: string, permission: Permission) => {
    if (!email) return toast.error("Please enter a valid email.");
    if (!entityId) return toast.error();

    try {
      const user = await UserService.findByEmail(email);
      if (!user) throw new Error("User not found.");
      await share(entityId, user.id, permission);
      toast.success(
        `${entityLabel} shared with ${user.display_name} as ${permission}.`,
      );
      await refreshSharedUsers();
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  const revokeAccessById = async (shareId: string) => {
    if (!entityId) return toast.error();
    try {
      await revokeAccess(shareId);
      toast.success("Access revoked.");
      await refreshSharedUsers();
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Public link copied!");
  };

  return {
    isPublic,
    publicPermission,
    sharedUsers,
    toggleIsPublic,
    setPublicPermission,
    shareWithUser,
    revokeAccessById,
    copyLink,
  };
};
