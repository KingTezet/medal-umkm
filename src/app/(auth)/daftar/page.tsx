import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Megaphone, Store } from "lucide-react";
import { AuthShell } from "@/components/auth-shell";
import { Stagger, StaggerItem } from "@/components/motion";

export const metadata: Metadata = { title: "Daftar" };

const OPTIONS = [
  { href: "/daftar/umkm", icon: Store, title: "Saya Pelaku UMKM", body: "Buat profil usaha, daftar stand di event, dan pantau status hingga nomor lapak.", img: "/images/jajan-pasar.jpg" },
  { href: "/daftar/penyelenggara", icon: Megaphone, title: "Saya Penyelenggara Event", body: "Komunitas, EO, desa, atau instansi yang ingin mengajukan event dan mengelola peserta.", img: "/images/pasar-malam-1.jpg" },
];

export default function RegisterChoicePage() {
  return (
    <AuthShell title="Bergabung dengan MEDAL" description="Pilih jenis akun yang sesuai dengan peran Anda.">
      <Stagger className="grid gap-4">
        {OPTIONS.map((o) => (
          <StaggerItem key={o.href}>
            <Link href={o.href} className="group flex items-stretch overflow-hidden rounded-[22px] bg-white ring-1 ring-black/[0.06] transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-25px_rgba(5,35,26,.4)]">
              <div className="relative w-28 shrink-0 sm:w-36">
                <Image src={o.img} alt="" fill sizes="144px" className="object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-forest/30" aria-hidden />
                <span className="absolute left-3 top-3 grid size-10 place-items-center rounded-xl bg-primary text-white"><o.icon className="size-5" aria-hidden /></span>
              </div>
              <div className="flex flex-1 items-center gap-3 p-5">
                <div className="flex-1">
                  <h2 className="display text-[22px] font-semibold text-brand-950">{o.title}</h2>
                  <p className="mt-1 text-sm text-muted">{o.body}</p>
                </div>
                <ArrowRight className="size-5 shrink-0 text-emerald transition group-hover:translate-x-1" aria-hidden />
              </div>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
      <p className="mt-8 text-center text-sm text-muted">
        Sudah punya akun? <Link href="/login" className="font-semibold text-emerald hover:underline">Masuk</Link>
      </p>
      <p className="mt-3 text-center text-xs text-muted">Akun Admin Disperindag tidak tersedia melalui pendaftaran publik.</p>
    </AuthShell>
  );
}
