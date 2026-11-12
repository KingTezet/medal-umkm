-- Workflow RPCs: every status transition goes through these functions.
-- Each validates caller role, ownership and the state machine, writes
-- status history, audit log and in-app notifications atomically.

-- ---------------------------------------------------------------------------
-- Internal helpers (not executable by API roles)
-- ---------------------------------------------------------------------------
create or replace function public._audit(
  p_action text, p_entity_type text, p_entity_id uuid,
  p_old jsonb, p_new jsonb, p_note text
) returns void
language sql
security definer
set search_path = ''
as $$
  insert into public.audit_logs (actor_user_id, action, entity_type, entity_id, old_values, new_values, note)
  values (auth.uid(), p_action, p_entity_type, p_entity_id, p_old, p_new, p_note);
$$;

create or replace function public._notify(p_user uuid, p_title text, p_message text, p_href text)
returns void
language sql
security definer
set search_path = ''
as $$
  insert into public.notifications (user_id, title, message, href)
  select p_user, p_title, p_message, p_href where p_user is not null;
$$;

create or replace function public._notify_admins(p_title text, p_message text, p_href text)
returns void
language sql
security definer
set search_path = ''
as $$
  insert into public.notifications (user_id, title, message, href)
  select p.id, p_title, p_message, p_href
  from public.profiles p
  where p.role = 'admin' and p.account_status <> 'suspended';
$$;

create or replace function public._app_history(
  p_app uuid, p_from public.application_status, p_to public.application_status, p_note text
) returns void
language sql
security definer
set search_path = ''
as $$
  insert into public.application_status_history (application_id, from_status, to_status, note, actor_role)
  values (p_app, p_from, p_to, p_note, (select role from public.profiles where id = auth.uid()));
$$;

create or replace function public._require_active(p_role public.user_role)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_profile public.profiles;
begin
  if v_uid is null then
    raise exception 'Sesi berakhir. Silakan masuk kembali.' using errcode = '28000';
  end if;
  select * into v_profile from public.profiles where id = v_uid;
  if not found or v_profile.account_status = 'suspended' then
    raise exception 'Akun Anda tidak aktif.' using errcode = '42501';
  end if;
  if p_role is not null and v_profile.role <> p_role then
    raise exception 'Anda tidak memiliki akses untuk tindakan ini.' using errcode = '42501';
  end if;
  return v_uid;
end;
$$;

create or replace function public._require_note(p_note text, p_label text)
returns text
language plpgsql
immutable
set search_path = ''
as $$
begin
  if char_length(coalesce(trim(p_note), '')) < 5 then
    raise exception 'Catatan % wajib diisi (minimal 5 karakter).', p_label;
  end if;
  return trim(p_note);
end;
$$;

-- ---------------------------------------------------------------------------
-- Organizer: submit event for review
-- ---------------------------------------------------------------------------
create or replace function public.submit_event(p_event_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := public._require_active('organizer');
  v_event public.events;
  v_org public.organizer_profiles;
begin
  select * into v_org from public.organizer_profiles where user_id = v_uid;
  select * into v_event from public.events where id = p_event_id and organizer_id = v_org.id for update;
  if not found then
    raise exception 'Event tidak ditemukan.' using errcode = '42501';
  end if;
  if v_event.status not in ('draft', 'revision_required') then
    raise exception 'Event ini tidak dapat diajukan pada status saat ini.';
  end if;
  if v_org.verification_status <> 'verified' then
    raise exception 'Profil organisasi harus diverifikasi Disperindag sebelum mengajukan event.';
  end if;
  if v_event.proposal_path is null then
    raise exception 'Unggah proposal/izin event (PDF) sebelum mengajukan.';
  end if;
  if v_event.registration_closes_at <= now() then
    raise exception 'Periode pendaftaran stand sudah lewat. Perbarui jadwal terlebih dahulu.';
  end if;

  update public.events set status = 'pending_review' where id = p_event_id;

  perform public._audit('event.submitted', 'event', p_event_id,
    jsonb_build_object('status', v_event.status), jsonb_build_object('status', 'pending_review'), null);
  perform public._notify(v_uid, 'Pengajuan event terkirim',
    format('"%s" sedang ditinjau oleh Disperindag.', v_event.title),
    '/dashboard/penyelenggara/events/' || p_event_id);
  perform public._notify_admins('Pengajuan event baru',
    format('%s mengajukan event "%s".', v_org.organization_name, v_event.title),
    '/admin/events/' || p_event_id);
end;
$$;

-- ---------------------------------------------------------------------------
-- Admin: review / publish / revise / reject / cancel / complete event
-- ---------------------------------------------------------------------------
create or replace function public.admin_review_event(p_event_id uuid, p_action text, p_note text default null)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := public._require_active('admin');
  v_event public.events;
  v_org public.organizer_profiles;
  v_to public.event_status;
  v_note text := nullif(trim(coalesce(p_note, '')), '');
  v_title text;
  v_msg text;
begin
  select * into v_event from public.events where id = p_event_id for update;
  if not found then
    raise exception 'Event tidak ditemukan.';
  end if;
  select * into v_org from public.organizer_profiles where id = v_event.organizer_id;

  case p_action
    when 'publish' then
      if v_event.status <> 'pending_review' then
        raise exception 'Hanya event yang menunggu review yang dapat dipublikasikan.';
      end if;
      if v_org.verification_status <> 'verified' then
        raise exception 'Verifikasi profil penyelenggara terlebih dahulu.';
      end if;
      v_to := 'published';
      v_title := 'Event dipublikasikan';
      v_msg := format('"%s" telah disetujui dan tampil di website MEDAL.', v_event.title);
    when 'revise' then
      if v_event.status <> 'pending_review' then
        raise exception 'Revisi hanya dapat diminta untuk event yang menunggu review.';
      end if;
      v_note := public._require_note(v_note, 'revisi');
      v_to := 'revision_required';
      v_title := 'Event perlu revisi';
      v_msg := format('"%s" perlu diperbaiki: %s', v_event.title, v_note);
    when 'reject' then
      if v_event.status <> 'pending_review' then
        raise exception 'Penolakan hanya untuk event yang menunggu review.';
      end if;
      v_note := public._require_note(v_note, 'penolakan');
      v_to := 'rejected';
      v_title := 'Pengajuan event ditolak';
      v_msg := format('"%s" ditolak: %s', v_event.title, v_note);
    when 'cancel' then
      if v_event.status <> 'published' then
        raise exception 'Hanya event terbit yang dapat dibatalkan.';
      end if;
      v_note := public._require_note(v_note, 'pembatalan');
      v_to := 'cancelled';
      v_title := 'Event dibatalkan';
      v_msg := format('"%s" dibatalkan: %s', v_event.title, v_note);
    when 'complete' then
      if v_event.status <> 'published' then
        raise exception 'Hanya event terbit yang dapat ditandai selesai.';
      end if;
      v_to := 'completed';
      v_title := 'Event selesai';
      v_msg := format('"%s" ditandai selesai.', v_event.title);
    else
      raise exception 'Aksi tidak dikenal.';
  end case;

  update public.events set
    status = v_to,
    review_note = coalesce(v_note, review_note),
    reviewed_by = v_uid,
    reviewed_at = now(),
    published_at = case when v_to = 'published' then now() else published_at end
  where id = p_event_id;

  perform public._audit('event.' || p_action, 'event', p_event_id,
    jsonb_build_object('status', v_event.status), jsonb_build_object('status', v_to), v_note);
  perform public._notify(v_org.user_id, v_title, v_msg, '/dashboard/penyelenggara/events/' || p_event_id);

  if v_to = 'cancelled' then
    insert into public.notifications (user_id, title, message, href)
    select a.submitted_by, 'Event dibatalkan',
      format('"%s" dibatalkan oleh Disperindag: %s', v_event.title, v_note),
      '/dashboard/umkm/pendaftaran/' || a.id
    from public.stand_applications a
    where a.event_id = p_event_id and a.status not in ('withdrawn', 'rejected');
  end if;
end;
$$;

-- ---------------------------------------------------------------------------
-- UMKM: submit stand application (validates profile, window, quota, duplicate)
-- ---------------------------------------------------------------------------
create or replace function public.submit_application(
  p_event_id uuid,
  p_products_offered text,
  p_note text default null,
  p_document_path text default null
) returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := public._require_active('umkm');
  v_bp public.business_profiles;
  v_owner public.profiles;
  v_event public.events;
  v_existing public.stand_applications;
  v_confirmed int;
  v_snapshot jsonb;
  v_app_id uuid;
  v_code text;
  v_reused boolean := false;
begin
  select * into v_bp from public.business_profiles where user_id = v_uid;
  if not found then
    raise exception 'Lengkapi profil usaha terlebih dahulu.';
  end if;
  if v_bp.verification_status = 'rejected' then
    raise exception 'Profil usaha Anda ditolak. Hubungi Disperindag untuk informasi lebih lanjut.';
  end if;
  if coalesce(v_bp.whatsapp, '') = '' or coalesce(v_bp.district, '') = '' or coalesce(v_bp.address, '') = ''
     or (v_bp.nib is null and v_bp.business_license_path is null) then
    raise exception 'Profil usaha belum lengkap (WhatsApp, alamat, kecamatan, dan NIB/surat keterangan usaha wajib).';
  end if;
  if char_length(coalesce(trim(p_products_offered), '')) < 3 then
    raise exception 'Isi produk yang akan dijual.';
  end if;
  if p_document_path is not null and split_part(p_document_path, '/', 1) <> v_uid::text then
    raise exception 'Dokumen tidak valid.' using errcode = '42501';
  end if;

  select * into v_event from public.events where id = p_event_id;
  if not found or v_event.status <> 'published' then
    raise exception 'Event tidak tersedia untuk pendaftaran.';
  end if;
  if now() < v_event.registration_opens_at then
    raise exception 'Pendaftaran event ini belum dibuka.';
  end if;
  if now() > v_event.registration_closes_at then
    raise exception 'Pendaftaran event ini sudah ditutup.';
  end if;
  select count(*) into v_confirmed from public.stand_applications
    where event_id = p_event_id and status = 'confirmed';
  if v_confirmed >= v_event.stand_capacity then
    raise exception 'Kuota stand event ini sudah penuh.';
  end if;

  select * into v_owner from public.profiles where id = v_uid;
  v_snapshot := jsonb_build_object(
    'business_name', v_bp.business_name,
    'slug', v_bp.slug,
    'category', v_bp.category,
    'description', v_bp.description,
    'owner_name', v_owner.full_name,
    'whatsapp', v_bp.whatsapp,
    'address', v_bp.address,
    'village', v_bp.village,
    'district', v_bp.district,
    'products', v_bp.products,
    'logo_path', v_bp.logo_path,
    'has_nib', v_bp.nib is not null,
    'has_license', v_bp.business_license_path is not null
  );

  select * into v_existing from public.stand_applications
    where event_id = p_event_id and business_profile_id = v_bp.id
    for update;

  if found then
    if v_existing.status <> 'withdrawn' then
      raise exception 'Usaha Anda sudah terdaftar pada event ini.' using errcode = '23505';
    end if;
    update public.stand_applications set
      status = 'submitted', products_offered = trim(p_products_offered),
      application_note = nullif(trim(coalesce(p_note, '')), ''),
      additional_document_path = p_document_path, business_snapshot = v_snapshot,
      admin_note = null, organizer_note = null, stand_number = null,
      verified_by = null, verified_at = null, organizer_decided_by = null, organizer_decided_at = null,
      confirmed_by = null, confirmed_at = null, submitted_at = now()
    where id = v_existing.id;
    v_app_id := v_existing.id;
    v_code := v_existing.application_code;
    v_reused := true;
  else
    v_code := 'MDL-' || to_char(now() at time zone 'Asia/Jakarta', 'YYMM') || '-'
      || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));
    insert into public.stand_applications (
      application_code, event_id, business_profile_id, submitted_by, business_snapshot,
      products_offered, application_note, additional_document_path, status
    ) values (
      v_code, p_event_id, v_bp.id, v_uid, v_snapshot, trim(p_products_offered),
      nullif(trim(coalesce(p_note, '')), ''), p_document_path, 'submitted'
    ) returning id into v_app_id;
  end if;

  perform public._app_history(v_app_id, case when v_reused then 'withdrawn'::public.application_status end, 'submitted', null);
  perform public._audit('application.submitted', 'stand_application', v_app_id, null,
    jsonb_build_object('status', 'submitted', 'event_id', p_event_id), null);
  perform public._notify(v_uid, 'Pendaftaran stand terkirim',
    format('Pendaftaran %s untuk "%s" diterima dan menunggu verifikasi Disperindag.', v_code, v_event.title),
    '/dashboard/umkm/pendaftaran/' || v_app_id);
  perform public._notify_admins('Pendaftaran stand baru',
    format('%s mendaftar ke "%s".', v_bp.business_name, v_event.title),
    '/admin/pendaftaran/' || v_app_id);
  return v_app_id;
end;
$$;

-- ---------------------------------------------------------------------------
-- UMKM: resubmit after revision
-- ---------------------------------------------------------------------------
create or replace function public.resubmit_application(
  p_application_id uuid,
  p_products_offered text,
  p_note text default null,
  p_document_path text default null
) returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := public._require_active('umkm');
  v_app public.stand_applications;
begin
  select * into v_app from public.stand_applications
    where id = p_application_id and submitted_by = v_uid for update;
  if not found then
    raise exception 'Pendaftaran tidak ditemukan.' using errcode = '42501';
  end if;
  if v_app.status <> 'revision_required' then
    raise exception 'Pendaftaran ini tidak sedang menunggu revisi.';
  end if;
  if char_length(coalesce(trim(p_products_offered), '')) < 3 then
    raise exception 'Isi produk yang akan dijual.';
  end if;
  if p_document_path is not null and split_part(p_document_path, '/', 1) <> v_uid::text then
    raise exception 'Dokumen tidak valid.' using errcode = '42501';
  end if;

  update public.stand_applications set
    status = 'under_verification',
    products_offered = trim(p_products_offered),
    application_note = nullif(trim(coalesce(p_note, '')), ''),
    additional_document_path = coalesce(p_document_path, additional_document_path)
  where id = p_application_id;

  perform public._app_history(p_application_id, 'revision_required', 'under_verification', 'Revisi dikirim ulang');
  perform public._audit('application.resubmitted', 'stand_application', p_application_id,
    jsonb_build_object('status', 'revision_required'), jsonb_build_object('status', 'under_verification'), null);
  perform public._notify_admins('Revisi pendaftaran masuk',
    format('Pendaftaran %s telah diperbarui dan menunggu verifikasi.', v_app.application_code),
    '/admin/pendaftaran/' || p_application_id);
end;
$$;

-- ---------------------------------------------------------------------------
-- UMKM: withdraw
-- ---------------------------------------------------------------------------
create or replace function public.withdraw_application(p_application_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := public._require_active('umkm');
  v_app public.stand_applications;
begin
  select * into v_app from public.stand_applications
    where id = p_application_id and submitted_by = v_uid for update;
  if not found then
    raise exception 'Pendaftaran tidak ditemukan.' using errcode = '42501';
  end if;
  if v_app.status not in ('submitted', 'under_verification', 'revision_required', 'verified', 'waitlisted', 'selected_by_organizer') then
    raise exception 'Pendaftaran tidak dapat dibatalkan pada status ini.';
  end if;
  update public.stand_applications set status = 'withdrawn' where id = p_application_id;
  perform public._app_history(p_application_id, v_app.status, 'withdrawn', 'Dibatalkan oleh pemohon');
  perform public._audit('application.withdrawn', 'stand_application', p_application_id,
    jsonb_build_object('status', v_app.status), jsonb_build_object('status', 'withdrawn'), null);
end;
$$;

-- ---------------------------------------------------------------------------
-- Admin: verify documents of an application
-- ---------------------------------------------------------------------------
create or replace function public.admin_verify_application(p_application_id uuid, p_action text, p_note text default null)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := public._require_active('admin');
  v_app public.stand_applications;
  v_event public.events;
  v_org_user uuid;
  v_to public.application_status;
  v_note text := nullif(trim(coalesce(p_note, '')), '');
  v_title text;
begin
  select * into v_app from public.stand_applications where id = p_application_id for update;
  if not found then
    raise exception 'Pendaftaran tidak ditemukan.';
  end if;
  if v_app.status not in ('submitted', 'under_verification') then
    raise exception 'Pendaftaran ini tidak berada pada antrean verifikasi.';
  end if;
  select * into v_event from public.events where id = v_app.event_id;

  case p_action
    when 'verify' then v_to := 'verified'; v_title := 'Berkas terverifikasi';
    when 'revise' then v_to := 'revision_required'; v_note := public._require_note(v_note, 'revisi'); v_title := 'Pendaftaran perlu revisi';
    when 'reject' then v_to := 'rejected'; v_note := public._require_note(v_note, 'penolakan'); v_title := 'Pendaftaran ditolak';
    else raise exception 'Aksi tidak dikenal.';
  end case;

  update public.stand_applications set
    status = v_to,
    admin_note = coalesce(v_note, admin_note),
    verified_by = case when v_to = 'verified' then v_uid else verified_by end,
    verified_at = case when v_to = 'verified' then now() else verified_at end
  where id = p_application_id;

  perform public._app_history(p_application_id, v_app.status, v_to, v_note);
  perform public._audit('application.' || p_action, 'stand_application', p_application_id,
    jsonb_build_object('status', v_app.status), jsonb_build_object('status', v_to), v_note);
  perform public._notify(v_app.submitted_by, v_title,
    format('%s — "%s"%s', v_app.application_code, v_event.title, coalesce(': ' || v_note, '')),
    '/dashboard/umkm/pendaftaran/' || p_application_id);

  if v_to = 'verified' then
    select o.user_id into v_org_user from public.organizer_profiles o where o.id = v_event.organizer_id;
    perform public._notify(v_org_user, 'Peserta siap diseleksi',
      format('%s telah diverifikasi untuk "%s".', v_app.business_snapshot ->> 'business_name', v_event.title),
      '/dashboard/penyelenggara/events/' || v_event.id || '/peserta');
  end if;
end;
$$;

-- ---------------------------------------------------------------------------
-- Organizer: select / waitlist / reject verified applicant on own event
-- ---------------------------------------------------------------------------
create or replace function public.organizer_decide_application(p_application_id uuid, p_decision text, p_note text default null)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := public._require_active('organizer');
  v_app public.stand_applications;
  v_event public.events;
  v_to public.application_status;
  v_note text := nullif(trim(coalesce(p_note, '')), '');
  v_label text;
begin
  select * into v_app from public.stand_applications where id = p_application_id for update;
  if not found or not public.owns_event(v_app.event_id) then
    raise exception 'Pendaftaran tidak ditemukan.' using errcode = '42501';
  end if;
  if v_app.status not in ('verified', 'waitlisted', 'selected_by_organizer') then
    raise exception 'Hanya pendaftar yang telah diverifikasi Disperindag yang dapat diseleksi.';
  end if;
  select * into v_event from public.events where id = v_app.event_id;
  if v_event.status <> 'published' then
    raise exception 'Seleksi hanya dapat dilakukan pada event yang sedang terbit.';
  end if;

  case p_decision
    when 'select' then v_to := 'selected_by_organizer'; v_label := 'dipilih penyelenggara';
    when 'waitlist' then v_to := 'waitlisted'; v_label := 'masuk daftar tunggu';
    when 'reject' then v_to := 'rejected'; v_note := public._require_note(v_note, 'penolakan'); v_label := 'tidak terpilih';
    else raise exception 'Keputusan tidak dikenal.';
  end case;
  if v_to = v_app.status then
    raise exception 'Status pendaftar sudah sesuai keputusan tersebut.';
  end if;

  update public.stand_applications set
    status = v_to, organizer_note = v_note,
    organizer_decided_by = v_uid, organizer_decided_at = now()
  where id = p_application_id;

  perform public._app_history(p_application_id, v_app.status, v_to, v_note);
  perform public._audit('application.organizer_' || p_decision, 'stand_application', p_application_id,
    jsonb_build_object('status', v_app.status), jsonb_build_object('status', v_to), v_note);
  perform public._notify(v_app.submitted_by, 'Hasil seleksi penyelenggara',
    format('%s untuk "%s" %s.%s', v_app.application_code, v_event.title, v_label,
      case when v_to = 'selected_by_organizer' then ' Menunggu pengesahan & nomor stand dari Disperindag.' else '' end),
    '/dashboard/umkm/pendaftaran/' || p_application_id);
  if v_to = 'selected_by_organizer' then
    perform public._notify_admins('Hasil seleksi menunggu pengesahan',
      format('%s dipilih untuk "%s".', v_app.business_snapshot ->> 'business_name', v_event.title),
      '/admin/pendaftaran/' || p_application_id);
  end if;
end;
$$;

-- ---------------------------------------------------------------------------
-- Admin: finalize (confirm with unique stand number, atomic capacity) or reject
-- ---------------------------------------------------------------------------
create or replace function public.admin_finalize_application(
  p_application_id uuid, p_action text, p_stand_number text default null, p_note text default null
) returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := public._require_active('admin');
  v_app public.stand_applications;
  v_event public.events;
  v_confirmed int;
  v_stand text := upper(nullif(trim(coalesce(p_stand_number, '')), ''));
  v_note text := nullif(trim(coalesce(p_note, '')), '');
begin
  select * into v_app from public.stand_applications where id = p_application_id;
  if not found then
    raise exception 'Pendaftaran tidak ditemukan.';
  end if;
  -- Lock the event row first: serializes concurrent confirmations per event.
  select * into v_event from public.events where id = v_app.event_id for update;
  select * into v_app from public.stand_applications where id = p_application_id for update;

  if v_app.status not in ('selected_by_organizer', 'waitlisted') then
    raise exception 'Hanya peserta terpilih atau daftar tunggu yang dapat difinalisasi.';
  end if;

  if p_action = 'confirm' then
    if v_event.status <> 'published' then
      raise exception 'Event tidak dalam status terbit.';
    end if;
    if v_stand is null then
      raise exception 'Nomor stand wajib diisi.';
    end if;
    if v_stand !~ '^[A-Z0-9][A-Z0-9-]{0,15}$' then
      raise exception 'Format nomor stand tidak valid (contoh: A-01).';
    end if;
    select count(*) into v_confirmed from public.stand_applications
      where event_id = v_event.id and status = 'confirmed';
    if v_confirmed >= v_event.stand_capacity then
      raise exception 'Kapasitas stand sudah penuh (% dari %).', v_confirmed, v_event.stand_capacity;
    end if;
    if exists (select 1 from public.stand_applications
               where event_id = v_event.id and upper(stand_number) = v_stand and id <> p_application_id) then
      raise exception 'Nomor stand % sudah digunakan pada event ini.', v_stand;
    end if;

    update public.stand_applications set
      status = 'confirmed', stand_number = v_stand,
      confirmed_by = v_uid, confirmed_at = now(),
      admin_note = coalesce(v_note, admin_note)
    where id = p_application_id;

    perform public._app_history(p_application_id, v_app.status, 'confirmed', 'Nomor stand ' || v_stand);
    perform public._audit('application.confirmed', 'stand_application', p_application_id,
      jsonb_build_object('status', v_app.status), jsonb_build_object('status', 'confirmed', 'stand_number', v_stand), v_note);
    perform public._notify(v_app.submitted_by, 'Selamat! Stand Anda dikonfirmasi',
      format('%s untuk "%s" disahkan. Nomor stand: %s.', v_app.application_code, v_event.title, v_stand),
      '/dashboard/umkm/pendaftaran/' || p_application_id);
  elsif p_action = 'reject' then
    v_note := public._require_note(v_note, 'penolakan');
    update public.stand_applications set status = 'rejected', admin_note = v_note where id = p_application_id;
    perform public._app_history(p_application_id, v_app.status, 'rejected', v_note);
    perform public._audit('application.final_reject', 'stand_application', p_application_id,
      jsonb_build_object('status', v_app.status), jsonb_build_object('status', 'rejected'), v_note);
    perform public._notify(v_app.submitted_by, 'Hasil akhir pendaftaran',
      format('%s untuk "%s" tidak disahkan: %s', v_app.application_code, v_event.title, v_note),
      '/dashboard/umkm/pendaftaran/' || p_application_id);
  else
    raise exception 'Aksi tidak dikenal.';
  end if;
end;
$$;

-- ---------------------------------------------------------------------------
-- Admin: verify business / organizer profile
-- ---------------------------------------------------------------------------
create or replace function public.admin_review_profile(p_kind text, p_profile_id uuid, p_action text, p_note text default null)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := public._require_active('admin');
  v_to public.verification_status;
  v_note text := nullif(trim(coalesce(p_note, '')), '');
  v_owner uuid;
  v_old public.verification_status;
  v_name text;
  v_href text;
begin
  case p_action
    when 'verify' then v_to := 'verified';
    when 'revise' then v_to := 'revision_required'; v_note := public._require_note(v_note, 'revisi');
    when 'reject' then v_to := 'rejected'; v_note := public._require_note(v_note, 'penolakan');
    else raise exception 'Aksi tidak dikenal.';
  end case;

  if p_kind = 'business' then
    select user_id, verification_status, business_name into v_owner, v_old, v_name
      from public.business_profiles where id = p_profile_id for update;
    if not found then raise exception 'Profil tidak ditemukan.'; end if;
    update public.business_profiles set
      verification_status = v_to, verification_note = v_note,
      verified_at = case when v_to = 'verified' then now() else null end
    where id = p_profile_id;
    v_href := '/dashboard/umkm/profil';
  elsif p_kind = 'organizer' then
    select user_id, verification_status, organization_name into v_owner, v_old, v_name
      from public.organizer_profiles where id = p_profile_id for update;
    if not found then raise exception 'Profil tidak ditemukan.'; end if;
    update public.organizer_profiles set
      verification_status = v_to, verification_note = v_note,
      verified_at = case when v_to = 'verified' then now() else null end
    where id = p_profile_id;
    v_href := '/dashboard/penyelenggara/profil';
  else
    raise exception 'Jenis profil tidak dikenal.';
  end if;

  perform public._audit('profile.' || p_kind || '.' || p_action, p_kind || '_profile', p_profile_id,
    jsonb_build_object('verification_status', v_old), jsonb_build_object('verification_status', v_to), v_note);
  perform public._notify(v_owner,
    case v_to when 'verified' then 'Profil terverifikasi'
              when 'revision_required' then 'Profil perlu revisi'
              else 'Profil ditolak' end,
    format('%s%s', v_name, coalesce(': ' || v_note, ' telah diverifikasi Disperindag.')),
    v_href);
end;
$$;

-- ---------------------------------------------------------------------------
-- Admin: suspend / reactivate non-admin accounts
-- ---------------------------------------------------------------------------
create or replace function public.admin_set_account_status(p_user_id uuid, p_status public.account_status, p_note text default null)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := public._require_active('admin');
  v_target public.profiles;
begin
  if p_user_id = v_uid then
    raise exception 'Tidak dapat mengubah status akun sendiri.';
  end if;
  select * into v_target from public.profiles where id = p_user_id for update;
  if not found then raise exception 'Pengguna tidak ditemukan.'; end if;
  if v_target.role = 'admin' then
    raise exception 'Status akun admin dikelola melalui provisioning.';
  end if;
  update public.profiles set account_status = p_status where id = p_user_id;
  perform public._audit(case when p_status = 'suspended' then 'user.suspended' else 'user.reactivated' end,
    'profile', p_user_id,
    jsonb_build_object('account_status', v_target.account_status), jsonb_build_object('account_status', p_status),
    nullif(trim(coalesce(p_note, '')), ''));
end;
$$;

-- ---------------------------------------------------------------------------
-- Read helpers
-- ---------------------------------------------------------------------------
create or replace function public.get_public_stats()
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'events_published', (select count(*) from public.events where status in ('published', 'completed')),
    'umkm_public', (select count(*) from public.public_business_profiles),
    'stands_confirmed', (select count(*) from public.stand_applications a
                           join public.events e on e.id = a.event_id
                           where a.status = 'confirmed' and e.status in ('published', 'completed')),
    'organizers_verified', (select count(*) from public.organizer_profiles where verification_status = 'verified')
  );
$$;

create or replace function public.get_event_application_counts(p_event_id uuid)
returns table (status public.application_status, total bigint)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not (public.is_admin() or public.owns_event(p_event_id)) then
    raise exception 'Akses ditolak.' using errcode = '42501';
  end if;
  return query
    select a.status, count(*) from public.stand_applications a
    where a.event_id = p_event_id group by a.status;
end;
$$;

create or replace function public.admin_dashboard_stats()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'Akses ditolak.' using errcode = '42501';
  end if;
  return jsonb_build_object(
    'umkm_total', (select count(*) from public.business_profiles),
    'umkm_verified', (select count(*) from public.business_profiles where verification_status = 'verified'),
    'umkm_pending', (select count(*) from public.business_profiles where verification_status = 'pending'),
    'organizers_total', (select count(*) from public.organizer_profiles),
    'organizers_pending', (select count(*) from public.organizer_profiles where verification_status = 'pending'),
    'events_pending', (select count(*) from public.events where status = 'pending_review'),
    'events_published', (select count(*) from public.events where status = 'published'),
    'events_completed', (select count(*) from public.events where status = 'completed'),
    'applications_by_status', coalesce((select jsonb_object_agg(s, c) from (
        select status::text s, count(*) c from public.stand_applications group by status) t), '{}'::jsonb),
    'applications_to_verify', (select count(*) from public.stand_applications where status in ('submitted', 'under_verification')),
    'applications_to_confirm', (select count(*) from public.stand_applications where status = 'selected_by_organizer')
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- Grants
-- ---------------------------------------------------------------------------
revoke execute on function public._audit(text, text, uuid, jsonb, jsonb, text) from public, anon, authenticated;
revoke execute on function public._notify(uuid, text, text, text) from public, anon, authenticated;
revoke execute on function public._notify_admins(text, text, text) from public, anon, authenticated;
revoke execute on function public._app_history(uuid, public.application_status, public.application_status, text) from public, anon, authenticated;
revoke execute on function public._require_active(public.user_role) from public, anon, authenticated;
revoke execute on function public._require_note(text, text) from public, anon, authenticated;

revoke execute on function public.submit_event(uuid) from public, anon;
revoke execute on function public.admin_review_event(uuid, text, text) from public, anon;
revoke execute on function public.submit_application(uuid, text, text, text) from public, anon;
revoke execute on function public.resubmit_application(uuid, text, text, text) from public, anon;
revoke execute on function public.withdraw_application(uuid) from public, anon;
revoke execute on function public.admin_verify_application(uuid, text, text) from public, anon;
revoke execute on function public.organizer_decide_application(uuid, text, text) from public, anon;
revoke execute on function public.admin_finalize_application(uuid, text, text, text) from public, anon;
revoke execute on function public.admin_review_profile(text, uuid, text, text) from public, anon;
revoke execute on function public.admin_set_account_status(uuid, public.account_status, text) from public, anon;
revoke execute on function public.get_event_application_counts(uuid) from public, anon;
revoke execute on function public.admin_dashboard_stats() from public, anon;

grant execute on function public.submit_event(uuid) to authenticated;
grant execute on function public.admin_review_event(uuid, text, text) to authenticated;
grant execute on function public.submit_application(uuid, text, text, text) to authenticated;
grant execute on function public.resubmit_application(uuid, text, text, text) to authenticated;
grant execute on function public.withdraw_application(uuid) to authenticated;
grant execute on function public.admin_verify_application(uuid, text, text) to authenticated;
grant execute on function public.organizer_decide_application(uuid, text, text) to authenticated;
grant execute on function public.admin_finalize_application(uuid, text, text, text) to authenticated;
grant execute on function public.admin_review_profile(text, uuid, text, text) to authenticated;
grant execute on function public.admin_set_account_status(uuid, public.account_status, text) to authenticated;
grant execute on function public.get_event_application_counts(uuid) to authenticated;
grant execute on function public.admin_dashboard_stats() to authenticated;
grant execute on function public.get_public_stats() to anon, authenticated;
