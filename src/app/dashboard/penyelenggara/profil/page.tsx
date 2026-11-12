import type { Metadata } from "next";
import { requireRole } from "@/lib/auth";
import { VERIFICATION_STATUS } from "@/lib/constants";
import { Notice, PageHeader, StatusBadge } from "@/components/ui/misc";
import { OrganizerProfileForm } from "@/components/forms/organizer-forms";

export const metadata: Metadata = { title: "Profil Organisasi" };

export default async function Page() {
  const { supabase, user } = await requireRole("organizer");
  const { data: org } = await supabase.from("organizer_profiles").select("*").eq("user_id", user.id).maybeSingle();
  if (!org) return <Notice tone="danger">Profil organisasi tidak ditemukan.</Notice>;
  return (
    <>
      <PageHeader eyebrow="Profil organisasi" title={org.organization_name} action={<StatusBadge map={VERIFICATION_STATUS} status={org.verification_status} />} />
      {org.verification_note && org.verification_status !== "verified" && <div className="mb-6"><Notice tone="warning" title="Catatan Disperindag">{org.verification_note}</Notice></div>}
      <OrganizerProfileForm profile={org} userId={user.id} />
    </>
  );
}
