import Link from "next/link";
import { cn } from "@/lib/cn";

export function StatusTabs({ tabs, active, basePath, extra }: { tabs: { key: string; label: string; count?: number }[]; active: string; basePath: string; extra?: Record<string, string | undefined> }) {
  return (
    <div className="mb-6 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]" role="tablist">
      {tabs.map((t) => {
        const sp = new URLSearchParams();
        Object.entries(extra ?? {}).forEach(([k, v]) => v && sp.set(k, v));
        if (t.key !== "all") sp.set("status", t.key);
        const href = `${basePath}${sp.toString() ? `?${sp}` : ""}`;
        return (
          <Link key={t.key} href={href} role="tab" aria-selected={active === t.key} className={cn("whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition", active === t.key ? "border-forest bg-forest text-ivory" : "border-line bg-surface text-ink/75 hover:border-emerald")}>
            {t.label}
            {t.count !== undefined && <span className="ml-1.5 opacity-70">{t.count}</span>}
          </Link>
        );
      })}
    </div>
  );
}

export function SearchBox({ defaultValue, placeholder, hidden }: { defaultValue?: string; placeholder: string; hidden?: Record<string, string | undefined> }) {
  return (
    <form method="get" role="search" className="mb-4 flex gap-2">
      {Object.entries(hidden ?? {}).map(([k, v]) => (v ? <input key={k} type="hidden" name={k} value={v} /> : null))}
      <label className="flex-1">
        <span className="sr-only">Cari</span>
        <input name="q" defaultValue={defaultValue} placeholder={placeholder} className="h-11 w-full rounded-full border border-line bg-surface px-4 text-sm focus:border-emerald focus:outline-none focus:ring-4 focus:ring-emerald/10" />
      </label>
      <button className="h-11 rounded-full bg-emerald px-5 text-sm font-semibold text-ivory hover:bg-forest">Cari</button>
    </form>
  );
}
