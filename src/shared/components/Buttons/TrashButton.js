import React, { useState } from "react";
import IconButton from "./IconButton";
import { TrashIcon as TrashSolid } from "@heroicons/react/20/solid";
import { TrashIcon as TrashOutline } from "@heroicons/react/24/outline";
import PropTypes from "prop-types";

const TrashButton = ({ onClick }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <IconButton
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title="Delete"
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
  onClick: PropTypes.func,
};


export default TrashButton;
