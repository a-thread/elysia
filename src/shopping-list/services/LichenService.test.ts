import { describe, it, expect, vi, beforeEach } from "vitest";

const maybeSingle = vi.fn();
const limit = vi.fn(() => ({ maybeSingle }));
const order = vi.fn(() => ({ limit }));
const eqTitle = vi.fn(() => ({ order }));
const eqUser = vi.fn(() => ({ eq: eqTitle }));
const select = vi.fn(() => ({ eq: eqUser }));
const updateEq = vi.fn();
const update = vi.fn(() => ({ eq: updateEq }));
const insert = vi.fn();
const from = vi.fn(() => ({ select, update, insert }));
const schema = vi.fn(() => ({ from }));

vi.mock("@shared/services/SupabaseWithAbort", () => ({
  supabaseWithAbort: {
    request: vi.fn(async (_key: string, fn: (client: unknown) => unknown) =>
      fn({ schema }),
    ),
  },
}));

const { default: LichenService, SHOPPING_LIST_NOTE_TITLE } = await import("./LichenService");

describe("LichenService.saveShoppingListNote", () => {
  beforeEach(() => {
    [maybeSingle, updateEq, insert].forEach((fn) => fn.mockReset());
    [schema, from, select, update, eqUser, eqTitle].forEach((fn) => fn.mockClear());
  });

  it("creates the note when the user has none, with the text as a JSON body", async () => {
    maybeSingle.mockResolvedValue({ data: null, error: null });
    insert.mockResolvedValue({ error: null });

    await LichenService.saveShoppingListNote("u1", "- [ ] Milk");

    expect(schema).toHaveBeenCalledWith("public");
    expect(from).toHaveBeenCalledWith("note");
    expect(eqUser).toHaveBeenCalledWith("user_id", "u1");
    expect(eqTitle).toHaveBeenCalledWith("title", SHOPPING_LIST_NOTE_TITLE);
    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: "u1",
        title: "Shopping List",
        body: JSON.stringify({ type: "text", text: "- [ ] Milk" }),
        created_by: "u1",
        updated_by: "u1",
        is_public: false,
      }),
    );
    expect(update).not.toHaveBeenCalled();
  });

  it("replaces the text of the existing note instead of creating another", async () => {
    maybeSingle.mockResolvedValue({ data: { id: "n1" }, error: null });
    updateEq.mockResolvedValue({ error: null });

    await expect(LichenService.saveShoppingListNote("u1", "- [x] Eggs")).resolves.toBe("n1");

    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        body: JSON.stringify({ type: "text", text: "- [x] Eggs" }),
        updated_by: "u1",
      }),
    );
    expect(updateEq).toHaveBeenCalledWith("id", "n1");
    expect(insert).not.toHaveBeenCalled();
  });

  it("writes an empty note for an empty list", async () => {
    maybeSingle.mockResolvedValue({ data: { id: "n1" }, error: null });
    updateEq.mockResolvedValue({ error: null });

    await LichenService.saveShoppingListNote("u1", "");

    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({ body: JSON.stringify({ type: "text", text: "" }) }),
    );
  });

  it("throws when the lookup, update or insert fails", async () => {
    maybeSingle.mockResolvedValueOnce({ data: null, error: { message: "boom" } });
    await expect(LichenService.saveShoppingListNote("u1", "x")).rejects.toThrow(
      "Failed to look up the Shopping List note.",
    );

    maybeSingle.mockResolvedValueOnce({ data: { id: "n1" }, error: null });
    updateEq.mockResolvedValueOnce({ error: { message: "boom" } });
    await expect(LichenService.saveShoppingListNote("u1", "x")).rejects.toThrow(
      "Failed to update the Shopping List note.",
    );

    maybeSingle.mockResolvedValueOnce({ data: null, error: null });
    insert.mockResolvedValueOnce({ error: { message: "boom" } });
    await expect(LichenService.saveShoppingListNote("u1", "x")).rejects.toThrow(
      "Failed to create the Shopping List note.",
    );
  });
});
