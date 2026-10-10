import { RecipeNutrition } from "@recipes/models/Recipe";
import { DEFAULT_NUTRITION_TIER } from "./normalizeNutrition";

/** The nutrition form's inputs as typed, so a half-filled form can be shown as it is. */
export interface NutritionDraft {
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  tier: RecipeNutrition["tier"];
}

export const toDraft = (nutrition?: RecipeNutrition | null): NutritionDraft => ({
  calories: nutrition ? String(nutrition.calories) : "",
  protein: nutrition ? String(nutrition.protein) : "",
  carbs: nutrition ? String(nutrition.carbs) : "",
  fat: nutrition ? String(nutrition.fat) : "",
  tier: nutrition?.tier ?? DEFAULT_NUTRITION_TIER,
});

const FIELDS = ["calories", "protein", "carbs", "fat"] as const;

const parse = (text: string): number | null => {
  if (text.trim() === "") return null;
  const n = Number(text);
  return Number.isFinite(n) && n >= 0 ? n : null;
};

/**
 * What the form should tell the recipe:
 * - all four values filled in: the nutrition, marked manual;
 * - all four blank: `null`, meaning remove it;
 * - anything else (partly filled, or an invalid number): `undefined`, meaning leave the saved
 *   value alone until the form is complete.
 */
export const fromDraft = (
  draft: NutritionDraft,
): RecipeNutrition | null | undefined => {
  if (FIELDS.every((field) => draft[field].trim() === "")) return null;

  const [calories, protein, carbs, fat] = FIELDS.map((field) => parse(draft[field]));
  if (calories === null || protein === null || carbs === null || fat === null) return undefined;
  if (calories === 0) return undefined;

  return { calories, protein, carbs, fat, tier: draft.tier, source: "manual" };
};

/** True when some, but not all, of the four values are filled in (or one is not a valid number). */
export const isIncomplete = (draft: NutritionDraft): boolean =>
  fromDraft(draft) === undefined;
