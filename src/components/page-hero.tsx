import type { ReactNode } from "react";

/** v3 inner-page hero: mint wash + grid + soft blobs, runs under the floating header. */
export function PageHero({ eyebrow, title, description, children }: { eyebrow: string; title: ReactNode; description?: ReactNode; image?: string; children?: ReactNode }) {
  return (
    <section className="relative isolate -mt-[68px] overflow-hidden pt-[68px] sm:-mt-[76px] sm:pt-[76px]">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-100/80 via-brand-50/50 to-white" />
        <div className="bg-grid fade-mask absolute inset-0" />
        <div className="absolute -left-32 -top-40 size-[30rem] rounded-full bg-brand-300/45 blur-[100px]" />
        <div className="absolute -right-24 -top-10 size-[24rem] rounded-full bg-sky-200/70 blur-[90px]" />
      </div>
      <div className="container-page pb-12 pt-10 sm:pb-16 sm:pt-16">
        <p className="inline-flex items-center gap-2 text-[13px] font-medium text-brand-700">
          <span className="h-px w-6 bg-brand-500" aria-hidden />
          {eyebrow}
        </p>
        <h1 className="display mt-3 max-w-3xl text-[34px] font-semibold leading-[1.04] text-brand-950 sm:text-[52px]">{title}</h1>
        {description && <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-[#4c5c54] sm:text-[17px]">{description}</p>}
        {children}
      </div>
    </section>
  );
}
