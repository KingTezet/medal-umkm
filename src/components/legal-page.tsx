import type { ReactNode } from "react";
import { PageHero } from "@/components/page-hero";

export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <>
      <PageHero eyebrow="Dokumen" title={title} description={`Terakhir diperbarui ${updated}. Versi MVP — menunggu pengesahan Disperindag Kabupaten Sumedang.`} image="/images/sawah.jpg" />
      <div className="container-page py-14">
        <div className="mx-auto max-w-3xl space-y-8 rounded-[28px] bg-white p-6 ring-1 ring-black/[0.06] sm:p-10 text-[15.5px] leading-relaxed text-ink/85 [&_h2]:mb-3 [&_h2]:font-semibold [&_h2]:text-[22px] [&_h2]:font-[family-name:var(--font-display)] [&_h2]:tracking-[-0.03em] [&_h2]:text-brand-950 [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-1.5">
          {children}
        </div>
      </div>
    </>
  );
}
