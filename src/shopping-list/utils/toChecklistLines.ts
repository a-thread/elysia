import { ShoppingListItem } from "../models/ShoppingListItem";

/**
 * One markdown task-list line per item (`- [ ] `/`- [x] `), in the order given. Newlines inside an
 * item are collapsed so every item stays on exactly one line — Lichen (and the export) read the
 * list line by line.
 */
export const toChecklistLines = (items: ShoppingListItem[]): string[] =>
  items.map(
    (item) =>
      `- [${item.checked ? "x" : " "}] ${item.value.replace(/\s*\n\s*/g, " ").trim()}`,
  );
