import { useState, useRef, useEffect } from "react";
import IconButton from "./IconButton";

export interface DropdownOption {
  label: string;
  onClick: () => void;
}

interface DropdownProps {
  options: DropdownOption[];
  icon: React.ReactNode;
}

const DropdownButton: React.FC<DropdownProps> = ({ options, icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
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
    <div className="relative inline-block" ref={menuRef}>
      {/* Customizable Icon Button */}
      <IconButton
        icon={icon}
        onClick={() => setIsOpen(!isOpen)}
        title="More Options"
      />

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 z-50">
          <ul className="py-2 text-gray-700 dark:text-gray-200">
            {options.map((option, index) => (
              <li key={index}>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => {
                    option.onClick();
                    setIsOpen(false); // Close dropdown after selection
                  }}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownButton;
