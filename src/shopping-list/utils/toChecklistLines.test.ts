import { describe, it, expect } from "vitest";
import { toChecklistLines } from "./toChecklistLines";
import { ShoppingListItem } from "../models/ShoppingListItem";

const item = (overrides: Partial<ShoppingListItem>): ShoppingListItem => ({
  id: "1",
  user_id: "user-1",
  value: "Milk",
  checked: false,
  created_at: "2026-01-01T00:00:00Z",
  ...overrides,
});

describe("toChecklistLines", () => {
  it("writes one task-list line per item, keeping the order given", () => {
    expect(
      toChecklistLines([
        item({ value: "Milk", checked: false }),
        item({ value: "Eggs", checked: true }),
      ]),
    ).toEqual(["- [ ] Milk", "- [x] Eggs"]);
  });

  it("collapses newlines inside an item so it stays on one line", () => {
    expect(toChecklistLines([item({ value: " 2 cups\nflour \n " })])).toEqual([
      "- [ ] 2 cups flour",
    ]);
  });

  it("returns no lines for an empty list", () => {
    expect(toChecklistLines([])).toEqual([]);
  });
});
