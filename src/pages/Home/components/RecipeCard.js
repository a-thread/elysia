import React from 'react';
import { Link } from 'react-router-dom';

function RecipeCard({ recipe }) {
  return (
    <Link
      to={`/recipe/${recipe.id}`}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
    >
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
        {recipe.title}
      </h2>
      <p className="text-gray-600 dark:text-gray-400 text-sm">
        {recipe.description}
      </p>
    </Link>
  );
}

export default RecipeCard;
