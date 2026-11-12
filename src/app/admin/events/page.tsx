import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { EVENT_STATUS, type EventStatus } from "@/lib/constants";
import { formatDateRange } from "@/lib/format";
import { sanitizeSearch } from "@/lib/queries";
import { DataTable, EmptyState, PageHeader, StatusBadge } from "@/components/ui/misc";
import { SearchBox, StatusTabs } from "@/components/status-tabs";

export const metadata = { title: "Manajemen Event" };

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const { supabase } = await requireRole("admin");
  const status = (Object.keys(EVENT_STATUS) as EventStatus[]).find((s) => s === sp.status);
  let q = supabase.from("events").select("id, title, status, starts_at, ends_at, stand_capacity, updated_at, organizer_profiles(organization_name)").order("updated_at", { ascending: false }).limit(100);
  if (status) q = q.eq("status", status);
  const term = sp.q ? sanitizeSearch(sp.q) : "";
  if (term) q = q.ilike("title", `%${term}%`);
  const { data } = await q;
  const tabs = [{ key: "all", label: "Semua" }, ...(["pending_review", "published", "revision_required", "draft", "rejected", "cancelled", "completed"] as EventStatus[]).map((k) => ({ key: k, label: EVENT_STATUS[k].label }))];
  return (
    <>
      <PageHeader eyebrow="Event" title="Manajemen event" />
      <StatusTabs tabs={tabs} active={status ?? "all"} basePath="/admin/events" extra={{ q: sp.q }} />
      <SearchBox defaultValue={sp.q} placeholder="Cari judul event…" hidden={{ status }} />
      {data?.length ? (
        <DataTable head={["Event", "Penyelenggara", "Jadwal", "Status"]}>
          {data.map((e) => (
            <tr key={e.id} className="hover:bg-ivory/60">
              <td className="px-4 py-3"><Link href={`/admin/events/${e.id}`} className="font-semibold hover:text-emerald">{e.title}</Link></td>
              <td className="px-4 py-3 text-muted">{e.organizer_profiles?.organization_name}</td>
              <td className="px-4 py-3 text-muted">{formatDateRange(e.starts_at, e.ends_at)}</td>
              <td className="px-4 py-3"><StatusBadge map={EVENT_STATUS} status={e.status} /></td>
            </tr>
          ))}
        </DataTable>
      ) : <EmptyState title="Tidak ada event" />}
    </>
  );
}
