# Database reference

SQL for the `elysia` schema, in the order it must be applied (supabase CLI layout). Reference only:
the live database was created by hand from these statements, not via `supabase db push`.

| File | Contents |
|---|---|
| `20261005000001_schema_and_tables.sql` | `pg_trgm`, schema, tables, grants |
| `20261005000002_functions.sql` | trigger functions |
| `20261005000003_triggers.sql` | triggers (incl. `auth.users` signup sync) |
| `20261005000004_indexes.sql` | indexes |
| `20261005000005_rls_policies.sql` | RLS + policies |
| `20261005000006_storage_bucket.sql` | `elysia_recipe_photo` bucket |
| `20261005000007_integrity.sql` | merge duplicate tags/links, cascading NOT NULL foreign keys, unique constraints, `timestamptz` |
| `20261005000008_access_control.sql` | RLS rewrite (helpers in `elysia_private`), `find_user_by_email` RPC, owner/visibility guard triggers, tighter grants |
| `20261005000009_search_and_indexes.sql` | `ingredients_text` trigger + backfill, trigram and foreign-key indexes |
| `20261005000010_storage_policies.sql` | policies for the photo bucket |
| `20261005000011_recipe_nutrition.sql` | `recipes.nutrition` (per-serving jsonb); nutrition-only updates keep `last_updated` |
| `20261005000012_user_settings.sql` | `user_settings` (per-user preferences, own-row RLS); first setting is `tern_enabled` |
| `20261005000013_user_settings_lichen.sql` | `user_settings.lichen_enabled` (opt-in to keeping the shopping list in a Lichen note) |
| `20261005000014_shopping_list_source_group.sql` | `shopping_list_items.source_group` (the recipe ingredient group an item came from); apply before deploying the app version that sends it |
| `20261005000015_user_settings_show_nutrition.sql` | `user_settings.show_nutrition` (default on): hide nutrition facts, and with them the Tern connection |

`data/recipe_nutrition.sql` is a one-off (not a migration): estimated nutrition for the recipes that
existed in October 2026. `export_recipes_for_nutrition.sql` produces the JSON used to make it.

Setup notes
- The schema is shared with other apps in the same Supabase project. Add `elysia` under
  **Project Settings -> API -> Exposed schemas**; the client selects it in `SupabaseWithAbort.ts`.
- `elysia.users` / `recipes.user_id` / `shopping_list_items.user_id` reference `auth.users`, so auth users must exist before data is loaded.
- Load data before applying files 2-5 (triggers would rewrite rows; `enforce_collection_ownership` needs `auth.uid()`).
- Auth redirect URLs for this app must be on the project's allow list (Auth -> URL Configuration).
- Storage policies are not captured in these files.

Applying 07-10 to an existing database
- Run `preflight_checks.sql` first (read-only) and resolve anything it returns. 07 deletes empty/duplicate join rows and merges case-variant tags.
- Apply 07, 08, 09, 10 in order. They are written as one transaction each; do not apply 08 without 07.
- Deploy the client change in the same release as 08: `UserService.findByEmail` now calls the `find_user_by_email` RPC, because 08 stops `elysia.users` being publicly readable. The old client cannot add shares after 08.
- After 08, sharing a recipe/collection with someone who already has access updates their permission instead of failing, and tags/collection links are idempotent (`upsert`).
- Tags can no longer be renamed or deleted from the client (insert/select only); do that in the SQL editor.
- `elysia_private` is deliberately not in Exposed schemas.
