"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  Bell, Building2, CalendarDays, ClipboardList, FileText, Globe, History, LayoutGrid, LogOut, Menu, Settings,
  Store, Tags, UserCog, Users, X, type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Wordmark } from "@/components/brand";
import { EASE } from "@/components/motion";
import { logoutAction } from "@/app/actions/auth";
import { cn } from "@/lib/cn";
import type { UserRole } from "@/lib/constants";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
  mobile?: boolean;
}
interface NavGroup {
  title?: string;
  items: NavItem[];
}

const NAV: Record<UserRole, NavGroup[]> = {
  umkm: [
    {
      items: [
        { href: "/dashboard/umkm", label: "Ringkasan", icon: LayoutGrid, exact: true, mobile: true },
        { href: "/dashboard/umkm/events", label: "Jelajahi Event", icon: CalendarDays, mobile: true },
        { href: "/dashboard/umkm/pendaftaran", label: "Pendaftaran Saya", icon: ClipboardList, mobile: true },
        { href: "/dashboard/umkm/profil", label: "Profil Usaha", icon: Store },
      ],
    },
    {
      title: "Akun",
      items: [
        { href: "/dashboard/umkm/notifikasi", label: "Notifikasi", icon: Bell },
        { href: "/dashboard/umkm/pengaturan", label: "Pengaturan Akun", icon: Settings },
      ],
    },
  ],
  organizer: [
    {
      items: [
        { href: "/dashboard/penyelenggara", label: "Ringkasan", icon: LayoutGrid, exact: true, mobile: true },
        { href: "/dashboard/penyelenggara/events", label: "Event Saya", icon: CalendarDays, mobile: true },
        { href: "/dashboard/penyelenggara/events/new", label: "Ajukan Event", icon: FileText, exact: true, mobile: true },
        { href: "/dashboard/penyelenggara/profil", label: "Profil Penyelenggara", icon: Building2 },
      ],
    },
    {
      title: "Akun",
      items: [
        { href: "/dashboard/penyelenggara/notifikasi", label: "Notifikasi", icon: Bell },
        { href: "/dashboard/penyelenggara/pengaturan", label: "Pengaturan Akun", icon: Settings },
      ],
    },
  ],
  admin: [
    { items: [{ href: "/admin", label: "Overview", icon: LayoutGrid, exact: true, mobile: true }] },
    {
      title: "Verifikasi",
      items: [
        { href: "/admin/events", label: "Event", icon: CalendarDays, mobile: true },
        { href: "/admin/pendaftaran", label: "Pendaftaran Stand", icon: ClipboardList, mobile: true },
        { href: "/admin/umkm", label: "Data UMKM", icon: Store, mobile: true },
        { href: "/admin/penyelenggara", label: "Data Penyelenggara", icon: Building2 },
      ],
    },
    {
      title: "Kelola",
      items: [
        { href: "/admin/pengguna", label: "Pengguna & Role", icon: Users },
        { href: "/admin/kategori", label: "Kategori", icon: Tags },
        { href: "/admin/konten", label: "Konten Publik", icon: FileText },
        { href: "/admin/audit-log", label: "Audit Log", icon: History },
      ],
    },
    {
      title: "Akun",
      items: [
        { href: "/admin/notifikasi", label: "Notifikasi", icon: Bell },
        { href: "/admin/pengaturan", label: "Pengaturan", icon: UserCog },
      ],
    },
  ],
};

const ROLE_TITLE: Record<UserRole, string> = { umkm: "Pelaku UMKM", organizer: "Penyelenggara", admin: "Admin Disperindag" };

function matches(pathname: string, item: NavItem) {
  return item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href + "/");
}
/** Most specific match wins (e.g. "Ajukan Event" over "Event Saya"). */
function activeHref(pathname: string, items: NavItem[]) {
  return items.filter((i) => matches(pathname, i)).sort((a, b) => b.href.length - a.href.length)[0]?.href;
}

function SideNav({ role, unread, onNavigate, layoutKey }: { role: UserRole; unread: number; onNavigate?: () => void; layoutKey: string }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const current = activeHref(pathname, NAV[role].flatMap((g) => g.items));
  return (
    <div className="space-y-5">
      {NAV[role].map((g, gi) => (
        <div key={gi}>
          {g.title && <p className="mb-1 px-3 text-xs font-medium text-muted">{g.title}</p>}
          <ul className="space-y-0.5">
            {g.items.map((item) => {
              const active = item.href === current;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn("relative flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors duration-150", active ? "text-primary" : "text-muted hover:bg-surface-muted hover:text-ink")}
                  >
                    {active && <motion.span layoutId={`active-${layoutKey}`} transition={reduce ? { duration: 0 } : { duration: 0.25, ease: EASE }} className="absolute inset-0 rounded-lg bg-primary-soft" />}
                    <item.icon className="relative size-[18px] shrink-0" aria-hidden />
                    <span className="relative flex-1 truncate">{item.label}</span>
                    {item.icon === Bell && unread > 0 && <span className="relative rounded-md bg-primary px-1.5 text-[11px] font-semibold leading-5 text-white tabular-nums">{unread > 99 ? "99+" : unread}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

function UserBlock({ name, email, role }: { name: string; email: string; role: UserRole }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-line p-2.5">
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary-soft text-sm font-semibold text-primary">{(name || email).charAt(0).toUpperCase()}</span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ink">{name || email}</p>
        <p className="truncate text-xs text-muted">{ROLE_TITLE[role]}</p>
      </div>
      <form action={logoutAction}>
        <button className="grid size-9 place-items-center rounded-lg text-muted transition-colors hover:bg-surface-muted hover:text-ink" aria-label="Keluar">
          <LogOut className="size-4" />
        </button>
      </form>
    </div>
  );
}

export function DashboardShell({ role, name, email, unread, children }: { role: UserRole; name: string; email: string; unread: number; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const search = useSearchParams();
  const reduce = useReducedMotion();
  const notifHref = role === "admin" ? "/admin/notifikasi" : role === "organizer" ? "/dashboard/penyelenggara/notifikasi" : "/dashboard/umkm/notifikasi";
  const mobileItems = NAV[role].flatMap((g) => g.items).filter((i) => i.mobile).slice(0, 4);
  const mobileCurrent = activeHref(pathname, mobileItems);

  useEffect(() => {
    if (search.get("forbidden")) toast.error("Anda tidak memiliki akses ke halaman tersebut.");
    if (search.get("welcome")) toast.success("Selamat datang di MEDAL. Lengkapi profil Anda untuk mulai.");
  }, [search]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="min-h-dvh bg-surface-muted lg:grid lg:grid-cols-[252px_1fr]">
      <aside className="sticky top-0 hidden h-dvh flex-col border-r border-line bg-white px-3 py-5 lg:flex">
        <Wordmark className="px-2" />
        <p className="mt-6 px-3 text-xs text-muted">{ROLE_TITLE[role]}</p>
        <nav aria-label="Navigasi dashboard" className="mt-2 flex-1 overflow-y-auto">
          <SideNav role={role} unread={unread} layoutKey="desktop" />
        </nav>
        <div className="space-y-2 border-t border-line pt-3">
          <Link href="/" className="flex h-9 items-center gap-3 rounded-lg px-3 text-sm text-muted hover:bg-surface-muted hover:text-ink">
            <Globe className="size-4" aria-hidden /> Lihat situs publik
          </Link>
          <UserBlock name={name} email={email} role={role} />
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-3 border-b border-line bg-white/95 px-4 backdrop-blur-sm sm:px-6 lg:h-16 lg:px-8">
          <div className="lg:hidden">
            <Wordmark compact />
          </div>
          <p className="hidden text-sm text-muted lg:block">{ROLE_TITLE[role]}</p>
          <div className="flex items-center gap-1">
            <Link href={notifHref} className="relative grid size-10 place-items-center rounded-lg text-muted transition-colors hover:bg-surface-muted hover:text-ink" aria-label={`Notifikasi (${unread} belum dibaca)`}>
              <Bell className="size-5" />
              {unread > 0 && <span className="absolute right-2 top-2 size-2 rounded-full bg-primary ring-2 ring-white" aria-hidden />}
            </Link>
            <button onClick={() => setOpen(true)} className="grid size-10 place-items-center rounded-lg text-ink hover:bg-surface-muted lg:hidden" aria-label="Buka menu" aria-expanded={open} aria-controls="dash-drawer">
              <Menu className="size-5" />
            </button>
          </div>
        </header>

        <AnimatePresence>
          {open && (
            <>
              <motion.div className="fixed inset-0 z-50 bg-ink/30 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={() => setOpen(false)} />
              <motion.aside
                id="dash-drawer"
                role="dialog"
                aria-modal="true"
                aria-label="Menu dashboard"
                className="fixed inset-y-0 left-0 z-50 flex w-[86vw] max-w-[300px] flex-col bg-white px-3 py-4 lg:hidden"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={reduce ? { duration: 0 } : { duration: 0.28, ease: EASE }}
              >
                <div className="mb-4 flex items-center justify-between px-2">
                  <Wordmark />
                  <button onClick={() => setOpen(false)} className="grid size-10 place-items-center rounded-lg hover:bg-surface-muted" aria-label="Tutup menu">
                    <X className="size-5" />
                  </button>
                </div>
                <nav className="flex-1 overflow-y-auto" aria-label="Navigasi dashboard seluler">
                  <SideNav role={role} unread={unread} onNavigate={() => setOpen(false)} layoutKey="drawer" />
                </nav>
                <div className="space-y-2 border-t border-line pt-3">
                  <Link href="/" className="flex h-10 items-center gap-3 rounded-lg px-3 text-sm text-muted hover:bg-surface-muted">
                    <Globe className="size-4" aria-hidden /> Lihat situs publik
                  </Link>
                  <UserBlock name={name} email={email} role={role} />
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        <main id="main" className="mx-auto w-full max-w-6xl px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-12 lg:pt-8">
          <motion.div key={pathname} initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: EASE }}>
            {children}
          </motion.div>
        </main>

        <nav aria-label="Navigasi cepat" className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm lg:hidden">
          <ul className="grid" style={{ gridTemplateColumns: `repeat(${mobileItems.length + 1}, minmax(0, 1fr))` }}>
            {mobileItems.map((item) => {
              const active = item.href === mobileCurrent;
              return (
                <li key={item.href}>
                  <Link href={item.href} aria-current={active ? "page" : undefined} className={cn("flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors", active ? "text-primary" : "text-muted")}>
                    <item.icon className="size-5" aria-hidden />
                    <span className="max-w-full truncate px-1">{item.label}</span>
                  </Link>
                </li>
              );
            })}
            <li>
              <button onClick={() => setOpen(true)} className="flex h-16 w-full flex-col items-center justify-center gap-1 text-[11px] font-medium text-muted">
                <Menu className="size-5" aria-hidden /> Menu
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
