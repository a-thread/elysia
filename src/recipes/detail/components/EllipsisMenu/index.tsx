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
import DropdownButton, {
  DropdownOption,
} from "@shared/components/Buttons/DropdownButton";

interface EllipsisMenuProps {
  isAuthenticated: boolean;
  isPublic: boolean;
  sharedUsers: SharedUser[];
  onEdit: () => void;
  onDelete: () => void;
  onAddTags: () => void;
  onAddToCollection: () => void;
  onExport: () => void;
  onTogglePublicShare: () => void;
  shareWithUser: (email: string, permission: "read" | "edit") => void;
  onRevokeAccess: (shareId: string) => void;
  onCopyLink: () => void;
}

const EllipsisMenu: React.FC<EllipsisMenuProps> = ({
  isAuthenticated,
  isPublic,
  sharedUsers,
  onEdit,
  onDelete,
  onAddTags,
  onAddToCollection,
  onExport,
  onTogglePublicShare,
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
        onTogglePublicShare={onTogglePublicShare}
        shareWithUser={shareWithUser}
        onRevokeAccess={onRevokeAccess}
        onCopyLink={onCopyLink}
        onClose={closeModal}
      />
    );

  const options: DropdownOption[] = [
    ...(isAuthenticated
      ? [
          { label: "Edit", icon: <FaPen aria-hidden="true" />, onClick: onEdit },
          {
            label: "Delete",
            icon: <FaTrash aria-hidden="true" />,
            destructive: true,
            onClick: onDelete,
          },
          { label: "Share", icon: <FaShareAlt aria-hidden="true" />, onClick: handleShareClick },
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
    {
      label: "Export",
      icon: <FaDownload aria-hidden="true" />,
      onClick: onExport,
      dividerBefore: isAuthenticated,
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
