import Link from "next/link";
import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import { AlertCircle, CheckCircle2, ChevronRight, Circle, Clock, Inbox, Info, MinusCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Tone } from "@/lib/constants";

const toneClass: Record<Tone, string> = {
  neutral: "bg-surface-muted text-muted border-line",
  info: "bg-[#eef3f8] text-[#2c5272] border-[#d9e4ee]",
  success: "bg-primary-soft text-primary border-primary-border",
  warning: "bg-[#fbf5ea] text-warning border-[#efe1c4]",
  danger: "bg-[#fbefef] text-danger border-[#f0d6d6]",
  gold: "bg-primary text-white border-primary",
};

const toneIcon: Record<Tone, typeof Circle> = {
  neutral: MinusCircle,
  info: Clock,
  success: CheckCircle2,
  warning: AlertCircle,
  danger: XCircle,
  gold: CheckCircle2,
};

/** Status label: text + icon, never colour alone. */
export function Badge({ tone = "neutral", children, className, dot = true }: { tone?: Tone; children: ReactNode; className?: string; dot?: boolean }) {
  const Icon = toneIcon[tone];
  return (
    <span className={cn("inline-flex items-center gap-1 whitespace-nowrap rounded-md border px-2 py-0.5 text-xs font-medium", toneClass[tone], className)}>
      {dot && <Icon className="size-3.5" aria-hidden />}
      {children}
    </span>
  );
}

export function StatusBadge({ map, status }: { map: Record<string, { label: string; tone: Tone }>; status: string }) {
  const s = map[status] ?? { label: status, tone: "neutral" as Tone };
  return <Badge tone={s.tone}>{s.label}</Badge>;
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-xl border border-line bg-white p-5 sm:p-6", className)}>{children}</div>;
}

export function SectionTitle({ eyebrow, title, description, action, className }: { eyebrow?: string; title: ReactNode; description?: ReactNode; action?: ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="max-w-2xl">
        {eyebrow && <p className="mb-2 text-sm font-medium text-primary">{eyebrow}</p>}
        <h2 className="text-[22px] font-semibold leading-tight text-ink sm:text-[28px]">{title}</h2>
        {description && <p className="mt-2 text-[15px] leading-relaxed text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({ title, description, action, icon }: { title: string; description?: string; action?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-line bg-white px-6 py-12 text-center">
      <div className="mb-4 grid size-11 place-items-center rounded-lg bg-surface-muted text-muted">{icon ?? <Inbox className="size-5" aria-hidden />}</div>
      <h3 className="text-base font-semibold text-ink">{title}</h3>
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
        {eyebrow && <p className="mb-1 text-[13px] font-medium text-primary">{eyebrow}</p>}
        <h1 className="text-[26px] font-semibold leading-tight text-ink sm:text-[30px]">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-[15px] leading-relaxed text-muted">{description}</p>}
      </div>
      {action && <div className="flex flex-wrap items-center gap-2">{action}</div>}
    </div>
  );
}

export function StatCard({ label, value, hint, icon, accent = false }: { label: string; value: ReactNode; hint?: string; icon?: ReactNode; accent?: boolean }) {
  return (
    <div className={cn("rounded-xl border bg-white p-4 sm:p-5", accent ? "border-primary-border" : "border-line")}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-[13px] font-medium text-muted">{label}</p>
        {icon && <span className={cn("grid size-8 place-items-center rounded-lg", accent ? "bg-primary text-white" : "bg-primary-soft text-primary")}>{icon}</span>}
      </div>
      <p className="mt-2 text-[28px] font-semibold leading-none tracking-tight text-ink tabular-nums">{value}</p>
      {hint && <p className="mt-2 text-xs text-muted">{hint}</p>}
    </div>
  );
}

export function Notice({ tone = "info", title, children }: { tone?: "info" | "warning" | "success" | "danger"; title?: string; children: ReactNode }) {
  const map = {
    info: { c: "border-[#d9e4ee] bg-[#f5f8fb] text-[#24445e]", i: Info },
    warning: { c: "border-[#efe1c4] bg-[#fdf9f1] text-[#6e4b10]", i: AlertCircle },
    success: { c: "border-primary-border bg-primary-soft text-primary-hover", i: CheckCircle2 },
    danger: { c: "border-[#f0d6d6] bg-[#fdf5f5] text-[#8a3030]", i: XCircle },
  }[tone];
  return (
    <div role={tone === "danger" ? "alert" : "status"} className={cn("flex gap-3 rounded-lg border px-4 py-3 text-sm leading-relaxed", map.c)}>
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
    <div className="overflow-hidden rounded-xl border border-line bg-white">
      <table className="w-full text-left text-sm max-md:block">
        <thead className="border-b border-line bg-surface-muted text-[12px] font-medium text-muted max-md:hidden">
          <tr>
            {head.map((h, i) => (
              <th key={i} scope="col" className="px-4 py-2.5 font-medium">
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
