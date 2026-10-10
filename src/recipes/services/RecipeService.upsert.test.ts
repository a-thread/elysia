import { describe, it, expect, vi, beforeEach } from "vitest";

const eq = vi.fn();
const update = vi.fn((_row: Record<string, unknown>) => ({ eq }));
const single = vi.fn();
const select = vi.fn(() => ({ single }));
const insert = vi.fn((_rows: Record<string, unknown>[]) => ({ select }));
const from = vi.fn(() => ({ insert, update }));

vi.mock("@shared/services/SupabaseWithAbort", () => ({
  supabaseWithAbort: {
    request: vi.fn(async (_key: string, fn: (client: unknown) => unknown) =>
      fn({ from }),
    ),
  },
}));

const { default: RecipeService } = await import("./RecipeService");

const nutrition = { calories: 300, protein: 20, carbs: 30, fat: 10, tier: 2 as const, source: "manual" as const };

describe("RecipeService.upsert nutrition", () => {
  beforeEach(() => {
    [eq, single].forEach((fn) => fn.mockReset());
    [update, select, insert, from].forEach((fn) => fn.mockClear());
    eq.mockResolvedValue({ error: null });
    single.mockResolvedValue({ data: { id: "new-id" }, error: null });
  });

  it("saves nutrition on update when the form provides it", async () => {
    await RecipeService.upsert("r1", { title: "Soup", nutrition });

    expect(update).toHaveBeenCalledWith(expect.objectContaining({ nutrition }));
  });

  it("removes nutrition on update when the form clears it (null)", async () => {
    await RecipeService.upsert("r1", { title: "Soup", nutrition: null });

    expect(update).toHaveBeenCalledWith(expect.objectContaining({ nutrition: null }));
  });

  it("leaves nutrition out of the update when it is undefined", async () => {
    await RecipeService.upsert("r1", { title: "Soup" });

    expect(update.mock.calls[0][0]).not.toHaveProperty("nutrition");
  });

  it("saves nutrition on insert, and leaves it out when undefined", async () => {
    await RecipeService.upsert(undefined, { title: "Soup", nutrition }, "u1");
    expect(insert.mock.calls[0][0][0]).toMatchObject({ nutrition, user_id: "u1" });

    await RecipeService.upsert(undefined, { title: "Stew" }, "u1");
    expect(insert.mock.calls[1][0][0]).not.toHaveProperty("nutrition");
  });

  it("throws when the update fails", async () => {
    eq.mockResolvedValue({ error: { message: "boom" } });

    await expect(RecipeService.upsert("r1", { title: "Soup" })).rejects.toThrow(
      "Failed to update recipe: boom",
    );
  });
});
