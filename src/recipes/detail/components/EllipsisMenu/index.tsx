import {
  FaDownload,
  FaEllipsisV,
  FaLayerGroup,
  FaPen,
  FaShareAlt,
  FaTags,
  FaTrash,
} from "react-icons/fa";
import { useModalManager, ShareModal } from "@shared/components/Modals";
import type { SharedUser } from "@shared/components/Modals/ShareModal";
import type { Permission } from "@shared/models/Permission";
import DropdownButton, {
  DropdownOption,
} from "@shared/components/Buttons/DropdownButton";

interface EllipsisMenuProps {
  canEdit: boolean;
  isOwner: boolean;
  isPublic: boolean;
  publicPermission: Permission;
  sharedUsers: SharedUser[];
  onEdit: () => void;
  onDelete: () => void;
  onAddTags: () => void;
  onAddToCollection: () => void;
  onExport: () => void;
  onTogglePublicShare: () => void;
  onSetPublicPermission: (permission: Permission) => void;
  shareWithUser: (email: string, permission: Permission) => void;
  onRevokeAccess: (shareId: string) => void;
  onCopyLink: () => void;
}

const EllipsisMenu: React.FC<EllipsisMenuProps> = ({
  canEdit,
  isOwner,
  isPublic,
  publicPermission,
  sharedUsers,
  onEdit,
  onDelete,
  onAddTags,
  onAddToCollection,
  onExport,
  onTogglePublicShare,
  onSetPublicPermission,
  shareWithUser,
  onRevokeAccess,
  onCopyLink,
}) => {
  const { openModal, closeModal } = useModalManager();

  const handleShareClick = () =>
    openModal(
      <ShareModal
        typeOfShare="Recipe"
        sharedUsers={sharedUsers}
        isPublic={isPublic}
        publicPermission={publicPermission}
        onTogglePublicShare={onTogglePublicShare}
        onSetPublicPermission={onSetPublicPermission}
        shareWithUser={shareWithUser}
        onRevokeAccess={onRevokeAccess}
        onCopyLink={onCopyLink}
        onClose={closeModal}
      />
    );

  const options: DropdownOption[] = [
    ...(canEdit
      ? [
          { label: "Edit", icon: <FaPen aria-hidden="true" />, onClick: onEdit },
          {
            label: "Delete",
            icon: <FaTrash aria-hidden="true" />,
            destructive: true,
            onClick: onDelete,
          },
          {
            label: "Add Tags",
            icon: <FaTags aria-hidden="true" />,
            dividerBefore: true,
            onClick: onAddTags,
          },
          {
            label: "Add to Collection",
            icon: <FaLayerGroup aria-hidden="true" />,
            onClick: onAddToCollection,
          },
        ]
      : []),
    ...(isOwner
      ? [
          {
            label: "Share",
            icon: <FaShareAlt aria-hidden="true" />,
            onClick: handleShareClick,
          },
        ]
      : []),
    {
      label: "Export",
      icon: <FaDownload aria-hidden="true" />,
      onClick: onExport,
      dividerBefore: canEdit || isOwner,
    },
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
