import Link from "next/link";
import { cn } from "@/lib/cn";
import type { ComponentProps } from "react";

const variants = {
  primary:
    "bg-emerald text-ivory shadow-[0_8px_24px_-12px_rgba(23,96,74,.8)] hover:bg-forest active:translate-y-px",
  gold: "bg-gold text-night shadow-[0_10px_30px_-12px_rgba(198,161,91,.9)] hover:bg-gold-soft active:translate-y-px",
  dark: "bg-night text-ivory hover:bg-forest",
  outline: "border border-line bg-surface text-ink hover:border-emerald hover:text-emerald",
  "outline-light": "border border-white/25 bg-white/5 text-ivory backdrop-blur hover:bg-white/15",
  ghost: "text-ink hover:bg-sage",
  danger: "bg-danger text-white hover:bg-danger/90",
  "danger-outline": "border border-danger/30 text-danger hover:bg-danger/5",
} as const;

const sizes = {
  sm: "h-9 px-3.5 text-sm gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-13 px-7 text-base gap-2.5",
} as const;

export type ButtonVariant = keyof typeof variants;
type Size = keyof typeof sizes;

export function buttonClass(variant: ButtonVariant = "primary", size: Size = "md", className?: string) {
  return cn(
    "inline-flex shrink-0 items-center justify-center rounded-full font-semibold tracking-tight transition-all duration-200 disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...props
}: ComponentProps<"button"> & { variant?: ButtonVariant; size?: Size }) {
  return <button type={type} className={buttonClass(variant, size, className)} {...props} />;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: ButtonVariant; size?: Size }) {
  return <Link className={buttonClass(variant, size, className)} {...props} />;
}
