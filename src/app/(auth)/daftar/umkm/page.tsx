import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth-shell";
import { RegisterUmkmForm } from "@/components/forms/auth-forms";
import { getCategories } from "@/lib/queries";
import { safeNextPath } from "@/lib/domain";

export const metadata: Metadata = { title: "Daftar sebagai UMKM" };

export default async function RegisterUmkmPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const categories = await getCategories("umkm");
  return (
    <AuthShell title="Daftar sebagai Pelaku UMKM" description={<>Profil usaha cukup diisi sekali. <Link href="/daftar/penyelenggara" className="font-semibold text-emerald hover:underline">Anda penyelenggara?</Link></>} image="/images/jajan-pasar.jpg" quote="Profil sekali isi, dipakai untuk setiap pendaftaran stand.">
      <RegisterUmkmForm categories={categories} next={safeNextPath(sp.next) ?? undefined} />
    </AuthShell>
  );
}
