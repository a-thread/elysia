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
    "flex gap-1.5 justify-center items-center font-semibold pl-2.5 pr-1.5 py-1 text-center transition focus:outline-hidden text-leaf-green-700 dark:text-leaf-green-100 bg-leaf-green-50 dark:bg-leaf-green-800 rounded-full";
  return (
    <button
      type="button"
      className={`${baseClasses} ${
        displayHover ? "hover:opacity-80" : ""
      } ${btnClass}`}
      disabled={disabled}
      aria-label={isReadOnly ? title : `Remove ${title}`}
      onClick={onClick}
      {...props}
    >
      <small className="text-xs">{title}</small>
      {!isReadOnly && <FaTimes className="w-2.5 h-2.5" />}
    </button>
  );
};

export default TagButton;
