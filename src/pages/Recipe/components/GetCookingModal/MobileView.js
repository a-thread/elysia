import React from "react";
import "./style.css";
import IngredientList from "./IngredientList";
import StepList from "./StepList";

const MobileView = ({ activeTab, recipe, checkedItems, onCheck }) => {
  return (
    <div className="block md:hidden h-full w-full overflow-y-auto px-4 sm:pt-4">
      {activeTab === "ingredients" ? (
        <IngredientList
          ingredients={recipe.ingredients}
          checkedItems={checkedItems}
          onCheck={onCheck}
        />
      ) : (
        <StepList steps={recipe.steps} />
      )}
    </div>
  );
};

export default MobileView;
