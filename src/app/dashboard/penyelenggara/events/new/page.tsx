import type { Metadata } from "next";
import { requireRole } from "@/lib/auth";
import { getCategories } from "@/lib/queries";
import { Breadcrumb, PageHeader } from "@/components/ui/misc";
import { EventForm } from "@/components/forms/organizer-forms";

export const metadata: Metadata = { title: "Ajukan Event" };

export default async function Page() {
  const { supabase, user } = await requireRole("organizer");
  const [{ data: org }, categories] = await Promise.all([
    supabase.from("organizer_profiles").select("verification_status").eq("user_id", user.id).maybeSingle(),
    getCategories("event"),
  ]);
  return (
    <>
      <Breadcrumb items={[{ label: "Event saya", href: "/dashboard/penyelenggara/events" }, { label: "Ajukan event" }]} />
      <PageHeader eyebrow="Pengajuan event" title="Ajukan event baru" description="Simpan sebagai draft kapan saja. Event tampil publik setelah disetujui Disperindag." />
      <EventForm categories={categories} userId={user.id} canSubmit={org?.verification_status === "verified"} />
    </>
  );
}
