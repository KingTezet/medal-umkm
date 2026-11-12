-- Notify admins when a new organizer or UMKM registers, so verification queues are visible.
create or replace function public.notify_admins_on_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_table_name = 'organizer_profiles' then
    perform public._notify_admins('Penyelenggara baru menunggu verifikasi',
      format('%s mendaftar sebagai penyelenggara event.', new.organization_name),
      '/admin/penyelenggara/' || new.id);
  else
    perform public._notify_admins('UMKM baru terdaftar',
      format('%s mendaftar sebagai pelaku UMKM.', new.business_name),
      '/admin/umkm/' || new.id);
  end if;
  return new;
end;
$$;
revoke execute on function public.notify_admins_on_profile() from public, anon, authenticated;

create trigger organizer_profiles_notify_admins after insert on public.organizer_profiles
  for each row execute function public.notify_admins_on_profile();
create trigger business_profiles_notify_admins after insert on public.business_profiles
  for each row execute function public.notify_admins_on_profile();
