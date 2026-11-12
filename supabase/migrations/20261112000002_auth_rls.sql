-- Auth sign-up trigger, role helpers, column guards, RLS policies, public views.

-- ---------------------------------------------------------------------------
-- Role helpers (SECURITY DEFINER, fixed search_path)
-- ---------------------------------------------------------------------------
create or replace function public.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = ''
as $$
  select p.role from public.profiles p where p.id = auth.uid() and p.account_status <> 'suspended';
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin' and p.account_status <> 'suspended'
  );
$$;

create or replace function public.my_organizer_id()
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select o.id from public.organizer_profiles o where o.user_id = auth.uid();
$$;

create or replace function public.owns_event(p_event_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.events e
    join public.organizer_profiles o on o.id = e.organizer_id
    where e.id = p_event_id and o.user_id = auth.uid()
  );
$$;

-- True when the current statement comes straight from an API role
-- (PostgREST). Inside SECURITY DEFINER RPCs current_user is the owner,
-- so trusted functions bypass the column guards below.
create or replace function public.is_api_caller()
returns boolean
language sql
stable
set search_path = ''
as $$
  select current_user in ('authenticated', 'anon');
$$;

create or replace function public.unique_business_slug(p_base text, p_exclude uuid default null)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_base text := left(public.slugify(p_base), 60);
  v_slug text := v_base;
  v_i int := 1;
begin
  while exists (
    select 1 from public.business_profiles b
    where b.slug = v_slug and (p_exclude is null or b.id <> p_exclude)
  ) loop
    v_i := v_i + 1;
    v_slug := v_base || '-' || v_i;
  end loop;
  return v_slug;
end;
$$;

create or replace function public.unique_event_slug(p_base text, p_exclude uuid default null)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_base text := left(public.slugify(p_base), 70);
  v_slug text := v_base;
  v_i int := 1;
begin
  while exists (
    select 1 from public.events e
    where e.slug = v_slug and (p_exclude is null or e.id <> p_exclude)
  ) loop
    v_i := v_i + 1;
    v_slug := v_base || '-' || v_i;
  end loop;
  return v_slug;
end;
$$;

-- ---------------------------------------------------------------------------
-- Sign-up trigger: never trusts metadata for admin.
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  v_role public.user_role := case
    when meta ->> 'role' = 'organizer' then 'organizer'::public.user_role
    else 'umkm'::public.user_role
  end;
  v_name text := left(coalesce(nullif(trim(meta ->> 'full_name'), ''), split_part(new.email, '@', 1)), 120);
  v_phone text := nullif(regexp_replace(coalesce(meta ->> 'phone', ''), '[^0-9+]', '', 'g'), '');
  v_base text;
  v_type text := meta ->> 'organization_type';
begin
  if v_phone is not null and v_phone !~ '^\+?[0-9]{8,15}$' then
    v_phone := null;
  end if;

  insert into public.profiles (id, role, full_name, email, phone)
  values (new.id, v_role, v_name, new.email, v_phone);

  if v_role = 'umkm' then
    v_base := left(coalesce(nullif(trim(meta ->> 'business_name'), ''), v_name), 120);
    if char_length(v_base) < 2 then
      v_base := 'Usaha ' || v_base;
    end if;
    insert into public.business_profiles (
      user_id, business_name, slug, category, district, village, address, whatsapp, description
    ) values (
      new.id,
      v_base,
      public.unique_business_slug(v_base),
      coalesce(nullif(trim(meta ->> 'category'), ''), 'Lainnya'),
      coalesce(trim(meta ->> 'district'), ''),
      nullif(trim(meta ->> 'village'), ''),
      left(coalesce(trim(meta ->> 'address'), ''), 300),
      coalesce(v_phone, ''),
      nullif(left(trim(meta ->> 'description'), 2000), '')
    );
  else
    v_base := left(coalesce(nullif(trim(meta ->> 'organization_name'), ''), v_name), 120);
    if char_length(v_base) < 2 then
      v_base := 'Organisasi ' || v_base;
    end if;
    insert into public.organizer_profiles (
      user_id, organization_name, organization_type, address, district, contact_phone, description
    ) values (
      new.id,
      v_base,
      case when v_type in ('community', 'eo', 'village', 'agency', 'other')
        then v_type::public.organization_type else 'other'::public.organization_type end,
      left(coalesce(trim(meta ->> 'address'), ''), 300),
      nullif(trim(meta ->> 'district'), ''),
      coalesce(v_phone, ''),
      nullif(left(trim(meta ->> 'description'), 2000), '')
    );
  end if;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Column guards: API callers cannot touch privileged columns.
-- ---------------------------------------------------------------------------
create or replace function public.guard_profiles()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if public.is_api_caller() then
    if new.role is distinct from old.role or new.account_status is distinct from old.account_status then
      raise exception 'Tidak diizinkan mengubah role atau status akun.' using errcode = '42501';
    end if;
    new.id := old.id;
    new.email := old.email;
  end if;
  return new;
end;
$$;
create trigger profiles_guard before update on public.profiles
  for each row execute function public.guard_profiles();

create or replace function public.guard_verification_columns()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if public.is_api_caller() then
    if tg_op = 'INSERT' then
      new.verification_status := 'pending';
      new.verification_note := null;
      new.verified_at := null;
    else
      new.user_id := old.user_id;
      -- Owner editing after a revision request automatically re-enters the queue.
      new.verification_status := case
        when old.verification_status = 'revision_required' then 'pending'::public.verification_status
        else old.verification_status
      end;
      new.verification_note := old.verification_note;
      new.verified_at := old.verified_at;
    end if;
  end if;
  return new;
end;
$$;
create trigger business_profiles_guard before insert or update on public.business_profiles
  for each row execute function public.guard_verification_columns();
create trigger organizer_profiles_guard before insert or update on public.organizer_profiles
  for each row execute function public.guard_verification_columns();

create or replace function public.guard_events()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if public.is_api_caller() then
    if tg_op = 'INSERT' then
      new.status := 'draft';
      new.review_note := null;
      new.reviewed_by := null;
      new.reviewed_at := null;
      new.published_at := null;
    else
      if old.status not in ('draft', 'revision_required') then
        raise exception 'Event hanya dapat diubah saat berstatus draft atau perlu revisi.' using errcode = '42501';
      end if;
      new.organizer_id := old.organizer_id;
      new.status := old.status;
      new.review_note := old.review_note;
      new.reviewed_by := old.reviewed_by;
      new.reviewed_at := old.reviewed_at;
      new.published_at := old.published_at;
    end if;
  end if;
  return new;
end;
$$;
create trigger events_guard before insert or update on public.events
  for each row execute function public.guard_events();

create or replace function public.guard_notifications()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if public.is_api_caller() then
    new.id := old.id;
    new.user_id := old.user_id;
    new.title := old.title;
    new.message := old.message;
    new.href := old.href;
    new.created_at := old.created_at;
  end if;
  return new;
end;
$$;
create trigger notifications_guard before update on public.notifications
  for each row execute function public.guard_notifications();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.business_profiles enable row level security;
alter table public.organizer_profiles enable row level security;
alter table public.event_categories enable row level security;
alter table public.events enable row level security;
alter table public.stand_applications enable row level security;
alter table public.application_status_history enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_logs enable row level security;
alter table public.platform_settings enable row level security;

-- profiles
create policy profiles_select_own_or_admin on public.profiles
  for select to authenticated
  using (id = (select auth.uid()) or (select public.is_admin()));
create policy profiles_update_own on public.profiles
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- business_profiles
create policy business_select_own_or_admin on public.business_profiles
  for select to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()));
create policy business_insert_own on public.business_profiles
  for insert to authenticated
  with check (user_id = (select auth.uid()) and (select public.current_user_role()) = 'umkm');
create policy business_update_own on public.business_profiles
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- organizer_profiles
create policy organizer_select_own_or_admin on public.organizer_profiles
  for select to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()));
create policy organizer_insert_own on public.organizer_profiles
  for insert to authenticated
  with check (user_id = (select auth.uid()) and (select public.current_user_role()) = 'organizer');
create policy organizer_update_own on public.organizer_profiles
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- event_categories
create policy categories_public_read on public.event_categories
  for select to anon, authenticated
  using (is_active or (select public.is_admin()));
create policy categories_admin_insert on public.event_categories
  for insert to authenticated with check ((select public.is_admin()));
create policy categories_admin_update on public.event_categories
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy categories_admin_delete on public.event_categories
  for delete to authenticated using ((select public.is_admin()));

-- events (public reads go through public_events view)
create policy events_select_owner_or_admin on public.events
  for select to authenticated
  using (organizer_id = (select public.my_organizer_id()) or (select public.is_admin()));
create policy events_insert_owner on public.events
  for insert to authenticated
  with check (
    organizer_id = (select public.my_organizer_id())
    and (select public.current_user_role()) = 'organizer'
  );
create policy events_update_owner on public.events
  for update to authenticated
  using (organizer_id = (select public.my_organizer_id()))
  with check (organizer_id = (select public.my_organizer_id()));
create policy events_delete_owner_draft on public.events
  for delete to authenticated
  using (organizer_id = (select public.my_organizer_id()) and status = 'draft');

-- stand_applications: read-only via RLS; all writes through RPCs.
create policy applications_select on public.stand_applications
  for select to authenticated
  using (
    submitted_by = (select auth.uid())
    or (select public.is_admin())
    or (
      public.owns_event(event_id)
      and (
        status in ('verified', 'selected_by_organizer', 'waitlisted', 'confirmed')
        or (status = 'rejected' and organizer_decided_at is not null)
      )
    )
  );

-- status history follows application visibility
create policy history_select on public.application_status_history
  for select to authenticated
  using (exists (select 1 from public.stand_applications a where a.id = application_id));

-- notifications
create policy notifications_select_own on public.notifications
  for select to authenticated using (user_id = (select auth.uid()));
create policy notifications_update_own on public.notifications
  for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy notifications_delete_own on public.notifications
  for delete to authenticated using (user_id = (select auth.uid()));

-- audit_logs: admin read only
create policy audit_admin_read on public.audit_logs
  for select to authenticated using ((select public.is_admin()));

-- platform_settings
create policy settings_public_read on public.platform_settings
  for select to anon, authenticated using (is_public or (select public.is_admin()));
create policy settings_admin_insert on public.platform_settings
  for insert to authenticated with check ((select public.is_admin()));
create policy settings_admin_update on public.platform_settings
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy settings_admin_delete on public.platform_settings
  for delete to authenticated using ((select public.is_admin()));

-- ---------------------------------------------------------------------------
-- Public read models (only safe columns; owner privileges, filtered rows)
-- ---------------------------------------------------------------------------
create view public.public_events
with (security_invoker = false)
as
select
  e.id, e.title, e.slug, e.summary, e.description, e.category, e.cover_path, e.gallery_paths,
  e.venue_name, e.address, e.district, e.starts_at, e.ends_at,
  e.registration_opens_at, e.registration_closes_at, e.stand_capacity, e.criteria,
  e.contact_name, e.contact_phone, e.status, e.published_at,
  o.organization_name, o.organization_type,
  (select count(*) from public.stand_applications a
    where a.event_id = e.id and a.status = 'confirmed')::int as confirmed_count
from public.events e
join public.organizer_profiles o on o.id = e.organizer_id
where e.status in ('published', 'completed');

create view public.public_business_profiles
with (security_invoker = false)
as
select
  b.id, b.business_name, b.slug, b.category, b.description, b.products,
  b.village, b.district, b.regency, b.logo_path, b.cover_path, b.gallery_paths,
  b.instagram,
  case when b.show_whatsapp then b.whatsapp else null end as whatsapp,
  b.verified_at, b.created_at
from public.business_profiles b
join public.profiles p on p.id = b.user_id
where b.verification_status = 'verified' and b.is_public and p.account_status <> 'suspended';

revoke all on public.public_events from anon, authenticated;
revoke all on public.public_business_profiles from anon, authenticated;
grant select on public.public_events to anon, authenticated;
grant select on public.public_business_profiles to anon, authenticated;

-- Lock down helper execution
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.unique_business_slug(text, uuid) from public, anon;
revoke execute on function public.unique_event_slug(text, uuid) from public, anon;
