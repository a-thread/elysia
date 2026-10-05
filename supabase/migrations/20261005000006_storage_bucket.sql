-- Public bucket used for recipe/collection photos. Storage RLS policies are NOT captured here;
-- recreate them from Storage -> Policies in the dashboard if this project is rebuilt.
insert into storage.buckets (id, name, public)
values ('elysia_recipe_photo', 'elysia_recipe_photo', true)
on conflict (id) do nothing;
