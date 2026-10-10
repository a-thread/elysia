-- Which ingredient group (e.g. "For the sauce:") a shopping list item came from, so the list can
-- show a recipe's ingredients under its own sub-headings. Null for items added by hand and for
-- recipe ingredients that are not in a group. Apply this before deploying the app version that sends
-- source_group, or adding a recipe to the shopping list will fail.

alter table elysia.shopping_list_items
  add column source_group text;
