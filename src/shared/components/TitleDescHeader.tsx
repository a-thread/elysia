import React from "react";
import { TitleDescriptionImgUrl } from "../models/TitleDescriptionImgUrl";
import { Button, IconButton } from "./Buttons";
import { useAuth } from "@shared/contexts/AuthContext";
import { FaPlus } from "react-icons/fa6";

interface TitleDescHeaderProps extends TitleDescriptionImgUrl {
  classes?: string;
  actionName?: string;
  /** "icon" (default): small ghost plus button next to the title. "solid": a filled pill CTA pushed to the right. */
  actionVariant?: "icon" | "solid";
  onAction?: () => void;
}

const TitleDescHeader: React.FC<TitleDescHeaderProps> = ({
  title,
  description,
  classes = "",
  actionName = "",
  actionVariant = "icon",
  onAction,
}) => {
  const { isAuthenticated } = useAuth();
  const showAction = isAuthenticated && actionName?.length > 0;

  return (
    <>
      <div
        className={`w-full flex items-center text-left ${
          actionVariant === "solid" ? "justify-between" : "space-x-3"
        } ${classes}`}
      >
        <h1 className="text-3xl font-medium text-leaf-green-900 dark:text-leaf-green-100">
          {title}
        </h1>
        {showAction &&
          (actionVariant === "solid" ? (
            <Button btnType="primary" className="shrink-0" onClick={onAction}>
              <FaPlus className="w-3.5 h-3.5" aria-hidden="true" />
              {actionName}
            </Button>
          ) : (
            <IconButton
              className="hover:bg-white dar:hover:bg-white/50"
              title={actionName}
              onClick={onAction}
              icon={
                <FaPlus className="w-5 h-5 dark:text-leaf-green-300 text-leaf-green-500" />
              }
            />
          ))}
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
