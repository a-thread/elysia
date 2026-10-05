import { describe, it, expect, vi, beforeEach } from "vitest";

const inFn = vi.fn();
const eq = vi.fn(() => ({ in: inFn }));
const del = vi.fn(() => ({ eq }));
const from = vi.fn(() => ({ delete: del }));

vi.mock("./SupabaseWithAbort", () => ({
  supabaseWithAbort: {
    request: vi.fn(async (_key: string, fn: (client: unknown) => unknown) =>
      fn({ from }),
    ),
  },
}));

const { default: TagService } = await import("./TagService");

describe("TagService tag removal", () => {
  beforeEach(() => {
    inFn.mockReset();
    inFn.mockResolvedValue({ error: null });
    from.mockClear();
  });

  it("removes tags from a collection via collection_to_tags", async () => {
    await TagService.removeFromCollection("c1", [{ id: "t1", title: "Pie" }]);

    expect(from).toHaveBeenCalledWith("collection_to_tags");
    expect(eq).toHaveBeenCalledWith("collection_id", "c1");
    expect(inFn).toHaveBeenCalledWith("tag_id", ["t1"]);
  });

  it("removes tags from a recipe via recipe_to_tags", async () => {
    await TagService.removeFromRecipe("r1", [{ id: "t1", title: "Pie" }]);

    expect(from).toHaveBeenCalledWith("recipe_to_tags");
    expect(eq).toHaveBeenCalledWith("recipe_id", "r1");
  });

  it("throws when the delete fails", async () => {
    inFn.mockResolvedValue({ error: { message: "boom" } });

    await expect(
      TagService.removeFromCollection("c1", [{ id: "t1", title: "Pie" }]),
    ).rejects.toThrow("Failed to remove tags from collection.");
  });

  it("does nothing harmful for an empty tag list", async () => {
    await TagService.removeFromCollection("c1", []);

    expect(inFn).toHaveBeenCalledWith("tag_id", []);
  });
});
