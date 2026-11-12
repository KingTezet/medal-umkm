-- Stand fees paid by manual bank transfer (no payment gateway).
-- Organizer sets a fee per event and a bank account; after the organizer accepts
-- an applicant, the UMKM uploads a transfer proof; the organizer verifies it;
-- the admin can only confirm the stand once payment is verified (or fee = 0).

create type public.payment_status as enum ('not_required', 'unpaid', 'submitted', 'verified', 'rejected');

alter table public.organizer_profiles
  add column bank_name text check (bank_name is null or char_length(bank_name) between 2 and 60),
  add column bank_account_number text check (bank_account_number is null or bank_account_number ~ '^[0-9]{5,30}$'),
  add column bank_account_holder text check (bank_account_holder is null or char_length(bank_account_holder) between 2 and 120);

alter table public.events
  add column stand_fee integer not null default 0 check (stand_fee >= 0 and stand_fee <= 100000000);

alter table public.stand_applications
  add column payment_status public.payment_status not null default 'not_required',
  add column payment_amount integer check (payment_amount is null or payment_amount >= 0),
  add column payment_proof_path text,
  add column payment_note text,
  add column payment_submitted_at timestamptz,
  add column payment_verified_at timestamptz,
  add column payment_verified_by uuid references public.profiles (id) on delete set null;

create index stand_applications_payment_idx on public.stand_applications (event_id, payment_status);

-- Public read model gets the fee (appended column keeps the view replaceable).
create or replace view public.public_events
with (security_invoker = false)
as
select
  e.id, e.title, e.slug, e.summary, e.description, e.category, e.cover_path, e.gallery_paths,
  e.venue_name, e.address, e.district, e.starts_at, e.ends_at,
  e.registration_opens_at, e.registration_closes_at, e.stand_capacity, e.criteria,
  e.contact_name, e.contact_phone, e.status, e.published_at,
  o.organization_name, o.organization_type,
  (select count(*) from public.stand_applications a
    where a.event_id = e.id and a.status = 'confirmed')::int as confirmed_count,
  e.stand_fee
from public.events e
join public.organizer_profiles o on o.id = e.organizer_id
where e.status in ('published', 'completed');

-- ---------------------------------------------------------------------------
-- Guard: confirmation requires settled payment.
-- ---------------------------------------------------------------------------
create or replace function public.guard_confirm_requires_payment()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status = 'confirmed' and old.status is distinct from 'confirmed'
     and new.payment_status not in ('not_required', 'verified') then
    raise exception 'Pembayaran stand belum diverifikasi penyelenggara.';
  end if;
  return new;
end;
$$;
create trigger stand_applications_payment_guard before update on public.stand_applications
  for each row execute function public.guard_confirm_requires_payment();

-- When the organizer accepts an applicant of a paid event, a payment is due.
create or replace function public.set_payment_due_on_select()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_fee int;
  v_title text;
begin
  if new.status = 'selected_by_organizer' and old.status is distinct from 'selected_by_organizer'
     and new.payment_status in ('not_required', 'rejected', 'unpaid') then
    select stand_fee, title into v_fee, v_title from public.events where id = new.event_id;
    if coalesce(v_fee, 0) > 0 and new.payment_status <> 'unpaid' then
      new.payment_status := 'unpaid';
      new.payment_amount := v_fee;
      insert into public.notifications (user_id, title, message, href)
      values (new.submitted_by, 'Lakukan pembayaran stand',
        format('Anda diterima di "%s". Transfer biaya stand Rp%s ke rekening penyelenggara, lalu unggah bukti transfer.', v_title, to_char(v_fee, 'FM999G999G999')),
        '/dashboard/umkm/pendaftaran/' || new.id);
    end if;
  end if;
  return new;
end;
$$;
revoke execute on function public.set_payment_due_on_select() from public, anon, authenticated;
create trigger stand_applications_payment_due before update on public.stand_applications
  for each row execute function public.set_payment_due_on_select();

-- ---------------------------------------------------------------------------
-- RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_payment_instructions(p_application_id uuid)
returns table (
  bank_name text, bank_account_number text, bank_account_holder text,
  amount int, organization_name text, event_title text
)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_app public.stand_applications;
begin
  select * into v_app from public.stand_applications where id = p_application_id;
  if not found or not (v_app.submitted_by = auth.uid() or public.is_admin() or public.owns_event(v_app.event_id)) then
    raise exception 'Akses ditolak.' using errcode = '42501';
  end if;
  if v_app.payment_status = 'not_required' then
    return;
  end if;
  return query
    select o.bank_name, o.bank_account_number, o.bank_account_holder,
           coalesce(v_app.payment_amount, e.stand_fee), o.organization_name, e.title
    from public.events e join public.organizer_profiles o on o.id = e.organizer_id
    where e.id = v_app.event_id;
end;
$$;

create or replace function public.submit_payment_proof(p_application_id uuid, p_proof_path text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := public._require_active('umkm');
  v_app public.stand_applications;
  v_event public.events;
  v_org_user uuid;
begin
  select * into v_app from public.stand_applications where id = p_application_id and submitted_by = v_uid for update;
  if not found then
    raise exception 'Pendaftaran tidak ditemukan.' using errcode = '42501';
  end if;
  if v_app.status <> 'selected_by_organizer' or v_app.payment_status not in ('unpaid', 'rejected') then
    raise exception 'Pembayaran tidak dapat dikirim pada status ini.';
  end if;
  if p_proof_path is null or split_part(p_proof_path, '/', 1) <> v_uid::text then
    raise exception 'Unggah bukti transfer terlebih dahulu.';
  end if;
  update public.stand_applications set
    payment_status = 'submitted', payment_proof_path = p_proof_path,
    payment_submitted_at = now(), payment_note = null
  where id = p_application_id;
  select * into v_event from public.events where id = v_app.event_id;
  select o.user_id into v_org_user from public.organizer_profiles o where o.id = v_event.organizer_id;
  perform public._audit('payment.submitted', 'stand_application', p_application_id,
    jsonb_build_object('payment_status', v_app.payment_status), jsonb_build_object('payment_status', 'submitted'), null);
  perform public._notify(v_org_user, 'Bukti transfer masuk',
    format('%s mengirim bukti pembayaran stand untuk "%s".', v_app.business_snapshot ->> 'business_name', v_event.title),
    '/dashboard/penyelenggara/events/' || v_event.id || '/peserta?status=selected');
end;
$$;

create or replace function public.organizer_verify_payment(p_application_id uuid, p_action text, p_note text default null)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := public._require_active('organizer');
  v_app public.stand_applications;
  v_event public.events;
  v_to public.payment_status;
  v_note text := nullif(trim(coalesce(p_note, '')), '');
begin
  select * into v_app from public.stand_applications where id = p_application_id for update;
  if not found or not public.owns_event(v_app.event_id) then
    raise exception 'Pendaftaran tidak ditemukan.' using errcode = '42501';
  end if;
  if v_app.payment_status <> 'submitted' then
    raise exception 'Tidak ada bukti pembayaran yang menunggu verifikasi.';
  end if;
  case p_action
    when 'verify' then v_to := 'verified';
    when 'reject' then v_to := 'rejected'; v_note := public._require_note(v_note, 'penolakan pembayaran');
    else raise exception 'Aksi tidak dikenal.';
  end case;
  update public.stand_applications set
    payment_status = v_to, payment_note = v_note,
    payment_verified_at = case when v_to = 'verified' then now() else null end,
    payment_verified_by = case when v_to = 'verified' then v_uid else null end
  where id = p_application_id;
  select * into v_event from public.events where id = v_app.event_id;
  perform public._audit('payment.' || p_action, 'stand_application', p_application_id,
    jsonb_build_object('payment_status', 'submitted'), jsonb_build_object('payment_status', v_to), v_note);
  perform public._notify(v_app.submitted_by,
    case when v_to = 'verified' then 'Pembayaran stand diterima' else 'Bukti transfer ditolak' end,
    case when v_to = 'verified'
      then format('Pembayaran untuk "%s" sudah diverifikasi. Menunggu pengesahan & nomor stand dari Disperindag.', v_event.title)
      else format('Bukti transfer untuk "%s" ditolak: %s. Silakan unggah ulang.', v_event.title, v_note) end,
    '/dashboard/umkm/pendaftaran/' || p_application_id);
  if v_to = 'verified' then
    perform public._notify_admins('Pembayaran terverifikasi',
      format('%s siap disahkan untuk "%s".', v_app.business_snapshot ->> 'business_name', v_event.title),
      '/admin/pendaftaran/' || p_application_id);
  end if;
end;
$$;

revoke execute on function public.get_payment_instructions(uuid) from public, anon;
revoke execute on function public.submit_payment_proof(uuid, text) from public, anon;
revoke execute on function public.organizer_verify_payment(uuid, text, text) from public, anon;
grant execute on function public.get_payment_instructions(uuid) to authenticated;
grant execute on function public.submit_payment_proof(uuid, text) to authenticated;
grant execute on function public.organizer_verify_payment(uuid, text, text) to authenticated;

-- ---------------------------------------------------------------------------
-- Storage: private payment proofs
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('private-payment-proofs', 'private-payment-proofs', false, 5242880, array['application/pdf', 'image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create or replace function public.can_read_payment_proof(p_name text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.stand_applications a
    where a.payment_proof_path = p_name and public.owns_event(a.event_id)
  );
$$;
revoke execute on function public.can_read_payment_proof(text) from public, anon;
grant execute on function public.can_read_payment_proof(text) to authenticated;

create policy medal_payment_insert on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'private-payment-proofs'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and (select public.current_user_role()) = 'umkm'
  );
create policy medal_payment_select on storage.objects
  for select to authenticated
  using (
    bucket_id = 'private-payment-proofs'
    and ((storage.foldername(name))[1] = (select auth.uid())::text
         or (select public.is_admin())
         or public.can_read_payment_proof(name))
  );
create policy medal_payment_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'private-payment-proofs' and (storage.foldername(name))[1] = (select auth.uid())::text);
