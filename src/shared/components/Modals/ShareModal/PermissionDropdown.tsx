import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import type { Permission } from "@shared/models/Permission";

interface PermissionDropdownProps {
  value: Permission;
  onChange: (permission: Permission) => void;
}

const options: { value: Permission; label: string }[] = [
  { value: "read", label: "Read-Only" },
  { value: "edit", label: "Can Edit" },
];

const PermissionDropdown: React.FC<PermissionDropdownProps> = ({
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleListClick = (optionValue: Permission) => {
    onChange(optionValue);
    setIsOpen(false);
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
    <div className="relative inline-block w-full" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-hidden focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 flex justify-between text-gray-600 dark:text-gray-300"
      >
        {options.find((opt) => opt.value === value)?.label}
        <FaChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      </button>

      {isOpen && (
        <div className="absolute w-full bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 z-50">
          <ul className="py-2 text-gray-700 dark:text-gray-200">
            {options.map((opt) => (
              <li key={opt.value}>
                <button
                  onClick={() => handleListClick(opt.value)}
                  className="w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                >
                  {opt.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PermissionDropdown;
