import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { ORGANIZATION_TYPES, VERIFICATION_STATUS, type VerificationStatus } from "@/lib/constants";
import { formatShortDate } from "@/lib/format";
import { DataTable, EmptyState, PageHeader, StatusBadge } from "@/components/ui/misc";
import { StatusTabs } from "@/components/status-tabs";

export const metadata = { title: "Data Penyelenggara" };

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const { supabase } = await requireRole("admin");
  const status = (Object.keys(VERIFICATION_STATUS) as VerificationStatus[]).find((s) => s === sp.status);
  let q = supabase.from("organizer_profiles").select("id, organization_name, organization_type, verification_status, created_at, legal_document_path").order("created_at", { ascending: false }).limit(200);
  if (status) q = q.eq("verification_status", status);
  const { data } = await q;
  return (
    <>
      <PageHeader eyebrow="Penyelenggara" title="Data penyelenggara" />
      <StatusTabs tabs={[{ key: "all", label: "Semua" }, ...(Object.keys(VERIFICATION_STATUS) as VerificationStatus[]).map((k) => ({ key: k, label: VERIFICATION_STATUS[k].label }))]} active={status ?? "all"} basePath="/admin/penyelenggara" />
      {data?.length ? (
        <DataTable head={["Organisasi", "Jenis", "Dokumen", "Status"]}>
          {data.map((o) => (
            <tr key={o.id} className="hover:bg-ivory/60">
              <td className="px-4 py-3"><Link href={`/admin/penyelenggara/${o.id}`} className="font-semibold hover:text-emerald">{o.organization_name}</Link><p className="text-xs text-muted">{formatShortDate(o.created_at)}</p></td>
              <td className="px-4 py-3 text-muted">{ORGANIZATION_TYPES[o.organization_type]}</td>
              <td className="px-4 py-3 text-muted">{o.legal_document_path ? "Ada" : "Belum"}</td>
              <td className="px-4 py-3"><StatusBadge map={VERIFICATION_STATUS} status={o.verification_status} /></td>
            </tr>
          ))}
        </DataTable>
      ) : <EmptyState title="Tidak ada penyelenggara" />}
    </>
  );
}
