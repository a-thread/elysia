import { Recipe } from "@recipes/models/Recipe";

/** Tern's saved-meal limits (tern: src/food/models/savedMeals.ts). */
export const TERN_MEAL_NAME_MAX = 60;

/**
 * A row for `tern.saved_meals`: one item holding a serving of the recipe, which
 * Tern scales by the portions eaten. The recipe id is reused as the meal id so
 * sending the same recipe again updates the meal instead of duplicating it.
 */
export interface TernMeal {
  id: string;
  name: string;
  items: {
    name: string;
    servings: number;
    servingLabel: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    tier: 1 | 2 | 3 | 4;
  }[];
}

const round1 = (n: number) => Math.round(n * 10) / 10;

/** Null when the recipe has no id or no nutrition yet. */
export const recipeToTernMeal = (
  recipe: Pick<Recipe, "id" | "title" | "nutrition">,
): TernMeal | null => {
  const { id, nutrition } = recipe;
  if (!id || !nutrition) return null;

  const title = (recipe.title ?? "").trim().replace(/\s+/g, " ");
  if (!title) return null;
  const name = title.slice(0, TERN_MEAL_NAME_MAX).trim();

  return {
    id,
    name,
    items: [
      {
        name: title,
        servings: 1,
        servingLabel: "1 serving",
        calories: Math.round(nutrition.calories),
        protein: round1(nutrition.protein),
        carbs: round1(nutrition.carbs),
        fat: round1(nutrition.fat),
        tier: nutrition.tier,
      },
    ],
  };
};
