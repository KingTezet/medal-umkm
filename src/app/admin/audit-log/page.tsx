import { requireRole } from "@/lib/auth";
import { formatDateTime } from "@/lib/format";
import { DataTable, EmptyState, PageHeader } from "@/components/ui/misc";
import { Pagination } from "@/components/pagination";

export const metadata = { title: "Audit Log" };

const PAGE = 50;

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? 1) || 1);
  const { supabase } = await requireRole("admin");
  const { data, count } = await supabase
    .from("audit_logs")
    .select("id, action, entity_type, entity_id, old_values, new_values, note, created_at, profiles(full_name, role)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * PAGE, page * PAGE - 1);
  return (
    <>
      <PageHeader eyebrow="Audit" title="Audit log" description="Riwayat keputusan penting: aktor, waktu, status sebelum/sesudah, dan catatan. Hanya dapat dibaca admin." />
      {data?.length ? (
        <DataTable head={["Waktu", "Aktor", "Aksi", "Perubahan", "Catatan"]}>
          {data.map((l) => (
            <tr key={l.id} className="align-top">
              <td className="whitespace-nowrap px-4 py-3 text-xs text-muted">{formatDateTime(l.created_at)}</td>
              <td className="px-4 py-3"><p className="font-semibold">{l.profiles?.full_name ?? "Sistem"}</p><p className="text-xs text-muted">{l.profiles?.role ?? ""}</p></td>
              <td className="px-4 py-3"><code className="rounded bg-sage px-1.5 py-0.5 text-xs">{l.action}</code><p className="mt-1 text-xs text-muted">{l.entity_type} · {l.entity_id?.slice(0, 8)}</p></td>
              <td className="px-4 py-3 font-mono text-xs text-muted">{JSON.stringify(l.old_values ?? {})} → {JSON.stringify(l.new_values ?? {})}</td>
              <td className="px-4 py-3 text-sm">{l.note ?? "-"}</td>
            </tr>
          ))}
        </DataTable>
      ) : <EmptyState title="Belum ada aktivitas" />}
      <Pagination page={page} total={count ?? 0} pageSize={PAGE} basePath="/admin/audit-log" params={{}} />
    </>
  );
}
