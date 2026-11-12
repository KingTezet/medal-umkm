"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowDown, BadgeCheck, CalendarSearch, Store } from "lucide-react";
import { MedalMark } from "@/components/brand";
import { ButtonLink } from "@/components/ui/button";
import { LinkStack } from "@/components/home/link-stack";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero({ headline, subheadline }: { headline: string; subheadline: string }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "28%"]);
  const fgY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "-12%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, reduce ? 1 : 0]);

  // Split headline into sentences; second one gets the gold italic treatment.
  const parts = headline.split(/(?<=\.)\s+/);

  return (
    <section ref={ref} className="relative isolate overflow-hidden bg-night text-ivory">
      {/* Background photo with parallax */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 -z-20">
        <Image src="/images/pasar-malam-2.jpg" alt="" fill priority sizes="100vw" className="object-cover opacity-35 lg:opacity-25" />
      </motion.div>
      <div className="bg-emerald-mesh absolute inset-0 -z-10 opacity-[0.92]" aria-hidden />
      <div className="bg-grain absolute inset-0 -z-10" aria-hidden />
      <div className="absolute -left-40 top-1/3 -z-10 size-[28rem] rounded-full bg-jade/30 blur-[120px]" aria-hidden />
      <div className="absolute -right-24 -top-24 -z-10 size-[24rem] rounded-full bg-gold/20 blur-[110px]" aria-hidden />

      {/* ---------- Mobile: link-in-bio layout ---------- */}
      <motion.div style={{ opacity: fade }} className="container-page relative flex min-h-dvh flex-col items-center px-5 pb-14 pt-24 lg:hidden">
        <motion.div initial={reduce ? false : { scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.9, ease }} className="relative">
          <div className="absolute inset-0 animate-[spin_14s_linear_infinite] rounded-full bg-[conic-gradient(from_0deg,#c6a15b,#f3e2b6,#2b8a67,#c6a15b)] p-[3px] blur-[1px]" aria-hidden />
          <div className="relative m-[3px] grid size-24 place-items-center rounded-full bg-night">
            <MedalMark className="size-14" />
          </div>
        </motion.div>
        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.15 }}
          className="mt-5 text-center font-display text-[2.6rem] font-semibold leading-none tracking-[0.08em]"
        >
          MEDAL
        </motion.h1>
        <motion.p initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25, duration: 0.8 }} className="mt-2 text-center text-[0.7rem] font-bold uppercase tracking-[0.22em] text-gold-soft">
          Media · Event · Dagang &amp; Lapak
        </motion.p>
        <motion.p initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }} className="mt-4 max-w-xs text-center text-sm leading-relaxed text-ivory/75">
          Portal resmi event &amp; stand UMKM Kabupaten Sumedang, diverifikasi Disperindag.
        </motion.p>
        <div className="mt-7 w-full max-w-md">
          <LinkStack />
        </div>
        <motion.a
          href="#cara-kerja"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-9 flex flex-col items-center gap-1 text-xs font-semibold uppercase tracking-[0.2em] text-ivory/55"
        >
          Gulir untuk selengkapnya
          <ArrowDown className="size-4 animate-bounce" aria-hidden />
        </motion.a>
      </motion.div>

      {/* ---------- Desktop: editorial split ---------- */}
      <div className="container-page relative hidden min-h-[100svh] grid-cols-[1.15fr_1fr] items-center gap-14 pb-20 pt-32 lg:grid">
        <motion.div style={{ opacity: fade }}>
          <motion.p initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }} className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-gold-soft backdrop-blur">
            <BadgeCheck className="size-4 text-gold" aria-hidden /> Media · Event · Dagang &amp; Lapak
          </motion.p>
          <h1 className="mt-7 font-display text-[3.9rem] leading-[0.98] tracking-tight xl:text-[4.6rem]">
            {parts.map((p, i) => (
              <motion.span
                key={i}
                initial={reduce ? false : { opacity: 0, y: 40, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1, ease, delay: 0.12 + i * 0.14 }}
                className={i === 1 ? "text-gold-gradient block italic" : "block"}
              >
                {p}
              </motion.span>
            ))}
          </h1>
          <motion.p initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.55 }} className="mt-7 max-w-xl text-lg leading-relaxed text-ivory/75">
            {subheadline}
          </motion.p>
          <motion.div initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.7 }} className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href="/events" variant="gold" size="lg">
              <CalendarSearch className="size-5" aria-hidden /> Jelajahi Event
            </ButtonLink>
            <ButtonLink href="/daftar/umkm" variant="outline-light" size="lg">
              <Store className="size-5" aria-hidden /> Daftarkan Usaha
            </ButtonLink>
          </motion.div>
        </motion.div>

        <motion.div style={{ y: fgY }} className="relative">
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.94, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, ease, delay: 0.2 }}
            className="relative ml-auto aspect-[4/5] w-full max-w-[30rem] overflow-hidden rounded-[2.5rem] border border-white/10 shadow-[0_60px_120px_-40px_rgba(0,0,0,.7)]"
          >
            <Image src="/images/pasar-malam-6.jpg" alt="Pelaku UMKM melayani pembeli di stand pasar malam" fill priority sizes="40vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-night via-night/30 to-transparent" aria-hidden />
            <div className="absolute inset-x-5 bottom-5 rounded-3xl border border-white/15 bg-night/55 p-4 backdrop-blur-xl">
              <p className="mb-3 px-1 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-gold-soft">Akses cepat</p>
              <LinkStack compact className="[&>li:nth-child(n+4)]:hidden" />
            </div>
          </motion.div>
          <motion.div
            initial={reduce ? false : { opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease, delay: 0.8 }}
            className="absolute -left-10 top-14 w-44 overflow-hidden rounded-3xl border-4 border-night shadow-2xl"
          >
            <div className="relative aspect-square">
              <Image src="/images/kue-lumpur.jpg" alt="Kue lumpur pandan, jajanan pasar" fill sizes="176px" className="object-cover" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
