import React from "react";
import { TitleDescriptionImgUrl } from "../models/TitleDescriptionImgUrl";
import { IconButton } from "./Buttons";
import { useAuth } from "@shared/contexts/AuthContext";
import { PlusIcon } from "@heroicons/react/20/solid";

interface TitleDescHeaderProps extends TitleDescriptionImgUrl {
  classes?: string;
  actionName?: string;
  onAction?: () => void;
}

const TitleDescHeader: React.FC<TitleDescHeaderProps> = ({
  title,
  description,
  classes = "",
  actionName = "",
  onAction,
}) => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <div
        className={`w-full flex space-x-3 text-left ${classes}`}
      >
        <h1 className="text-3xl font-medium text-leaf-green-900 dark:text-leaf-green-100">
          {title}
        </h1>
        {isAuthenticated && actionName?.length > 0 && (
          <IconButton
            className="hover:bg-white dar:hover:bg-white/50"
            title={actionName}
            onClick={onAction}
            icon={
              <PlusIcon className="w-6 h-6 dark:text-leaf-green-300 text-leaf-green-500" />
            }
          />
        )}
      </div>

      {!!description?.length && (
        <p className="text-leaf-green-800 dark:text-gray-300 mt-4 mb-4">
          {description}
        </p>
      )}
    </>
  );
};

export default TitleDescHeader;
