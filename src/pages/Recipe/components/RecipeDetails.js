import React from 'react';

function RecipeDetails({ recipe }) {
  return (
    <>
      <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
        {recipe.title}
      </h1>
      <p className="text-gray-700 dark:text-gray-300 mb-4">{recipe.description}</p>
      <div className="mb-4">
        <strong className="text-gray-800 dark:text-gray-100">Prep Time:</strong>{' '}
        <span className="text-gray-700 dark:text-gray-300">{recipe.prep_time} minutes</span>
      </div>
      <div className="mb-6">
        <strong className="text-gray-800 dark:text-gray-100">Cook Time:</strong>{' '}
        <span className="text-gray-700 dark:text-gray-300">{recipe.cook_time} minutes</span>
      </div>
    </>
  );
}

export default RecipeDetails;
