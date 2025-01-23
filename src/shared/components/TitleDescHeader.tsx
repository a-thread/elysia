import React from "react";
import { TitleDescriptionImgUrl } from "../models/TitleDescriptionImgUrl";


const TitleDescHeader: React.FC<TitleDescriptionImgUrl> = ({ title, description }) => {
  return (
    <>
      <h1 className="text-3xl font-bold text-leaf-green-900 dark:text-leaf-green-100">
        {title}
      </h1>
      {!!description?.length && (
        <p className="text-leaf-green-800 dark:text-gray-300 mt-4 mb-4">
          {description}
        </p>
      )}
    </>
  );
};

export default TitleDescHeader;
