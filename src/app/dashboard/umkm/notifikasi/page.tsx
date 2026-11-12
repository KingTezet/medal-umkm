import type { Metadata } from "next";
import { requireRole } from "@/lib/auth";
import { PageHeader } from "@/components/ui/misc";
import { NotificationsView } from "@/components/dashboard/shared";

export const metadata: Metadata = { title: "Notifikasi" };

export default async function Page() {
  const { supabase, user } = await requireRole("umkm");
  return (
    <>
      <PageHeader eyebrow="Notifikasi" title="Pemberitahuan" />
      <NotificationsView supabase={supabase} userId={user.id} />
    </>
  );
}
