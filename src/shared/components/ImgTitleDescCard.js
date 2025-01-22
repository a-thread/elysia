import React from "react";

function ImgTitleDescription({ title, description, imgUrl }) {
  return (
    <>
      {imgUrl && (
        <img
          src={imgUrl}
          alt={title}
          className="w-full h-32 object-cover rounded-t-lg"
        />
      )}
      <div
        className={`bg-white dark:bg-gray-800 rounded-b-lg shadow-md p-4 hover:shadow-lg transition-shadow ${
          !imgUrl && "rounded-t-lg"
        }`}
      >
        <h2 className="text-xl font-semibold text-gray-800 dark:text-leafGreen-100 mb-2">
          {title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {description}
        </p>
      </div>
    </>
  );
}

export default ImgTitleDescription;
