import React, { useState } from "react";
import IconButton from "./IconButton";
import { FaTrashAlt as TrashSolid } from "react-icons/fa";
import { FiTrash as TrashOutline } from "react-icons/fi";


// Define ShareModal Props
interface TrashButtonProps {
  onClick: () => void;
}
const TrashButton: React.FC<TrashButtonProps> = ({ onClick }) => {
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

export default TrashButton;
