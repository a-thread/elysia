import { describe, it, expect } from "vitest";
import { toMarkdownChecklist } from "./toMarkdownChecklist";
import { ShoppingListItem } from "../models/ShoppingListItem";

const item = (overrides: Partial<ShoppingListItem>): ShoppingListItem => ({
  id: "1",
  user_id: "user-1",
  value: "Milk",
  checked: false,
  created_at: "2026-01-01T00:00:00Z",
  ...overrides,
});

describe("toMarkdownChecklist", () => {
  it("formats unchecked and checked items as markdown checklist lines", () => {
    const result = toMarkdownChecklist([
      item({ value: "Milk", checked: false }),
      item({ value: "Eggs", checked: true }),
    ]);

    expect(result).toBe(
      ["# Shopping List", "- [ ] Milk", "- [x] Eggs"].join("\n"),
    );
  });

  it("uses a custom title when provided", () => {
    const result = toMarkdownChecklist([item({ value: "Milk" })], "Groceries");

    expect(result).toBe(["# Groceries", "- [ ] Milk"].join("\n"));
  });

  it("returns just the heading when there are no items", () => {
    const result = toMarkdownChecklist([]);

    expect(result).toBe("# Shopping List");
  });
});
