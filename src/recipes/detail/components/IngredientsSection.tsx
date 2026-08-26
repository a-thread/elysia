import React from "react";
import ListItem from "./ListItem";
import { StepIngredient } from "@shared/models/StepIngredient";

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

const IngredientsSection: React.FC<{ ingredients: StepIngredient[] }> = ({ ingredients }) => {
  if (!ingredients?.length) return null;

  const groups = groupIngredients(ingredients);

  return (
    <div>
      <h2 className="text-2xl font-semibold text-leaf-green-900 dark:text-leaf-green-100 mb-4">
        Ingredients
      </h2>
      <div className="flex flex-col gap-4 mb-6">
        {groups.map((group, groupIndex) => (
          <div key={groupIndex}>
            {group.group && (
              <div className="text-xs font-bold uppercase tracking-wide text-leaf-green-700 dark:text-leaf-green-300 mb-1.5">
                {group.group}
              </div>
            )}
            <ul>
              {group.items.map((ingredient) => (
                <ListItem key={ingredient.id} value={ingredient.value} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IngredientsSection;
