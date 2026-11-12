"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";
import { EventIcon, InfoIcon, MegaphoneIcon, SearchStatusIcon, StoreIcon, UsersIcon, VerifiedIcon } from "@/components/icons";
import { MedalMark } from "@/components/brand";
import { BlurWords, Counter, EASE, PillLink, useParallax, useRange } from "@/components/landing/kit";
import { cn } from "@/lib/cn";

export interface HeroStats {
  events: number;
  umkm: number;
  stands: number;
  organizers: number;
}

const STEPS = ["Berkas", "Verifikasi", "Seleksi", "Nomor stand"];

const LINKS = [
  { href: "/events", label: "Jelajahi event & bazar", sub: "Event yang sedang buka pendaftaran", icon: EventIcon, tint: "bg-brand-100 text-brand-800", featured: true },
  { href: "/daftar/umkm", label: "Daftarkan usaha saya", sub: "Untuk pelaku UMKM Sumedang", icon: StoreIcon, tint: "bg-brand-100 text-brand-800" },
  { href: "/daftar/penyelenggara", label: "Ajukan event", sub: "Komunitas, EO, desa & instansi", icon: MegaphoneIcon, tint: "bg-sky-tint text-sky-ink" },
  { href: "/umkm", label: "Direktori UMKM", sub: "Produk lokal terverifikasi", icon: UsersIcon, tint: "bg-[#fdeee9] text-coral" },
  { href: "/cek-status", label: "Cek status pendaftaran", sub: "Berkas hingga nomor stand", icon: SearchStatusIcon, tint: "bg-brand-100 text-brand-800" },
  { href: "/tentang", label: "Tentang MEDAL", sub: "Program & tim pengembang", icon: InfoIcon, tint: "bg-canvas text-brand-900" },
];

function Blobs() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-sky-50 via-white to-white md:from-brand-100/80 md:via-brand-50/40" />
      <div className="bg-grid fade-mask absolute inset-0" />
      {/* green: soft corner on mobile, large wash on desktop */}
      <div className="absolute -left-24 -top-24 size-64 rounded-full bg-brand-300/35 blur-[80px] md:-left-40 md:-top-48 md:size-[38rem] md:bg-brand-300/50 md:blur-[110px]" />
      {/* blue + coral highlights balance the green */}
      <div className="absolute -right-20 top-6 size-72 rounded-full bg-sky-300/45 blur-[80px] md:-right-32 md:top-0 md:size-[30rem] md:bg-sky-200/70 md:blur-[100px]" />
      <div className="absolute -left-16 top-[48%] size-56 rounded-full bg-sky-200/50 blur-[80px] md:hidden" />
      <div className="absolute right-[10%] top-[30%] size-32 rounded-full bg-coral/15 blur-[60px] md:right-[18%] md:top-[42%] md:size-40" />
      <svg className="absolute left-1/2 top-[8%] hidden w-[1100px] -translate-x-1/2 text-brand-500/15 md:block" viewBox="0 0 1100 600" fill="none">
        <ellipse cx="550" cy="300" rx="540" ry="290" stroke="currentColor" />
        <ellipse cx="550" cy="300" rx="420" ry="220" stroke="currentColor" strokeDasharray="4 8" />
        <ellipse cx="550" cy="300" rx="300" ry="150" stroke="currentColor" />
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------- mobile: link-in-bio */
function MobileHero({ stats }: { stats: HeroStats }) {
  const reduce = useReducedMotion();
  return (
    <div className="relative px-5 pb-12 pt-8 md:hidden">
      <div className="flex flex-col items-center text-center">
        <motion.div initial={reduce ? false : { scale: 0.7, opacity: 0, filter: "blur(10px)" }} animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }} transition={{ duration: 0.9, ease: EASE }} className="relative">
          <div className="absolute -inset-2 rounded-[30px] bg-gradient-to-br from-sky-300/50 to-brand-300/40 blur-md" aria-hidden />
          <div className="relative grid size-20 place-items-center rounded-[24px] bg-white shadow-[0_12px_30px_-12px_rgba(5,35,26,.45)] ring-1 ring-black/5">
            <MedalMark className="size-12" />
          </div>
        </motion.div>
        <h1 className="display mt-5 text-[34px] font-semibold leading-none text-brand-950">
          <BlurWords text="MEDAL" delay={0.1} />
        </h1>
        <motion.p initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }} className="mt-2 text-[13px] font-medium text-brand-700">
          Media · Event · Dagang &amp; Lapak
        </motion.p>
        <motion.p initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.7, ease: EASE }} className="mt-3 max-w-[18rem] text-[15px] leading-relaxed text-[#4c5c54]">
          Portal event &amp; stand UMKM Kabupaten Sumedang, diverifikasi Disperindag.
        </motion.p>

        <motion.div initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.7, ease: EASE }} className="mt-5 flex w-full max-w-sm divide-x divide-black/[0.06] rounded-2xl bg-white/90 py-3 shadow-[0_12px_30px_-20px_rgba(47,111,168,.5)] ring-1 ring-black/[0.05] backdrop-blur">
          {[
            { v: stats.events, l: "Event" },
            { v: stats.umkm, l: "UMKM" },
            { v: stats.stands, l: "Stand" },
          ].map((s) => (
            <div key={s.l} className="flex-1">
              <Counter value={s.v} className="display block text-[22px] font-semibold text-brand-950" />
              <span className="text-[11px] text-[#5b6b63]">{s.l}</span>
            </div>
          ))}
        </motion.div>

        <motion.ul className="mt-5 flex w-full max-w-sm flex-col gap-2.5" initial="h" animate="s" variants={{ h: {}, s: { transition: { staggerChildren: 0.07, delayChildren: 0.6 } } }}>
          {LINKS.map((l) => (
            <motion.li key={l.href} variants={{ h: reduce ? { opacity: 1 } : { opacity: 0, y: 16, filter: "blur(6px)" }, s: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: EASE } } }}>
              <Link
                href={l.href}
                className={cn(
                  "group flex items-center gap-3 rounded-2xl p-2.5 pr-4 text-left transition-transform duration-200 active:scale-[0.98]",
                  l.featured ? "bg-brand-900 text-white shadow-[0_14px_30px_-14px_rgba(5,35,26,.7)]" : "bg-white/90 ring-1 ring-black/[0.05] backdrop-blur",
                )}
              >
                <span className={cn("grid size-11 shrink-0 place-items-center rounded-xl", l.featured ? "bg-white/10 text-brand-300" : l.tint)}>
                  <l.icon className="size-5" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-semibold leading-tight">{l.label}</span>
                  <span className={cn("mt-0.5 block truncate text-xs", l.featured ? "text-white/65" : "text-[#5b6b63]")}>{l.sub}</span>
                </span>
                <ArrowRight className={cn("size-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5", l.featured ? "text-brand-300" : "text-[#9aa8a1]")} aria-hidden />
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- desktop */
function DesktopHero({ headline, subheadline, stats, thumbs }: { headline: string; subheadline: string; stats: HeroStats; thumbs: string[] }) {
  const reduce = useReducedMotion();
  const { ref, progress } = useParallax(["start start", "end start"]);
  const imgY = useRange(progress, 0, 120);
  const imgScale = useTransform(progress, [0, 1], reduce ? [1, 1] : [1, 1.08]);
  const cardL = useRange(progress, 0, -90);
  const cardR = useRange(progress, 0, -150);
  const cardB = useRange(progress, 0, -60);
  const [first, ...rest] = headline.split(". ");
  const second = rest.join(". ");

  const pop = (d: number) => ({
    initial: reduce ? false : { opacity: 0, y: 24, scale: 0.96, filter: "blur(8px)" },
    animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
    transition: { duration: 0.9, ease: EASE, delay: d },
  });

  return (
    <div ref={ref} className="relative hidden pb-24 pt-14 md:block lg:pt-20">
      <div className="container-page text-center">
        <motion.p {...pop(0)} className="mx-auto inline-flex items-center gap-2 rounded-full bg-white/80 py-1.5 pl-1.5 pr-4 text-[13px] font-medium text-brand-900 ring-1 ring-black/[0.06] backdrop-blur">
          <span className="rounded-full bg-brand-900 px-2.5 py-0.5 text-[11px] font-semibold text-white">Resmi</span>
          Bersama Disperindag Kabupaten Sumedang
        </motion.p>
        <h1 className="display mx-auto mt-7 max-w-4xl text-[56px] font-semibold leading-[1.02] text-brand-950 lg:text-[76px]">
          <BlurWords text={first.endsWith(".") ? first : `${first}.`} delay={0.1} />
          {second && (
            <>
              <br />
              <BlurWords text={second} delay={0.35} className="text-brand-700" />
            </>
          )}
        </h1>
        <motion.p {...pop(0.55)} className="mx-auto mt-6 max-w-2xl text-[18px] leading-relaxed text-[#4c5c54]">
          {subheadline}
        </motion.p>
        <motion.div {...pop(0.7)} className="mt-9 flex justify-center gap-3">
          <PillLink href="/events">Jelajahi event</PillLink>
          <PillLink href="/daftar/umkm" tone="light">Daftarkan usaha</PillLink>
        </motion.div>
      </div>

      {/* Showcase */}
      <div className="container-page relative mt-16">
        <motion.div {...pop(0.5)} className="relative mx-auto aspect-[2.2/1] max-w-6xl overflow-hidden rounded-[32px] bg-brand-900 shadow-[0_40px_80px_-40px_rgba(5,35,26,.55)]">
          <motion.div style={{ y: imgY, scale: imgScale }} className="absolute -inset-y-16 inset-x-0">
            <Image src="/images/pasar-malam-2.jpg" alt="Suasana bazar malam UMKM yang ramai pengunjung" fill priority sizes="(min-width:1200px) 1150px, 100vw" className="object-cover" />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-brand-950/70 via-brand-950/10 to-transparent" aria-hidden />
          <div className="absolute bottom-7 left-8 max-w-sm text-left text-white">
            <p className="text-[13px] text-white/70">Dari dapur rumah ke lapak festival</p>
            <p className="display mt-1 text-[26px] font-semibold leading-tight">Setiap usaha layak mendapat panggung.</p>
          </div>
        </motion.div>

        {/* Floating glass cards */}
        <motion.div style={{ y: cardL }} className="absolute -left-2 top-10 hidden w-60 lg:block xl:left-4">
          <motion.div {...pop(0.9)} className="glass rounded-3xl p-5 text-left">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-medium text-brand-900">Event terbit</p>
              <span className="flex items-center gap-1 rounded-full bg-brand-100 px-2 py-0.5 text-[11px] font-medium text-brand-800">
                <span className="size-1.5 animate-pulse rounded-full bg-brand-500" /> Live
              </span>
            </div>
            <Counter value={stats.events} className="display mt-1 block text-[44px] font-semibold leading-none text-brand-950" />
            <div className="mt-4 grid grid-cols-2 gap-2 border-t border-black/[0.06] pt-3">
              <div>
                <Counter value={stats.stands} className="display block text-[20px] font-semibold text-brand-950" />
                <p className="text-[11px] text-[#45544c]">Stand dikonfirmasi</p>
              </div>
              <div>
                <Counter value={stats.organizers} className="display block text-[20px] font-semibold text-brand-950" />
                <p className="text-[11px] text-[#45544c]">Penyelenggara</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div style={{ y: cardR }} className="absolute -right-2 top-24 hidden w-64 lg:block xl:right-4">
          <motion.div {...pop(1.05)} className="glass rounded-3xl p-5 text-left">
            <p className="text-[13px] font-medium text-brand-950">Alur pendaftaran stand</p>
            <ol className="mt-4 space-y-3">
              {STEPS.map((s, i) => (
                <li key={s} className="flex items-center gap-3 text-[13px]">
                  <motion.span
                    className={cn("grid size-6 place-items-center rounded-full text-[11px] font-semibold", i < 3 ? "bg-brand-700 text-white" : "bg-white text-brand-700 ring-2 ring-brand-500")}
                    initial={reduce ? false : { scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 18, delay: 1.3 + i * 0.12 }}
                  >
                    {i < 3 ? "✓" : i + 1}
                  </motion.span>
                  <span className={i < 3 ? "text-brand-950" : "font-medium text-brand-700"}>{s}</span>
                </li>
              ))}
            </ol>
          </motion.div>
        </motion.div>

        <motion.div style={{ y: cardB }} className="absolute -bottom-10 left-1/2 hidden -translate-x-1/2 lg:block">
          <motion.div {...pop(1.2)} className="glass flex items-center gap-4 rounded-full py-2.5 pl-2.5 pr-6">
            <div className="flex -space-x-3">
              {thumbs.slice(0, 4).map((t) => (
                <div key={t} className="relative size-10 overflow-hidden rounded-full ring-2 ring-white">
                  <Image src={t} alt="" fill sizes="40px" className="object-cover" />
                </div>
              ))}
            </div>
            <p className="text-left text-[13px] leading-tight text-[#4c5c54]">
              <Counter value={stats.umkm} className="display text-[18px] font-semibold text-brand-950" /> UMKM terverifikasi
              <br />
              <span className="inline-flex items-center gap-1 text-brand-700"><VerifiedIcon className="size-4" /> diperiksa Disperindag</span>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export function LandingHero(props: { headline: string; subheadline: string; stats: HeroStats; thumbs: string[] }) {
  return (
    <section className="relative isolate -mt-[68px] overflow-hidden pt-[68px] sm:-mt-[76px] sm:pt-[76px]">
      <Blobs />
      <MobileHero stats={props.stats} />
      <DesktopHero {...props} />
    </section>
  );
}
