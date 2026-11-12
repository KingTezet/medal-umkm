import Link from "next/link";
import { Search } from "lucide-react";
import { cn } from "@/lib/cn";

/** Underline tabs (scrollable on mobile). */
export function StatusTabs({ tabs, active, basePath, extra }: { tabs: { key: string; label: string; count?: number }[]; active: string; basePath: string; extra?: Record<string, string | undefined> }) {
  return (
    <nav aria-label="Filter status" className="mb-5 border-b border-line">
      <ul className="-mb-px flex gap-5 overflow-x-auto [scrollbar-width:none]">
        {tabs.map((t) => {
          const sp = new URLSearchParams();
          Object.entries(extra ?? {}).forEach(([k, v]) => v && sp.set(k, v));
          if (t.key !== "all") sp.set("status", t.key);
          const href = `${basePath}${sp.toString() ? `?${sp}` : ""}`;
          const on = active === t.key;
          return (
            <li key={t.key}>
              <Link href={href} aria-current={on ? "page" : undefined} className={cn("flex items-center gap-1.5 whitespace-nowrap border-b-2 py-2.5 text-sm font-medium transition-colors duration-150", on ? "border-primary text-primary" : "border-transparent text-muted hover:text-ink")}>
                {t.label}
                {t.count !== undefined && <span className={cn("rounded px-1.5 text-xs tabular-nums", on ? "bg-primary-soft" : "bg-surface-muted")}>{t.count}</span>}
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
        <input name="q" defaultValue={defaultValue} placeholder={placeholder} className="h-10 w-full rounded-[10px] border border-line bg-white pl-10 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-3 focus:ring-primary/10" />
      </label>
      <button className="h-10 rounded-[10px] bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary-hover">Cari</button>
    </form>
  );
}
