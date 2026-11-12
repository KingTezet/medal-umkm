import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, CalendarPlus, ClipboardCheck, UsersRound } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { EVENT_STATUS, VERIFICATION_STATUS } from "@/lib/constants";
import { formatDateRange } from "@/lib/format";
import { Card, EmptyState, Notice, PageHeader, StatCard, StatusBadge } from "@/components/ui/misc";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = { title: "Ringkasan Penyelenggara" };

export default async function OrganizerHome() {
  const { supabase, user, profile } = await requireRole("organizer");
  const { data: org } = await supabase.from("organizer_profiles").select("*").eq("user_id", user.id).maybeSingle();
  const { data: events } = await supabase.from("events").select("id, title, status, starts_at, ends_at, stand_capacity").order("starts_at", { ascending: true });
  const ids = (events ?? []).map((e) => e.id);
  const { data: apps } = ids.length ? await supabase.from("stand_applications").select("event_id, status").in("event_id", ids) : { data: [] };
  const list = events ?? [];
  const toSelect = (apps ?? []).filter((a) => a.status === "verified").length;
  const confirmed = (apps ?? []).filter((a) => a.status === "confirmed").length;
  const upcoming = list.filter((e) => e.status === "published" && new Date(e.ends_at) > new Date());

  return (
    <>
      <PageHeader eyebrow="Dashboard penyelenggara" title={org?.organization_name ?? profile.full_name} action={<ButtonLink href="/dashboard/penyelenggara/events/new"><CalendarPlus className="size-4" /> Ajukan event</ButtonLink>} />
      {org && org.verification_status !== "verified" && (
        <div className="mb-6">
          <Notice tone={org.verification_status === "rejected" ? "danger" : "warning"} title={`Profil organisasi: ${VERIFICATION_STATUS[org.verification_status].label}`}>
            {org.verification_note ?? "Lengkapi profil dan unggah dokumen legal. Pengajuan event aktif setelah profil diverifikasi Disperindag."}{" "}
            <Link className="font-semibold underline" href="/dashboard/penyelenggara/profil">Buka profil</Link>
          </Notice>
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard accent label="Total event" value={list.length} icon={<CalendarDays className="size-5" />} />
        <StatCard label="Siap diseleksi" value={toSelect} hint="Pendaftar terverifikasi Disperindag" icon={<ClipboardCheck className="size-5" />} />
        <StatCard label="Peserta dikonfirmasi" value={confirmed} icon={<UsersRound className="size-5" />} />
      </div>
      <Card className="mt-8">
        <h2 className="font-display text-2xl">Agenda mendatang</h2>
        {upcoming.length ? (
          <ul className="mt-4 divide-y divide-line">
            {upcoming.map((e) => (
              <li key={e.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Link href={`/dashboard/penyelenggara/events/${e.id}`} className="font-semibold hover:text-emerald">{e.title}</Link>
                  <p className="text-xs text-muted">{formatDateRange(e.starts_at, e.ends_at)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge map={EVENT_STATUS} status={e.status} />
                  <ButtonLink href={`/dashboard/penyelenggara/events/${e.id}/peserta`} variant="outline" size="sm">Peserta</ButtonLink>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-4"><EmptyState title="Belum ada event terbit" description="Ajukan event Anda untuk ditinjau Disperindag." action={<ButtonLink href="/dashboard/penyelenggara/events/new">Ajukan event</ButtonLink>} /></div>
        )}
      </Card>
    </>
  );
}
