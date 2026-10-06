-- Search and index tuning. Requires 07 (unique constraints give the join tables their
-- (parent, child) indexes).
--
-- recipes.ingredients_text is what RecipeService searches for ingredient matches, but nothing
-- ever populated it (only tags_text had a trigger). It is now derived from the ingredients json.

create or replace function elysia.update_ingredients_text() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.ingredients_text := case
    when jsonb_typeof(new.ingredients) = 'array' then (
      select string_agg(e ->> 'value', E'\n')
      from jsonb_array_elements(new.ingredients) as e
      where e ->> 'value' is not null)
  end;
  return new;
end $$;

create trigger sync_ingredients_text
  before insert or update on elysia.recipes
  for each row execute function elysia.update_ingredients_text();

-- Backfill without bumping last_updated on every recipe.
alter table elysia.recipes disable trigger set_last_updated;
update elysia.recipes set ingredients = ingredients;
alter table elysia.recipes enable trigger set_last_updated;

-- Trigram indexes: the search is `ilike '%term%'` across these columns, which btree cannot serve.
create index idx_recipes_description_trgm on elysia.recipes using gin (description extensions.gin_trgm_ops);
create index idx_recipes_ingredients_text_trgm on elysia.recipes using gin (ingredients_text extensions.gin_trgm_ops);
create index idx_recipes_tags_text_trgm on elysia.recipes using gin (tags_text extensions.gin_trgm_ops);
create index idx_collections_title_trgm on elysia.collections using gin (title extensions.gin_trgm_ops);
create index idx_collections_description_trgm on elysia.collections using gin (description extensions.gin_trgm_ops);

-- A btree on a long text column can fail on large values, and it served no query.
drop index if exists elysia.idx_recipes_description;
-- Covered by collection_to_recipes_collection_recipe_key.
drop index if exists elysia.idx_collection_tagged_recipes_collection;

-- Foreign-key columns that RLS policies and the app's joins filter on.
create index idx_recipes_user_id on elysia.recipes (user_id);
create index idx_collections_user_id on elysia.collections (user_id);
create index idx_recipe_to_tags_tag_id on elysia.recipe_to_tags (tag_id);
create index idx_collection_to_tags_tag_id on elysia.collection_to_tags (tag_id);
create index idx_recipe_to_users_user_id on elysia.recipe_to_users (user_id);
create index idx_recipe_to_users_owner on elysia.recipe_to_users (recipe_owner_id);
create index idx_collection_to_users_user_id on elysia.collection_to_users (user_id);
create index idx_shopping_list_items_source_recipe on elysia.shopping_list_items (source_recipe_id);
