import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * MEDAL mark — from Sumedang's motto "Insun Medal" (aku lahir/terbit):
 * rising sun + Tugu Lingga silhouette (Sumedang) + market-stall awning (UMKM).
 */
export function MedalMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={cn("size-8", className)} aria-hidden>
      <rect width="64" height="64" rx="15" fill="#0A3A2C" />
      <g stroke="#86DCB2" strokeWidth="2.8" strokeLinecap="round">
        <path d="M12.6 17.8l3.4 3.1M51.4 17.8l-3.4 3.1M6.8 33.5h4.6M52.6 33.5h4.6" />
      </g>
      <path d="M12.5 38a19.5 19.5 0 0 1 39 0z" fill="#86DCB2" />
      <path d="M32 6.5l1.5 9.5h-3z" fill="#fff" />
      <circle cx="32" cy="16.8" r="1.9" fill="#fff" />
      <path d="M24 32.4c0-6.6 3.5-11.2 8-12.8 4.5 1.6 8 6.2 8 12.8z" fill="#fff" />
      <rect x="22.5" y="32.4" width="19" height="5.6" rx="1" fill="#fff" />
      <path d="M7 38h50v4.6c0 2.8-2.25 5.1-5 5.1s-5-2.3-5-5.1c0 2.8-2.25 5.1-5 5.1s-5-2.3-5-5.1c0 2.8-2.25 5.1-5 5.1s-5-2.3-5-5.1c0 2.8-2.25 5.1-5 5.1s-5-2.3-5-5.1c0 2.8-2.25 5.1-5 5.1S7 45.4 7 42.6z" fill="#fff" />
      <path d="M17 38v4.6M27 38v4.6M37 38v4.6M47 38v4.6" stroke="#0A3A2C" strokeWidth="1.5" />
      <rect x="11" y="51" width="42" height="4.5" rx="2.25" fill="#3DBB87" />
    </svg>
  );
}

export function Wordmark({ className, compact = false }: { light?: boolean; className?: string; compact?: boolean }) {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-2.5", className)} aria-label="MEDAL — beranda">
      <MedalMark />
      <span className="leading-none">
        <span className="block text-[17px] font-semibold tracking-[-0.01em] text-ink">MEDAL</span>
        {!compact && <span className="mt-0.5 block text-[11px] text-muted">Insun Medal · UMKM Sumedang</span>}
      </span>
    </Link>
  );
}
