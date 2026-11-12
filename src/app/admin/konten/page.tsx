import { requireRole } from "@/lib/auth";
import { getPublicSettings } from "@/lib/queries";
import { PageHeader } from "@/components/ui/misc";
import { ContentForm } from "@/components/forms/admin-forms";

export const metadata = { title: "Konten Publik" };

export default async function Page() {
  await requireRole("admin");
  const settings = await getPublicSettings();
  return (
    <>
      <PageHeader eyebrow="Konten" title="Konten publik" description="Teks hero beranda dan pengumuman singkat." />
      <ContentForm settings={settings} />
    </>
  );
}
