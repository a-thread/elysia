-- Per-user preferences. First setting: whether the user has connected Elysia to Tern
-- (shows "Send to Tern" on recipes). Kept off elysia.users so other people you share with,
-- who can read your users row, never see it. A missing row means every setting is at its
-- default, so nothing needs to be created at signup.

create table elysia.user_settings (
  user_id uuid primary key references auth.users (id) on delete cascade,
  tern_enabled boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table elysia.user_settings enable row level security;

create policy "Users manage their own settings" on elysia.user_settings for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- Default privileges already withhold access from anon (migration 08); signed-in users read and
-- write their own row only (RLS above). No delete: turning a setting off is an update.
revoke delete on elysia.user_settings from authenticated;
