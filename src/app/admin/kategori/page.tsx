import { requireRole } from "@/lib/auth";
import { Card, DataTable, PageHeader, Badge } from "@/components/ui/misc";
import { CategoryForm } from "@/components/forms/admin-forms";
import { InlineAction } from "@/components/action-form";
import { toggleCategoryAction } from "@/app/actions/admin";

export const metadata = { title: "Kategori" };

export default async function Page() {
  const { supabase } = await requireRole("admin");
  const { data } = await supabase.from("event_categories").select("*").order("kind").order("sort_order").order("name");
  return (
    <>
      <PageHeader eyebrow="Kategori" title="Kategori event & UMKM" description="Kategori nonaktif tidak muncul di formulir dan filter publik." />
      <Card className="mb-6"><CategoryForm /></Card>
      <DataTable head={["Nama", "Jenis", "Urutan", "Status", ""]}>
        {(data ?? []).map((c) => (
          <tr key={c.id}>
            <td className="px-4 py-3 font-semibold">{c.name}</td>
            <td className="px-4 py-3 text-muted">{c.kind === "event" ? "Event" : "UMKM"}</td>
            <td className="px-4 py-3 text-muted">{c.sort_order}</td>
            <td className="px-4 py-3"><Badge tone={c.is_active ? "success" : "neutral"}>{c.is_active ? "Aktif" : "Nonaktif"}</Badge></td>
            <td className="px-4 py-3 text-right"><InlineAction action={toggleCategoryAction} hidden={{ id: c.id, active: String(!c.is_active) }} variant="ghost">{c.is_active ? "Nonaktifkan" : "Aktifkan"}</InlineAction></td>
          </tr>
        ))}
      </DataTable>
    </>
  );
}
