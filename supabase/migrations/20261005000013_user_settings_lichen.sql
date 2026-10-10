-- Opt-in for keeping the shopping list in a "Shopping List" note in Lichen (the notes app on the
-- same Supabase project). Off by default; same own-row RLS as the rest of user_settings.

alter table elysia.user_settings
  add column lichen_enabled boolean not null default false;
