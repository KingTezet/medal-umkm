"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Wordmark } from "@/components/brand";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/", label: "Beranda" },
  { href: "/events", label: "Event" },
  { href: "/umkm", label: "Direktori UMKM" },
  { href: "/tentang", label: "Tentang" },
];
const ease = [0.16, 1, 0.3, 1] as const;

export function SiteHeader({ session }: { session: { name: string; dashboard: string } | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 12));

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const cta = session ? { href: session.dashboard, label: "Dashboard" } : { href: "/daftar", label: "Daftar" };

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-4">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease }}
        className={cn(
          "mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 rounded-full pl-4 pr-2 transition-[background-color,box-shadow] duration-300 sm:h-16 sm:pl-5",
          scrolled || open ? "bg-white/85 shadow-[0_10px_30px_-18px_rgba(5,35,26,.35)] ring-1 ring-black/[0.06] backdrop-blur-xl" : "bg-transparent",
        )}
      >
        <Wordmark compact />
        <nav aria-label="Navigasi utama" className="hidden items-center rounded-full bg-brand-900/[0.05] p-1 md:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} aria-current={isActive(n.href) ? "page" : undefined} className={cn("relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200", isActive(n.href) ? "text-brand-950" : "text-[#5b6b63] hover:text-brand-950")}>
              {isActive(n.href) && <motion.span layoutId="nav-pill" transition={{ duration: 0.4, ease }} className="absolute inset-0 rounded-full bg-white shadow-sm ring-1 ring-black/[0.05]" />}
              <span className="relative">{n.label}</span>
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1.5">
          {!session && (
            <Link href="/login" className="hidden rounded-full px-4 py-2 text-sm font-medium text-brand-950 hover:bg-black/[0.04] sm:block">
              Masuk
            </Link>
          )}
          <Link href={cta.href} className="group hidden h-10 items-center gap-2 rounded-full bg-brand-900 pl-4 pr-1.5 text-sm font-medium text-white transition-colors hover:bg-brand-800 sm:inline-flex">
            {cta.label}
            <span className="grid size-7 place-items-center rounded-full bg-brand-300 text-brand-950 transition-transform duration-300 group-hover:rotate-45"><ArrowUpRight className="size-3.5" aria-hidden /></span>
          </Link>
          <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Tutup menu" : "Buka menu"} className="grid size-10 place-items-center rounded-full text-brand-950 hover:bg-black/[0.04] md:hidden">
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -10, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(8px)" }}
            transition={{ duration: 0.35, ease }}
            className="mx-auto mt-2 max-w-6xl overflow-hidden rounded-3xl bg-white/90 p-3 shadow-xl ring-1 ring-black/[0.06] backdrop-blur-xl md:hidden"
          >
            <nav aria-label="Navigasi seluler" className="flex flex-col">
              {NAV.map((n, i) => (
                <motion.div key={n.href} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i, duration: 0.3, ease }}>
                  <Link href={n.href} onClick={() => setOpen(false)} className={cn("display flex h-12 items-center rounded-2xl px-4 text-[18px] font-medium", isActive(n.href) ? "bg-brand-50 text-brand-800" : "text-brand-950")}>
                    {n.label}
                  </Link>
                </motion.div>
              ))}
              <div className="mt-2 grid grid-cols-2 gap-2">
                {!session && <Link href="/login" onClick={() => setOpen(false)} className="grid h-12 place-items-center rounded-full bg-black/[0.04] text-[15px] font-medium">Masuk</Link>}
                <Link href={cta.href} onClick={() => setOpen(false)} className={cn("grid h-12 place-items-center rounded-full bg-brand-900 text-[15px] font-medium text-white", session && "col-span-2")}>{cta.label}</Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
