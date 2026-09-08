import { describe, it, expect, vi, beforeEach } from "vitest";

const maybeSingle = vi.fn();
const chain = {
  from: vi.fn(() => chain),
  select: vi.fn(() => chain),
  eq: vi.fn(() => chain),
  or: vi.fn(() => chain),
  maybeSingle,
};

vi.mock("@shared/services/SupabaseWithAbort", () => ({
  supabaseWithAbort: {
    request: vi.fn(async (_key: string, fn: (client: unknown) => unknown) =>
      fn(chain),
    ),
  },
}));

const { default: RecipeService } = await import("./RecipeService");

describe("RecipeService.getDetail", () => {
  beforeEach(() => {
    maybeSingle.mockReset();
  });

  const baseRecipeRow = {
    id: "r1",
    title: "Soup",
    description: null,
    img_url: null,
    user_id: "owner-1",
    servings: 4,
    prep_time: 5,
    cook_time: 10,
    original_recipe_url: null,
    ingredients: [],
    steps: [],
    recipe_to_users: [],
    collection_to_recipes: [],
    recipe_to_tags: [],
  };

  it("grants can_edit to the owner", async () => {
    maybeSingle.mockResolvedValue({
      data: { ...baseRecipeRow, is_public: false, public_permission: "read" },
      error: null,
    });

    const result = await RecipeService.getDetail("r1", "owner-1");

    expect(result?.can_edit).toBe(true);
    expect(result?.is_owner).toBe(true);
  });

  it("grants can_edit to a user with a named edit share", async () => {
    maybeSingle.mockResolvedValue({
      data: {
        ...baseRecipeRow,
        is_public: false,
        public_permission: "read",
        recipe_to_users: [{ permission: "edit" }],
      },
      error: null,
    });

    const result = await RecipeService.getDetail("r1", "visitor-1");

    expect(result?.can_edit).toBe(true);
    expect(result?.is_owner).toBe(false);
  });

  it("grants can_edit to a signed-in non-owner when public_permission is edit", async () => {
    maybeSingle.mockResolvedValue({
      data: { ...baseRecipeRow, is_public: true, public_permission: "edit" },
      error: null,
    });

    const result = await RecipeService.getDetail("r1", "visitor-1");

    expect(result?.can_edit).toBe(true);
  });

  it("does not grant can_edit to a signed-in non-owner when public_permission is read", async () => {
    maybeSingle.mockResolvedValue({
      data: { ...baseRecipeRow, is_public: true, public_permission: "read" },
      error: null,
    });

    const result = await RecipeService.getDetail("r1", "visitor-1");

    expect(result?.can_edit).toBe(false);
  });

  it("never grants can_edit to an anonymous visitor even when public_permission is edit", async () => {
    maybeSingle.mockResolvedValue({
      data: { ...baseRecipeRow, is_public: true, public_permission: "edit" },
      error: null,
    });

    const result = await RecipeService.getDetail("r1", undefined);

    expect(result?.can_edit).toBe(false);
  });

  it("throws when the query returns an error", async () => {
    maybeSingle.mockResolvedValue({ data: null, error: { message: "boom" } });

    await expect(RecipeService.getDetail("r1", "owner-1")).rejects.toThrow(
      "Failed to fetch recipe details.",
    );
  });

  it("throws when no recipe is found (empty result)", async () => {
    maybeSingle.mockResolvedValue({ data: null, error: null });

    await expect(
      RecipeService.getDetail("missing", "owner-1"),
    ).rejects.toThrow("No data returned for the given recipe.");
  });
});
