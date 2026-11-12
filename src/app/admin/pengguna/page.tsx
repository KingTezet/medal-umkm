import { requireRole } from "@/lib/auth";
import { ACCOUNT_STATUS, ROLE_LABEL, type UserRole } from "@/lib/constants";
import { formatShortDate } from "@/lib/format";
import { sanitizeSearch } from "@/lib/queries";
import { DataTable, EmptyState, PageHeader, StatusBadge } from "@/components/ui/misc";
import { SearchBox, StatusTabs } from "@/components/status-tabs";
import { ActionDialog } from "@/components/action-form";
import { setAccountStatusAction } from "@/app/actions/admin";

export const metadata = { title: "Pengguna" };

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const { supabase, user } = await requireRole("admin");
  const role = (["umkm", "organizer", "admin"] as UserRole[]).find((r) => r === sp.status);
  let q = supabase.from("profiles").select("id, full_name, email, role, account_status, created_at").order("created_at", { ascending: false }).limit(200);
  if (role) q = q.eq("role", role);
  const term = sp.q ? sanitizeSearch(sp.q) : "";
  if (term) q = q.or(`full_name.ilike.%${term}%,email.ilike.%${term}%`);
  const { data } = await q;
  return (
    <>
      <PageHeader eyebrow="Pengguna" title="Manajemen pengguna" description="Tangguhkan atau aktifkan kembali akun non-admin. Promosi admin hanya melalui provisioning aman, bukan dari UI." />
      <StatusTabs tabs={[{ key: "all", label: "Semua" }, { key: "umkm", label: "UMKM" }, { key: "organizer", label: "Penyelenggara" }, { key: "admin", label: "Admin" }]} active={role ?? "all"} basePath="/admin/pengguna" extra={{ q: sp.q }} />
      <SearchBox defaultValue={sp.q} placeholder="Cari nama atau email…" hidden={{ status: role }} />
      {data?.length ? (
        <DataTable head={["Pengguna", "Peran", "Bergabung", "Status", ""]}>
          {data.map((p) => (
            <tr key={p.id}>
              <td className="px-4 py-3"><p className="font-semibold">{p.full_name || "-"}</p><p className="text-xs text-muted">{p.email}</p></td>
              <td className="px-4 py-3 text-muted">{ROLE_LABEL[p.role]}</td>
              <td className="px-4 py-3 text-muted">{formatShortDate(p.created_at)}</td>
              <td className="px-4 py-3"><StatusBadge map={ACCOUNT_STATUS} status={p.account_status} /></td>
              <td className="px-4 py-3 text-right">
                {p.role !== "admin" && p.id !== user.id && (p.account_status === "suspended" ? (
                  <ActionDialog action={setAccountStatusAction} hidden={{ user_id: p.id, status: "active" }} trigger="Aktifkan" triggerVariant="outline" title="Aktifkan kembali akun?" confirmLabel="Aktifkan" noteLabel="Catatan (opsional)" />
                ) : (
                  <ActionDialog action={setAccountStatusAction} hidden={{ user_id: p.id, status: "suspended" }} trigger="Tangguhkan" triggerVariant="danger-outline" title="Tangguhkan akun?" description="Pengguna tidak dapat masuk atau melakukan tindakan sampai diaktifkan kembali." confirmLabel="Tangguhkan" confirmVariant="danger" noteLabel="Alasan" noteRequired />
                ))}
              </td>
            </tr>
          ))}
        </DataTable>
      ) : <EmptyState title="Tidak ada pengguna" />}
    </>
  );
}
