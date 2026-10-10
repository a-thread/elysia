import { describe, it, expect } from "vitest";
import { load } from "cheerio";
import { parseJsonLdNutrition } from "./jsonLdNutrition";
import { parseRecipeFromHtml } from "./recipeHtmlParser";

const page = (...scripts: string[]) =>
  `<html><head>${scripts
    .map((s) => `<script type="application/ld+json">${s}</script>`)
    .join("")}</head><body></body></html>`;

const nutritionOf = (...scripts: string[]) => parseJsonLdNutrition(load(page(...scripts)));

describe("parseJsonLdNutrition", () => {
  it("reads per-serving nutrition from a Recipe with units in the text, defaulting tier and source", () => {
    expect(
      nutritionOf(`{"@type":"Recipe","nutrition":{"calories":"250 calories",
        "proteinContent":"12.5 g","carbohydrateContent":"30 grams","fatContent":"8g"}}`),
    ).toEqual({ calories: 250, protein: 12.5, carbs: 30, fat: 8, tier: 3, source: "scraped" });
  });

  it("finds the recipe inside a graph or root array and accepts numeric values", () => {
    expect(
      nutritionOf(`{"@graph":[{"@type":"WebSite"},{"@type":["Recipe","Thing"],
        "nutrition":{"calories":410,"proteinContent":20,"carbohydrateContent":45.25,"fatContent":"15.04 g"}}]}`),
    ).toMatchObject({ calories: 410, protein: 20, carbs: 45.3, fat: 15 });

    expect(
      nutritionOf(`[{"@type":"BreadcrumbList"},{"@type":"Recipe","nutrition":{"calories":"100 kcal",
        "proteinContent":"1 g","carbohydrateContent":"2 g","fatContent":"3 g"}}]`),
    ).toMatchObject({ calories: 100, protein: 1, carbs: 2, fat: 3 });
  });

  it("converts kilojoules when no calories are given", () => {
    expect(
      nutritionOf(`{"@type":"Recipe","nutrition":{"calories":"1046 kJ","proteinContent":"5 g",
        "carbohydrateContent":"10 g","fatContent":"2 g"}}`)?.calories,
    ).toBe(250);
  });

  it("is null when a value is missing, there is no recipe, or nothing is numeric", () => {
    expect(
      nutritionOf(`{"@type":"Recipe","nutrition":{"calories":"250","proteinContent":"12 g"}}`),
    ).toBeNull();
    expect(nutritionOf(`{"@type":"Recipe","name":"Soup"}`)).toBeNull();
    expect(nutritionOf(`{"@type":"Article","nutrition":{"calories":"250"}}`)).toBeNull();
    expect(
      nutritionOf(`{"@type":"Recipe","nutrition":{"calories":"unknown","proteinContent":"1 g",
        "carbohydrateContent":"2 g","fatContent":"3 g"}}`),
    ).toBeNull();
    expect(parseJsonLdNutrition(load("<html><body></body></html>"))).toBeNull();
  });

  it("skips malformed structured data and keeps looking in other scripts", () => {
    expect(
      nutritionOf(
        "{ not json",
        `{"@type":"Recipe","nutrition":{"calories":"90","proteinContent":"1 g",
          "carbohydrateContent":"2 g","fatContent":"3 g"}}`,
      )?.calories,
    ).toBe(90);
  });

  it("is included in the parsed recipe from pasted HTML", async () => {
    const recipe = await parseRecipeFromHtml(
      page(`{"@type":"Recipe","nutrition":{"calories":"253 kcal","carbohydrateContent":"50 g",
        "proteinContent":"2 g","fatContent":"6 g"}}`),
      "https://example.com/apple-crisp",
    );
    expect(recipe.nutrition).toMatchObject({ calories: 253, protein: 2, carbs: 50, fat: 6 });
  });
});
