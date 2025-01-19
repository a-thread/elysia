import React from "react";
import "./style.css";
import IngredientList from "./IngredientList";
import StepList from "./StepList";

const DesktopView = ({ recipe, checkedItems, onCheck }) => {
  return (
    <div className="hidden md:flex md:flex-row gap-6 w-full">
      <div className="w-1/3 h-full overflow-y-auto px-4 xs:py-4 border-r border-gray-300 dark:border-leafGreen-100">
        <h2 className="text-2xl font-semibold text-leafGreen-900 dark:text-leafGreen-100 mb-4">
          Ingredients
        </h2>
        <IngredientList
          ingredients={recipe.ingredients}
          checkedItems={checkedItems}
          onCheck={onCheck}
        />
      </div>

      <div className="w-2/3 h-full overflow-y-auto px-4 xs:py-4">
        <h2 className="text-2xl font-semibold text-leafGreen-900 dark:text-leafGreen-100 mb-4">
          Directions
        </h2>
        <StepList steps={recipe.steps} />
      </div>
    </div>
  );
};

export default DesktopView;
