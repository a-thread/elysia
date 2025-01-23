import React from "react";
import IngredientList from "./IngredientList";
import StepList from "./StepList";
import { CheckedItems } from ".";

interface MobileViewProps {
  activeTab: string;
  recipe: {
    ingredients: any[];
    steps: any[];
  };
  checkedItems: CheckedItems;
  onCheck: (index: number) => void;
}

const MobileView: React.FC<MobileViewProps> = ({ activeTab, recipe, checkedItems, onCheck }) => {
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
