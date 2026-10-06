-- Read-only checks to run in the SQL editor BEFORE applying migrations 07-10.
-- Nothing here changes data. Each query should return zero rows; anything it returns is
-- data that migration 07 will merge, delete or reject (see the note on each).

-- Tags that differ only by case/whitespace. 07 merges them into one tag (earliest id wins)
-- and repoints their recipe/collection links.
select lower(btrim(title)) as normalized, count(*) as copies, array_agg(title) as titles
from elysia.tags group by 1 having count(*) > 1;

-- Join rows with a missing foreign key. 07 deletes these (they link nothing).
select 'recipe_to_tags' as tbl, count(*) from elysia.recipe_to_tags where recipe_id is null or tag_id is null
union all select 'collection_to_tags', count(*) from elysia.collection_to_tags where collection_id is null or tag_id is null
union all select 'collection_to_recipes', count(*) from elysia.collection_to_recipes where collection_id is null or recipe_id is null
union all select 'collection_to_users', count(*) from elysia.collection_to_users where collection_id is null or user_id is null
union all select 'recipe_to_users', count(*) from elysia.recipe_to_users where recipe_id is null or user_id is null;

-- Duplicate links. 07 keeps one row of each (for recipe_to_users, the 'edit' row if both exist).
select 'recipe_to_tags' as tbl, recipe_id::text as a, tag_id::text as b, count(*) from elysia.recipe_to_tags group by 2, 3 having count(*) > 1
union all select 'collection_to_tags', collection_id::text, tag_id::text, count(*) from elysia.collection_to_tags group by 2, 3 having count(*) > 1
union all select 'collection_to_recipes', collection_id::text, recipe_id::text, count(*) from elysia.collection_to_recipes group by 2, 3 having count(*) > 1
union all select 'collection_to_users', collection_id::text, user_id::text, count(*) from elysia.collection_to_users group by 2, 3 having count(*) > 1
union all select 'recipe_to_users', recipe_id::text, user_id::text, count(*) from elysia.recipe_to_users group by 2, 3 having count(*) > 1;

-- Recipes/collections with no owner. 07 will NOT make user_id NOT NULL while any exist;
-- decide who owns them (or delete them) and re-run that step.
select 'recipes' as tbl, id from elysia.recipes where user_id is null
union all select 'collections', id from elysia.collections where user_id is null;

-- Sharing rows whose cached owner id is missing or no longer matches the recipe's owner.
select rtu.id from elysia.recipe_to_users rtu
join elysia.recipes r on r.id = rtu.recipe_id
where rtu.recipe_owner_id is distinct from r.user_id;

-- Rows pointing at things that no longer exist. The current foreign keys should make
-- these impossible; if any appear, 07's new constraints will fail until they are cleaned up.
select 'recipes.user_id' as ref, id from elysia.recipes r where user_id is not null and not exists (select 1 from auth.users u where u.id = r.user_id)
union all select 'collections.user_id', id from elysia.collections c where user_id is not null and not exists (select 1 from auth.users u where u.id = c.user_id)
union all select 'shopping_list_items.user_id', id from elysia.shopping_list_items s where not exists (select 1 from auth.users u where u.id = s.user_id);

-- Context, not problems: how much search data exists today.
select count(*) as recipes,
       count(*) filter (where ingredients_text is null or ingredients_text = '') as without_ingredients_text,
       count(*) filter (where jsonb_typeof(ingredients) is distinct from 'array') as ingredients_not_an_array
from elysia.recipes;

-- Storage policies currently on the photo bucket (10 adds its own; any older ones are OR'd in).
select policyname, cmd, roles, qual, with_check
from pg_policies where schemaname = 'storage' and tablename = 'objects';
