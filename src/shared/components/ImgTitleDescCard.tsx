import React from "react";
import { TitleDescriptionImgUrl } from "../models/TitleDescriptionImgUrl";

const ImgTitleDescription: React.FC<TitleDescriptionImgUrl> = ({ title, img_url }) => {
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
        className={`bg-white dark:bg-gray-800 rounded-b-lg shadow-md p-4 hover:shadow-lg transition-shadow-xs ${
          !img_url ? "rounded-t-lg" : ""
        }`}
      >
        <h2 className="text-xl font-semibold text-gray-800 dark:text-leaf-green-100 mb-2">
          {title}
        </h2>
      </div>
    </>
  );
};

export default ImgTitleDescription;
