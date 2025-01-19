import React from "react";
import ListItem from "./ListItem";

function IngredientsSection({ ingredients }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-leafGreen-900 dark:text-leafGreen-100 mb-4">
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
