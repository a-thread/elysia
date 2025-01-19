import React from 'react';

function RecipeDetails({ recipe }) {
  return (
    <>
      <h1 className="text-3xl font-bold text-leafGreen-900 dark:text-leafGreen-100 mb-4">
        {recipe.title}
      </h1>
      <p className="text-leafGreen-800 dark:text-gray-300 mb-4">{recipe.description}</p>
    </>
  );
}

export default RecipeDetails;
