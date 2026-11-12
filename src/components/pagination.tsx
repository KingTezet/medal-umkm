import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

export function Pagination({ page, total, pageSize, basePath, params }: { page: number; total: number; pageSize: number; basePath: string; params: Record<string, string | undefined> }) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages <= 1) return null;
  const href = (p: number) => {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => v && sp.set(k, v));
    if (p > 1) sp.set("page", String(p));
    const s = sp.toString();
    return `${basePath}${s ? `?${s}` : ""}`;
  };
  return (
    <nav aria-label="Halaman" className="mt-12 flex items-center justify-center gap-2">
      <Link aria-disabled={page <= 1} tabIndex={page <= 1 ? -1 : undefined} href={href(page - 1)} className={cn("grid size-10 place-items-center rounded-full border border-line bg-surface", page <= 1 && "pointer-events-none opacity-40")} aria-label="Sebelumnya">
        <ChevronLeft className="size-4" />
      </Link>
      <span className="px-3 text-sm text-muted">
        Halaman <strong className="text-ink">{page}</strong> dari {pages}
      </span>
      <Link aria-disabled={page >= pages} tabIndex={page >= pages ? -1 : undefined} href={href(page + 1)} className={cn("grid size-10 place-items-center rounded-full border border-line bg-surface", page >= pages && "pointer-events-none opacity-40")} aria-label="Berikutnya">
        <ChevronRight className="size-4" />
      </Link>
    </nav>
  );
}
