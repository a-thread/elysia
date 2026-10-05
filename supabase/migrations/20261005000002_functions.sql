-- Trigger functions (search_path pinned).
-- touch_recipe_tags_text also handles DELETE, unlike the original in the old project.

create or replace function elysia.set_recipe_owner_id() returns trigger
language plpgsql set search_path = '' as $$
begin
  select user_id into new.recipe_owner_id from elysia.recipes where id = new.recipe_id;
  return new;
end $$;

create or replace function elysia.enforce_collection_ownership() returns trigger
language plpgsql set search_path = '' as $$
begin
  if new.user_id is distinct from auth.uid() then
    raise exception 'You can only create collections for yourself.';
  end if;
  return new;
end $$;

create or replace function elysia.enforce_unique_tag_creation() returns trigger
language plpgsql set search_path = '' as $$
begin
  if exists (select 1 from elysia.tags where lower(title) = lower(new.title)) then
    raise exception 'Tag already exists';
  end if;
  return new;
end $$;

create or replace function elysia.update_last_updated_column() returns trigger
language plpgsql set search_path = '' as $$
begin new.last_updated = now(); return new; end $$;

create or replace function elysia.update_tags_text() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.tags_text := (
    select string_agg(t.title, ', ')
    from elysia.recipe_to_tags rt join elysia.tags t on t.id = rt.tag_id
    where rt.recipe_id = new.id);
  return new;
end $$;

create or replace function elysia.touch_recipe_tags_text() returns trigger
language plpgsql set search_path = '' as $$
declare rid uuid := coalesce(new.recipe_id, old.recipe_id);
begin
  update elysia.recipes set tags_text = (
    select string_agg(t.title, ', ')
    from elysia.recipe_to_tags rt join elysia.tags t on t.id = rt.tag_id
    where rt.recipe_id = rid)
  where id = rid;
  return null;
end $$;

create or replace function elysia.sync_auth_users_to_users() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into elysia.users (id, email, display_name, profile_image, created_at)
  values (new.id, new.email, new.raw_user_meta_data->>'display_name',
          new.raw_user_meta_data->>'profile_image', now())
  on conflict (id) do nothing;
  return new;
end $$;
