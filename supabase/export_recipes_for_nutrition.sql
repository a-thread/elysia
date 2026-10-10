-- Run in the Supabase SQL editor (after migration 11). Returns ONE cell of JSON: every recipe
-- that has no nutrition yet, with just what is needed to estimate it. Copy the cell and
-- paste it into the chat, or save it to a file in this repo (e.g. recipes_dump.json).

select coalesce(jsonb_agg(
  jsonb_build_object(
    'id', r.id,
    'title', r.title,
    'servings', r.servings,
    'ingredients', case when jsonb_typeof(r.ingredients) = 'array'
      then (select coalesce(jsonb_agg(e ->> 'value'), '[]'::jsonb)
            from jsonb_array_elements(r.ingredients) as e)
      else '[]'::jsonb end
  ) order by r.title
), '[]'::jsonb) as recipes
from elysia.recipes r
where r.nutrition is null;
