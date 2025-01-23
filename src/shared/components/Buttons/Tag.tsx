import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface TagProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isReadOnly?: boolean;
  btnClass?: string;
}

const Tag: React.FC<TagProps> = ({
  isReadOnly = false,
  title = "tag",
  onClick,
  btnClass = "",
  disabled = false,
  ...props
}) => {
  const baseClasses =
    "flex gap-2 justify-center items-center font-medium px-2 py-1 text-center transition focus:outline-hidden text-leaf-green-600 dark:text-leaf-green-100 border border-leaf-green-600 dark:border-leaf-green-100 hover:bg-leaf-green-100 dark:hover:text-leaf-green-600 rounded-lg";
  return (
    <button
      type="button"
      className={`${baseClasses} ${
        isReadOnly ? "opacity-50 cursor-not-allowed" : ""
      } ${btnClass}`}
      disabled={isReadOnly || disabled}
      aria-label={`${!isReadOnly && "Remove "}${title}`}
      onClick={!isReadOnly ? onClick : undefined}
      {...props}
    >
      <small>{title}</small>
      {!isReadOnly && <XMarkIcon className="w-3 h-3" />}
    </button>
  );
};

export default Tag;
