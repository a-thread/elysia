import React from "react";
import { FaTimes } from "react-icons/fa";

interface RemoveButtonProps {
  onClick: () => void;
  label?: string;
  className?: string;
}

const RemoveButton: React.FC<RemoveButtonProps> = ({
  onClick,
  label = "Remove",
  className = "",
}) => (
  <button
    type="button"
    onClick={onClick}
    title={label}
    aria-label={label}
    className={`shrink-0 p-1.5 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-500 transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-leaf-green-300 rounded-full ${className}`}
  >
    <FaTimes className="w-3.5 h-3.5" />
  </button>
);

export default RemoveButton;
