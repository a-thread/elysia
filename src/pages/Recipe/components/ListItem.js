import React from "react";
import PropTypes from "prop-types";

const ListItem = ({ value, index }) => {
  return (
    <li key={index} className="text-leafGreen-800 dark:text-gray-200 p-2">
      {value}
    </li>
  );
};

ListItem.propTypes = {
  value: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
};

export default ListItem;
