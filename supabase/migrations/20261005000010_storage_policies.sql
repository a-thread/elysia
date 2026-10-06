-- Storage policies for the elysia_recipe_photo bucket (previously not captured in migrations).
--
-- The bucket is public, so image URLs work without any policy. These cover the app's calls:
-- upload (PhotoService.addPhoto) for any signed-in user, replace/delete only by the uploader.
-- If the live project already has older policies on storage.objects they are OR'd with these;
-- list them (last query in preflight_checks.sql) and drop any that are broader.

drop policy if exists "elysia photos: signed-in read" on storage.objects;
drop policy if exists "elysia photos: signed-in upload" on storage.objects;
drop policy if exists "elysia photos: uploader replace" on storage.objects;
drop policy if exists "elysia photos: uploader delete" on storage.objects;

-- Needed by upload(..., { upsert: true }); the objects are already public by URL.
create policy "elysia photos: signed-in read" on storage.objects for select to authenticated
  using (bucket_id = 'elysia_recipe_photo');

create policy "elysia photos: signed-in upload" on storage.objects for insert to authenticated
  with check (bucket_id = 'elysia_recipe_photo');

create policy "elysia photos: uploader replace" on storage.objects for update to authenticated
  using (bucket_id = 'elysia_recipe_photo' and owner_id = (select auth.uid())::text)
  with check (bucket_id = 'elysia_recipe_photo' and owner_id = (select auth.uid())::text);

create policy "elysia photos: uploader delete" on storage.objects for delete to authenticated
  using (bucket_id = 'elysia_recipe_photo' and owner_id = (select auth.uid())::text);
