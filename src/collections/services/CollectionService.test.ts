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
      fn(chain)
    ),
  },
}));

const { default: CollectionService, mergeCollectionRecipes } = await import(
  "./CollectionService"
);

describe("mergeCollectionRecipes", () => {
  it("returns an empty array when there are no recipes", () => {
    expect(mergeCollectionRecipes({})).toEqual([]);
  });

  it("returns a directly-linked recipe untouched", () => {
    const result = mergeCollectionRecipes({
      collection_to_recipes: [
        { recipes: { id: "r1", title: "Recipe One", recipe_to_tags: [] } },
      ],
    });
    expect(result).toEqual([
      { id: "r1", title: "Recipe One", recipe_to_tags: [], tags: [] },
    ]);
  });

  it("dedupes a recipe reachable both directly and via a shared tag", () => {
    const result = mergeCollectionRecipes({
      collection_to_recipes: [
        { recipes: { id: "r1", title: "Recipe One", recipe_to_tags: [] } },
      ],
      collection_to_tags: [
        {
          tags: {
            recipe_to_tags: [
              { recipes: { id: "r1", title: "Recipe One", recipe_to_tags: [] } },
              { recipes: { id: "r2", title: "Recipe Two", recipe_to_tags: [] } },
            ],
          },
        },
      ],
    });
    expect(result.map((r) => r.id).sort()).toEqual(["r1", "r2"]);
  });
});

// Spec convention: default/loading, success, error, empty/edge case.
describe("CollectionService.getDetail", () => {
  beforeEach(() => {
    maybeSingle.mockReset();
  });

  it("merges recipes reached directly and via a shared tag, deduping by id", async () => {
    maybeSingle.mockResolvedValue({
      data: {
        id: "c1",
        title: "Weeknight dinners",
        description: null,
        img_url: null,
        is_public: true,
        user_id: "owner-1",
        collection_to_recipes: [
          {
            recipes: {
              id: "r1",
              title: "Recipe One",
              recipe_to_tags: [],
            },
          },
        ],
        collection_to_tags: [
          {
            tags: {
              id: "t1",
              title: "Quick",
              recipe_to_tags: [
                // r1 is reachable both directly and via this tag — should be deduped.
                { recipes: { id: "r1", title: "Recipe One", recipe_to_tags: [] } },
                { recipes: { id: "r2", title: "Recipe Two", recipe_to_tags: [] } },
              ],
            },
          },
        ],
        collection_to_users: [],
      },
      error: null,
    });

    const result = await CollectionService.getDetail("c1", "owner-1");

    expect(result?.recipes.map((r) => r.id).sort()).toEqual(["r1", "r2"]);
    expect(result?.tags.map((t: { id: string }) => t.id)).toEqual(["t1"]);
    expect(result?.can_edit).toBe(true);
  });

  it("throws when the query returns an error", async () => {
    maybeSingle.mockResolvedValue({ data: null, error: { message: "boom" } });

    await expect(CollectionService.getDetail("c1", "owner-1")).rejects.toThrow(
      "Failed to fetch collection details."
    );
  });

  it("throws when no collection is found (empty result)", async () => {
    maybeSingle.mockResolvedValue({ data: null, error: null });

    await expect(CollectionService.getDetail("missing", "owner-1")).rejects.toThrow(
      "No data returned."
    );
  });
});
