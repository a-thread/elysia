import React, { useState, ChangeEvent } from "react";
import { Button } from "../../Buttons";
import { useToast } from "../../Toast/ToastManager";
import { FieldLabel, fieldClasses } from "../../FormField";
import type { Permission } from "@shared/models/Permission";
import PermissionDropdown from "./PermissionDropdown";

interface ShareWithUserProps {
  shareWithUser: (email: string, permission: Permission) => void;
}

const ShareWithUser: React.FC<ShareWithUserProps> = ({ shareWithUser }) => {
  const [email, setEmail] = useState<string>("");
  const [permission, setPermission] = useState<Permission>("read");
  const toast = useToast();

  const handleShareWithUser = async () => {
    if (!email) return toast.error("Please enter a valid email.");
    shareWithUser(email, permission);
  };

  return (
    <>
      <h3 className="text-sm font-medium mb-2 dark:text-leaf-green-100">Share with a User</h3>
      <div className="flex flex-col space-y-2 mb-4">
        {/* Email Input */}
        <div>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            className={fieldClasses}
          />
        </div>

        {/* Permission Dropdown */}
        <PermissionDropdown value={permission} onChange={setPermission} />

        {/* Share Button */}
        <Button btnType="secondary" onClick={handleShareWithUser} className="w-full">
          Share
        </Button>
      </div>
    </>
  );
};

export default ShareWithUser;
