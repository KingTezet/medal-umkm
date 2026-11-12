"use client";

import { useId } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

export function MedalMark({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, "");
  const gold = `mm-gold-${uid}`;
  const green = `mm-green-${uid}`;
  return (
    <svg viewBox="0 0 48 48" className={cn("size-9", className)} aria-hidden>
      <defs>
        <linearGradient id={gold} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f3e2b6" />
          <stop offset=".5" stopColor="#c6a15b" />
          <stop offset="1" stopColor="#9c7a36" />
        </linearGradient>
        <linearGradient id={green} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2b8a67" />
          <stop offset="1" stopColor="#0e3a2b" />
        </linearGradient>
      </defs>
      <path d="M15 2h7l4 12h-7zM33 2h-7l-4 12h7z" fill={`url(#${green})`} />
      <circle cx="24" cy="29" r="17" fill={`url(#${gold})`} />
      <circle cx="24" cy="29" r="13.2" fill={`url(#${green})`} />
      <path d="M16.8 35.5V22.6l7.2 7.6 7.2-7.6v12.9" fill="none" stroke="#f3e2b6" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Wordmark({ light = false, className, compact = false }: { light?: boolean; className?: string; compact?: boolean }) {
  return (
    <Link href="/" className={cn("group inline-flex items-center gap-2.5", className)} aria-label="MEDAL — beranda">
      <MedalMark className="transition-transform duration-500 group-hover:rotate-[8deg]" />
      <span className="leading-none">
        <span className={cn("block font-display text-[1.45rem] font-semibold tracking-[0.06em]", light ? "text-ivory" : "text-forest")}>MEDAL</span>
        {!compact && (
          <span className={cn("mt-0.5 block text-[0.62rem] font-semibold uppercase tracking-[0.16em]", light ? "text-gold-soft/80" : "text-gold-deep")}>
            UMKM Sumedang · Disperindag
          </span>
        )}
      </span>
    </Link>
  );
}
