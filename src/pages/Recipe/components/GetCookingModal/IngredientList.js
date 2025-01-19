import React from "react";
import { CheckIcon } from "@heroicons/react/24/solid";

const IngredientList = ({ ingredients, checkedItems, onCheck }) => {
  return (
    <div className="flex flex-col space-y-4">
      {ingredients.map((ingredient, index) => (
        <label key={index} className="flex items-start gap-3 cursor-pointer">
          <div
            className={`custom-checkbox ${
              checkedItems[index] ? "checked" : ""
            }`}
            onClick={() => onCheck(index)}
          >
            {checkedItems[index] && (
              <CheckIcon className="w-5 h-5 text-white" />
            )}
          </div>
          <span
            className={`text-lg leading-6 flex-1 ${
              checkedItems[index]
                ? "text-gray-400 dark:text-gray-500"
                : "text-gray-800 dark:text-gray-300"
            }`}
          >
            {ingredient.value}
          </span>
        </label>
      ))}
    </div>
  );
};

export default IngredientList;
