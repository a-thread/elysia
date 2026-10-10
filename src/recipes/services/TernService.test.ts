import { describe, it, expect, vi, beforeEach } from "vitest";

const upsert = vi.fn();
const from = vi.fn(() => ({ upsert }));
const schema = vi.fn(() => ({ from }));

vi.mock("@shared/services/SupabaseWithAbort", () => ({
  supabaseWithAbort: {
    request: vi.fn(async (_key: string, fn: (client: unknown) => unknown) =>
      fn({ schema }),
    ),
  },
}));

const { default: TernService, TernSendError } = await import("./TernService");

const recipe = {
  id: "r1",
  title: "Pancakes",
  nutrition: { calories: 300, protein: 8, carbs: 40, fat: 10, tier: 3 as const },
};

describe("TernService.sendRecipe", () => {
  beforeEach(() => {
    upsert.mockReset();
    upsert.mockResolvedValue({ error: null });
    schema.mockClear();
    from.mockClear();
  });

  it("upserts the recipe as a saved meal in the tern schema, keyed by recipe id", async () => {
    const meal = await TernService.sendRecipe(recipe);

    expect(schema).toHaveBeenCalledWith("tern");
    expect(from).toHaveBeenCalledWith("saved_meals");
    expect(upsert).toHaveBeenCalledWith(
      expect.objectContaining({ id: "r1", name: "Pancakes" }),
      { onConflict: "id" },
    );
    expect(meal?.items[0].calories).toBe(300);
  });

  it("refuses a recipe without nutrition and never calls Supabase", async () => {
    await expect(
      TernService.sendRecipe({ ...recipe, nutrition: null }),
    ).rejects.toMatchObject({ reason: "no-nutrition" });
    expect(upsert).not.toHaveBeenCalled();
  });

  it("reports a name clash with a different Tern meal", async () => {
    upsert.mockResolvedValue({ error: { code: "23505" } });
    await expect(TernService.sendRecipe(recipe)).rejects.toMatchObject({
      reason: "name-taken",
    });
  });

  it("reports Tern being unavailable when the schema or table is not reachable", async () => {
    upsert.mockResolvedValue({ error: { code: "PGRST106" } });
    await expect(TernService.sendRecipe(recipe)).rejects.toBeInstanceOf(TernSendError);
    await expect(TernService.sendRecipe(recipe)).rejects.toMatchObject({
      reason: "unavailable",
    });
  });

  it("falls back to a generic failure for other errors", async () => {
    upsert.mockResolvedValue({ error: { code: "XX000" } });
    await expect(TernService.sendRecipe(recipe)).rejects.toMatchObject({
      reason: "failed",
    });
  });
});
