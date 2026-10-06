-- Referential integrity and data shape. Run supabase/preflight_checks.sql first.
--
-- * merges case-variant tags, removes empty/duplicate join rows
-- * every join-table foreign key becomes NOT NULL with ON DELETE CASCADE, so deleting a
--   recipe/collection/tag/user no longer fails on (or orphans) its links
-- * one row per (recipe|collection, tag|recipe|user): unique constraints replace the two
--   per-permission partial indexes on recipe_to_users
-- * timestamps on the join tables / collections become timestamptz, like recipes

-- 1. Tags: merge copies that differ only by case/whitespace ---------------------------------

create temp table tag_merge as
select id, first_value(id) over (partition by lower(btrim(title)) order by id) as keep_id
from elysia.tags;

update elysia.recipe_to_tags rt set tag_id = m.keep_id
from tag_merge m where rt.tag_id = m.id and m.id <> m.keep_id;

update elysia.collection_to_tags ct set tag_id = m.keep_id
from tag_merge m where ct.tag_id = m.id and m.id <> m.keep_id;

delete from elysia.tags t using tag_merge m where t.id = m.id and m.id <> m.keep_id;
drop table tag_merge;

update elysia.tags set title = btrim(title) where title <> btrim(title);

alter table elysia.tags
  add constraint tags_title_not_blank check (btrim(title) <> '');

-- Replaces the unique_tag_check trigger, which raced under concurrent inserts.
create unique index tags_title_lower_key on elysia.tags (lower(title));

drop trigger if exists unique_tag_check on elysia.tags;
drop function if exists elysia.enforce_unique_tag_creation();

-- 2. Join tables: drop empty and duplicate rows ---------------------------------------------

delete from elysia.recipe_to_tags where recipe_id is null or tag_id is null;
delete from elysia.collection_to_tags where collection_id is null or tag_id is null;
delete from elysia.collection_to_recipes where collection_id is null or recipe_id is null;
delete from elysia.collection_to_users where collection_id is null or user_id is null;
delete from elysia.recipe_to_users where recipe_id is null or user_id is null;

delete from elysia.recipe_to_tags a using elysia.recipe_to_tags b
where a.recipe_id = b.recipe_id and a.tag_id = b.tag_id and a.ctid > b.ctid;

delete from elysia.collection_to_tags a using elysia.collection_to_tags b
where a.collection_id = b.collection_id and a.tag_id = b.tag_id and a.ctid > b.ctid;

delete from elysia.collection_to_recipes a using elysia.collection_to_recipes b
where a.collection_id = b.collection_id and a.recipe_id = b.recipe_id and a.ctid > b.ctid;

-- A user holding both a read and an edit share keeps the edit one.
delete from elysia.collection_to_users a using elysia.collection_to_users b
where a.collection_id = b.collection_id and a.user_id = b.user_id
  and ((a.permission = 'read' and b.permission = 'edit')
       or (a.permission = b.permission and a.ctid > b.ctid));

delete from elysia.recipe_to_users a using elysia.recipe_to_users b
where a.recipe_id = b.recipe_id and a.user_id = b.user_id
  and ((a.permission = 'read' and b.permission = 'edit')
       or (a.permission = b.permission and a.ctid > b.ctid));

-- recipe_owner_id is the owner cached for RLS; make sure it is filled in and correct.
update elysia.recipe_to_users rtu set recipe_owner_id = r.user_id
from elysia.recipes r
where r.id = rtu.recipe_id and rtu.recipe_owner_id is distinct from r.user_id;

-- 3. Foreign keys: replace whatever exists with a named, cascading constraint -----------------
-- The random-uuid defaults on the FK columns were an artifact: an omitted value became a
-- random id and a foreign-key violation instead of a clear NOT NULL error.

alter table elysia.recipe_to_tags
  alter column recipe_id drop default, alter column tag_id drop default;
alter table elysia.collection_to_tags
  alter column collection_id drop default, alter column tag_id drop default;

do $$
declare
  spec record;
  existing record;
  tbl_oid regclass;
begin
  for spec in
    select * from (values
      ('users',                 'id',            'auth.users',         'cascade'),
      ('recipes',               'user_id',       'auth.users',         'cascade'),
      ('collections',           'user_id',       'auth.users',         'cascade'),
      ('collection_to_recipes', 'collection_id', 'elysia.collections', 'cascade'),
      ('collection_to_recipes', 'recipe_id',     'elysia.recipes',     'cascade'),
      ('collection_to_tags',    'collection_id', 'elysia.collections', 'cascade'),
      ('collection_to_tags',    'tag_id',        'elysia.tags',        'cascade'),
      ('collection_to_users',   'collection_id', 'elysia.collections', 'cascade'),
      ('collection_to_users',   'user_id',       'elysia.users',       'cascade'),
      ('recipe_to_tags',        'recipe_id',     'elysia.recipes',     'cascade'),
      ('recipe_to_tags',        'tag_id',        'elysia.tags',        'cascade'),
      ('recipe_to_users',       'recipe_id',     'elysia.recipes',     'cascade'),
      ('recipe_to_users',       'user_id',       'elysia.users',       'cascade'),
      ('shopping_list_items',   'user_id',       'auth.users',         'cascade'),
      ('shopping_list_items',   'source_recipe_id', 'elysia.recipes',  'set null')
    ) as v(tbl, col, ref, action)
  loop
    tbl_oid := format('elysia.%I', spec.tbl)::regclass;

    for existing in
      select c.conname from pg_constraint c
      where c.conrelid = tbl_oid and c.contype = 'f'
        and c.conkey = array[(select a.attnum from pg_attribute a
                              where a.attrelid = tbl_oid and a.attname = spec.col)]
    loop
      execute format('alter table elysia.%I drop constraint %I', spec.tbl, existing.conname);
    end loop;

    execute format(
      'alter table elysia.%I add constraint %I foreign key (%I) references %s (id) on delete %s',
      spec.tbl, spec.tbl || '_' || spec.col || '_fkey', spec.col, spec.ref, spec.action);
  end loop;
end $$;

-- 4. NOT NULL ---------------------------------------------------------------------------------

alter table elysia.recipe_to_tags
  alter column recipe_id set not null, alter column tag_id set not null;
alter table elysia.collection_to_tags
  alter column collection_id set not null, alter column tag_id set not null;
alter table elysia.collection_to_recipes
  alter column collection_id set not null, alter column recipe_id set not null;
alter table elysia.collection_to_users
  alter column collection_id set not null, alter column user_id set not null;
alter table elysia.recipe_to_users
  alter column recipe_id set not null, alter column user_id set not null,
  alter column recipe_owner_id set not null;

-- Legacy rows without an owner are left alone (and the constraint skipped) rather than
-- deleted; see preflight_checks.sql. Re-run these two statements once they are resolved.
do $$
begin
  if not exists (select 1 from elysia.recipes where user_id is null) then
    alter table elysia.recipes alter column user_id set not null;
  else
    raise notice 'elysia.recipes has rows without user_id; NOT NULL not applied';
  end if;
  if not exists (select 1 from elysia.collections where user_id is null) then
    alter table elysia.collections alter column user_id set not null;
  else
    raise notice 'elysia.collections has rows without user_id; NOT NULL not applied';
  end if;
end $$;

-- 5. One row per relationship -----------------------------------------------------------------

alter table elysia.recipe_to_tags
  add constraint recipe_to_tags_recipe_tag_key unique (recipe_id, tag_id);
alter table elysia.collection_to_tags
  add constraint collection_to_tags_collection_tag_key unique (collection_id, tag_id);
alter table elysia.collection_to_recipes
  add constraint collection_to_recipes_collection_recipe_key unique (collection_id, recipe_id);
alter table elysia.collection_to_users
  add constraint collection_to_users_collection_user_key unique (collection_id, user_id);

-- Replaces the read/edit partial indexes, which let one user hold both a read and an edit row.
drop index if exists elysia.unique_recipe_edit_shares;
drop index if exists elysia.unique_recipe_read_shares;
alter table elysia.recipe_to_users
  add constraint recipe_to_users_recipe_user_key unique (recipe_id, user_id);

-- 6. Timestamps: timestamp -> timestamptz (existing values were written in UTC) ---------------

alter table elysia.collections
  alter column created_at type timestamptz using created_at at time zone 'UTC';
alter table elysia.collection_to_recipes
  alter column created_at type timestamptz using created_at at time zone 'UTC';
alter table elysia.collection_to_users
  alter column created_at type timestamptz using created_at at time zone 'UTC';
alter table elysia.recipe_to_users
  alter column created_at type timestamptz using created_at at time zone 'UTC';
