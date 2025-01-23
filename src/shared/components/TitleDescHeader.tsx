import React from "react";
import { TitleDescriptionImgUrl } from "../models/TitleDescriptionImgUrl";


const TitleDescHeader: React.FC<TitleDescriptionImgUrl> = ({ title, description }) => {
  return (
    <>
      <h1 className="text-3xl font-bold text-leafGreen-900 dark:text-leafGreen-100">
        {title}
      </h1>
      {!!description?.length && (
        <p className="text-leafGreen-800 dark:text-gray-300 mt-4 mb-4">
          {description}
        </p>
      )}
    </>
  );
};

export default TitleDescHeader;
