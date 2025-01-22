import React from "react";
import PropTypes from "prop-types";
import { XMarkIcon } from "@heroicons/react/24/outline";

const Tag = ({
  isReadOnly = false,
  title = "tag",
  onClick,
  btnClass = "",
  disabled = false,
  ...props
}) => {
  const baseClasses =
    "flex gap-2 justify-center items-center font-medium px-2 py-1 text-center transition focus:outline-none text-leafGreen-600 dark:text-leafGreen-100 border border-leafGreen-600 dark:border-leafGreen-100 hover:bg-leafGreen-100 dark:hover:text-leafGreen-600 rounded-lg";
  return (
    <button
      type="button"
      className={`${baseClasses} ${
        isReadOnly ? "opacity-50 cursor-not-allowed" : ""
      } ${btnClass}`}
      disabled={isReadOnly}
      aria-label={`${!isReadOnly && "Remove "}${title}`}
      onClick={!isReadOnly ? onClick : undefined}
      {...props}
    >
      <small>{title}</small>
      {!isReadOnly && <XMarkIcon className="w-3 h-3" />}
    </button>
  );
};

Tag.propTypes = {
  isReadOnly: PropTypes.bool,
  onClick: PropTypes.func,
  title: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Tag;
