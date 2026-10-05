-- Extension, schema, tables and grants for the elysia schema.
-- Prerequisite: add 'elysia' to Project Settings -> API -> Exposed schemas.

create extension if not exists pg_trgm with schema extensions;

create schema if not exists elysia;

create table elysia.users (
  id uuid primary key references auth.users(id),
  created_at timestamptz not null default now(),
  display_name varchar,
  profile_image varchar,
  email text not null unique
);

create table elysia.tags (
  id uuid primary key default gen_random_uuid(),
  title text not null unique
);

create table elysia.recipes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid default auth.uid() references auth.users(id),
  title varchar default '',
  description varchar default '',
  prep_time smallint,
  cook_time smallint,
  img_url text,
  servings smallint,
  original_recipe_url varchar,
  is_public boolean default false,
  last_updated timestamptz not null default (now() at time zone 'utc'),
  ingredients jsonb,
  steps jsonb,
  ingredients_text text,
  tags_text text,
  public_permission text not null default 'read' check (public_permission in ('read','edit'))
);

create table elysia.collections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid default auth.uid() references elysia.users(id),
  title varchar not null,
  description text,
  is_public boolean default false,
  created_at timestamp default current_timestamp,
  img_url text,
  public_permission text not null default 'read' check (public_permission in ('read','edit'))
);

create table elysia.collection_to_recipes (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid references elysia.collections(id),
  recipe_id uuid references elysia.recipes(id),
  created_at timestamp default now()
);

create table elysia.collection_to_tags (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid not null default gen_random_uuid() references elysia.collections(id),
  tag_id uuid default gen_random_uuid() references elysia.tags(id)
);

create table elysia.collection_to_users (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid references elysia.collections(id),
  user_id uuid references elysia.users(id),
  permission text not null check (permission in ('read','edit')),
  created_at timestamp default current_timestamp
);

create table elysia.recipe_to_tags (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null default gen_random_uuid() references elysia.recipes(id),
  tag_id uuid default gen_random_uuid() references elysia.tags(id)
);

create table elysia.recipe_to_users (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid references elysia.recipes(id),
  user_id uuid references elysia.users(id),
  permission text not null check (permission in ('read','edit')),
  created_at timestamp default current_timestamp,
  recipe_owner_id uuid
);

create table elysia.shopping_list_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  value text not null,
  checked boolean not null default false,
  source_recipe_id uuid references elysia.recipes(id),
  source_recipe_title text,
  created_at timestamptz not null default now()
);

-- Let the Data API (PostgREST) reach the schema
grant usage on schema elysia to anon, authenticated, service_role;
grant all on all tables in schema elysia to anon, authenticated, service_role;
alter default privileges in schema elysia
  grant all on tables to anon, authenticated, service_role;
