import React from "react";
import PropTypes from "prop-types";
import "./style.css";

const TabNavigation = ({ activeTab, onTabChange }) => {
  return (
    <div className="block md:hidden mb-4">
      <div className="border-b border-gray-300 dark:border-gray-700 flex">
        <button
          className={`flex-1 p-2 text-lg font-semibold ${
            activeTab === "ingredients"
              ? "border-b-2 border-gray-900 dark:border-gray-100 text-gray-900 dark:text-gray-100"
              : "text-gray-500"
          }`}
          onClick={() => onTabChange("ingredients")}
        >
          Ingredients
        </button>
        <button
          className={`flex-1 p-2 text-lg font-semibold ${
            activeTab === "directions"
              ? "border-b-2 border-gray-900 dark:border-gray-100 text-gray-900 dark:text-gray-100"
              : "text-gray-500"
          }`}
          onClick={() => onTabChange("directions")}
        >
          Directions
        </button>
      </div>
    </div>
  );
};

TabNavigation.propTypes = {
  currentTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
};

export default TabNavigation;
