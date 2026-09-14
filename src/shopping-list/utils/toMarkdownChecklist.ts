import { ShoppingListItem } from "../models/ShoppingListItem";

/**
 * Formats items as standard markdown task-list lines (`- [ ] `/`- [x] `)
 * under a heading, for the shopping list's "Export as Markdown" action.
 */
export const toMarkdownChecklist = (
  items: ShoppingListItem[],
  title = "Shopping List",
): string => {
  const lines = items.map((item) => `- [${item.checked ? "x" : " "}] ${item.value}`);
  return [`# ${title}`, ...lines].join("\n");
};
