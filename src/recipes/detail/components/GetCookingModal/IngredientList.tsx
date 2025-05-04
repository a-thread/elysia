import React from "react";
import { FaCheck } from "react-icons/fa";
import { CheckedItems } from ".";
import { StepIngredient } from "@shared/models/StepIngredient";

interface IngredientItemProps {
  index: number;
  ingredient: string;
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
            peer-checked:bg-leaf-green-500 peer-checked:border-leaf-green-500 
            dark:border-gray-600 dark:peer-checked:bg-leaf-green-400 dark:peer-checked:border-leaf-green-400"
      >
        <FaCheck
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
        {ingredient}
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
          key={ingredient.id}
          ingredient={ingredient.value}
          index={index}
          onCheck={onCheck}
          isChecked={!!checkedItems[index] || false}
        />
      ))}
    </div>
  );
};

export default IngredientList;
