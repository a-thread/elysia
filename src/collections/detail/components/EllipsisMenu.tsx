import { FaEllipsisV, FaPen, FaShareAlt, FaTrash } from "react-icons/fa";
import { useModalManager, ShareModal } from "@shared/components/Modals";
import type { SharedUser } from "@shared/components/Modals/ShareModal";
import DropdownButton, {
  DropdownOption,
} from "@shared/components/Buttons/DropdownButton";

interface EllipsisMenuProps {
  isPublic: boolean;
  sharedUsers: SharedUser[];
  onEdit: () => void;
  onDelete: () => void;
  onTogglePublicShare: () => void;
  shareWithUser: (email: string, permission: "read" | "edit") => void;
  onRevokeAccess: (shareId: string) => void;
  onCopyLink: () => void;
}

const EllipsisMenu: React.FC<EllipsisMenuProps> = ({
  isPublic,
  sharedUsers,
  onEdit,
  onDelete,
  onTogglePublicShare,
  shareWithUser,
  onRevokeAccess,
  onCopyLink,
}) => {
  const { openModal, closeModal } = useModalManager();

  const handleShareClick = () =>
    openModal(
      <ShareModal
        typeOfShare="Collection"
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
    { label: "Edit", icon: <FaPen aria-hidden="true" />, onClick: onEdit },
    {
      label: "Delete",
      icon: <FaTrash aria-hidden="true" />,
      destructive: true,
      onClick: onDelete,
    },
    { label: "Share", icon: <FaShareAlt aria-hidden="true" />, onClick: handleShareClick },
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
