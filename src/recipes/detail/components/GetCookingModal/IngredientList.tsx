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
        className="shrink-0 w-5 h-5 mt-0.5 flex items-center justify-center border-2 border-gray-300 rounded-sm cursor-pointer transition-all
            peer-checked:bg-leaf-green-500 peer-checked:border-leaf-green-500
            dark:border-gray-600 dark:peer-checked:bg-leaf-green-400 dark:peer-checked:border-leaf-green-400"
      >
        <FaCheck
          className={`w-3 h-3 text-white peer-checked:block ${
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

interface IngredientGroup {
  group?: string;
  items: StepIngredient[];
}

const groupIngredients = (ingredients: StepIngredient[]): IngredientGroup[] => {
  const groups: IngredientGroup[] = [];
  ingredients.forEach((ingredient) => {
    const last = groups[groups.length - 1];
    if (last && (last.group || "") === (ingredient.group || "")) {
      last.items.push(ingredient);
    } else {
      groups.push({ group: ingredient.group, items: [ingredient] });
    }
  });
  return groups;
};

interface IngredientListProps {
  ingredients: StepIngredient[];
  checkedItems: CheckedItems;
  onCheck: (index: number) => void;
}

const IngredientList: React.FC<IngredientListProps> = ({ ingredients, checkedItems, onCheck }) => {
  const groups = groupIngredients(ingredients);
  let runningIndex = 0;

  return (
    <div className="flex flex-col gap-5">
      {groups.map((group, groupIndex) => (
        <div key={groupIndex} className="flex flex-col gap-4">
          {group.group && (
            <div className="text-xs font-bold uppercase tracking-wide text-leaf-green-700 dark:text-leaf-green-300">
              {group.group}
            </div>
          )}
          {group.items.map((ingredient) => {
            const index = runningIndex++;
            return (
              <IngredientItem
                key={ingredient.id}
                ingredient={ingredient.value}
                index={index}
                onCheck={onCheck}
                isChecked={!!checkedItems[index] || false}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default IngredientList;
