"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useTransform } from "motion/react";
import { ArrowUpRight, BadgeCheck, CalendarDays, FileCheck2, Lock, MapPin, Store, Ticket, UserRoundPlus } from "lucide-react";
import { Counter, EASE, FillBar, PillLink, Rise, RiseGroup, RiseItem, useParallax, useRange } from "@/components/landing/kit";
import { cn } from "@/lib/cn";

/* ------------------------------------------------------------ shared heading */
export function Heading({ kicker, title, sub, action, center = false, dark = false }: { kicker: string; title: React.ReactNode; sub?: string; action?: React.ReactNode; center?: boolean; dark?: boolean }) {
  return (
    <div className={cn("flex flex-col gap-6", center ? "items-center text-center" : "md:flex-row md:items-end md:justify-between")}>
      <Rise className={cn("max-w-2xl", center && "mx-auto")}>
        <p className={cn("inline-flex items-center gap-2 text-[13px] font-medium", dark ? "text-brand-300" : "text-brand-700")}>
          <span className={cn("h-px w-6", dark ? "bg-brand-300" : "bg-brand-500")} aria-hidden />
          {kicker}
        </p>
        <h2 className={cn("display mt-3 text-[32px] font-semibold leading-[1.05] sm:text-[44px] lg:text-[52px]", dark ? "text-white" : "text-brand-950")}>{title}</h2>
        {sub && <p className={cn("mt-4 text-[16px] leading-relaxed sm:text-[17px]", dark ? "text-white/70" : "text-[#4c5c54]")}>{sub}</p>}
      </Rise>
      {action && <Rise delay={0.1}>{action}</Rise>}
    </div>
  );
}

/* ------------------------------------------------------------ backgrounds */
export function SectionBg({ variant }: { variant: "dots-right" | "blob-left" | "mint" | "dark" }) {
  if (variant === "dark")
    return (
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-brand-900">
        <div className="bg-grid-light absolute inset-0" />
        <div className="absolute -left-32 top-0 size-[30rem] rounded-full bg-brand-500/35 blur-[110px]" />
        <div className="absolute -right-24 bottom-0 size-[26rem] rounded-full bg-sky-400/15 blur-[110px]" />
      </div>
    );
  if (variant === "mint")
    return (
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-brand-50">
        <div className="bg-dots absolute inset-0 [mask-image:linear-gradient(180deg,#000,transparent_70%)]" />
        <div className="absolute -right-40 -top-20 size-[28rem] rounded-full bg-brand-300/35 blur-[110px]" />
      </div>
    );
  if (variant === "blob-left")
    return (
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-white">
        <div className="absolute -left-48 top-10 size-[30rem] rounded-full bg-brand-100 blur-[100px]" />
        <div className="absolute -right-20 bottom-0 size-72 rounded-full bg-sky-100 blur-[90px]" />
      </div>
    );
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-white">
      <div className="bg-dots absolute right-0 top-0 h-80 w-[36rem] [mask-image:radial-gradient(ellipse_at_top_right,#000,transparent_70%)]" />
      <div className="absolute -right-32 top-20 size-80 rounded-full bg-brand-100/80 blur-[100px]" />
      <div className="absolute -left-20 bottom-10 size-64 rounded-full bg-[#fdeee9] blur-[90px]" />
    </div>
  );
}

/* ------------------------------------------------------------ marquee */
export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-brand-300/40 bg-white py-5 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]" aria-hidden>
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
        {row.map((m, i) => (
          <span key={i} className="display flex items-center gap-10 text-[20px] font-medium text-brand-900/45">
            {m}
            <span className="size-1.5 rounded-full bg-brand-400" />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ bento */
export function Bento({ rows, confirmed, capacity }: { rows: { title: string; state: string; open: boolean }[]; confirmed: number; capacity: number }) {
  const reduce = useReducedMotion();
  const pct = capacity ? Math.round((confirmed / capacity) * 100) : 0;
  return (
    <RiseGroup className="mt-12 grid gap-4 md:grid-cols-6 [&>*]:min-w-0">
      {/* Big dark cell */}
      <RiseItem className="md:col-span-4">
        <div className="noise relative h-full overflow-hidden rounded-[28px] bg-brand-900 p-7 text-white sm:p-9">
          <div className="absolute -right-20 -top-20 size-72 rounded-full bg-brand-500/40 blur-[80px]" aria-hidden />
          <p className="relative text-[13px] text-brand-300">Satu pintu</p>
          <h3 className="display relative mt-2 max-w-md text-[28px] font-semibold leading-tight sm:text-[34px]">Semua event &amp; pendaftaran stand dalam satu tempat.</h3>
          <div className="relative mt-8 space-y-2.5">
            {rows.map((r, i) => (
              <motion.div
                key={r.title}
                className="glass-dark flex flex-col gap-0.5 rounded-2xl px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3"
                initial={reduce ? false : { opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: EASE, delay: 0.2 + i * 0.1 }}
              >
                <span className="flex min-w-0 items-center gap-3 text-[14px]">
                  <span className={cn("size-2 shrink-0 rounded-full", r.open ? "bg-brand-300" : "bg-sky-300")} />
                  <span className="truncate">{r.title}</span>
                </span>
                <span className="shrink-0 pl-5 text-[12px] text-brand-300 sm:pl-0">{r.state}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </RiseItem>

      {/* Kuota */}
      <RiseItem className="md:col-span-2">
        <div className="flex h-full flex-col rounded-[28px] bg-brand-100 p-7">
          <p className="text-[13px] text-brand-800">Kuota real-time</p>
          <p className="display mt-auto pt-10 text-[56px] font-semibold leading-none text-brand-950">
            <Counter value={pct} />%
          </p>
          <p className="mt-2 text-[14px] text-brand-900/80">stand terisi di event unggulan</p>
          <FillBar pct={pct} className="mt-5 bg-white/70" />
          <p className="mt-2 text-[12px] text-brand-900/60">{confirmed} dari {capacity} stand dikonfirmasi</p>
        </div>
      </RiseItem>

      {/* Verification */}
      <RiseItem className="md:col-span-2">
        <div className="flex h-full flex-col rounded-[28px] bg-white p-7 ring-1 ring-black/[0.06]">
          <span className="grid size-12 place-items-center rounded-2xl bg-sky-tint text-sky-ink"><BadgeCheck className="size-6" aria-hidden /></span>
          <h3 className="display mt-6 text-[22px] font-semibold text-brand-950">Diverifikasi Disperindag</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-[#4c5c54]">Event dan berkas diperiksa sebelum tampil atau diteruskan ke penyelenggara.</p>
        </div>
      </RiseItem>

      {/* Security */}
      <RiseItem className="md:col-span-2">
        <div className="flex h-full flex-col rounded-[28px] bg-white p-7 ring-1 ring-black/[0.06]">
          <span className="grid size-12 place-items-center rounded-2xl bg-[#fdeee9] text-coral"><Lock className="size-6" aria-hidden /></span>
          <h3 className="display mt-6 text-[22px] font-semibold text-brand-950">Dokumen tetap privat</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-[#4c5c54]">NIB &amp; dokumen legal hanya dapat dibuka pemilik dan admin, lewat tautan sementara.</p>
        </div>
      </RiseItem>

      {/* Photo */}
      <RiseItem className="md:col-span-2">
        <Link href="/umkm" className="group relative block h-full min-h-64 overflow-hidden rounded-[28px]">
          <Image src="/images/jajan-pasar.jpg" alt="Aneka jajanan pasar tradisional" fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-950/90 via-brand-950/30 to-transparent" aria-hidden />
          <div className="absolute inset-x-6 bottom-6 flex items-end justify-between gap-3 text-white">
            <div>
              <p className="text-[13px] text-white/70">Direktori</p>
              <h3 className="display text-[22px] font-semibold leading-tight">Produk lokal terverifikasi</h3>
            </div>
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-brand-950 transition-transform duration-300 group-hover:rotate-45"><ArrowUpRight className="size-4" aria-hidden /></span>
          </div>
        </Link>
      </RiseItem>
    </RiseGroup>
  );
}

/* ------------------------------------------------------------ stats */
export function StatsBand({ stats, dark = false }: { stats: { events: number; umkm: number; stands: number; organizers: number }; dark?: boolean }) {
  const items = [
    { v: stats.events, l: "Event terbit", d: "Disetujui Disperindag" },
    { v: stats.umkm, l: "UMKM di direktori", d: "Terverifikasi & publik" },
    { v: stats.stands, l: "Stand dikonfirmasi", d: "Nomor lapak final" },
    { v: stats.organizers, l: "Penyelenggara", d: "Profil terverifikasi" },
  ];
  return (
    <RiseGroup className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4 [&>*]:min-w-0">
      {items.map((s) => (
        <RiseItem key={s.l} className={cn("border-l pl-5", dark ? "border-white/15" : "border-black/[0.08]")}>
          <Counter value={s.v} className={cn("display block text-[52px] font-semibold leading-none sm:text-[64px]", dark ? "text-white" : "text-brand-950")} />
          <p className={cn("mt-3 text-[15px] font-medium", dark ? "text-white" : "text-brand-950")}>{s.l}</p>
          <p className={cn("text-[13px]", dark ? "text-brand-300" : "text-[#5b6b63]")}>{s.d}</p>
        </RiseItem>
      ))}
    </RiseGroup>
  );
}

/* ------------------------------------------------------------ event card v3 */
export interface LandingEvent {
  id: string;
  slug: string;
  title: string;
  category: string;
  cover: string;
  dateLabel: string;
  day: string;
  month: string;
  place: string;
  remaining: number;
  capacity: number;
  stateLabel: string;
  open: boolean;
}

export function EventTile({ e }: { e: LandingEvent }) {
  const pct = e.capacity ? Math.round(((e.capacity - e.remaining) / e.capacity) * 100) : 0;
  return (
    <Link href={`/events/${e.slug}`} className="group block h-full overflow-hidden rounded-[28px] bg-white p-2 ring-1 ring-black/[0.06] transition-[box-shadow,transform] duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(5,35,26,.4)]">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[22px]">
        <Image src={e.cover} alt={`Foto ${e.title}`} fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 90vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]" />
        <div className="glass absolute left-3 top-3 rounded-2xl px-3 py-1.5 text-center">
          <p className="display text-[20px] font-semibold leading-none text-brand-950">{e.day}</p>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-brand-700">{e.month}</p>
        </div>
        <span className={cn("absolute right-3 top-3 rounded-full px-3 py-1 text-[12px] font-medium backdrop-blur", e.open ? "bg-brand-900/90 text-white" : "bg-white/95 text-brand-950 shadow-sm")}>
          {e.open && <span className="mr-1.5 inline-block size-1.5 animate-pulse rounded-full bg-brand-300 align-middle" />}
          {e.stateLabel}
        </span>
      </div>
      <div className="px-3 pb-3 pt-4">
        <p className="text-[12px] font-medium text-brand-700">{e.category}</p>
        <h3 className="display mt-1 line-clamp-2 text-[20px] font-semibold leading-snug text-brand-950">{e.title}</h3>
        <div className="mt-3 space-y-1 text-[13px] text-[#5b6b63]">
          <p className="flex items-center gap-2"><CalendarDays className="size-4" aria-hidden />{e.dateLabel}</p>
          <p className="flex items-center gap-2"><MapPin className="size-4" aria-hidden /><span className="truncate">{e.place}</span></p>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <FillBar pct={pct} className="flex-1" />
          <span className="shrink-0 text-[12px] text-[#5b6b63]"><strong className="text-brand-950">{e.remaining}</strong>/{e.capacity} sisa</span>
        </div>
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------ steps with drawn line */
const STEPS = [
  { icon: UserRoundPlus, t: "Buat akun & profil", b: "Isi data usaha dan dokumen legal sekali saja." },
  { icon: CalendarDays, t: "Pilih event", b: "Daftar stand pada event yang sedang dibuka." },
  { icon: FileCheck2, t: "Verifikasi & seleksi", b: "Disperindag memeriksa berkas, penyelenggara menyeleksi." },
  { icon: Ticket, t: "Nomor stand", b: "Hasil akhir dan nomor lapak tampil di dashboard." },
];

export function Steps() {
  const { ref, progress } = useParallax(["start end", "end start"]);
  const reduce = useReducedMotion();
  const draw = useTransform(progress, [0.1, 0.55], reduce ? [1, 1] : [0, 1]);
  return (
    <div ref={ref} className="relative mt-14">
      <div className="absolute left-[23px] top-0 h-full w-px bg-black/[0.08] md:left-0 md:top-[23px] md:h-px md:w-full" aria-hidden />
      <motion.div style={{ scaleY: draw }} className="absolute left-[23px] top-0 h-full w-px origin-top bg-brand-500 md:hidden" aria-hidden />
      <motion.div style={{ scaleX: draw }} className="absolute left-0 top-[23px] hidden h-px w-full origin-left bg-brand-500 md:block" aria-hidden />
      <RiseGroup className="relative grid gap-10 md:grid-cols-4 md:gap-6 [&>*]:min-w-0">
        {STEPS.map((s, i) => (
          <RiseItem key={s.t} className="flex gap-5 md:block">
            <span className="relative grid size-12 shrink-0 place-items-center rounded-full bg-white text-brand-700 shadow-[0_8px_20px_-10px_rgba(5,35,26,.4)] ring-1 ring-brand-300/60">
              <s.icon className="size-5" aria-hidden />
            </span>
            <div className="md:mt-6">
              <p className="text-[12px] font-medium text-[#9aa8a1]">Langkah 0{i + 1}</p>
              <h3 className="display mt-1 text-[20px] font-semibold text-brand-950">{s.t}</h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-[#4c5c54]">{s.b}</p>
            </div>
          </RiseItem>
        ))}
      </RiseGroup>
    </div>
  );
}

/* ------------------------------------------------------------ UMKM tiles */
export interface LandingUmkm {
  id: string;
  slug: string;
  name: string;
  category: string;
  district: string;
  img: string | null;
}

export function UmkmTiles({ items }: { items: LandingUmkm[] }) {
  return (
    <RiseGroup className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 [&>*]:min-w-0">
      {items.map((u, i) => (
        <RiseItem key={u.id} className={cn(i === 0 && "col-span-2 row-span-2 lg:col-span-2")}>
          <Link href={`/umkm/${u.slug}`} className="group relative block h-full min-h-48 overflow-hidden rounded-[24px] bg-canvas">
            {u.img ? (
              <Image src={u.img} alt={`Foto usaha ${u.name}`} fill sizes={i === 0 ? "(min-width:1024px) 50vw, 100vw" : "(min-width:1024px) 25vw, 50vw"} className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
            ) : (
              <div className="grid size-full place-items-center text-[#9aa8a1]"><Store className="size-8" aria-hidden /></div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950/90 via-brand-950/25 to-transparent" aria-hidden />
            <div className="absolute inset-x-4 bottom-4 text-white [text-shadow:0_1px_12px_rgba(0,0,0,.35)]">
              <p className="text-[12px] text-white/85">{u.category} · {u.district}</p>
              <h3 className={cn("display font-semibold leading-tight", i === 0 ? "text-[24px] sm:text-[30px]" : "text-[16px]")}>{u.name}</h3>
            </div>
          </Link>
        </RiseItem>
      ))}
    </RiseGroup>
  );
}

/* ------------------------------------------------------------ CTA */
export function FinalCta() {
  const { ref, progress } = useParallax();
  const y = useRange(progress, -40, 40);
  return (
    <div ref={ref} className="noise relative overflow-hidden rounded-[36px] bg-brand-900 px-6 py-14 text-white sm:px-12 sm:py-20">
      <div className="absolute -left-24 -top-24 size-96 rounded-full bg-brand-500/40 blur-[100px]" aria-hidden />
      <div className="absolute -bottom-32 right-10 size-96 rounded-full bg-sky-400/20 blur-[110px]" aria-hidden />
      <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="inline-flex items-center gap-2 text-[13px] text-brand-300"><span className="h-px w-6 bg-brand-300" aria-hidden />Untuk penyelenggara</p>
          <h2 className="display mt-3 text-[34px] font-semibold leading-[1.05] sm:text-[52px]">Punya event untuk UMKM Sumedang?</h2>
          <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-white/70">Komunitas, EO, desa, dan instansi dapat mengajukan event. Setelah disetujui Disperindag, event tampil publik dan Anda menyeleksi peserta yang berkasnya sudah diperiksa.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <PillLink href="/daftar/penyelenggara" tone="light">Ajukan event</PillLink>
            <PillLink href="/daftar/umkm" tone="ghost">Daftar sebagai UMKM</PillLink>
          </div>
        </div>
        <motion.div style={{ y }} className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[28px] ring-1 ring-white/10">
          <Image src="/images/pasar-malam-1.jpg" alt="Deretan stand UMKM pada bazar malam" fill sizes="(min-width:1024px) 30vw, 80vw" className="object-cover" />
          <div className="glass absolute inset-x-4 bottom-4 rounded-2xl p-4 text-brand-950">
            <p className="text-[12px] text-[#5b6b63]">Pengajuan event</p>
            <p className="display text-[17px] font-semibold">Ditinjau Disperindag → terbit</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
