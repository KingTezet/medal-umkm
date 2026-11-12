"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, CalendarSearch, ClipboardCheck, Info, Megaphone, Store, Users } from "lucide-react";
import { cn } from "@/lib/cn";

const LINKS = [
  { href: "/events", label: "Jelajahi Event & Bazar", sub: "Cari event yang sedang buka pendaftaran", icon: CalendarSearch, featured: true },
  { href: "/daftar/umkm", label: "Daftarkan Usaha Saya", sub: "Untuk pelaku UMKM Sumedang", icon: Store },
  { href: "/daftar/penyelenggara", label: "Ajukan Event", sub: "Untuk komunitas, EO, desa & instansi", icon: Megaphone },
  { href: "/umkm", label: "Direktori UMKM", sub: "Kenali produk lokal terverifikasi", icon: Users },
  { href: "/cek-status", label: "Cek Status Pendaftaran", sub: "Pantau berkas hingga nomor stand", icon: ClipboardCheck },
  { href: "/tentang", label: "Tentang MEDAL", sub: "Program & tim pengembang", icon: Info },
];

export function LinkStack({ className, compact = false }: { className?: string; compact?: boolean }) {
  const reduce = useReducedMotion();
  return (
    <motion.ul
      className={cn("flex w-full flex-col gap-3", className)}
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.35 } } }}
    >
      {LINKS.map((l) => (
        <motion.li
          key={l.href}
          variants={{
            hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 18, scale: 0.97 },
            show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 260, damping: 24 } },
          }}
        >
          <Link
            href={l.href}
            className={cn(
              "group flex items-center gap-3.5 rounded-2xl border px-4 transition duration-300 active:scale-[0.98]",
              compact ? "py-3" : "py-3.5",
              l.featured
                ? "border-gold/60 bg-gradient-to-r from-gold to-[#e2c584] text-night shadow-[0_18px_40px_-18px_rgba(198,161,91,.9)] hover:brightness-105"
                : "border-white/12 bg-white/[0.06] text-ivory backdrop-blur-md hover:border-gold/50 hover:bg-white/[0.11]",
            )}
          >
            <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl", l.featured ? "bg-night/10" : "bg-white/10 text-gold-soft")}>
              <l.icon className="size-5" aria-hidden />
            </span>
            <span className="min-w-0 flex-1 text-left">
              <span className="block text-[15px] font-bold leading-tight">{l.label}</span>
              <span className={cn("mt-0.5 block truncate text-xs", l.featured ? "text-night/70" : "text-ivory/60")}>{l.sub}</span>
            </span>
            <ArrowRight className="size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
          </Link>
        </motion.li>
      ))}
    </motion.ul>
  );
}
