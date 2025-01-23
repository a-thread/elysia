import React from "react";
import { CheckIcon } from "@heroicons/react/24/solid";
import { StepIngredient } from "@shared/models/StepIngredient";
import { CheckedItems } from ".";

interface IngredientItemProps {
  index: number;
  ingredient: StepIngredient;
  isChecked: boolean;
  onCheck: (index: number) => void;
}

const IngredientItem: React.FC<IngredientItemProps> = ({ index, ingredient, isChecked, onCheck }) => {
  return (
    <div className="flex items-start gap-3" onClick={() => onCheck(index)}>
      {/* Hidden Checkbox Input */}
      <input
        type="checkbox"
        checked={isChecked}
        onChange={() => onCheck(index)}
        className="peer hidden"
        id={`checkbox-${index}`}
      />
      {/* Styled Label acting as Checkbox */}
      <label
        htmlFor={`checkbox-${index}`}
        className="w-6 h-6 flex items-center justify-center border-2 border-gray-400 rounded-md cursor-pointer transition-all 
            peer-checked:bg-leafGreen-500 peer-checked:border-leafGreen-500 
            dark:border-gray-600 dark:peer-checked:bg-leafGreen-400 dark:peer-checked:border-leafGreen-400"
      >
        <CheckIcon
          className={`w-4 h-4 text-white peer-checked:block ${
            !isChecked && "hidden"
          }`}
        />
      </label>
      {/* Ingredient Text */}
      <span
        className={`text-lg leading-6 flex-1 transition-all ${
          isChecked
            ? "text-gray-400 dark:text-gray-500"
            : "text-gray-800 dark:text-gray-300"
        }`}
      >
        {ingredient.value}
      </span>
    </div>
  );
};

interface IngredientListProps {
  ingredients: StepIngredient[];
  checkedItems: CheckedItems;
  onCheck: (index: number) => void;
}

const IngredientList: React.FC<IngredientListProps> = ({ ingredients, checkedItems, onCheck }) => {
  return (
    <div className="flex flex-col space-y-4">
      {ingredients.map((ingredient, index) => (
        <IngredientItem
          key={index}
          ingredient={ingredient}
          index={index}
          onCheck={onCheck}
          isChecked={!!checkedItems[index] || false}
        />
      ))}
    </div>
  );
};

export default IngredientList;