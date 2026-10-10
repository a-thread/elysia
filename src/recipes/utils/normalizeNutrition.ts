import { RecipeNutrition } from "@recipes/models/Recipe";

/** NOVA class used when a source (e.g. the scraper) gives no tier; Tern lets the user change it. */
export const DEFAULT_NUTRITION_TIER = 3;

const isNonNegativeNumber = (n: unknown): n is number =>
  typeof n === "number" && Number.isFinite(n) && n >= 0;

/**
 * Turns nutrition from outside the app (the scraper's `{calories, protein, carbs, fat}`, or an
 * already-saved value) into the shape stored on a recipe. Null when it is missing or incomplete,
 * since the database requires all four numbers.
 */
export const normalizeNutrition = (raw: unknown): RecipeNutrition | null => {
  if (!raw || typeof raw !== "object") return null;
  const n = raw as Record<string, unknown>;
  if (
    !isNonNegativeNumber(n.calories) ||
    !isNonNegativeNumber(n.protein) ||
    !isNonNegativeNumber(n.carbs) ||
    !isNonNegativeNumber(n.fat) ||
    n.calories === 0
  ) {
    return null;
  }

  const tier = [1, 2, 3, 4].includes(n.tier as number)
    ? (n.tier as RecipeNutrition["tier"])
    : DEFAULT_NUTRITION_TIER;

  return {
    calories: n.calories,
    protein: n.protein,
    carbs: n.carbs,
    fat: n.fat,
    tier,
    source: (n.source as RecipeNutrition["source"]) ?? "scraped",
    ...(typeof n.estimated_at === "string" ? { estimated_at: n.estimated_at } : {}),
  };
};
