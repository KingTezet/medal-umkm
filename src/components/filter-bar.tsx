"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { EASE } from "@/components/motion";
import { cn } from "@/lib/cn";

/**
 * GET search form. Desktop: filters inline. Mobile: filters in a sheet
 * opened by the "Filter" button (single set of inputs, so no duplicates).
 */
export function FilterBar({ q, placeholder, children, activeCount = 0, hidden }: { q?: string; placeholder: string; children: ReactNode; activeCount?: number; hidden?: Record<string, string | undefined> }) {
  const [open, setOpen] = useState(false);
  return (
    <form method="get" role="search" className="relative">
      {Object.entries(hidden ?? {}).map(([k, v]) => (v ? <input key={k} type="hidden" name={k} value={v} /> : null))}
      <div className="flex gap-2">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">Kata kunci</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
          <input name="q" defaultValue={q} placeholder={placeholder} className="h-12 w-full rounded-full border border-black/[0.08] bg-white pl-11 pr-4 text-[15px] shadow-[0_8px_24px_-16px_rgba(5,35,26,.35)] transition-[border-color,box-shadow] duration-200 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-300/30" />
        </label>
        <button type="button" onClick={() => setOpen(true)} className="relative inline-flex h-12 items-center gap-2 rounded-full bg-brand-100 px-4 text-sm font-medium text-brand-950 ring-1 ring-brand-300/60 md:hidden" aria-expanded={open} aria-controls="filter-sheet">
          <SlidersHorizontal className="size-4" aria-hidden /> Filter
          {activeCount > 0 && <span className="grid size-5 place-items-center rounded-full bg-primary text-[11px] text-white">{activeCount}</span>}
        </button>
        <button className="hidden h-12 rounded-full bg-brand-900 px-6 text-sm font-medium text-white transition-colors hover:bg-brand-800 md:block">Cari</button>
      </div>

      <div className="mt-3 hidden gap-3 md:grid md:grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">{!open && children}</div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div className="fixed inset-0 z-50 bg-ink/30 md:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
            <motion.div
              id="filter-sheet"
              role="dialog"
              aria-modal="true"
              aria-label="Filter"
              className="fixed inset-x-0 bottom-0 z-50 max-h-[85dvh] overflow-y-auto rounded-t-[28px] bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] md:hidden"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.28, ease: EASE }}
            >
              <div className="mb-4 flex items-center justify-between">
                <p className="text-base font-semibold">Filter</p>
                <button type="button" onClick={() => setOpen(false)} className="grid size-10 place-items-center rounded-lg hover:bg-surface-muted" aria-label="Tutup filter">
                  <X className="size-5" />
                </button>
              </div>
              <div className="grid gap-3">{children}</div>
              <button className="mt-5 h-12 w-full rounded-full bg-brand-900 text-[15px] font-medium text-white">Terapkan</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </form>
  );
}

export function FilterSelect({ label, name, defaultValue, options, className }: { label: string; name: string; defaultValue?: string; options: { value: string; label: string }[]; className?: string }) {
  return (
    <label className={cn("block text-[13px] font-medium text-ink", className)}>
      <span className="mb-1 block">{label}</span>
      <select name={name} defaultValue={defaultValue ?? ""} className="h-11 w-full rounded-xl border border-black/[0.08] bg-white px-3 text-sm font-normal">
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}

export function FilterDate({ label, name, defaultValue }: { label: string; name: string; defaultValue?: string }) {
  return (
    <label className="block text-[13px] font-medium text-ink">
      <span className="mb-1 block">{label}</span>
      <input type="date" name={name} defaultValue={defaultValue} className="h-11 w-full rounded-xl border border-black/[0.08] bg-white px-3 text-sm font-normal" />
    </label>
  );
}
