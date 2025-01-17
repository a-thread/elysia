import { useState } from "react";
import PropTypes from "prop-types";
import IconButton from "./IconButton";
import { TrashIcon as TrashOutline } from "@heroicons/react/24/outline";
import { TrashIcon as TrashSolid } from "@heroicons/react/20/solid";

const TrashButton = ({ onDelete, className = '' }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <IconButton
      onClick={onDelete}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title="Delete"
      className={`rounded-full focus:ring-gray-200 dark:focus:ring-gray-400 transition-all ${className}`}
      icon={
        hovered ? (
          <TrashSolid className="w-6 h-6 text-red-500" />
        ) : (
          <TrashOutline className="w-6 h-6 text-gray-500" />
        )
      }
    />
  );
};

TrashButton.propTypes = {
  onDelete: PropTypes.func.isRequired,
  className: PropTypes.string,
};

TrashButton.defaultProps = {
  className: "",
};

export default TrashButton;
