import React from "react";

const TimeLabelValue: React.FC<{label: string, value: string | number}> = ({ label, value }) => {
  return (
    <>
      <small className="text-leafGreen-800 dark:text-leafGreen-100">
        {label}
      </small>
      <div className="text-leafGreen-700 dark:text-white">
        <strong>{value}</strong>
      </div>
    </>
  );
};

export default TimeLabelValue;
