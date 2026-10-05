-- Triggers, including the signup sync on auth.users (shared with other apps in the project,
-- hence the app-specific trigger name).

create trigger update_tags_text_on_tag_change
  after insert or delete or update on elysia.recipe_to_tags
  for each row execute function elysia.touch_recipe_tags_text();

create trigger enforce_collection_ownership_trigger
  before insert on elysia.collections
  for each row execute function elysia.enforce_collection_ownership();

create trigger set_recipe_owner_trigger
  before insert on elysia.recipe_to_users
  for each row execute function elysia.set_recipe_owner_id();

create trigger set_last_updated
  before insert or update on elysia.recipes
  for each row execute function elysia.update_last_updated_column();

create trigger unique_tag_check
  before insert on elysia.tags
  for each row execute function elysia.enforce_unique_tag_creation();

create trigger sync_tags_text
  before insert or update on elysia.recipes
  for each row execute function elysia.update_tags_text();

create trigger elysia_on_auth_user_created
  after insert on auth.users
  for each row execute function elysia.sync_auth_users_to_users();
