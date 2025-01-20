import React from 'react';
import { Link } from 'react-router-dom';

function RecipeCard({ recipe }) {
  return (
    <Link
      to={`/recipe/${recipe.id}`}
    >

      {recipe.img_url && (
        <img
          src={recipe.img_url}
          alt={recipe.title}
          className="w-full h-32 object-cover rounded-t-lg"
        />
      )}
      <div className={`bg-white dark:bg-gray-800 rounded-b-lg shadow-md p-4 hover:shadow-lg transition-shadow ${!recipe.img_url && 'rounded-t-lg'}`}>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-leafGreen-100 mb-2">
          {recipe.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {recipe.description}
        </p>
      </div>
    </Link>
  );
}

export default RecipeCard;
