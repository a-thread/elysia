import { ShoppingListItem } from "../models/ShoppingListItem";

/** Items from one ingredient group of a recipe (or the recipe's ungrouped items, with no title). */
export interface ShoppingGroup {
  title?: string;
  items: ShoppingListItem[];
}

/** Everything that came from one recipe, or the "Other" section of items added by hand. */
export interface ShoppingSection {
  key: string;
  title: string;
  isManual: boolean;
  groups: ShoppingGroup[];
}

/** "For the sauce:" -> "For the sauce"; blank or missing -> undefined. */
const cleanGroupTitle = (group?: string | null): string | undefined =>
  (group ?? "").trim().replace(/:\s*$/, "").trim() || undefined;

const groupBySourceGroup = (items: ShoppingListItem[]): ShoppingGroup[] => {
  const groups = new Map<string, ShoppingGroup>();
  items.forEach((item) => {
    const title = cleanGroupTitle(item.source_group);
    const key = title ?? "";
    const group = groups.get(key) ?? { title, items: [] };
    group.items.push(item);
    groups.set(key, group);
  });
  return [...groups.values()];
};

/**
 * Splits a shopping list into a section per source recipe (in the order the recipes first
 * appear) and, if any items were added by hand, an "Other" section first. Within a recipe, items
 * are grouped by the ingredient group they came from, again in order of first appearance.
 */
export const groupShoppingItems = (items: ShoppingListItem[]): ShoppingSection[] => {
  const manual: ShoppingListItem[] = [];
  const recipes = new Map<string, { title: string; items: ShoppingListItem[] }>();

  items.forEach((item) => {
    const source = item.source_recipe_id ?? item.source_recipe_title;
    if (!source) {
      manual.push(item);
      return;
    }
    const recipe = recipes.get(source) ?? {
      title: item.source_recipe_title || "Recipe",
      items: [],
    };
    recipe.items.push(item);
    recipes.set(source, recipe);
  });

  return [
    ...(manual.length
      ? [{ key: "other", title: "Other", isManual: true, groups: [{ items: manual }] }]
      : []),
    ...[...recipes.entries()].map(([source, recipe]) => ({
      key: `recipe:${source}`,
      title: recipe.title,
      isManual: false,
      groups: groupBySourceGroup(recipe.items),
    })),
  ];
};

/** True when the list has recipe sections, so section headings are worth showing. */
export const hasRecipeSections = (sections: ShoppingSection[]): boolean =>
  sections.some((section) => !section.isManual);
