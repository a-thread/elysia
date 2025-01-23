import React from "react";

const TimeLabelValue: React.FC<{label: string, value: string | number}> = ({ label, value }) => {
  return (
    <>
      <small className="text-leaf-green-800 dark:text-leaf-green-100">
        {label}
      </small>
      <div className="text-leaf-green-700 dark:text-white">
        <strong>{value}</strong>
      </div>
    </>
  );
};

export default TimeLabelValue;
