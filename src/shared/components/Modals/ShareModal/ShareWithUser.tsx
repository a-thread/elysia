import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import { FaChevronDown } from "react-icons/fa";
import { Button } from "../../Buttons";
import { useToast } from "../../Toast/ToastManager";
import { FieldLabel, fieldClasses } from "../../FormField";

// Define permission types
type PermissionType = "read" | "edit";

// Define component props
interface ShareWithUserProps {
  shareWithUser: (email: string, permission: PermissionType) => void;
}

const ShareWithUser: React.FC<ShareWithUserProps> = ({ shareWithUser }) => {
  const [email, setEmail] = useState<string>("");
  const [permission, setPermission] = useState<PermissionType>("read");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const toast = useToast();

  const options: { value: PermissionType; label: string }[] = [
    { value: "read", label: "Read-Only" },
    { value: "edit", label: "Can Edit" },
  ];

  const handleListClick = (optionValue: PermissionType) => {
    setPermission(optionValue);
    setIsOpen(false);
  };

  const handleShareWithUser = async () => {
    if (!email) return toast.error("Please enter a valid email.");
    shareWithUser(email, permission);
  };

  // Close the menu if clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

        {/* Dropdown Menu */}
        <div className="relative inline-block" ref={menuRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-hidden focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 flex justify-between text-gray-600 dark:text-gray-300"
          >
            {options.find((opt) => opt.value === permission)?.label}
            <FaChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>

          {isOpen && (
            <div className="absolute w-full bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 z-50">
              <ul className="py-2 text-gray-700 dark:text-gray-200">
                {options.map((opt) => (
                  <li key={opt.value} onClick={() => handleListClick(opt.value)}>
                    <button className="w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                      {opt.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Share Button */}
        <Button btnType="secondary" onClick={handleShareWithUser} className="w-full">
          Share
        </Button>
      </div>
    </>
  );
};

export default ShareWithUser;
