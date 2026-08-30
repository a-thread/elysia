import React from "react";

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="block md:hidden mb-4">
      <div className="border-b border-gray-200 dark:border-gray-700 flex">
        <button
          className={`flex-1 pb-2.5 text-base font-semibold border-b-2 -mb-px transition-colors ${
            activeTab === "ingredients"
              ? "border-leaf-green-700 dark:border-leaf-green-400 text-leaf-green-700 dark:text-leaf-green-300"
              : "border-transparent text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
          }`}
          onClick={() => onTabChange("ingredients")}
        >
          Ingredients
        </button>
        <button
          className={`flex-1 pb-2.5 text-base font-semibold border-b-2 -mb-px transition-colors ${
            activeTab === "directions"
              ? "border-leaf-green-700 dark:border-leaf-green-400 text-leaf-green-700 dark:text-leaf-green-300"
              : "border-transparent text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
          }`}
          onClick={() => onTabChange("directions")}
        >
          Directions
        </button>
      </div>
    </div>
  );
};

export default TabNavigation;
