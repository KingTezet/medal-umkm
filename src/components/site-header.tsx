"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { LayoutDashboard, Menu, X } from "lucide-react";
import { Wordmark } from "@/components/brand";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/", label: "Beranda" },
  { href: "/events", label: "Event" },
  { href: "/umkm", label: "Direktori UMKM" },
  { href: "/tentang", label: "Tentang Kami" },
];

const OVERLAY_PATHS = ["/", "/tentang"];

export function SiteHeader({ session }: { session: { name: string; dashboard: string } | null }) {
  const pathname = usePathname();
  const overlay = OVERLAY_PATHS.includes(pathname);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const light = overlay && !scrolled && !open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        light ? "bg-transparent" : "border-b border-line/70 bg-ivory/85 backdrop-blur-xl",
      )}
    >
      <div className="container-page flex h-[4.25rem] items-center justify-between gap-4">
        <Wordmark light={light} />
        <nav aria-label="Navigasi utama" className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => {
            const active = n.href === "/" ? pathname === "/" : pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-semibold transition",
                  light ? "text-ivory/85 hover:text-ivory" : "text-ink/75 hover:text-emerald",
                  active && (light ? "text-ivory" : "text-emerald"),
                )}
              >
                {n.label}
                {active && <motion.span layoutId="nav-dot" className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-gold" />}
              </Link>
            );
          })}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          {session ? (
            <ButtonLink href={session.dashboard} variant={light ? "gold" : "primary"} size="sm">
              <LayoutDashboard className="size-4" /> Dashboard
            </ButtonLink>
          ) : (
            <>
              <ButtonLink href="/login" variant={light ? "outline-light" : "ghost"} size="sm">
                Masuk
              </ButtonLink>
              <ButtonLink href="/daftar" variant={light ? "gold" : "primary"} size="sm">
                Daftar Sekarang
              </ButtonLink>
            </>
          )}
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          className={cn("grid size-11 place-items-center rounded-full lg:hidden", light ? "bg-white/10 text-ivory backdrop-blur" : "bg-sage text-forest")}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="h-[calc(100dvh-4.25rem)] overflow-y-auto border-t border-line bg-ivory lg:hidden"
          >
            <nav aria-label="Navigasi seluler" className="container-page flex flex-col gap-1 py-6">
              {NAV.map((n, i) => (
                <motion.div key={n.href} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}>
                  <Link href={n.href} onClick={() => setOpen(false)} className="block rounded-2xl px-4 py-3.5 font-display text-2xl text-ink hover:bg-sage">
                    {n.label}
                  </Link>
                </motion.div>
              ))}
              <div className="mt-6 grid gap-3 px-1">
                {session ? (
                  <ButtonLink href={session.dashboard} onClick={() => setOpen(false)} size="lg">
                    Buka Dashboard
                  </ButtonLink>
                ) : (
                  <>
                    <ButtonLink href="/daftar" onClick={() => setOpen(false)} size="lg">
                      Daftar Sekarang
                    </ButtonLink>
                    <ButtonLink href="/login" onClick={() => setOpen(false)} variant="outline" size="lg">
                      Masuk
                    </ButtonLink>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
