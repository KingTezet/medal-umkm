import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight, Inbox } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Tone } from "@/lib/constants";

const toneClass: Record<Tone, string> = {
  neutral: "bg-stone-100 text-stone-700 ring-stone-300/60",
  info: "bg-sky-50 text-sky-800 ring-sky-300/60",
  success: "bg-mint/70 text-forest ring-emerald/25",
  warning: "bg-amber-50 text-amber-800 ring-amber-300/70",
  danger: "bg-red-50 text-red-800 ring-red-300/60",
  gold: "bg-gold-soft/60 text-gold-deep ring-gold/40",
};

export function Badge({ tone = "neutral", children, className, dot = true }: { tone?: Tone; children: ReactNode; className?: string; dot?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset", toneClass[tone], className)}>
      {dot && <span className="size-1.5 rounded-full bg-current opacity-70" aria-hidden />}
      {children}
    </span>
  );
}

export function StatusBadge({ map, status }: { map: Record<string, { label: string; tone: Tone }>; status: string }) {
  const s = map[status] ?? { label: status, tone: "neutral" as Tone };
  return <Badge tone={s.tone}>{s.label}</Badge>;
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-2xl border border-line bg-surface p-5 sm:p-6", className)}>{children}</div>;
}

export function SectionTitle({ eyebrow, title, description, action, className }: { eyebrow?: string; title: ReactNode; description?: ReactNode; action?: ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="max-w-2xl">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h2 className="font-display text-3xl leading-[1.08] tracking-tight text-ink sm:text-[2.6rem]">{title}</h2>
        {description && <p className="mt-3 text-base leading-relaxed text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({ title, description, action, icon }: { title: string; description?: string; action?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-line bg-surface/60 px-6 py-14 text-center">
      <div className="mb-4 grid size-14 place-items-center rounded-2xl bg-sage text-emerald">{icon ?? <Inbox className="size-6" aria-hidden />}</div>
      <h3 className="font-display text-xl text-ink">{title}</h3>
      {description && <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-muted">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="size-3.5 opacity-60" aria-hidden />}
            {it.href ? (
              <Link href={it.href} className="hover:text-emerald">
                {it.label}
              </Link>
            ) : (
              <span aria-current="page" className="font-medium text-ink">
                {it.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHeader({ title, description, action, eyebrow }: { title: string; description?: ReactNode; action?: ReactNode; eyebrow?: string }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h1 className="font-display text-[1.9rem] leading-tight tracking-tight text-ink sm:text-4xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted">{description}</p>}
      </div>
      {action && <div className="flex flex-wrap gap-2">{action}</div>}
    </div>
  );
}

export function StatCard({ label, value, hint, icon, accent = false }: { label: string; value: ReactNode; hint?: string; icon?: ReactNode; accent?: boolean }) {
  return (
    <div className={cn("relative overflow-hidden rounded-2xl border p-5", accent ? "border-transparent bg-forest text-ivory" : "border-line bg-surface")}>
      <div className="flex items-start justify-between gap-3">
        <p className={cn("text-sm font-medium", accent ? "text-ivory/75" : "text-muted")}>{label}</p>
        {icon && <span className={cn("grid size-9 place-items-center rounded-xl", accent ? "bg-white/10 text-gold" : "bg-sage text-emerald")}>{icon}</span>}
      </div>
      <p className={cn("mt-3 font-display text-4xl tracking-tight", accent ? "text-ivory" : "text-ink")}>{value}</p>
      {hint && <p className={cn("mt-1 text-xs", accent ? "text-ivory/60" : "text-muted")}>{hint}</p>}
    </div>
  );
}

export function Notice({ tone = "info", title, children }: { tone?: "info" | "warning" | "success" | "danger"; title?: string; children: ReactNode }) {
  const map = {
    info: "border-sky-200 bg-sky-50/70 text-sky-900",
    warning: "border-amber-200 bg-amber-50 text-amber-900",
    success: "border-emerald/20 bg-mint/50 text-forest",
    danger: "border-red-200 bg-red-50 text-red-900",
  };
  return (
    <div role={tone === "danger" ? "alert" : "status"} className={cn("rounded-2xl border px-4 py-3.5 text-sm leading-relaxed", map[tone])}>
      {title && <p className="mb-0.5 font-semibold">{title}</p>}
      <div>{children}</div>
    </div>
  );
}

export function DefinitionList({ items }: { items: { label: string; value: ReactNode }[] }) {
  return (
    <dl className="divide-y divide-line">
      {items.map((it) => (
        <div key={it.label} className="grid gap-1 py-3 sm:grid-cols-3 sm:gap-4">
          <dt className="text-sm text-muted">{it.label}</dt>
          <dd className="text-sm font-medium text-ink sm:col-span-2">{it.value || "-"}</dd>
        </div>
      ))}
    </dl>
  );
}

export function DataTable({ head, children, empty }: { head: string[]; children: ReactNode; empty?: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-line bg-ivory/80 text-xs uppercase tracking-wider text-muted">
            <tr>
              {head.map((h) => (
                <th key={h} scope="col" className="px-4 py-3 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">{children}</tbody>
        </table>
      </div>
      {empty}
    </div>
  );
}
