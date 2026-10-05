create unique index unique_recipe_edit_shares on elysia.recipe_to_users (recipe_id, user_id) where permission = 'edit';
create unique index unique_recipe_read_shares on elysia.recipe_to_users (recipe_id, user_id) where permission = 'read';
create index idx_collection_tagged_recipes_collection on elysia.collection_to_recipes (collection_id);
create index idx_collection_tagged_recipes_recipe on elysia.collection_to_recipes (recipe_id);
create index idx_recipes_title on elysia.recipes (title);
create index idx_recipes_description on elysia.recipes (description);
create index idx_recipes_title_desc on elysia.recipes
  using gin (to_tsvector('english'::regconfig, (title::text || ' ' || description::text)));
create index idx_recipes_title_trgm on elysia.recipes using gist (title extensions.gist_trgm_ops);
create index shopping_list_items_user_id_idx on elysia.shopping_list_items (user_id);
