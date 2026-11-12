import Link from "next/link";
import { cn } from "@/lib/cn";

/** Solid green medal mark: ribbon + disc + "M". No gradients. */
export function MedalMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("size-8", className)} aria-hidden>
      <rect width="32" height="32" rx="8" fill="#174B3A" />
      <path d="M11 5h4l2 6h-4zM21 5h-4l-2 6h4z" fill="#C9DAD1" />
      <circle cx="16" cy="19" r="8" fill="none" stroke="#fff" strokeWidth="1.6" />
      <path d="M12.6 22.2v-6.4l3.4 3.6 3.4-3.6v6.4" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Wordmark({ className, compact = false }: { light?: boolean; className?: string; compact?: boolean }) {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-2.5", className)} aria-label="MEDAL — beranda">
      <MedalMark />
      <span className="leading-none">
        <span className="block text-[17px] font-semibold tracking-[-0.01em] text-ink">MEDAL</span>
        {!compact && <span className="mt-0.5 block text-[11px] text-muted">UMKM Sumedang · Disperindag</span>}
      </span>
    </Link>
  );
}
