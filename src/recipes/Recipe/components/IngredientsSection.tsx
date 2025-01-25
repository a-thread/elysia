import React from "react";
import ListItem from "./ListItem";
import { StepIngredient } from "@shared/models/StepIngredient";

const IngredientsSection: React.FC<{ingredients: StepIngredient[]}> = ({ ingredients }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-leaf-green-900 dark:text-leaf-green-100 mb-4">
        Ingredients
      </h2>
      <ul className="list-disc pl-6 mb-6">
        {ingredients?.map((ingredient, index) => (
          <ListItem key={index} value={ingredient.value} index={index} />
        ))}
      </ul>
    </div>
  );
}

export default IngredientsSection;
