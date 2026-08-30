import React from "react";
import { Link } from "react-router-dom";
import { Recipe } from "@shared/models/Recipe";
import ImgTitleDescription from "@shared/components/ImgTitleDescCard";

const MoreToExplore: React.FC<{ recipes: Recipe[] }> = ({ recipes }) => {
  if (!recipes.length) return null;

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-leaf-green-100 mb-4">
        More to Explore
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <Link key={recipe.id} to={`/recipes/${recipe.id}`}>
            <ImgTitleDescription {...recipe} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MoreToExplore;
