import Image from "next/image";
import type { ReactNode } from "react";
import { Wordmark } from "@/components/brand";
import { Reveal } from "@/components/motion";

export function AuthShell({ title, description, children, image = "/images/pasar-malam-6.jpg", quote }: { title: string; description?: ReactNode; children: ReactNode; image?: string; quote?: string }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1fr_1.05fr]">
      <div className="relative hidden overflow-hidden bg-night lg:block">
        <Image src={image} alt="" fill priority sizes="50vw" className="object-cover opacity-55" />
        <div className="bg-emerald-mesh absolute inset-0 opacity-75" aria-hidden />
        <div className="absolute inset-0 flex flex-col justify-between p-12 text-ivory">
          <Wordmark light />
          <div>
            <p className="max-w-md font-display text-4xl leading-tight">{quote ?? "Satu profil usaha, banyak peluang lapak di seluruh Sumedang."}</p>
            <p className="mt-4 text-sm text-ivory/70">MEDAL · Media, Event, Dagang &amp; Lapak</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col px-4 pb-12 pt-6 sm:px-8 lg:px-16">
        <div className="lg:hidden">
          <Wordmark />
        </div>
        <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center py-10">
          <Reveal>
            <h1 className="font-display text-4xl leading-tight tracking-tight">{title}</h1>
            {description && <p className="mt-2 text-[15px] text-muted">{description}</p>}
            <div className="mt-8">{children}</div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
