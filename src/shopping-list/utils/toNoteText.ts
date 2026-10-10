import { ShoppingListItem } from "../models/ShoppingListItem";
import { groupShoppingItems, hasRecipeSections } from "./groupShoppingItems";
import { toChecklistLines } from "./toChecklistLines";

/**
 * The text of the Lichen "Shopping List" note: checklist lines, unchecked before checked. A list of
 * only hand-added items stays a flat checklist; once there are recipe items, each recipe gets a
 * `##` heading (and each of its ingredient groups a `###` heading), which Lichen renders as headings.
 */
export const toNoteText = (items: ShoppingListItem[]): string => {
  const sections = groupShoppingItems(items);
  const withHeadings = hasRecipeSections(sections);

  return sections
    .map((section) => {
      const lines = withHeadings ? [`## ${section.title}`] : [];
      section.groups.forEach((group) => {
        if (group.title) lines.push(`### ${group.title}`);
        lines.push(
          ...toChecklistLines([
            ...group.items.filter((item) => !item.checked),
            ...group.items.filter((item) => item.checked),
          ]),
        );
      });
      return lines.join("\n");
    })
    .join("\n\n");
};
