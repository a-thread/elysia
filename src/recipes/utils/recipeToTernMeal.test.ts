import { describe, it, expect } from "vitest";
import { recipeToTernMeal, TERN_MEAL_NAME_MAX } from "./recipeToTernMeal";

const nutrition = { calories: 412.6, protein: 30.04, carbs: 40.55, fat: 12.2, tier: 2 as const };

describe("recipeToTernMeal", () => {
  it("maps a recipe to one saved-meal item per serving, reusing the recipe id", () => {
    expect(
      recipeToTernMeal({ id: "r1", title: "  Chicken   curry ", nutrition }),
    ).toEqual({
      id: "r1",
      name: "Chicken curry",
      items: [
        {
          name: "Chicken curry",
          servings: 1,
          servingLabel: "1 serving",
          calories: 413,
          protein: 30,
          carbs: 40.6,
          fat: 12.2,
          tier: 2,
        },
      ],
    });
  });

  it("returns null without nutrition, an id, or a title", () => {
    expect(recipeToTernMeal({ id: "r1", title: "Soup", nutrition: null })).toBeNull();
    expect(recipeToTernMeal({ id: undefined, title: "Soup", nutrition })).toBeNull();
    expect(recipeToTernMeal({ id: "r1", title: "   ", nutrition })).toBeNull();
  });

  it("truncates the meal name to Tern's limit but keeps the full item name", () => {
    const title = "a".repeat(TERN_MEAL_NAME_MAX + 20);
    const meal = recipeToTernMeal({ id: "r1", title, nutrition })!;
    expect(meal.name).toHaveLength(TERN_MEAL_NAME_MAX);
    expect(meal.items[0].name).toBe(title);
  });
});
