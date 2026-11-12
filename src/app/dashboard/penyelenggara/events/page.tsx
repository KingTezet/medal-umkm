import type { Metadata } from "next";
import Link from "next/link";
import { CalendarPlus } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { EVENT_STATUS } from "@/lib/constants";
import { formatDateRange } from "@/lib/format";
import { DataTable, EmptyState, Notice, PageHeader, StatusBadge } from "@/components/ui/misc";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = { title: "Event Saya" };

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const { supabase } = await requireRole("organizer");
  const { data } = await supabase.from("events").select("id, title, status, starts_at, ends_at, stand_capacity, category, updated_at").order("updated_at", { ascending: false });
  const list = data ?? [];
  return (
    <>
      <PageHeader eyebrow="Event saya" title="Kelola event" action={<ButtonLink href="/dashboard/penyelenggara/events/new"><CalendarPlus className="size-4" /> Ajukan event baru</ButtonLink>} />
      {sp.deleted && <div className="mb-4"><Notice tone="success">Draft event dihapus.</Notice></div>}
      {list.length ? (
        <DataTable head={["Event", "Jadwal", "Kapasitas", "Status", ""]}>
          {list.map((e) => (
            <tr key={e.id} className="hover:bg-white">
              <td className="px-4 py-3"><Link href={`/dashboard/penyelenggara/events/${e.id}`} className="font-semibold hover:text-emerald">{e.title}</Link><p className="text-xs text-muted">{e.category}</p></td>
              <td className="px-4 py-3 text-muted">{formatDateRange(e.starts_at, e.ends_at)}</td>
              <td className="px-4 py-3">{e.stand_capacity}</td>
              <td className="px-4 py-3"><StatusBadge map={EVENT_STATUS} status={e.status} /></td>
              <td className="px-4 py-3 text-right">
                {["published", "completed"].includes(e.status) ? (
                  <ButtonLink href={`/dashboard/penyelenggara/events/${e.id}/peserta`} variant="outline" size="sm">Peserta</ButtonLink>
                ) : (
                  <ButtonLink href={`/dashboard/penyelenggara/events/${e.id}`} variant="ghost" size="sm">Buka</ButtonLink>
                )}
              </td>
            </tr>
          ))}
        </DataTable>
      ) : (
        <EmptyState title="Belum ada event" description="Buat draft event, unggah proposal, lalu ajukan ke Disperindag." action={<ButtonLink href="/dashboard/penyelenggara/events/new">Ajukan event</ButtonLink>} />
      )}
    </>
  );
}
