import { describe, it, expect } from "vitest";
import { normalizeNutrition, DEFAULT_NUTRITION_TIER } from "./normalizeNutrition";

describe("normalizeNutrition", () => {
  it("adds the default tier and a scraped source to the scraper's shape", () => {
    expect(
      normalizeNutrition({ calories: 250, protein: 12.5, carbs: 30, fat: 8 }),
    ).toEqual({
      calories: 250,
      protein: 12.5,
      carbs: 30,
      fat: 8,
      tier: DEFAULT_NUTRITION_TIER,
      source: "scraped",
    });
  });

  it("keeps a valid tier, source and timestamp from an already-saved value", () => {
    expect(
      normalizeNutrition({
        calories: 400,
        protein: 20,
        carbs: 40,
        fat: 15,
        tier: 1,
        source: "llm",
        estimated_at: "2026-10-09T00:00:00Z",
      }),
    ).toMatchObject({ tier: 1, source: "llm", estimated_at: "2026-10-09T00:00:00Z" });
  });

  it("falls back to the default tier for an out-of-range tier", () => {
    expect(
      normalizeNutrition({ calories: 1, protein: 0, carbs: 0, fat: 0, tier: 9 })?.tier,
    ).toBe(DEFAULT_NUTRITION_TIER);
  });

  it("returns null when missing, incomplete, negative, non-numeric or zero calories", () => {
    expect(normalizeNutrition(null)).toBeNull();
    expect(normalizeNutrition(undefined)).toBeNull();
    expect(normalizeNutrition("250 calories")).toBeNull();
    expect(normalizeNutrition({ calories: 250, protein: 1, carbs: 2 })).toBeNull();
    expect(normalizeNutrition({ calories: 250, protein: -1, carbs: 2, fat: 3 })).toBeNull();
    expect(normalizeNutrition({ calories: "250", protein: 1, carbs: 2, fat: 3 })).toBeNull();
    expect(normalizeNutrition({ calories: 0, protein: 0, carbs: 0, fat: 0 })).toBeNull();
  });
});
