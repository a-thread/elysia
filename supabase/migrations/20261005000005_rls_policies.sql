-- Row level security: enable on every table and create policies.
-- NOTE: the join-table "Allow modify to authenticated users" policies let any signed-in user
-- modify sharing rows. Carried over unchanged from the original project.

alter table elysia.users enable row level security;
alter table elysia.tags enable row level security;
alter table elysia.recipes enable row level security;
alter table elysia.collections enable row level security;
alter table elysia.collection_to_recipes enable row level security;
alter table elysia.collection_to_tags enable row level security;
alter table elysia.collection_to_users enable row level security;
alter table elysia.recipe_to_tags enable row level security;
alter table elysia.recipe_to_users enable row level security;
alter table elysia.shopping_list_items enable row level security;

-- users
create policy "Allow inserts from Supabase" on elysia.users for insert with check (auth.uid() = id);
create policy "Allow users to read users" on elysia.users for select using (true);

-- tags
create policy "Allow authenticated users to create" on elysia.tags for insert to authenticated with check (true);
create policy "Allow authenticated users to delete" on elysia.tags for delete to authenticated using (true);
create policy "Allow authenticated users to update" on elysia.tags for update to authenticated using (true);
create policy "Allow modify to authenticated users" on elysia.tags for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Allow read to everyone" on elysia.tags for select using (true);

-- join tables: modify + read
do $$
declare t text;
begin
  foreach t in array array['recipe_to_users','recipe_to_tags','collection_to_recipes','collection_to_tags','collection_to_users']
  loop
    execute format('create policy "Allow modify to authenticated users" on elysia.%I for all
      using (auth.role() = ''authenticated'') with check (auth.role() = ''authenticated'')', t);
    execute format('create policy "Allow read to everyone" on elysia.%I for select using (true)', t);
  end loop;
end $$;

create policy "Allow recipe owner to manage shares" on elysia.recipe_to_users for all to authenticated
  using (auth.uid() = recipe_owner_id);

create policy "Allow viewing tags on public or shared recipes" on elysia.recipe_to_tags for select
  using (recipe_id in (
    select r.id from elysia.recipes r
    where r.is_public = true or auth.uid() = r.user_id
       or auth.uid() in (select rtu.user_id from elysia.recipe_to_users rtu where rtu.recipe_id = r.id)));

-- recipes
create policy "Authenticated users can insert their own recipes" on elysia.recipes for insert to authenticated
  with check (auth.uid() = user_id);
create policy "Authenticated users can read private or shared recipes" on elysia.recipes for select to authenticated
  using (auth.uid() = user_id or exists (
    select 1 from elysia.recipe_to_users rtu where rtu.recipe_id = recipes.id and rtu.user_id = auth.uid()));
create policy "Only the owner can delete recipe" on elysia.recipes for delete to authenticated
  using (auth.uid() = user_id);
create policy "Owner or editor can update recipe" on elysia.recipes for update to authenticated
  using (auth.uid() = user_id or exists (
    select 1 from elysia.recipe_to_users rtu
    where rtu.recipe_id = recipes.id and rtu.user_id = auth.uid() and rtu.permission = 'edit'));
create policy "Public can read public recipes" on elysia.recipes for select using (is_public = true);
create policy editable_public_recipes_update on elysia.recipes for update
  using (is_public = true and public_permission = 'edit' and auth.uid() is not null)
  with check (is_public = true and public_permission = 'edit' and auth.uid() is not null);

-- collections
create policy "Authenticated users can insert their own collections" on elysia.collections for insert to authenticated
  with check (auth.uid() = user_id);
create policy "Authenticated users can read private or shared collections" on elysia.collections for select to authenticated
  using (auth.uid() = user_id or exists (
    select 1 from elysia.collection_to_users ctu where ctu.collection_id = collections.id and ctu.user_id = auth.uid()));
create policy "Only the owner can delete collection" on elysia.collections for delete to authenticated
  using (auth.uid() = user_id);
create policy "Owner or editor can update collection" on elysia.collections for update to authenticated
  using (auth.uid() = user_id or exists (
    select 1 from elysia.collection_to_users ctu
    where ctu.collection_id = collections.id and ctu.user_id = auth.uid() and ctu.permission = 'edit'));
create policy "Public can read public collections" on elysia.collections for select using (is_public = true);
create policy editable_public_collections_update on elysia.collections for update
  using (is_public = true and public_permission = 'edit' and auth.uid() is not null)
  with check (is_public = true and public_permission = 'edit' and auth.uid() is not null);

-- shopping list
create policy "Users manage their own shopping list items" on elysia.shopping_list_items for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
