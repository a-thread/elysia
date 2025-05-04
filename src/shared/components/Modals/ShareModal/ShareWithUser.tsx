import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import { FaChevronDown } from "react-icons/fa";
import { Button } from "../../Buttons";
import { useToast } from "../../Toast/ToastManager";

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
        <div className="relative z-0 w-full group">
          <input
            type="email"
            name="email"
            id="email"
            placeholder=" "
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-hidden focus:ring-0 focus:border-blue-600 peer"
          />
          <label
            htmlFor="email"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:rtl:translate-x-1/4 peer-focus:rtl:left-auto peer-focus:text-blue-600 dark:peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Email
          </label>
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
