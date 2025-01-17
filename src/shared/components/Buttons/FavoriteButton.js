import { useState } from "react";
import PropTypes from "prop-types";
import IconButton from "./IconButton";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/20/solid";

const FavoriteButton = ({ isFavorited, onToggle, className = '' }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <IconButton
      onClick={onToggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={isFavorited ? "Remove from Favorites" : "Add to Favorites"}
      className={`rounded-full focus:ring-gray-200 dark:focus:ring-gray-400 transition-all ${className}`}
      icon={
        hovered || isFavorited ? (
          <HeartSolid className="w-6 h-6 text-pink-500" />
        ) : (
          <HeartOutline className="w-6 h-6 text-gray-500" />
        )
      }
    />
  );
};

FavoriteButton.propTypes = {
  isFavorited: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  className: PropTypes.string,
};

FavoriteButton.defaultProps = {
  className: "",
};

export default FavoriteButton;
