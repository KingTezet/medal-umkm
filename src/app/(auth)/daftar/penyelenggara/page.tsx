import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth-shell";
import { RegisterOrganizerForm } from "@/components/forms/auth-forms";

export const metadata: Metadata = { title: "Daftar sebagai Penyelenggara" };

export default function RegisterOrganizerPage() {
  return (
    <AuthShell title="Daftar sebagai Penyelenggara Event" description={<>Untuk komunitas, EO, desa, dan instansi. <Link href="/daftar/umkm" className="font-semibold text-emerald hover:underline">Anda pelaku UMKM?</Link></>} image="/images/pasar-malam-1.jpg" quote="Ajukan event, seleksi peserta terverifikasi, ekspor rekap — semua rapi.">
      <RegisterOrganizerForm />
    </AuthShell>
  );
}
