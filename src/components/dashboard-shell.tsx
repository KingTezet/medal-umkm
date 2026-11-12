"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Bell, Building2, CalendarDays, ClipboardList, FileText, Globe, History, LayoutDashboard, LogOut, Menu, Settings,
  Store, Tags, UserCog, Users, X, type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Wordmark } from "@/components/brand";
import { logoutAction } from "@/app/actions/auth";
import { cn } from "@/lib/cn";
import type { UserRole } from "@/lib/constants";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}

const NAV: Record<UserRole, NavItem[]> = {
  umkm: [
    { href: "/dashboard/umkm", label: "Ringkasan", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/umkm/profil", label: "Profil Usaha", icon: Store },
    { href: "/dashboard/umkm/events", label: "Cari Event", icon: CalendarDays },
    { href: "/dashboard/umkm/pendaftaran", label: "Pendaftaran Saya", icon: ClipboardList },
    { href: "/dashboard/umkm/notifikasi", label: "Notifikasi", icon: Bell },
    { href: "/dashboard/umkm/pengaturan", label: "Pengaturan", icon: Settings },
  ],
  organizer: [
    { href: "/dashboard/penyelenggara", label: "Ringkasan", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/penyelenggara/profil", label: "Profil Organisasi", icon: Building2 },
    { href: "/dashboard/penyelenggara/events", label: "Event Saya", icon: CalendarDays },
    { href: "/dashboard/penyelenggara/notifikasi", label: "Notifikasi", icon: Bell },
    { href: "/dashboard/penyelenggara/pengaturan", label: "Pengaturan", icon: Settings },
  ],
  admin: [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { href: "/admin/events", label: "Event", icon: CalendarDays },
    { href: "/admin/pendaftaran", label: "Pendaftaran", icon: ClipboardList },
    { href: "/admin/umkm", label: "Data UMKM", icon: Store },
    { href: "/admin/penyelenggara", label: "Penyelenggara", icon: Building2 },
    { href: "/admin/pengguna", label: "Pengguna", icon: Users },
    { href: "/admin/kategori", label: "Kategori", icon: Tags },
    { href: "/admin/konten", label: "Konten Publik", icon: FileText },
    { href: "/admin/audit-log", label: "Audit Log", icon: History },
    { href: "/admin/notifikasi", label: "Notifikasi", icon: Bell },
    { href: "/admin/pengaturan", label: "Pengaturan", icon: UserCog },
  ],
};

const ROLE_TITLE: Record<UserRole, string> = {
  umkm: "Pelaku UMKM",
  organizer: "Penyelenggara",
  admin: "Admin Disperindag",
};

function NavLinks({ role, unread, onNavigate }: { role: UserRole; unread: number; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <ul className="space-y-1">
      {NAV[role].map((item) => {
        const active = item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition",
                active ? "text-night" : "text-ivory/70 hover:bg-white/[0.06] hover:text-ivory",
              )}
            >
              {active && <motion.span layoutId={`dash-active-${role}`} className="absolute inset-0 rounded-xl bg-gradient-to-r from-gold to-[#e2c584]" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
              <item.icon className="relative size-[18px]" aria-hidden />
              <span className="relative flex-1">{item.label}</span>
              {item.icon === Bell && unread > 0 && (
                <span className="relative grid min-w-5 place-items-center rounded-full bg-terracotta px-1.5 text-[11px] font-bold text-white">{unread > 99 ? "99+" : unread}</span>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function SidebarFooter({ name, email, role }: { name: string; email: string; role: UserRole }) {
  return (
    <div className="space-y-3 border-t border-white/10 pt-4">
      <Link href="/" className="flex items-center gap-3 rounded-xl px-3.5 py-2 text-sm text-ivory/60 hover:text-ivory">
        <Globe className="size-4" aria-hidden /> Lihat situs publik
      </Link>
      <div className="flex items-center gap-3 rounded-2xl bg-white/[0.06] p-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gold font-display text-lg text-night">{name.charAt(0).toUpperCase() || "M"}</span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ivory">{name || email}</p>
          <p className="truncate text-xs text-gold-soft/80">{ROLE_TITLE[role]}</p>
        </div>
        <form action={logoutAction}>
          <button className="grid size-9 place-items-center rounded-full text-ivory/70 hover:bg-white/10 hover:text-ivory" aria-label="Keluar">
            <LogOut className="size-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

export function DashboardShell({ role, name, email, unread, children }: { role: UserRole; name: string; email: string; unread: number; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const search = useSearchParams();
  const notifHref = role === "admin" ? "/admin/notifikasi" : role === "organizer" ? "/dashboard/penyelenggara/notifikasi" : "/dashboard/umkm/notifikasi";

  useEffect(() => {
    if (search.get("forbidden")) toast.error("Anda tidak memiliki akses ke halaman tersebut.");
    if (search.get("welcome")) toast.success("Selamat datang di MEDAL! Lengkapi profil Anda untuk mulai.");
  }, [search]);

  return (
    <div className="min-h-dvh bg-ivory lg:grid lg:grid-cols-[17rem_1fr]">
      <aside className="sticky top-0 hidden h-dvh flex-col overflow-y-auto bg-night px-4 py-6 lg:flex">
        <div className="bg-emerald-mesh pointer-events-none absolute inset-0 opacity-50" aria-hidden />
        <div className="relative flex flex-1 flex-col">
          <Wordmark light className="px-2" />
          <p className="mt-6 px-3.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-gold/80">{ROLE_TITLE[role]}</p>
          <nav aria-label="Navigasi dashboard" className="mt-3 flex-1">
            <NavLinks role={role} unread={unread} />
          </nav>
          <SidebarFooter name={name} email={email} role={role} />
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-line bg-ivory/85 px-4 backdrop-blur-xl lg:hidden">
          <Wordmark compact />
          <div className="flex items-center gap-2">
            <Link href={notifHref} className="relative grid size-10 place-items-center rounded-full bg-sage text-forest" aria-label={`Notifikasi (${unread} belum dibaca)`}>
              <Bell className="size-5" />
              {unread > 0 && <span className="absolute -right-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-terracotta px-1 text-[10px] font-bold text-white">{unread > 9 ? "9+" : unread}</span>}
            </Link>
            <button onClick={() => setOpen(true)} className="grid size-10 place-items-center rounded-full bg-forest text-ivory" aria-label="Buka menu" aria-expanded={open}>
              <Menu className="size-5" />
            </button>
          </div>
        </header>

        <AnimatePresence>
          {open && (
            <>
              <motion.div className="fixed inset-0 z-50 bg-night/60 backdrop-blur-sm lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
              <motion.aside
                className="fixed inset-y-0 right-0 z-50 flex w-[85vw] max-w-xs flex-col overflow-y-auto bg-night px-4 py-5 lg:hidden"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 320, damping: 34 }}
                aria-label="Menu dashboard"
              >
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-gold/80">{ROLE_TITLE[role]}</p>
                  <button onClick={() => setOpen(false)} className="grid size-9 place-items-center rounded-full bg-white/10 text-ivory" aria-label="Tutup menu">
                    <X className="size-4" />
                  </button>
                </div>
                <nav className="flex-1" aria-label="Navigasi dashboard seluler">
                  <NavLinks role={role} unread={unread} onNavigate={() => setOpen(false)} />
                </nav>
                <SidebarFooter name={name} email={email} role={role} />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        <main id="main" className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10 lg:px-10">
          <motion.div key={pathname} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
