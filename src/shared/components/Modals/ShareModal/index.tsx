import React, { useEffect, useState } from "react";
import { Button, TrashButton } from "../../Buttons";
import ShareWithUser from "./ShareWithUser";
import { FaCheck } from "react-icons/fa";
import { BaseModalProps } from "../BaseModal/BaseModalProps";

// Define permission type
type PermissionType = "read" | "edit";

// Define shared user type
interface SharedUser {
  id: string;
  users: { email: string };
  permission: PermissionType;
}

// Define ShareModal Props
interface ShareModalProps extends BaseModalProps {
  typeOfShare: string;
  sharedUsers: SharedUser[];
  isPublic: boolean;
  onTogglePublicShare: () => void;
  shareWithUser: (email: string, permission: PermissionType) => void;
  onRevokeAccess: (userId: string) => void;
  onCopyLink: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({
  typeOfShare,
  sharedUsers,
  isPublic,
  onTogglePublicShare,
  shareWithUser,
  onRevokeAccess,
  onCopyLink,
  onClose,
}) => {
  const [isPublicLocal, setIsPublicLocal] = useState(isPublic);

  useEffect(() => {
    setIsPublicLocal(isPublic);
  }, [isPublic]);

  const handleTogglePublicShare = () => {
    setIsPublicLocal(!isPublicLocal);
    onTogglePublicShare();
  }
  return (
    <>
      <h2 className="text-lg font-semibold mb-4 min-w-[300px] dark:text-leaf-green-100">
        Share {typeOfShare}
      </h2>

      {/* Toggle Public Access */}
      <div className="flex items-center justify-between mb-4 dark:text-leaf-green-100">
        <label className="text-sm">Make Public</label>
        <input
          type="checkbox"
          checked={isPublicLocal}
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
          <FaCheck
            className={`w-4 h-4 text-white ${isPublicLocal ? "block" : "hidden"}`}
          />
        </label>
      </div>

      {isPublicLocal && (
        <Button btnType="secondary" onClick={onCopyLink} className="w-full">
          Copy Public Link
        </Button>
      )}

      <hr className="border-gray-700 my-4" />

      {/* Share with a Specific User */}
      <ShareWithUser shareWithUser={shareWithUser} />

      <hr className="border-gray-700 my-4" />

      {/* List of Shared Users */}
      <h3 className="text-sm font-medium mb-2 dark:text-leaf-green-100">Shared Users</h3>
      <ul className="space-y-2 mb-4 dark:text-leaf-green-100">
        {sharedUsers.map((user) => (
          <li
            key={user.id}
            className="flex justify-between items-center bg-white dark:bg-gray-800 rounded-xs gap-2 p-2"
          >
            <span className="text-gray-700 dark:text-gray-200 text-sm">
              {user.users.email} - {user.permission}
            </span>
            <TrashButton onClick={() => onRevokeAccess(user.id)} />
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
