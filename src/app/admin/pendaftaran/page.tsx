import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { APPLICATION_STATUS, type ApplicationStatus } from "@/lib/constants";
import { formatShortDate } from "@/lib/format";
import { DataTable, EmptyState, PageHeader, StatusBadge } from "@/components/ui/misc";
import { StatusTabs } from "@/components/status-tabs";

export const metadata = { title: "Semua Pendaftaran" };

type Snap = { business_name?: string; category?: string };

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const { supabase } = await requireRole("admin");
  let q = supabase.from("stand_applications").select("id, application_code, status, stand_number, submitted_at, business_snapshot, events(id, title)").order("submitted_at", { ascending: false }).limit(200);
  const statuses = Object.keys(APPLICATION_STATUS) as ApplicationStatus[];
  const active = sp.status === "queue" ? "queue" : statuses.find((s) => s === sp.status) ?? "all";
  if (active === "queue") q = q.in("status", ["submitted", "under_verification"]);
  else if (active !== "all") q = q.eq("status", active);
  if (sp.event && /^[0-9a-f-]{36}$/i.test(sp.event)) q = q.eq("event_id", sp.event);
  const { data } = await q;
  const tabs = [
    { key: "all", label: "Semua" },
    { key: "queue", label: "Perlu verifikasi" },
    { key: "selected_by_organizer", label: "Menunggu pengesahan" },
    { key: "verified", label: "Terverifikasi" },
    { key: "waitlisted", label: "Daftar tunggu" },
    { key: "revision_required", label: "Revisi" },
    { key: "confirmed", label: "Dikonfirmasi" },
    { key: "rejected", label: "Ditolak" },
  ];
  return (
    <>
      <PageHeader eyebrow="Pendaftaran" title="Pendaftaran stand" description="Verifikasi berkas, pantau seleksi, dan sahkan hasil akhir." />
      <StatusTabs tabs={tabs} active={active} basePath="/admin/pendaftaran" extra={{ event: sp.event }} />
      {data?.length ? (
        <DataTable head={["Kode", "Usaha", "Event", "Dikirim", "Status"]}>
          {data.map((a) => (
            <tr key={a.id} className="hover:bg-white">
              <td className="px-4 py-3 font-mono text-xs"><Link href={`/admin/pendaftaran/${a.id}`} className="hover:text-emerald">{a.application_code}</Link></td>
              <td className="px-4 py-3"><Link href={`/admin/pendaftaran/${a.id}`} className="font-semibold hover:text-emerald">{(a.business_snapshot as Snap)?.business_name}</Link><p className="text-xs text-muted">{(a.business_snapshot as Snap)?.category}</p></td>
              <td className="px-4 py-3 text-muted">{a.events?.title}</td>
              <td className="px-4 py-3 text-muted">{formatShortDate(a.submitted_at)}</td>
              <td className="px-4 py-3"><div className="flex items-center gap-2"><StatusBadge map={APPLICATION_STATUS} status={a.status} />{a.stand_number && <span className="text-xs font-semibold">#{a.stand_number}</span>}</div></td>
            </tr>
          ))}
        </DataTable>
      ) : <EmptyState title="Tidak ada pendaftaran" />}
    </>
  );
}
