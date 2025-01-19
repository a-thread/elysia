import React from "react";
import PropTypes from "prop-types";

const TimeLabelValue = ({ label, value }) => {
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

TimeLabelValue.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

export default TimeLabelValue;
