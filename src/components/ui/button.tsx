import Link from "next/link";
import { cn } from "@/lib/cn";
import type { ComponentProps } from "react";

const variants = {
  primary: "bg-primary text-white hover:bg-primary-hover",
  secondary: "border border-line bg-white text-ink hover:border-primary-border hover:bg-surface-muted",
  ghost: "text-ink hover:bg-surface-muted",
  link: "px-0 text-primary underline-offset-4 hover:underline",
  danger: "bg-danger text-white hover:bg-danger/90",
  "danger-outline": "border border-danger/30 bg-white text-danger hover:bg-danger/5",
} as const;

/** Legacy names map onto the v2 set so older call sites stay valid. */
const aliases = { gold: "primary", dark: "primary", outline: "secondary", "outline-light": "secondary" } as const;

const sizes = {
  sm: "h-9 px-3.5 text-[13px] gap-1.5 rounded-[9px]",
  md: "h-11 px-4.5 text-sm gap-2 rounded-[10px]",
  lg: "h-12 px-6 text-[15px] gap-2 rounded-[11px]",
} as const;

export type ButtonVariant = keyof typeof variants | keyof typeof aliases;
type Size = keyof typeof sizes;

export function buttonClass(variant: ButtonVariant = "primary", size: Size = "md", className?: string) {
  const v = (variant in aliases ? aliases[variant as keyof typeof aliases] : variant) as keyof typeof variants;
  return cn(
    "inline-flex shrink-0 select-none items-center justify-center font-medium transition-[background-color,border-color,color,transform] duration-150 ease-out active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
    variants[v],
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
