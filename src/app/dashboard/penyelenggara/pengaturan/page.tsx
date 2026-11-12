import type { Metadata } from "next";
import { requireRole } from "@/lib/auth";
import { PageHeader } from "@/components/ui/misc";
import { AccountForm } from "@/components/forms/account-form";
import { ROLE_LABEL } from "@/lib/constants";

export const metadata: Metadata = { title: "Pengaturan Akun" };

export default async function Page() {
  const { profile } = await requireRole("organizer");
  return (
    <>
      <PageHeader eyebrow="Pengaturan" title="Akun Anda" />
      <AccountForm fullName={profile.full_name} phone={profile.phone} email={profile.email ?? ""} roleLabel={ROLE_LABEL[profile.role]} />
    </>
  );
}
