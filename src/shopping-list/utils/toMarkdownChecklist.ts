import { ShoppingListItem } from "../models/ShoppingListItem";
import { toChecklistLines } from "./toChecklistLines";

/**
 * Formats items as standard markdown task-list lines (`- [ ] `/`- [x] `)
 * under a heading, for the shopping list's "Export as Markdown" action.
 */
export const toMarkdownChecklist = (
  items: ShoppingListItem[],
  title = "Shopping List",
): string => [`# ${title}`, ...toChecklistLines(items)].join("\n");
