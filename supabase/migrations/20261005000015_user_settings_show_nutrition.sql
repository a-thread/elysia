-- Lets a user hide nutrition facts (on recipes and in the recipe form). On by default, so nothing
-- changes for existing users. Hiding nutrition also hides "Send to Tern", which needs it.

alter table elysia.user_settings
  add column show_nutrition boolean not null default true;
