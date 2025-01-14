import React from 'react';

function IngredientsSection({ ingredients }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Ingredients</h2>
      <ul className="list-disc pl-6 mb-6">
        {ingredients?.map((ingredient, index) => (
          <li
            key={index}
            className="text-gray-700 dark:text-gray-300"
          >
            {ingredient.quantity} {ingredient.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default IngredientsSection;
