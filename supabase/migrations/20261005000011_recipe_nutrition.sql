-- Per-serving nutrition for a recipe, used to send a recipe to Tern as a saved meal.
-- Shape: { calories, protein, carbs, fat, tier, source, estimated_at }
--   calories: kcal, protein/carbs/fat: grams, all per serving
--   tier: NOVA food class 1-4, the scale Tern uses
--   source: 'llm' (estimated by Claude from the ingredients), 'scraped' (published by the
--           recipe site, via the scraper; tier defaulted to 3) or 'manual'
-- Null means not estimated yet. Existing policies and the owner/visibility guard trigger
-- are column-agnostic, so editors can update it like any other recipe content.
-- A nutrition-only update is not an edit: keep last_updated so estimating nutrition for every
-- recipe does not reshuffle lists sorted by date.
create or replace function elysia.update_last_updated_column() returns trigger
language plpgsql set search_path = '' as $$
begin
  if tg_op = 'UPDATE'
     and (to_jsonb(new) - 'nutrition' - 'last_updated')
         = (to_jsonb(old) - 'nutrition' - 'last_updated') then
    new.last_updated := old.last_updated;
  else
    new.last_updated := now();
  end if;
  return new;
end $$;

alter table elysia.recipes
  add column nutrition jsonb
  check (
    nutrition is null or (
      jsonb_typeof(nutrition -> 'calories') = 'number'
      and jsonb_typeof(nutrition -> 'protein') = 'number'
      and jsonb_typeof(nutrition -> 'carbs') = 'number'
      and jsonb_typeof(nutrition -> 'fat') = 'number'
      and (nutrition ->> 'tier') in ('1', '2', '3', '4')
    )
  );
