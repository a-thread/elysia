-- Access control rewrite. Requires 07 (unique/not-null/cascade constraints).
--
-- Fixes:
--  * the "authenticated users can modify" policies on every join table, which let any
--    signed-in user grant themselves edit access to anyone's recipe or collection
--  * elysia.users (incl. every email) and the sharing tables being readable by everyone
--  * editors being able to change a recipe's/collection's owner or visibility
--  * any user being able to rename or delete any tag
--  * over-broad table grants (TRUNCATE bypasses RLS; anon had write privileges)
--
-- Client changes that go with this: UserService.findByEmail now calls the
-- elysia.find_user_by_email RPC instead of reading elysia.users directly.

-- Helpers ----------------------------------------------------------------------------------------
-- security definer so policies can consult other tables without re-entering their RLS (which
-- would recurse). They live in a schema that is NOT exposed through the API.

create schema if not exists elysia_private;
grant usage on schema elysia_private to anon, authenticated;

create or replace function elysia_private.can_read_recipe(rid uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from elysia.recipes r
    where r.id = rid and (
      coalesce(r.is_public, false)
      or r.user_id = (select auth.uid())
      or exists (select 1 from elysia.recipe_to_users s
                 where s.recipe_id = r.id and s.user_id = (select auth.uid()))));
$$;

create or replace function elysia_private.can_edit_recipe(rid uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from elysia.recipes r
    where r.id = rid and (
      r.user_id = (select auth.uid())
      or (coalesce(r.is_public, false) and r.public_permission = 'edit' and (select auth.uid()) is not null)
      or exists (select 1 from elysia.recipe_to_users s
                 where s.recipe_id = r.id and s.user_id = (select auth.uid()) and s.permission = 'edit')));
$$;

create or replace function elysia_private.can_read_collection(cid uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from elysia.collections c
    where c.id = cid and (
      coalesce(c.is_public, false)
      or c.user_id = (select auth.uid())
      or exists (select 1 from elysia.collection_to_users s
                 where s.collection_id = c.id and s.user_id = (select auth.uid()))));
$$;

create or replace function elysia_private.can_edit_collection(cid uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from elysia.collections c
    where c.id = cid and (
      c.user_id = (select auth.uid())
      or (coalesce(c.is_public, false) and c.public_permission = 'edit' and (select auth.uid()) is not null)
      or exists (select 1 from elysia.collection_to_users s
                 where s.collection_id = c.id and s.user_id = (select auth.uid()) and s.permission = 'edit')));
$$;

create or replace function elysia_private.is_collection_owner(cid uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from elysia.collections c
                 where c.id = cid and c.user_id = (select auth.uid()));
$$;

-- True when the caller has shared a recipe or collection with `uid` (so may see their email).
create or replace function elysia_private.is_sharee_of_mine(uid uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from elysia.recipe_to_users s
                 where s.recipe_owner_id = (select auth.uid()) and s.user_id = uid)
      or exists (select 1 from elysia.collection_to_users s
                 join elysia.collections c on c.id = s.collection_id
                 where c.user_id = (select auth.uid()) and s.user_id = uid);
$$;

-- users: no more public email list ---------------------------------------------------------------

drop policy if exists "Allow users to read users" on elysia.users;
create policy "Read self and people I share with" on elysia.users for select to authenticated
  using (id = (select auth.uid()) or elysia_private.is_sharee_of_mine(id));

-- Share-by-email lookup: exact match only, signed-in callers only, returns just id + name.
create or replace function elysia.find_user_by_email(p_email text)
returns table (id uuid, display_name text)
language sql stable security definer set search_path = '' as $$
  select u.id, u.display_name::text
  from elysia.users u
  where (select auth.uid()) is not null
    and lower(u.email) = lower(btrim(p_email))
  limit 1;
$$;
revoke execute on function elysia.find_user_by_email(text) from public, anon;
grant execute on function elysia.find_user_by_email(text) to authenticated;

-- tags: shared vocabulary; clients may create and read, not rename or delete ----------------------

drop policy if exists "Allow authenticated users to delete" on elysia.tags;
drop policy if exists "Allow authenticated users to update" on elysia.tags;
drop policy if exists "Allow modify to authenticated users" on elysia.tags;

-- Join tables: replace every blanket policy ------------------------------------------------------

drop policy if exists "Allow modify to authenticated users" on elysia.recipe_to_users;
drop policy if exists "Allow read to everyone" on elysia.recipe_to_users;
drop policy if exists "Allow recipe owner to manage shares" on elysia.recipe_to_users;
drop policy if exists "Allow modify to authenticated users" on elysia.recipe_to_tags;
drop policy if exists "Allow read to everyone" on elysia.recipe_to_tags;
drop policy if exists "Allow viewing tags on public or shared recipes" on elysia.recipe_to_tags;
drop policy if exists "Allow modify to authenticated users" on elysia.collection_to_recipes;
drop policy if exists "Allow read to everyone" on elysia.collection_to_recipes;
drop policy if exists "Allow modify to authenticated users" on elysia.collection_to_tags;
drop policy if exists "Allow read to everyone" on elysia.collection_to_tags;
drop policy if exists "Allow modify to authenticated users" on elysia.collection_to_users;
drop policy if exists "Allow read to everyone" on elysia.collection_to_users;

-- recipe_to_users: only the recipe's owner manages shares; a sharee may see and drop their own.
-- recipe_owner_id is filled in by trigger from the recipe, so it cannot be spoofed.
create policy "Owner or sharee can read shares" on elysia.recipe_to_users for select
  using (recipe_owner_id = (select auth.uid()) or user_id = (select auth.uid()));
create policy "Owner can share" on elysia.recipe_to_users for insert to authenticated
  with check (recipe_owner_id = (select auth.uid()) and user_id <> recipe_owner_id);
create policy "Owner can change shares" on elysia.recipe_to_users for update to authenticated
  using (recipe_owner_id = (select auth.uid()))
  with check (recipe_owner_id = (select auth.uid()));
create policy "Owner can revoke or sharee can leave" on elysia.recipe_to_users for delete to authenticated
  using (recipe_owner_id = (select auth.uid()) or user_id = (select auth.uid()));

-- recipe_to_tags: visible with the recipe, editable by whoever can edit the recipe.
create policy "Read tags of readable recipes" on elysia.recipe_to_tags for select
  using (elysia_private.can_read_recipe(recipe_id));
create policy "Editors can tag recipes" on elysia.recipe_to_tags for insert to authenticated
  with check (elysia_private.can_edit_recipe(recipe_id));
create policy "Editors can untag recipes" on elysia.recipe_to_tags for delete to authenticated
  using (elysia_private.can_edit_recipe(recipe_id));

-- collection_to_users
create policy "Owner or sharee can read collection shares" on elysia.collection_to_users for select
  using (elysia_private.is_collection_owner(collection_id) or user_id = (select auth.uid()));
create policy "Owner can share collection" on elysia.collection_to_users for insert to authenticated
  with check (elysia_private.is_collection_owner(collection_id));
create policy "Owner can change collection shares" on elysia.collection_to_users for update to authenticated
  using (elysia_private.is_collection_owner(collection_id))
  with check (elysia_private.is_collection_owner(collection_id));
create policy "Owner can revoke or sharee can leave collection" on elysia.collection_to_users for delete to authenticated
  using (elysia_private.is_collection_owner(collection_id) or user_id = (select auth.uid()));

-- collection_to_tags / collection_to_recipes: visible with the collection, editable by its editors.
create policy "Read tags of readable collections" on elysia.collection_to_tags for select
  using (elysia_private.can_read_collection(collection_id));
create policy "Editors can tag collections" on elysia.collection_to_tags for insert to authenticated
  with check (elysia_private.can_edit_collection(collection_id));
create policy "Editors can untag collections" on elysia.collection_to_tags for delete to authenticated
  using (elysia_private.can_edit_collection(collection_id));

create policy "Read recipes of readable collections" on elysia.collection_to_recipes for select
  using (elysia_private.can_read_collection(collection_id));
create policy "Editors can add readable recipes to collections" on elysia.collection_to_recipes for insert to authenticated
  with check (elysia_private.can_edit_collection(collection_id) and elysia_private.can_read_recipe(recipe_id));
create policy "Editors can remove recipes from collections" on elysia.collection_to_recipes for delete to authenticated
  using (elysia_private.can_edit_collection(collection_id));

-- Owner / visibility are not editable by editors --------------------------------------------------
-- The update policies let editors change any column; this narrows that to content only.

create or replace function elysia.protect_shared_entity_columns() returns trigger
language plpgsql set search_path = '' as $$
begin
  -- No JWT: service role / SQL editor / migrations.
  if (select auth.uid()) is null then
    return new;
  end if;
  if new.user_id is distinct from old.user_id then
    raise exception 'Ownership cannot be changed.';
  end if;
  if (select auth.uid()) is distinct from old.user_id
     and (new.is_public is distinct from old.is_public
          or new.public_permission is distinct from old.public_permission) then
    raise exception 'Only the owner can change visibility.';
  end if;
  return new;
end $$;

create trigger protect_recipe_columns
  before update on elysia.recipes
  for each row execute function elysia.protect_shared_entity_columns();

create trigger protect_collection_columns
  before update on elysia.collections
  for each row execute function elysia.protect_shared_entity_columns();

-- Grants -------------------------------------------------------------------------------------------
-- RLS is the real gate, but TRUNCATE ignores it and anon never needs to write. Anon keeps SELECT
-- on what public pages embed (RLS decides which rows); it gets no access to users or shopping lists.

revoke all on all tables in schema elysia from anon;
grant select on
  elysia.recipes, elysia.collections, elysia.tags,
  elysia.recipe_to_tags, elysia.recipe_to_users,
  elysia.collection_to_recipes, elysia.collection_to_tags, elysia.collection_to_users
to anon;

revoke truncate, references, trigger on all tables in schema elysia from authenticated;

alter default privileges in schema elysia revoke all on tables from anon;
alter default privileges in schema elysia revoke truncate, references, trigger on tables from authenticated;
