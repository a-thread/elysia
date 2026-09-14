import { describe, it, expect, vi, beforeEach } from "vitest";

const order = vi.fn();
const single = vi.fn();
const select = vi.fn();
const eq = vi.fn();
const del = vi.fn();
const insert = vi.fn();
const update = vi.fn();

const chain = {
  from: vi.fn(() => chain),
  select,
  eq,
  order,
  insert,
  update,
  delete: del,
  single,
};

// Default: each intermediate call continues the chain. Individual tests
// override this with mockResolvedValueOnce when a call is the terminal one.
select.mockReturnValue(chain);
eq.mockReturnValue(chain);
insert.mockReturnValue(chain);
update.mockReturnValue(chain);
del.mockReturnValue(chain);

vi.mock("@shared/services/SupabaseWithAbort", () => ({
  supabaseWithAbort: {
    request: vi.fn(async (_key: string, fn: (client: unknown) => unknown) =>
      fn(chain),
    ),
  },
}));

const { default: ShoppingListService } = await import("./ShoppingListService");

describe("ShoppingListService", () => {
  beforeEach(() => {
    order.mockReset();
    single.mockReset();
    select.mockClear();
    eq.mockClear();
    del.mockClear();
    insert.mockClear();
    update.mockClear();
  });

  describe("getList", () => {
    it("returns items ordered by created_at", async () => {
      order.mockResolvedValue({
        data: [{ id: "1", value: "Milk" }],
        error: null,
      });

      const result = await ShoppingListService.getList("user-1");

      expect(result).toEqual([{ id: "1", value: "Milk" }]);
    });

    it("returns an empty array when there are no items", async () => {
      order.mockResolvedValue({ data: null, error: null });

      const result = await ShoppingListService.getList("user-1");

      expect(result).toEqual([]);
    });

    it("throws when the query returns an error", async () => {
      order.mockResolvedValue({ data: null, error: { message: "boom" } });

      await expect(ShoppingListService.getList("user-1")).rejects.toThrow(
        "Failed to fetch shopping list.",
      );
    });
  });

  describe("addItem", () => {
    it("inserts and returns the created item", async () => {
      single.mockResolvedValue({
        data: { id: "1", value: "Milk", checked: false },
        error: null,
      });

      const result = await ShoppingListService.addItem("user-1", "Milk");

      expect(insert).toHaveBeenCalledWith([{ user_id: "user-1", value: "Milk" }]);
      expect(result).toEqual({ id: "1", value: "Milk", checked: false });
    });

    it("throws when the insert fails", async () => {
      single.mockResolvedValue({ data: null, error: { message: "boom" } });

      await expect(
        ShoppingListService.addItem("user-1", "Milk"),
      ).rejects.toThrow("Failed to add item to shopping list.");
    });
  });

  describe("addItems", () => {
    it("inserts every item tagged with the user id", async () => {
      select.mockResolvedValueOnce({
        data: [{ id: "1" }, { id: "2" }],
        error: null,
      });

      const result = await ShoppingListService.addItems("user-1", [
        { value: "Milk" },
        { value: "Eggs", source_recipe_id: "r1", source_recipe_title: "Cake" },
      ]);

      expect(insert).toHaveBeenCalledWith([
        { value: "Milk", user_id: "user-1" },
        {
          value: "Eggs",
          source_recipe_id: "r1",
          source_recipe_title: "Cake",
          user_id: "user-1",
        },
      ]);
      expect(result).toEqual([{ id: "1" }, { id: "2" }]);
    });

    it("throws when the bulk insert fails", async () => {
      select.mockResolvedValueOnce({ data: null, error: { message: "boom" } });

      await expect(
        ShoppingListService.addItems("user-1", [{ value: "Milk" }]),
      ).rejects.toThrow("Failed to add items to shopping list.");
    });
  });

  describe("deleteById", () => {
    it("resolves when the delete succeeds", async () => {
      eq.mockResolvedValueOnce({ error: null });

      await expect(
        ShoppingListService.deleteById("item-1"),
      ).resolves.toBeUndefined();
    });

    it("throws when the delete fails", async () => {
      eq.mockResolvedValueOnce({ error: { message: "boom" } });

      await expect(
        ShoppingListService.deleteById("item-1"),
      ).rejects.toThrow("Failed to remove item.");
    });
  });
});
