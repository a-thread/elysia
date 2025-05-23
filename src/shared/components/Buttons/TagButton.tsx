import React from "react";
import { FaTimes } from "react-icons/fa";

interface TagProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isReadOnly?: boolean;
  btnClass?: string;
  displayHover?: boolean;
}

const TagButton: React.FC<TagProps> = ({
  isReadOnly = false,
  displayHover = true,
  title = "tag",
  onClick,
  btnClass = "",
  disabled = false,
  ...props
}) => {
  const baseClasses =
    "flex gap-2 justify-center items-center font-medium px-2 py-1 text-center transition focus:outline-hidden text-leaf-green-600 dark:text-leaf-green-100 border border-leaf-green-600 dark:border-leaf-green-100 rounded-lg";
  return (
    <button
      type="button"
      className={`${baseClasses} ${
        displayHover ? "hover:bg-leaf-green-100 dark:hover:text-leaf-green-600" : ""
      } ${btnClass}`}
      disabled={disabled}
      aria-label={`${!isReadOnly && "Remove "}${title}`}
      onClick={onClick}
      {...props}
    >
      <small>{title}</small>
      {!isReadOnly && <FaTimes className="w-3 h-3" />}
    </button>
  );
};

export default TagButton;
