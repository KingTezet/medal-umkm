-- MEDAL (Media, Event, Dagang & Lapak) — Platform UMKM Sumedang
-- Core schema: enums, tables, constraints, indexes, timestamps.

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type public.user_role as enum ('umkm', 'organizer', 'admin');
create type public.account_status as enum ('pending', 'active', 'suspended');
create type public.verification_status as enum ('pending', 'verified', 'revision_required', 'rejected');
create type public.organization_type as enum ('community', 'eo', 'village', 'agency', 'other');
create type public.event_status as enum (
  'draft', 'pending_review', 'revision_required', 'published', 'rejected', 'cancelled', 'completed'
);
create type public.application_status as enum (
  'submitted', 'under_verification', 'revision_required', 'verified',
  'selected_by_organizer', 'waitlisted', 'rejected', 'confirmed', 'withdrawn'
);
create type public.category_kind as enum ('event', 'umkm');

-- ---------------------------------------------------------------------------
-- Utility functions
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.slugify(v text)
returns text
language sql
immutable
set search_path = ''
as $$
  select coalesce(
    nullif(trim(both '-' from regexp_replace(lower(coalesce(v, '')), '[^a-z0-9]+', '-', 'g')), ''),
    'item'
  );
$$;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.user_role not null default 'umkm',
  full_name text not null default '' check (char_length(full_name) <= 120),
  email text,
  phone text check (phone is null or phone ~ '^\+?[0-9]{8,15}$'),
  account_status public.account_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index profiles_role_idx on public.profiles (role);

-- ---------------------------------------------------------------------------
-- business_profiles (1 per UMKM account on MVP)
-- ---------------------------------------------------------------------------
create table public.business_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles (id) on delete cascade,
  business_name text not null check (char_length(business_name) between 2 and 120),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  category text not null default 'Lainnya',
  description text check (description is null or char_length(description) <= 2000),
  products jsonb not null default '[]'::jsonb check (jsonb_typeof(products) = 'array'),
  address text not null default '',
  village text,
  district text not null default '',
  regency text not null default 'Sumedang',
  whatsapp text not null default '',
  instagram text,
  nib text check (nib is null or nib ~ '^[0-9]{13}$'),
  business_license_path text,
  logo_path text,
  cover_path text,
  gallery_paths jsonb not null default '[]'::jsonb check (jsonb_typeof(gallery_paths) = 'array'),
  is_public boolean not null default false,
  show_whatsapp boolean not null default false,
  verification_status public.verification_status not null default 'pending',
  verification_note text,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index business_profiles_directory_idx on public.business_profiles (verification_status, is_public);
create index business_profiles_category_idx on public.business_profiles (category);
create index business_profiles_district_idx on public.business_profiles (district);

-- ---------------------------------------------------------------------------
-- organizer_profiles
-- ---------------------------------------------------------------------------
create table public.organizer_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles (id) on delete cascade,
  organization_name text not null check (char_length(organization_name) between 2 and 120),
  organization_type public.organization_type not null default 'other',
  description text check (description is null or char_length(description) <= 2000),
  address text not null default '',
  district text,
  contact_phone text not null default '',
  legal_document_path text,
  verification_status public.verification_status not null default 'pending',
  verification_note text,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index organizer_profiles_status_idx on public.organizer_profiles (verification_status);

-- ---------------------------------------------------------------------------
-- event_categories (event + umkm categories, admin managed)
-- ---------------------------------------------------------------------------
create table public.event_categories (
  id uuid primary key default gen_random_uuid(),
  kind public.category_kind not null default 'event',
  name text not null check (char_length(name) between 2 and 60),
  slug text not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (kind, slug),
  unique (kind, name)
);

-- ---------------------------------------------------------------------------
-- events
-- ---------------------------------------------------------------------------
create table public.events (
  id uuid primary key default gen_random_uuid(),
  organizer_id uuid not null references public.organizer_profiles (id) on delete restrict,
  title text not null check (char_length(title) between 5 and 140),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  summary text not null check (char_length(summary) between 10 and 300),
  description text not null check (char_length(description) between 20 and 8000),
  category text not null,
  cover_path text,
  gallery_paths jsonb not null default '[]'::jsonb check (jsonb_typeof(gallery_paths) = 'array'),
  venue_name text not null check (char_length(venue_name) between 3 and 140),
  address text not null check (char_length(address) between 5 and 300),
  district text,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  registration_opens_at timestamptz not null,
  registration_closes_at timestamptz not null,
  stand_capacity integer not null check (stand_capacity > 0 and stand_capacity <= 5000),
  criteria jsonb not null default '[]'::jsonb check (jsonb_typeof(criteria) = 'array'),
  proposal_path text,
  contact_name text,
  contact_phone text,
  status public.event_status not null default 'draft',
  review_note text,
  reviewed_by uuid references public.profiles (id) on delete set null,
  reviewed_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint events_dates_valid check (ends_at > starts_at),
  constraint events_registration_valid check (registration_closes_at > registration_opens_at),
  constraint events_registration_before_end check (registration_closes_at <= ends_at)
);
create index events_status_idx on public.events (status, registration_closes_at);
create index events_organizer_idx on public.events (organizer_id);
create index events_category_idx on public.events (category);
create index events_district_idx on public.events (district);
create index events_starts_idx on public.events (starts_at);

-- ---------------------------------------------------------------------------
-- stand_applications
-- ---------------------------------------------------------------------------
create table public.stand_applications (
  id uuid primary key default gen_random_uuid(),
  application_code text not null unique,
  event_id uuid not null references public.events (id) on delete restrict,
  business_profile_id uuid not null references public.business_profiles (id) on delete restrict,
  submitted_by uuid not null references public.profiles (id) on delete restrict,
  business_snapshot jsonb not null default '{}'::jsonb,
  products_offered text not null check (char_length(products_offered) between 3 and 1000),
  application_note text check (application_note is null or char_length(application_note) <= 1000),
  additional_document_path text,
  status public.application_status not null default 'submitted',
  admin_note text,
  organizer_note text,
  stand_number text check (stand_number is null or stand_number ~ '^[A-Za-z0-9][A-Za-z0-9-]{0,15}$'),
  verified_by uuid references public.profiles (id) on delete set null,
  organizer_decided_by uuid references public.profiles (id) on delete set null,
  confirmed_by uuid references public.profiles (id) on delete set null,
  submitted_at timestamptz not null default now(),
  verified_at timestamptz,
  organizer_decided_at timestamptz,
  confirmed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint stand_applications_unique_business unique (event_id, business_profile_id),
  constraint stand_applications_confirmed_has_stand check (status <> 'confirmed' or stand_number is not null)
);
create unique index stand_applications_unique_stand
  on public.stand_applications (event_id, upper(stand_number))
  where stand_number is not null;
create index stand_applications_event_status_idx on public.stand_applications (event_id, status);
create index stand_applications_submitter_idx on public.stand_applications (submitted_by);
create index stand_applications_business_idx on public.stand_applications (business_profile_id);
create index stand_applications_status_idx on public.stand_applications (status);

-- Status history used for user-facing timelines.
create table public.application_status_history (
  id bigint generated always as identity primary key,
  application_id uuid not null references public.stand_applications (id) on delete cascade,
  from_status public.application_status,
  to_status public.application_status not null,
  note text,
  actor_role public.user_role,
  created_at timestamptz not null default now()
);
create index application_status_history_app_idx on public.application_status_history (application_id, created_at);

-- ---------------------------------------------------------------------------
-- notifications
-- ---------------------------------------------------------------------------
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  message text not null,
  href text check (href is null or href ~ '^/'),
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index notifications_user_idx on public.notifications (user_id, read_at, created_at desc);

-- ---------------------------------------------------------------------------
-- audit_logs
-- ---------------------------------------------------------------------------
create table public.audit_logs (
  id bigint generated always as identity primary key,
  actor_user_id uuid references public.profiles (id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  old_values jsonb,
  new_values jsonb,
  note text,
  created_at timestamptz not null default now()
);
create index audit_logs_created_idx on public.audit_logs (created_at desc);
create index audit_logs_entity_idx on public.audit_logs (entity_type, entity_id);

-- ---------------------------------------------------------------------------
-- platform_settings
-- ---------------------------------------------------------------------------
create table public.platform_settings (
  key text primary key check (key ~ '^[a-z0-9_]+$'),
  value jsonb not null,
  is_public boolean not null default true,
  updated_by uuid references public.profiles (id) on delete set null,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------
create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger business_profiles_updated_at before update on public.business_profiles
  for each row execute function public.set_updated_at();
create trigger organizer_profiles_updated_at before update on public.organizer_profiles
  for each row execute function public.set_updated_at();
create trigger events_updated_at before update on public.events
  for each row execute function public.set_updated_at();
create trigger stand_applications_updated_at before update on public.stand_applications
  for each row execute function public.set_updated_at();
create trigger platform_settings_updated_at before update on public.platform_settings
  for each row execute function public.set_updated_at();
