import Link from "next/link";
import { Search } from "lucide-react";
import { cn } from "@/lib/cn";

/** Underline tabs (scrollable on mobile). */
export function StatusTabs({ tabs, active, basePath, extra }: { tabs: { key: string; label: string; count?: number }[]; active: string; basePath: string; extra?: Record<string, string | undefined> }) {
  return (
    <nav aria-label="Filter status" className="mb-5">
      <ul className="flex w-fit max-w-full gap-1 overflow-x-auto rounded-full bg-brand-900/[0.05] p-1 [scrollbar-width:none]">
        {tabs.map((t) => {
          const sp = new URLSearchParams();
          Object.entries(extra ?? {}).forEach(([k, v]) => v && sp.set(k, v));
          if (t.key !== "all") sp.set("status", t.key);
          const href = `${basePath}${sp.toString() ? `?${sp}` : ""}`;
          const on = active === t.key;
          return (
            <li key={t.key}>
              <Link href={href} aria-current={on ? "page" : undefined} className={cn("flex h-9 items-center gap-1.5 whitespace-nowrap rounded-full px-4 text-sm font-medium transition-colors duration-200", on ? "bg-white text-brand-950 shadow-sm ring-1 ring-black/[0.05]" : "text-[#5b6b63] hover:text-brand-950")}>
                {t.label}
                {t.count !== undefined && <span className={cn("rounded-full px-1.5 text-xs tabular-nums", on ? "bg-brand-100 text-brand-800" : "bg-black/[0.05]")}>{t.count}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function SearchBox({ defaultValue, placeholder, hidden }: { defaultValue?: string; placeholder: string; hidden?: Record<string, string | undefined> }) {
  return (
    <form method="get" role="search" className="mb-4 flex gap-2">
      {Object.entries(hidden ?? {}).map(([k, v]) => (v ? <input key={k} type="hidden" name={k} value={v} /> : null))}
      <label className="relative min-w-0 flex-1">
        <span className="sr-only">Cari</span>
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
        <input name="q" defaultValue={defaultValue} placeholder={placeholder} className="h-11 w-full rounded-full border border-black/[0.08] bg-white pl-10 pr-4 text-sm focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-300/30" />
      </label>
      <button className="h-11 rounded-full bg-brand-900 px-5 text-sm font-medium text-white transition-colors hover:bg-brand-800">Cari</button>
    </form>
  );
}
