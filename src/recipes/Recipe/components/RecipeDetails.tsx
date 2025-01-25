import { Recipe } from '@shared/models/Recipe';
import React from 'react';

const RecipeDetails: React.FC<{recipe: Recipe}> = ({ recipe }) => {
  return (
    <>
      <h1 className="text-3xl font-bold text-leaf-green-900 dark:text-leaf-green-100 mb-4">
        {recipe.title}
      </h1>
      <p className="text-leaf-green-800 dark:text-gray-300 mb-4">{recipe.description}</p>
    </>
  );
}

export default RecipeDetails;
