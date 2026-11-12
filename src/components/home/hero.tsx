"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { EASE } from "@/components/motion";

export function Hero({ headline, subheadline }: { headline: string; subheadline: string }) {
  const reduce = useReducedMotion();
  const up = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: EASE, delay },
  });

  return (
    <section className="bg-white">
      <div className="container-page grid items-center gap-8 py-10 sm:py-14 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:py-20">
        <div>
          <motion.p {...up(0)} className="inline-flex items-center gap-1.5 rounded-md bg-primary-soft px-2.5 py-1 text-[13px] font-medium text-primary">
            <ShieldCheck className="size-4" aria-hidden /> Bersama Disperindag Kabupaten Sumedang
          </motion.p>
          <motion.h1 {...up(0.06)} className="mt-5 text-[34px] font-semibold leading-[1.1] tracking-[-0.025em] text-ink sm:text-[44px] lg:text-[52px]">
            {headline}
          </motion.h1>
          <motion.p {...up(0.12)} className="mt-4 max-w-xl text-base leading-relaxed text-muted sm:text-[17px]">
            {subheadline}
          </motion.p>
          <motion.div {...up(0.18)} className="mt-7 flex flex-col gap-2.5 sm:flex-row">
            <ButtonLink href="/events" size="lg">
              Jelajahi Event <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
            <ButtonLink href="/daftar/umkm" variant="secondary" size="lg">
              Daftarkan Usaha
            </ButtonLink>
          </motion.div>
        </div>
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
          className="relative aspect-[4/3] overflow-hidden rounded-xl bg-surface-muted lg:aspect-[5/4]"
        >
          <Image src="/images/pasar-malam-6.jpg" alt="Pelaku UMKM melayani pembeli di stand pasar malam" fill priority sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
        </motion.div>
      </div>
    </section>
  );
}
