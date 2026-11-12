import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { VERIFICATION_STATUS, type VerificationStatus } from "@/lib/constants";
import { formatShortDate } from "@/lib/format";
import { sanitizeSearch } from "@/lib/queries";
import { DataTable, EmptyState, PageHeader, StatusBadge } from "@/components/ui/misc";
import { SearchBox, StatusTabs } from "@/components/status-tabs";

export const metadata = { title: "Data UMKM" };

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const { supabase } = await requireRole("admin");
  const status = (Object.keys(VERIFICATION_STATUS) as VerificationStatus[]).find((s) => s === sp.status);
  let q = supabase.from("business_profiles").select("id, business_name, category, district, verification_status, is_public, created_at, nib, business_license_path").order("created_at", { ascending: false }).limit(200);
  if (status) q = q.eq("verification_status", status);
  const term = sp.q ? sanitizeSearch(sp.q) : "";
  if (term) q = q.ilike("business_name", `%${term}%`);
  const { data } = await q;
  return (
    <>
      <PageHeader eyebrow="UMKM" title="Data UMKM" description="Direktori internal, termasuk profil yang belum dipublikasikan." />
      <StatusTabs tabs={[{ key: "all", label: "Semua" }, ...(Object.keys(VERIFICATION_STATUS) as VerificationStatus[]).map((k) => ({ key: k, label: VERIFICATION_STATUS[k].label }))]} active={status ?? "all"} basePath="/admin/umkm" extra={{ q: sp.q }} />
      <SearchBox defaultValue={sp.q} placeholder="Cari nama usaha…" hidden={{ status }} />
      {data?.length ? (
        <DataTable head={["Usaha", "Kecamatan", "Dokumen", "Publik", "Status"]}>
          {data.map((b) => (
            <tr key={b.id} className="hover:bg-ivory/60">
              <td className="px-4 py-3"><Link href={`/admin/umkm/${b.id}`} className="font-semibold hover:text-emerald">{b.business_name}</Link><p className="text-xs text-muted">{b.category} · {formatShortDate(b.created_at)}</p></td>
              <td className="px-4 py-3 text-muted">{b.district || "-"}</td>
              <td className="px-4 py-3 text-muted">{b.nib || b.business_license_path ? "Lengkap" : "Belum"}</td>
              <td className="px-4 py-3 text-muted">{b.is_public ? "Ya" : "Tidak"}</td>
              <td className="px-4 py-3"><StatusBadge map={VERIFICATION_STATUS} status={b.verification_status} /></td>
            </tr>
          ))}
        </DataTable>
      ) : <EmptyState title="Tidak ada data UMKM" />}
    </>
  );
}
