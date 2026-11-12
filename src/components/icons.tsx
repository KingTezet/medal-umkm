import type { SVGProps } from "react";
import { cn } from "@/lib/cn";

/**
 * MEDAL brand icon set — 24px grid, 1.6 stroke, soft duotone fill.
 * Used for key concepts so they read as one family (not generic AI icons).
 */
type P = SVGProps<SVGSVGElement> & { className?: string };
const base = (className?: string) => cn("size-5 shrink-0", className);

/** Verified seal (scalloped badge + check). `solid` = filled brand seal. */
export function VerifiedIcon({ className, solid = true, ...p }: P & { solid?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={base(className)} aria-hidden {...p}>
      <path
        d="M12 1.8l2.27 1.66 2.8-.06.86 2.67 2.27 1.64-.88 2.67.88 2.67-2.27 1.64-.86 2.67-2.8-.06L12 22.2l-2.27-1.66-2.8.06-.86-2.67-2.27-1.64.88-2.67-.88-2.67 2.27-1.64.86-2.67 2.8.06L12 1.8z"
        fill={solid ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={solid ? 0 : 1.6}
        strokeLinejoin="round"
      />
      <path d="M8.2 12.2l2.5 2.5 5.1-5.3" fill="none" stroke={solid ? "#fff" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function EventIcon({ className, ...p }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={base(className)} aria-hidden {...p}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="3.5" fill="currentColor" fillOpacity=".12" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
      <path d="M8.5 14l2 2 4-4" />
    </svg>
  );
}

export function StoreIcon({ className, ...p }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={base(className)} aria-hidden {...p}>
      <path d="M4.5 10.5V19a1.5 1.5 0 001.5 1.5h12a1.5 1.5 0 001.5-1.5v-8.5" fill="currentColor" fillOpacity=".12" />
      <path d="M3 8.5L5 4h14l2 4.5a2.75 2.75 0 01-5 1.6 2.75 2.75 0 01-4 0 2.75 2.75 0 01-4 0 2.75 2.75 0 01-5-1.6z" />
      <path d="M10 20.5V16a2 2 0 014 0v4.5" />
    </svg>
  );
}

export function StandIcon({ className, ...p }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={base(className)} aria-hidden {...p}>
      <path d="M3 9l2.5-5h13L21 9" />
      <path d="M3 9h18v1.5a3 3 0 01-6 0 3 3 0 01-6 0 3 3 0 01-6 0V9z" fill="currentColor" fillOpacity=".12" />
      <path d="M5 13.5V20h14v-6.5M9.5 20v-3.5h5V20" />
    </svg>
  );
}

export function ShieldLockIcon({ className, ...p }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={base(className)} aria-hidden {...p}>
      <path d="M12 2.8l7.5 3v5.6c0 4.6-3.2 8.3-7.5 9.8-4.3-1.5-7.5-5.2-7.5-9.8V5.8l7.5-3z" fill="currentColor" fillOpacity=".12" />
      <rect x="9" y="11" width="6" height="5" rx="1.2" />
      <path d="M10.2 11V9.6a1.8 1.8 0 013.6 0V11" />
    </svg>
  );
}

export function DocCheckIcon({ className, ...p }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={base(className)} aria-hidden {...p}>
      <path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5z" fill="currentColor" fillOpacity=".12" />
      <path d="M14 3v5h5M9 14.5l2 2 4-4" />
    </svg>
  );
}

export function MegaphoneIcon({ className, ...p }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={base(className)} aria-hidden {...p}>
      <path d="M4 10v4a1.5 1.5 0 001.5 1.5H8l7 4V4.5l-7 4H5.5A1.5 1.5 0 004 10z" fill="currentColor" fillOpacity=".12" />
      <path d="M8 15.5l1.2 4.5M18.5 9.5a3.5 3.5 0 010 5" />
    </svg>
  );
}

export function UserPlusIcon({ className, ...p }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={base(className)} aria-hidden {...p}>
      <circle cx="10" cy="8" r="4" fill="currentColor" fillOpacity=".12" />
      <path d="M3 20.5a7 7 0 0114 0M19 8v6M16 11h6" />
    </svg>
  );
}

export function SearchStatusIcon({ className, ...p }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={base(className)} aria-hidden {...p}>
      <rect x="4" y="3" width="13" height="17" rx="2.5" fill="currentColor" fillOpacity=".12" />
      <path d="M7.5 8h6M7.5 11.5h4" />
      <circle cx="16.5" cy="16.5" r="3" fill="#fff" />
      <path d="M18.7 18.7L21 21" />
    </svg>
  );
}

export function InfoIcon({ className, ...p }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={base(className)} aria-hidden {...p}>
      <circle cx="12" cy="12" r="9" fill="currentColor" fillOpacity=".12" />
      <path d="M12 11v5.5M12 7.6v.2" />
    </svg>
  );
}

export function UsersIcon({ className, ...p }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={base(className)} aria-hidden {...p}>
      <circle cx="9" cy="8.5" r="3.5" fill="currentColor" fillOpacity=".12" />
      <path d="M2.5 20a6.5 6.5 0 0113 0M16 5.2a3.5 3.5 0 010 6.6M18 14.2a6.5 6.5 0 013.5 5.8" />
    </svg>
  );
}
