import React from "react";
import { TitleDescriptionImgUrl } from "../models/TitleDescriptionImgUrl";

interface ImgTitleDescCardProps extends TitleDescriptionImgUrl {
  prep_time?: number;
  cook_time?: number;
  servings?: number;
}

const ImgTitleDescription: React.FC<ImgTitleDescCardProps> = ({
  title,
  img_url,
  prep_time,
  cook_time,
  servings,
}) => {
  const totalTime = (prep_time || 0) + (cook_time || 0);
  const hasStats = !!totalTime || !!servings;

  return (
    <>
      {img_url && (
        <img
          src={img_url}
          alt={title}
          className="w-full h-32 object-cover rounded-t-lg"
        />
      )}
      <div
        className={`bg-white dark:bg-gray-800 rounded-b-lg shadow-md p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all ${
          !img_url ? "rounded-t-lg" : ""
        }`}
      >
        <h2 className="text-xl font-semibold text-gray-800 dark:text-leaf-green-100 mb-2">
          {title}
        </h2>
        {hasStats && (
          <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-leaf-green-400 shrink-0"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 3" />
            </svg>
            {totalTime ? <span>{totalTime} min</span> : null}
            {totalTime && servings ? <span>&middot;</span> : null}
            {servings ? <span>{servings} servings</span> : null}
          </div>
        )}
      </div>
    </>
  );
};

export default ImgTitleDescription;
