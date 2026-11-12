import Link from "next/link";
import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import { AlertCircle, CheckCircle2, ChevronRight, Circle, Clock, Inbox, Info, MinusCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/cn";
import { VerifiedIcon } from "@/components/icons";
import type { Tone } from "@/lib/constants";

const toneClass: Record<Tone, string> = {
  neutral: "bg-surface-muted text-muted border-line",
  info: "bg-[#eef3f8] text-[#2c5272] border-[#d9e4ee]",
  success: "bg-primary-soft text-primary border-primary-border",
  warning: "bg-[#fbf5ea] text-warning border-[#efe1c4]",
  danger: "bg-[#fbefef] text-danger border-[#f0d6d6]",
  gold: "bg-brand-900 text-white border-brand-900",
  verified: "bg-brand-100 text-brand-800 border-brand-300/60",
};

const toneIcon: Record<Tone, typeof Circle> = {
  neutral: MinusCircle,
  info: Clock,
  success: CheckCircle2,
  warning: AlertCircle,
  danger: XCircle,
  gold: CheckCircle2,
  verified: VerifiedIcon as unknown as typeof Circle,
};

/** Status label: text + icon, never colour alone. */
export function Badge({ tone = "neutral", children, className, dot = true }: { tone?: Tone; children: ReactNode; className?: string; dot?: boolean }) {
  const Icon = toneIcon[tone];
  return (
    <span className={cn("inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium", toneClass[tone], className)}>
      {dot && <Icon className={cn("size-3.5", tone === "verified" && "size-4 text-brand-700")} aria-hidden />}
      {children}
    </span>
  );
}

export function StatusBadge({ map, status }: { map: Record<string, { label: string; tone: Tone }>; status: string }) {
  const s = map[status] ?? { label: status, tone: "neutral" as Tone };
  return <Badge tone={s.tone}>{s.label}</Badge>;
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-[22px] bg-white p-5 ring-1 ring-black/[0.06] sm:p-6", className)}>{children}</div>;
}

export function SectionTitle({ eyebrow, title, description, action, className }: { eyebrow?: string; title: ReactNode; description?: ReactNode; action?: ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="max-w-2xl">
        {eyebrow && <p className="mb-2 inline-flex items-center gap-2 text-[13px] font-medium text-brand-700"><span className="h-px w-6 bg-brand-500" aria-hidden />{eyebrow}</p>}
        <h2 className="display text-[26px] font-semibold leading-[1.08] text-brand-950 sm:text-[36px]">{title}</h2>
        {description && <p className="mt-2 text-[15px] leading-relaxed text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({ title, description, action, icon }: { title: string; description?: string; action?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-[22px] border border-dashed border-brand-300/70 bg-brand-50/60 px-6 py-12 text-center">
      <div className="mb-4 grid size-12 place-items-center rounded-2xl bg-white text-brand-700 ring-1 ring-brand-300/60">{icon ?? <Inbox className="size-5" aria-hidden />}</div>
      <h3 className="display text-lg font-semibold text-brand-950">{title}</h3>
      {description && <p className="mt-1.5 max-w-md text-sm leading-relaxed text-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-3">
      <ol className="flex flex-wrap items-center gap-1 text-[13px] text-muted">
        {items.map((it, i) => (
          <li key={i} className="flex min-w-0 items-center gap-1">
            {i > 0 && <ChevronRight className="size-3.5 shrink-0 opacity-60" aria-hidden />}
            {it.href ? (
              <Link href={it.href} className="hover:text-primary">
                {it.label}
              </Link>
            ) : (
              <span aria-current="page" className="truncate font-medium text-ink">
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
    <div className="mb-6 flex flex-col gap-4 sm:mb-8 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0">
        {eyebrow && <p className="mb-1.5 inline-flex items-center gap-2 text-[13px] font-medium text-brand-700"><span className="h-px w-5 bg-brand-500" aria-hidden />{eyebrow}</p>}
        <h1 className="display text-[28px] font-semibold leading-[1.08] text-brand-950 sm:text-[36px]">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-[15px] leading-relaxed text-muted">{description}</p>}
      </div>
      {action && <div className="flex flex-wrap items-center gap-2">{action}</div>}
    </div>
  );
}

export function StatCard({ label, value, hint, icon, accent = false }: { label: string; value: ReactNode; hint?: string; icon?: ReactNode; accent?: boolean }) {
  return (
    <div className={cn("relative overflow-hidden rounded-[22px] p-5 sm:p-6", accent ? "bg-brand-900 text-white" : "bg-white ring-1 ring-black/[0.06]")}>
      {accent && <div className="bg-grid-light pointer-events-none absolute inset-0" aria-hidden />}
      {accent && <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-brand-500/40 blur-3xl" aria-hidden />}
      <div className="relative flex items-center justify-between gap-3">
        <p className={cn("text-[12px] font-medium leading-snug sm:text-[13px]", accent ? "text-brand-300" : "text-muted")}>{label}</p>
        {icon && <span className={cn("grid size-9 place-items-center rounded-xl", accent ? "bg-white/10 text-brand-300" : "bg-brand-100 text-brand-800")}>{icon}</span>}
      </div>
      <p className={cn("display relative mt-3 text-[34px] font-semibold leading-none tabular-nums", accent ? "text-white" : "text-brand-950")}>{value}</p>
      {hint && <p className={cn("relative mt-2 text-xs", accent ? "text-white/60" : "text-muted")}>{hint}</p>}
    </div>
  );
}

export function Notice({ tone = "info", title, children }: { tone?: "info" | "warning" | "success" | "danger"; title?: string; children: ReactNode }) {
  const map = {
    info: { c: "border-[#d9e4ee] bg-[#f5f8fb] text-[#24445e]", i: Info },
    warning: { c: "border-[#efe1c4] bg-[#fdf9f1] text-[#6e4b10]", i: AlertCircle },
    success: { c: "border-brand-300/60 bg-brand-50 text-brand-900", i: CheckCircle2 },
    danger: { c: "border-[#f0d6d6] bg-[#fdf5f5] text-[#8a3030]", i: XCircle },
  }[tone];
  return (
    <div role={tone === "danger" ? "alert" : "status"} className={cn("flex gap-3 rounded-2xl border px-4 py-3.5 text-sm leading-relaxed", map.c)}>
      <map.i className="mt-0.5 size-4 shrink-0" aria-hidden />
      <div className="min-w-0">
        {title && <p className="font-semibold">{title}</p>}
        <div>{children}</div>
      </div>
    </div>
  );
}

export function DefinitionList({ items }: { items: { label: string; value: ReactNode }[] }) {
  return (
    <dl className="divide-y divide-line">
      {items.map((it) => (
        <div key={it.label} className="grid gap-0.5 py-3 sm:grid-cols-3 sm:gap-4">
          <dt className="text-[13px] text-muted">{it.label}</dt>
          <dd className="min-w-0 break-words text-sm text-ink sm:col-span-2">{it.value || "-"}</dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * Table on ≥md; stacked cards on mobile. Each <td> gets its column label
 * injected as data-label so mobile rows stay readable.
 */
export function DataTable({ head, children, empty }: { head: string[]; children: ReactNode; empty?: ReactNode }) {
  const rows = Children.map(children, (row) => {
    if (!isValidElement(row)) return row;
    const r = row as ReactElement<{ children?: ReactNode }>;
    let i = 0;
    const cells = Children.map(r.props.children, (cell) => {
      if (!isValidElement(cell)) return cell;
      const label = head[i++] ?? "";
      return cloneElement(cell as ReactElement<Record<string, unknown>>, { "data-label": label });
    });
    return cloneElement(r, undefined, cells);
  });
  return (
    <div className="overflow-hidden rounded-[22px] bg-white ring-1 ring-black/[0.06]">
      <table className="w-full text-left text-sm max-md:block">
        <thead className="border-b border-line bg-brand-50/70 text-[12px] font-medium text-brand-900/70 max-md:hidden">
          <tr>
            {head.map((h, i) => (
              <th key={i} scope="col" className="px-4 py-3 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line max-md:block [&>tr]:transition-colors [&>tr:hover]:bg-surface-muted/60 max-md:[&>tr]:block max-md:[&>tr]:px-4 max-md:[&>tr]:py-3 max-md:[&_td]:grid max-md:[&_td]:grid-cols-[5.5rem_minmax(0,1fr)] max-md:[&_td]:items-start max-md:[&_td]:gap-x-3 max-md:[&_td]:!px-0 max-md:[&_td]:!py-1 max-md:[&_td]:!text-left max-md:[&_td>*]:col-start-2 max-md:[&_td>*]:justify-self-start max-md:[&_td:first-child]:block max-md:[&_td:first-child]:pb-1.5 max-md:[&_td:not(:first-child)]:before:pt-px max-md:[&_td:not(:first-child)]:before:text-xs max-md:[&_td:not(:first-child)]:before:text-muted max-md:[&_td:not(:first-child)]:before:content-[attr(data-label)] max-md:[&_td:empty]:hidden">
          {rows}
        </tbody>
      </table>
      {empty}
    </div>
  );
}
