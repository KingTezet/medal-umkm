"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { LayoutDashboard, Menu, X } from "lucide-react";
import { Wordmark } from "@/components/brand";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/", label: "Beranda" },
  { href: "/events", label: "Event" },
  { href: "/umkm", label: "Direktori UMKM" },
  { href: "/tentang", label: "Tentang" },
];

const ease = [0.22, 1, 0.36, 1] as const;

export function SiteHeader({ session }: { session: { name: string; dashboard: string } | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

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

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur-sm">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Wordmark />
        <nav aria-label="Navigasi utama" className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={isActive(n.href) ? "page" : undefined}
              className={cn(
                "relative px-3 py-2 text-sm font-medium transition-colors duration-150",
                isActive(n.href) ? "text-primary" : "text-muted hover:text-ink",
              )}
            >
              {n.label}
              {isActive(n.href) && (
                <motion.span layoutId="nav-underline" transition={{ duration: 0.25, ease }} className="absolute inset-x-3 -bottom-[13px] h-0.5 bg-primary" />
              )}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          {session ? (
            <ButtonLink href={session.dashboard} size="sm">
              <LayoutDashboard className="size-4" aria-hidden /> Dashboard
            </ButtonLink>
          ) : (
            <>
              <ButtonLink href="/login" variant="ghost" size="sm">
                Masuk
              </ButtonLink>
              <ButtonLink href="/daftar" size="sm">
                Daftar
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
          className="-mr-2 grid size-11 place-items-center rounded-lg text-ink hover:bg-surface-muted md:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease }}
            className="absolute inset-x-0 top-16 h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line bg-white md:hidden"
          >
            <nav aria-label="Navigasi seluler" className="container-page flex flex-col py-4">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(n.href) ? "page" : undefined}
                  className={cn("flex h-12 items-center border-b border-line text-base font-medium", isActive(n.href) ? "text-primary" : "text-ink")}
                >
                  {n.label}
                </Link>
              ))}
              <div className="mt-6 grid gap-2">
                {session ? (
                  <ButtonLink href={session.dashboard} onClick={() => setOpen(false)} size="lg">
                    Buka Dashboard
                  </ButtonLink>
                ) : (
                  <>
                    <ButtonLink href="/daftar" onClick={() => setOpen(false)} size="lg">
                      Daftar
                    </ButtonLink>
                    <ButtonLink href="/login" onClick={() => setOpen(false)} variant="secondary" size="lg">
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
