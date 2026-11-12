"use client";

import { motion, useReducedMotion, useScroll, useTransform, useInView, animate } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";

const ease = [0.22, 1, 0.36, 1] as const;

export function Reveal({ children, delay = 0, y = 28, className }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({ children, className, gap = 0.08 }: { children: ReactNode; className?: string; gap?: number }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap } } }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={{
        hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 22, scale: 0.98 },
        show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease } },
      }}
    >
      {children}
    </motion.div>
  );
}

/** Image that drifts slower than the page while scrolling. */
export function ParallaxImage({
  src,
  alt,
  className,
  strength = 80,
  priority,
  sizes = "100vw",
  imgClassName,
}: {
  src: string;
  alt: string;
  className?: string;
  strength?: number;
  priority?: boolean;
  sizes?: string;
  imgClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-strength, strength]);
  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div style={{ y }} className="absolute -inset-y-[18%] inset-x-0">
        <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className={cn("object-cover", imgClassName)} />
      </motion.div>
    </div>
  );
}

/** Hero layer that fades/scales as user scrolls away. */
export function ScrollFade({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.8], reduce ? [1, 1] : [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 120]);
  return (
    <motion.div ref={ref} style={{ opacity, y }} className={className}>
      {children}
    </motion.div>
  );
}

export function CountUp({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, { duration: 1.4, ease, onUpdate: (v) => setDisplay(Math.round(v)) });
    return () => controls.stop();
  }, [inView, value]);
  return (
    <span ref={ref} className={className}>
      {display.toLocaleString("id-ID")}
    </span>
  );
}

export function FloatY({ children, className, duration = 6 }: { children: ReactNode; className?: string; duration?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      animate={reduce ? undefined : { y: [0, -10, 0] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}
