import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  /** True when this card sits directly below an image (e.g. PhotoUpload) that already has rounded top corners. */
  hasImageAbove?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = "p-6",
  hasImageAbove = false,
}) => {
  return (
    <div
      className={`bg-white dark:bg-gray-900 shadow-md rounded-b-xl ${
        hasImageAbove ? "" : "rounded-t-xl"
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
