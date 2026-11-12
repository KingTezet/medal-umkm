-- Applicants may read the events they applied to (title/schedule on their dashboard),
-- even after an event is completed or cancelled. Proposal files stay private via storage RLS.
create or replace function public.has_application_for_event(p_event_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.stand_applications a
    where a.event_id = p_event_id and a.submitted_by = auth.uid()
  );
$$;
revoke execute on function public.has_application_for_event(uuid) from public, anon;
grant execute on function public.has_application_for_event(uuid) to authenticated;

create policy events_select_applicant on public.events
  for select to authenticated
  using (public.has_application_for_event(id));
