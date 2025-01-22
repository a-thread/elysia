import React from 'react';

function TitleDescHeader({ title, description }) {
  return (
    <>
      <h1 className="text-3xl font-bold text-leafGreen-900 dark:text-leafGreen-100">
        {title}
      </h1>
      {!!description?.length && <p className="text-leafGreen-800 dark:text-gray-300 nt-4 mb-4">{description}</p> }
    </>
  );
}

export default TitleDescHeader;
