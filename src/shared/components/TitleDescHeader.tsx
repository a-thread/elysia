import React from "react";
import { TitleDescriptionImgUrl } from "../models/TitleDescriptionImgUrl";
import { Button, IconButton } from "./Buttons";
import { useAuth } from "@shared/contexts/AuthContext";
import { FaPlus } from "react-icons/fa6";

interface TitleDescHeaderProps extends TitleDescriptionImgUrl {
  actionName?: string;
  actionVariant?: "icon" | "solid";
  actionClassName?: string;
  onAction?: () => void;
}

const TitleDescHeader: React.FC<TitleDescHeaderProps> = ({
  title,
  description,
  actionName = "",
  actionVariant = "icon",
  actionClassName = "",
  onAction,
}) => {
  const { isAuthenticated } = useAuth();
  const showAction = isAuthenticated && actionName?.length > 0;

  return (
    <>
      <div
        className={`w-full flex items-center text-left mb-2 ${
          actionVariant === "solid" ? "justify-between" : "space-x-3"
        }`}
      >
        <h1 className="text-3xl font-medium text-leaf-green-900 dark:text-leaf-green-100">
          {title}
        </h1>
        {showAction && (
          <div className={`shrink-0 ${actionClassName}`}>
            {actionVariant === "solid" ? (
              <Button btnType="primary" onClick={onAction}>
                <FaPlus className="w-3.5 h-3.5" aria-hidden="true" />
                {actionName}
              </Button>
            ) : (
              <IconButton
                className="hover:bg-white dark:hover:bg-white/50"
                title={actionName}
                onClick={onAction}
                icon={
                  <FaPlus className="w-5 h-5 dark:text-leaf-green-300 text-leaf-green-500" />
                }
              />
            )}
          </div>
        )}
      </div>

      {!!description?.length && (
        <p className="text-leaf-green-800 dark:text-gray-300 mt-4 mb-6">
          {description}
        </p>
      )}
    </>
  );
};

export default TitleDescHeader;
