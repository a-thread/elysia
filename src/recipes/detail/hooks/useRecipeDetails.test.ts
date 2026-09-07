import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";

vi.mock("@recipes/services/RecipeService", () => ({
  default: { getDetail: vi.fn() },
}));

const { default: RecipeService } = await import("@recipes/services/RecipeService");
const { useRecipeDetails } = await import("./useRecipeDetails");

// Spec convention: default/loading, success, error, empty/edge case.
describe("useRecipeDetails", () => {
  beforeEach(() => {
    vi.mocked(RecipeService.getDetail).mockReset();
  });

  it("starts in a loading state with no recipe", () => {
    vi.mocked(RecipeService.getDetail).mockReturnValue(
      new Promise(() => {
        // Never resolves — asserting the hook's initial loading state.
      })
    );

    const { result } = renderHook(() => useRecipeDetails("r1", "u1"));

    expect(result.current.loading).toBe(true);
    expect(result.current.recipe).toBeNull();
  });

  it("loads and formats the recipe on success", async () => {
    vi.mocked(RecipeService.getDetail).mockResolvedValue({
      id: "r1",
      title: "Soup",
      description: null,
      img_url: null,
      user_id: "u1",
      is_public: false,
      servings: 4,
      prep_time: 5,
      cook_time: 10,
      original_recipe_url: null,
      ingredients: [],
      steps: [],
      recipe_to_users: [],
      collection_to_recipes: [],
      recipe_to_tags: [],
    });

    const { result } = renderHook(() => useRecipeDetails("r1", "u1"));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.recipe?.title).toBe("Soup");
    expect(result.current.recipe?.total_time).toBe(15);
  });

  it("stops loading without setting a recipe when the fetch errors", async () => {
    vi.mocked(RecipeService.getDetail).mockRejectedValue(new Error("network down"));

    const { result } = renderHook(() => useRecipeDetails("r1", "u1"));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.recipe).toBeNull();
  });

  it("does not fetch when id is undefined (edge case)", () => {
    renderHook(() => useRecipeDetails(undefined, "u1"));

    expect(RecipeService.getDetail).not.toHaveBeenCalled();
  });
});
