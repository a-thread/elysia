import React from "react";
import { RecipeNutrition } from "@recipes/models/Recipe";

const NutritionSection: React.FC<{ nutrition?: RecipeNutrition | null }> = ({
  nutrition,
}) => {
  if (!nutrition) return null;

  const rows: [string, string][] = [
    ["Calories", `${Math.round(nutrition.calories)} kcal`],
    ["Protein", `${Math.round(nutrition.protein)} g`],
    ["Carbs", `${Math.round(nutrition.carbs)} g`],
    ["Fat", `${Math.round(nutrition.fat)} g`],
  ];

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-semibold text-leaf-green-900 dark:text-leaf-green-100 mt-6 md:mt-8 mb-1">
        Nutrition facts
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 md:mb-4">
        per serving
        {nutrition.source === "llm"
          ? " (estimated)"
          : nutrition.source === "scraped"
            ? " (from the original recipe)"
            : ""}
      </p>
      <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 md:mb-6">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2"
          >
            <dt className="text-xs uppercase tracking-wide text-leaf-green-700 dark:text-leaf-green-300">
              {label}
            </dt>
            <dd className="text-lg font-medium text-leaf-green-900 dark:text-leaf-green-100">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

export default NutritionSection;
