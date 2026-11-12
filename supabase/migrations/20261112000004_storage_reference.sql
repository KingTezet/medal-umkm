-- Storage buckets + policies, reference data (categories, public settings).
-- Path convention for every bucket: {auth.uid()}/{folder}/{file}

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('public-event-media', 'public-event-media', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
  ('public-umkm-media', 'public-umkm-media', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
  ('private-verification-documents', 'private-verification-documents', false, 5242880, array['application/pdf', 'image/jpeg', 'image/png']),
  ('private-event-proposals', 'private-event-proposals', false, 10485760, array['application/pdf']),
  ('private-application-documents', 'private-application-documents', false, 5242880, array['application/pdf'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create or replace function public.storage_role_can_write(p_bucket text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select case p_bucket
    when 'public-event-media' then public.current_user_role() in ('organizer', 'admin')
    when 'private-event-proposals' then public.current_user_role() in ('organizer', 'admin')
    when 'public-umkm-media' then public.current_user_role() in ('umkm', 'admin')
    when 'private-application-documents' then public.current_user_role() = 'umkm'
    when 'private-verification-documents' then public.current_user_role() in ('umkm', 'organizer')
    else false
  end;
$$;
revoke execute on function public.storage_role_can_write(text) from public, anon;
grant execute on function public.storage_role_can_write(text) to authenticated;

create policy medal_storage_insert on storage.objects
  for insert to authenticated
  with check (
    bucket_id in ('public-event-media', 'public-umkm-media', 'private-verification-documents',
                  'private-event-proposals', 'private-application-documents')
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and public.storage_role_can_write(bucket_id)
  );

create policy medal_storage_select on storage.objects
  for select to authenticated
  using (
    bucket_id in ('public-event-media', 'public-umkm-media', 'private-verification-documents',
                  'private-event-proposals', 'private-application-documents')
    and ((storage.foldername(name))[1] = (select auth.uid())::text or (select public.is_admin()))
  );

create policy medal_storage_update on storage.objects
  for update to authenticated
  using (
    bucket_id in ('public-event-media', 'public-umkm-media', 'private-verification-documents',
                  'private-event-proposals', 'private-application-documents')
    and ((storage.foldername(name))[1] = (select auth.uid())::text or (select public.is_admin()))
  );

create policy medal_storage_delete on storage.objects
  for delete to authenticated
  using (
    bucket_id in ('public-event-media', 'public-umkm-media', 'private-verification-documents',
                  'private-event-proposals', 'private-application-documents')
    and ((storage.foldername(name))[1] = (select auth.uid())::text or (select public.is_admin()))
  );

-- ---------------------------------------------------------------------------
-- Reference data
-- ---------------------------------------------------------------------------
insert into public.event_categories (kind, name, slug, sort_order) values
  ('event', 'Bazar', 'bazar', 1),
  ('event', 'Festival', 'festival', 2),
  ('event', 'Pameran', 'pameran', 3),
  ('event', 'Pasar Malam', 'pasar-malam', 4),
  ('event', 'Expo & Business Matching', 'expo', 5),
  ('event', 'Lainnya', 'lainnya', 99),
  ('umkm', 'Kuliner', 'kuliner', 1),
  ('umkm', 'Fesyen', 'fesyen', 2),
  ('umkm', 'Kriya & Kerajinan', 'kriya', 3),
  ('umkm', 'Pertanian & Olahan', 'pertanian', 4),
  ('umkm', 'Kecantikan & Kesehatan', 'kecantikan', 5),
  ('umkm', 'Jasa', 'jasa', 6),
  ('umkm', 'Lainnya', 'lainnya', 99)
on conflict do nothing;

insert into public.platform_settings (key, value, is_public) values
  ('contact', jsonb_build_object(
     'agency', 'Dinas Perindustrian dan Perdagangan Kabupaten Sumedang',
     'address', 'Alamat resmi menunggu konfirmasi Disperindag',
     'phone', '',
     'whatsapp', '',
     'email', '',
     'instagram', ''
   ), true),
  ('announcement', jsonb_build_object('enabled', false, 'text', ''), true),
  ('hero', jsonb_build_object(
     'headline', 'Temukan Event. Perluas Pasar. Tumbuhkan UMKM Sumedang.',
     'subheadline', 'MEDAL menghubungkan pelaku UMKM dengan penyelenggara event — dari pendaftaran stand, verifikasi Disperindag, hingga nomor lapak final, semua dalam satu pintu.'
   ), true)
on conflict (key) do nothing;
