import type { ReactNode } from "react";

/** Simple white page header for inner public pages. */
export function PageHero({ eyebrow, title, description, children }: { eyebrow: string; title: ReactNode; description?: ReactNode; image?: string; children?: ReactNode }) {
  return (
    <section className="border-b border-line bg-white">
      <div className="container-page py-10 sm:py-14">
        <p className="text-sm font-medium text-primary">{eyebrow}</p>
        <h1 className="mt-2 max-w-3xl text-[30px] font-semibold leading-[1.12] text-ink sm:text-[40px]">{title}</h1>
        {description && <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted sm:text-base">{description}</p>}
        {children}
      </div>
    </section>
  );
}
