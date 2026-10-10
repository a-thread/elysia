import { describe, it, expect } from "vitest";
import { groupShoppingItems, hasRecipeSections } from "./groupShoppingItems";
import { toNoteText } from "./toNoteText";
import { ShoppingListItem } from "../models/ShoppingListItem";

const item = (value: string, overrides: Partial<ShoppingListItem> = {}): ShoppingListItem => ({
  id: value,
  user_id: "u1",
  value,
  checked: false,
  created_at: "2026-01-01T00:00:00Z",
  ...overrides,
});

const fromRecipe = (value: string, recipe: string, group?: string, checked = false) =>
  item(value, {
    source_recipe_id: recipe,
    source_recipe_title: `${recipe} recipe`,
    source_group: group,
    checked,
  });

describe("groupShoppingItems", () => {
  it("returns no sections for an empty list", () => {
    expect(groupShoppingItems([])).toEqual([]);
  });

  it("keeps hand-added items in a single Other section", () => {
    const sections = groupShoppingItems([item("Milk"), item("Eggs")]);

    expect(sections).toHaveLength(1);
    expect(sections[0]).toMatchObject({ key: "other", title: "Other", isManual: true });
    expect(sections[0].groups[0].items.map((i) => i.value)).toEqual(["Milk", "Eggs"]);
    expect(hasRecipeSections(sections)).toBe(false);
  });

  it("puts Other first, then one section per recipe in order of first appearance", () => {
    const sections = groupShoppingItems([
      fromRecipe("Flour", "pie"),
      fromRecipe("Chicken", "satay"),
      item("Milk"),
      fromRecipe("Apples", "pie"),
    ]);

    expect(sections.map((s) => s.title)).toEqual(["Other", "pie recipe", "satay recipe"]);
    expect(sections[1].groups[0].items.map((i) => i.value)).toEqual(["Flour", "Apples"]);
    expect(hasRecipeSections(sections)).toBe(true);
  });

  it("groups a recipe's items by ingredient group, dropping the trailing colon", () => {
    const [section] = groupShoppingItems([
      fromRecipe("Chicken", "satay", "For The Chicken:"),
      fromRecipe("Peanut butter", "satay", "For the sauce:"),
      fromRecipe("Honey", "satay", "For The Chicken:"),
      fromRecipe("Salt", "satay"),
    ]);

    expect(section.groups.map((g) => g.title)).toEqual([
      "For The Chicken",
      "For the sauce",
      undefined,
    ]);
    expect(section.groups[0].items.map((i) => i.value)).toEqual(["Chicken", "Honey"]);
  });

  it("treats a blank group like no group", () => {
    const [section] = groupShoppingItems([fromRecipe("Salt", "satay", "  :  ")]);

    expect(section.groups).toEqual([expect.objectContaining({ title: undefined })]);
  });
});

describe("toNoteText", () => {
  it("is empty for an empty list", () => {
    expect(toNoteText([])).toBe("");
  });

  it("stays a flat checklist, unchecked first, when there are only hand-added items", () => {
    expect(toNoteText([item("Eggs", { checked: true }), item("Milk")])).toBe(
      "- [ ] Milk\n- [x] Eggs",
    );
  });

  it("adds recipe and group headings once there are recipe items", () => {
    const text = toNoteText([
      item("Milk"),
      fromRecipe("Chicken", "satay", "For The Chicken:"),
      fromRecipe("Peanut butter", "satay", "For the sauce:", true),
      fromRecipe("Honey", "satay", "For The Chicken:"),
      fromRecipe("Salt", "pie"),
    ]);

    expect(text).toBe(
      [
        "## Other",
        "- [ ] Milk",
        "",
        "## satay recipe",
        "### For The Chicken",
        "- [ ] Chicken",
        "- [ ] Honey",
        "### For the sauce",
        "- [x] Peanut butter",
        "",
        "## pie recipe",
        "- [ ] Salt",
      ].join("\n"),
    );
  });
});
