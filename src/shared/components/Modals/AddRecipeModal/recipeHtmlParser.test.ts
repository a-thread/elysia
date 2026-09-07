import { describe, it, expect } from "vitest";
import { parseRecipeFromHtml } from "./recipeHtmlParser";

const html = (body: string) => `<html><head>
  <link rel="canonical" href="https://example.com/soup" />
  <meta property="og:image" content="/soup.jpg" />
</head><body>${body}</body></html>`;

describe("parseRecipeFromHtml", () => {
  it("extracts title, ingredients, and steps from a well-formed recipe page", async () => {
    const recipe = await parseRecipeFromHtml(
      html(`
        <h1 class="recipe-title">Tomato Soup</h1>
        <ul class="ingredients">
          <li>2 cups tomatoes</li>
          <li>1 onion</li>
        </ul>
        <ol class="instructions">
          <li>Chop the onion.</li>
          <li>Simmer everything.</li>
        </ol>
      `)
    );

    expect(recipe.title).toBe("Tomato Soup");
    expect(recipe.original_recipe_url).toBe("https://example.com/soup");
    expect(recipe.img_url).toBe("https://example.com/soup.jpg");
    expect(recipe.ingredients?.map((i) => i.value)).toEqual([
      "2 cups tomatoes",
      "1 onion",
    ]);
    expect(recipe.steps?.map((s) => s.value)).toEqual([
      "Chop the onion.",
      "Simmer everything.",
    ]);
  });

  it("groups ingredients under a structural WPRM-style group container", async () => {
    const recipe = await parseRecipeFromHtml(
      html(`
        <h1>Layered Cake</h1>
        <div class="wprm-recipe-ingredient-group">
          <span class="wprm-recipe-group-name">For the topping</span>
          <ul><li class="wprm-recipe-ingredient">1 cup frosting</li></ul>
        </div>
      `)
    );

    expect(recipe.ingredients).toEqual([
      expect.objectContaining({ value: "1 cup frosting", group: "For the topping" }),
    ]);
  });

  it("falls back to defaults when the page has no recognizable recipe markup (edge case)", async () => {
    const recipe = await parseRecipeFromHtml(html(""), "https://example.com/empty");

    expect(recipe.title).toBe("Untitled Recipe");
    expect(recipe.ingredients).toEqual([]);
    expect(recipe.steps).toEqual([]);
    expect(recipe.original_recipe_url).toBe("https://example.com/empty");
  });
});
