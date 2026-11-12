import { requireRole } from "@/lib/auth";
import { getPublicSettings } from "@/lib/queries";
import { PageHeader } from "@/components/ui/misc";
import { ContactForm } from "@/components/forms/admin-forms";

export const metadata = { title: "Pengaturan" };

export default async function Page() {
  await requireRole("admin");
  const { contact } = await getPublicSettings();
  return (
    <>
      <PageHeader eyebrow="Pengaturan" title="Identitas & kontak Disperindag" description="Ditampilkan di footer dan halaman Tentang. Jangan simpan data rahasia di sini." />
      <ContactForm contact={contact} />
    </>
  );
}
