import Link from "next/link";
import { cn } from "@/lib/cn";
import type { ComponentProps } from "react";

const variants = {
  primary: "bg-brand-900 text-white shadow-[0_8px_20px_-10px_rgba(5,35,26,.6)] hover:bg-brand-800",
  secondary: "bg-brand-100 text-brand-950 ring-1 ring-brand-300/60 hover:bg-brand-300/50",
  ghost: "text-brand-950 hover:bg-brand-50",
  link: "px-0 text-primary underline-offset-4 hover:underline",
  danger: "bg-danger text-white hover:bg-danger/90",
  "danger-outline": "bg-white text-danger ring-1 ring-danger/30 hover:bg-danger/5",
} as const;

/** Legacy names map onto the v2 set so older call sites stay valid. */
const aliases = { gold: "primary", dark: "primary", outline: "secondary", "outline-light": "secondary" } as const;

const sizes = {
  sm: "h-9 px-4 text-[13px] gap-1.5 rounded-full",
  md: "h-11 px-5 text-sm gap-2 rounded-full",
  lg: "h-12 px-6 text-[15px] gap-2 rounded-full",
} as const;

export type ButtonVariant = keyof typeof variants | keyof typeof aliases;
type Size = keyof typeof sizes;

export function buttonClass(variant: ButtonVariant = "primary", size: Size = "md", className?: string) {
  const v = (variant in aliases ? aliases[variant as keyof typeof aliases] : variant) as keyof typeof variants;
  return cn(
    "inline-flex shrink-0 select-none items-center justify-center font-medium transition-[background-color,box-shadow,color,transform] duration-200 ease-out active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50",
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
