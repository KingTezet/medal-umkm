import Image from "next/image";
import type { ReactNode } from "react";

/** Compact dark hero for inner public pages. */
export function PageHero({ eyebrow, title, description, image, children }: { eyebrow: string; title: ReactNode; description?: ReactNode; image: string; children?: ReactNode }) {
  return (
    <section className="relative isolate overflow-hidden bg-night pb-14 pt-32 text-ivory sm:pb-20 sm:pt-40">
      <Image src={image} alt="" fill priority sizes="100vw" className="-z-20 object-cover opacity-30" />
      <div className="bg-emerald-mesh absolute inset-0 -z-10 opacity-90" aria-hidden />
      <div className="bg-grain absolute inset-0 -z-10" aria-hidden />
      <div className="container-page">
        <p className="eyebrow !text-gold">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl">{title}</h1>
        {description && <p className="mt-4 max-w-2xl text-base leading-relaxed text-ivory/75 sm:text-lg">{description}</p>}
        {children}
      </div>
    </section>
  );
}
