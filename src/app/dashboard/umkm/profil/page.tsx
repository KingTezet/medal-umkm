import type { Metadata } from "next";
import { requireRole } from "@/lib/auth";
import { getCategories } from "@/lib/queries";
import { asProducts, asStringArray } from "@/lib/storage";
import { VERIFICATION_STATUS } from "@/lib/constants";
import { Notice, PageHeader, StatusBadge } from "@/components/ui/misc";
import { BusinessProfileForm } from "@/components/forms/business-profile-form";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = { title: "Profil Usaha" };

export default async function BusinessProfilePage() {
  const { supabase, user } = await requireRole("umkm");
  const [{ data: bp }, categories] = await Promise.all([
    supabase.from("business_profiles").select("*").eq("user_id", user.id).maybeSingle(),
    getCategories("umkm"),
  ]);
  if (!bp) return <Notice tone="danger">Profil usaha tidak ditemukan. Hubungi admin.</Notice>;
  return (
    <>
      <PageHeader
        eyebrow="Profil usaha"
        title={bp.business_name}
        description="Data ini dipakai ulang setiap kali Anda mendaftar event."
        action={<>
          <StatusBadge map={VERIFICATION_STATUS} status={bp.verification_status} />
          {bp.verification_status === "verified" && bp.is_public && <ButtonLink href={`/umkm/${bp.slug}`} variant="outline" size="sm" target="_blank">Lihat profil publik</ButtonLink>}
        </>}
      />
      {bp.verification_note && bp.verification_status !== "verified" && (
        <div className="mb-6"><Notice tone={bp.verification_status === "rejected" ? "danger" : "warning"} title="Catatan Disperindag">{bp.verification_note}</Notice></div>
      )}
      <BusinessProfileForm profile={bp} categories={categories} userId={user.id} products={asProducts(bp.products)} gallery={asStringArray(bp.gallery_paths)} />
    </>
  );
}
