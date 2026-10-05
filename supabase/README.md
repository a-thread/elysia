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

Setup notes
- The schema is shared with other apps in the same Supabase project. Add `elysia` under
  **Project Settings -> API -> Exposed schemas**; the client selects it in `SupabaseWithAbort.ts`.
- `elysia.users` / `recipes.user_id` / `shopping_list_items.user_id` reference `auth.users`, so auth users must exist before data is loaded.
- Load data before applying files 2-5 (triggers would rewrite rows; `enforce_collection_ownership` needs `auth.uid()`).
- Auth redirect URLs for this app must be on the project's allow list (Auth -> URL Configuration).
- Storage policies are not captured in these files.
