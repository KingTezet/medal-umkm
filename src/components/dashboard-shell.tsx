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
          {g.title && <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9aa8a1]">{g.title}</p>}
          <ul className="space-y-0.5">
            {g.items.map((item) => {
              const active = item.href === current;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn("relative flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors duration-200", active ? "text-white" : "text-[#4c5c54] hover:bg-brand-50 hover:text-brand-950")}
                  >
                    {active && <motion.span layoutId={`active-${layoutKey}`} transition={reduce ? { duration: 0 } : { duration: 0.25, ease: EASE }} className="absolute inset-0 rounded-xl bg-brand-900 shadow-[0_8px_20px_-10px_rgba(5,35,26,.7)]" />}
                    <item.icon className="relative size-[18px] shrink-0" aria-hidden />
                    <span className="relative flex-1 truncate">{item.label}</span>
                    {item.icon === Bell && unread > 0 && <span className={cn("relative rounded-full px-1.5 text-[11px] font-semibold leading-5 tabular-nums", active ? "bg-brand-300 text-brand-950" : "bg-coral text-white")}>{unread > 99 ? "99+" : unread}</span>}
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
    <div className="flex items-center gap-3 rounded-2xl bg-brand-50 p-2.5 ring-1 ring-brand-300/40">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-900 text-sm font-semibold text-brand-300">{(name || email).charAt(0).toUpperCase()}</span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ink">{name || email}</p>
        <p className="truncate text-xs text-muted">{ROLE_TITLE[role]}</p>
      </div>
      <form action={logoutAction}>
        <button className="grid size-9 place-items-center rounded-xl text-[#5b6b63] transition-colors hover:bg-white hover:text-brand-950" aria-label="Keluar">
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
    <div className="relative isolate min-h-dvh bg-canvas lg:grid lg:grid-cols-[272px_1fr]">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-brand-100/70 to-transparent" />
        <div className="bg-dots absolute inset-x-0 top-0 h-[360px] [mask-image:linear-gradient(180deg,#000,transparent)]" />
        <div className="absolute -right-32 -top-32 size-[28rem] rounded-full bg-sky-200/50 blur-[100px]" />
      </div>
      <aside className="sticky top-0 hidden h-dvh p-3 lg:block">
        <div className="flex h-full flex-col rounded-[26px] bg-white px-3 py-5 shadow-[0_20px_50px_-35px_rgba(5,35,26,.45)] ring-1 ring-black/[0.06]">
        <Wordmark className="px-2" />
        <p className="mx-2 mt-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-[12px] font-medium text-brand-800 ring-1 ring-brand-300/50"><span className="size-1.5 rounded-full bg-brand-500" />{ROLE_TITLE[role]}</p>
        <nav aria-label="Navigasi dashboard" className="mt-4 flex-1 overflow-y-auto">
          <SideNav role={role} unread={unread} layoutKey="desktop" />
        </nav>
        <div className="space-y-2 border-t border-line pt-3">
          <Link href="/" className="flex h-9 items-center gap-3 rounded-xl px-3 text-sm text-[#5b6b63] hover:bg-brand-50 hover:text-brand-950">
            <Globe className="size-4" aria-hidden /> Lihat situs publik
          </Link>
          <UserBlock name={name} email={email} role={role} />
        </div>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-40 mx-3 mt-3 flex h-14 items-center justify-between gap-3 rounded-full bg-white/80 pl-4 pr-2 shadow-[0_10px_30px_-20px_rgba(5,35,26,.4)] ring-1 ring-black/[0.05] backdrop-blur-xl sm:mx-4 lg:mx-8 lg:mt-4 lg:h-16 lg:pl-6">
          <div className="lg:hidden">
            <Wordmark compact />
          </div>
          <p suppressHydrationWarning className="hidden text-sm text-[#5b6b63] lg:block">Halo, <span className="font-semibold text-brand-950">{(name || email).split(" ")[0]}</span> · {new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "numeric", month: "long", timeZone: "Asia/Jakarta" }).format(new Date())}</p>
          <div className="flex items-center gap-1">
            <Link href={notifHref} className="relative grid size-10 place-items-center rounded-full bg-brand-50 text-brand-900 ring-1 ring-brand-300/40 transition-colors hover:bg-brand-100" aria-label={`Notifikasi (${unread} belum dibaca)`}>
              <Bell className="size-5" />
              {unread > 0 && <span className="absolute right-2 top-2 size-2 rounded-full bg-coral ring-2 ring-white" aria-hidden />}
            </Link>
            <button onClick={() => setOpen(true)} className="grid size-10 place-items-center rounded-full text-brand-950 hover:bg-brand-50 lg:hidden" aria-label="Buka menu" aria-expanded={open} aria-controls="dash-drawer">
              <Menu className="size-5" />
            </button>
          </div>
        </header>

        <AnimatePresence>
          {open && (
            <>
              <motion.div className="fixed inset-0 z-50 bg-brand-950/30 backdrop-blur-[2px] lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={() => setOpen(false)} />
              <motion.aside
                id="dash-drawer"
                role="dialog"
                aria-modal="true"
                aria-label="Menu dashboard"
                className="fixed inset-y-2 left-2 z-50 flex w-[86vw] max-w-[300px] flex-col rounded-[26px] bg-white px-3 py-4 shadow-2xl lg:hidden"
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

        <main id="main" className="mx-auto w-full max-w-6xl px-4 pb-32 pt-6 sm:px-6 lg:px-8 lg:pb-12 lg:pt-8">
          <motion.div key={pathname} initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: EASE }}>
            {children}
          </motion.div>
        </main>

        <nav aria-label="Navigasi cepat" className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 rounded-[22px] bg-white/90 p-1.5 shadow-[0_18px_40px_-18px_rgba(5,35,26,.5)] ring-1 ring-black/[0.06] backdrop-blur-xl lg:hidden">
          <ul className="grid gap-1" style={{ gridTemplateColumns: `repeat(${mobileItems.length + 1}, minmax(0, 1fr))` }}>
            {mobileItems.map((item) => {
              const active = item.href === mobileCurrent;
              return (
                <li key={item.href}>
                  <Link href={item.href} aria-current={active ? "page" : undefined} className={cn("flex h-14 flex-col items-center justify-center gap-0.5 rounded-2xl text-[10.5px] font-medium transition-colors duration-200", active ? "bg-brand-900 text-white" : "text-[#5b6b63]")}>
                    <item.icon className="size-5" aria-hidden />
                    <span className="max-w-full truncate px-1">{item.label}</span>
                  </Link>
                </li>
              );
            })}
            <li>
              <button onClick={() => setOpen(true)} className="flex h-14 w-full flex-col items-center justify-center gap-0.5 rounded-2xl text-[10.5px] font-medium text-[#5b6b63]">
                <Menu className="size-5" aria-hidden /> Menu
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
