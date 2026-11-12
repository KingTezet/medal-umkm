"use client";

/**
 * Landing v3 motion kit — light (transform/opacity/filter only),
 * scroll-linked parallax, blur-in text, count-up. Reduced-motion safe.
 */
import Link from "next/link";
import { animate, motion, useInView, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef, useState, type ComponentProps, type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";

export const EASE = [0.16, 1, 0.3, 1] as const;

/* ---------------------------------------------------------------- buttons */
export function PillLink({ href, children, tone = "dark", className, ...rest }: ComponentProps<typeof Link> & { tone?: "dark" | "light" | "ghost"; children: ReactNode }) {
  const tones = {
    dark: "bg-brand-900 text-white hover:bg-brand-800 shadow-[0_10px_30px_-12px_rgba(5,35,26,.6)]",
    light: "bg-brand-100 text-brand-950 ring-1 ring-brand-300/60 hover:bg-brand-300/50",
    ghost: "bg-white/10 text-white ring-1 ring-white/25 hover:bg-white/20",
  }[tone];
  const dot = { dark: "bg-brand-300 text-brand-950", light: "bg-brand-900 text-white", ghost: "bg-white text-brand-950" }[tone];
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex h-12 items-center gap-3 rounded-full pl-5 pr-1.5 text-[15px] font-medium transition-[background-color,box-shadow,transform] duration-300 ease-out active:scale-[0.97]",
        tones,
        className,
      )}
      {...rest}
    >
      <span>{children}</span>
      <span className={cn("grid size-9 place-items-center overflow-hidden rounded-full", dot)}>
        <span className="relative block size-4">
          <ArrowUpRight className="absolute inset-0 size-4 transition-transform duration-300 ease-out group-hover:-translate-y-5 group-hover:translate-x-5" aria-hidden />
          <ArrowUpRight className="absolute inset-0 size-4 -translate-x-5 translate-y-5 transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:translate-y-0" aria-hidden />
        </span>
      </span>
    </Link>
  );
}

/* ---------------------------------------------------------------- text */
/** Words rise + unblur one by one. */
export function BlurWords({ text, className, delay = 0, highlight = [] as string[], highlightClass = "text-brand-700" }: { text: string; className?: string; delay?: number; highlight?: string[]; highlightClass?: string }) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          className={cn("inline-block whitespace-pre", highlight.includes(w.replace(/[.,]/g, "")) && highlightClass)}
          initial={reduce ? false : { opacity: 0, y: "0.35em", filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: EASE, delay: delay + i * 0.06 }}
        >
          {w}
          {i < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </span>
  );
}

/** Section reveal: rise + unblur when scrolled into view. */
export function Rise({ children, className, delay = 0, y = 28 }: { children: ReactNode; className?: string; delay?: number; y?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

export function RiseGroup({ children, className, gap = 0.08 }: { children: ReactNode; className?: string; gap?: number }) {
  return (
    <motion.div className={className} initial="h" whileInView="s" viewport={{ once: true, margin: "-60px" }} variants={{ h: {}, s: { transition: { staggerChildren: gap } } }}>
      {children}
    </motion.div>
  );
}

export function RiseItem({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={{
        h: reduce ? { opacity: 1 } : { opacity: 0, y: 24, filter: "blur(6px)" },
        s: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: EASE } },
      }}
    >
      {children}
    </motion.div>
  );
}

/* ---------------------------------------------------------------- scroll */
/** Smoothed scroll progress of an element (0 → 1 while it crosses the viewport). */
export function useParallax(offset: ["start end" | "start start", "end start" | "end end"] = ["start end", "end start"]) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  return { ref, progress: smooth };
}

export function useRange(v: MotionValue<number>, from: number, to: number) {
  const reduce = useReducedMotion();
  return useTransform(v, [0, 1], reduce ? [0, 0] : [from, to]);
}

/** Thin progress bar at the very top that follows page scroll. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const x = useSpring(scrollYProgress, { stiffness: 160, damping: 30 });
  return <motion.div aria-hidden style={{ scaleX: x }} className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-brand-500" />;
}

/* ---------------------------------------------------------------- numbers */
export function Counter({ value, className, duration = 1.6 }: { value: number; className?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, value, { duration: reduce ? 0 : duration, ease: EASE, onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, value, reduce, duration]);
  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {n.toLocaleString("id-ID")}
    </span>
  );
}

/** Bar that fills when visible. */
export function FillBar({ pct, className }: { pct: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <div className={cn("h-2 overflow-hidden rounded-full bg-black/[0.06]", className)}>
      <motion.div
        className="h-full rounded-full bg-brand-500"
        initial={reduce ? false : { width: 0 }}
        whileInView={{ width: `${pct}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: EASE, delay: 0.2 }}
      />
    </div>
  );
}
