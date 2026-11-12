import Image from "next/image";
import type { ReactNode } from "react";
import { Wordmark } from "@/components/brand";
import { VerifiedIcon } from "@/components/icons";
import { Rise } from "@/components/landing/kit";

export function AuthShell({ title, description, children, image = "/images/p-keranjang-bambu.jpg" }: { title: string; description?: ReactNode; children: ReactNode; image?: string; quote?: string }) {
  return (
    <div className="relative isolate grid min-h-dvh lg:grid-cols-[1fr_0.95fr]">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-white" />
        <div className="bg-grid fade-mask absolute inset-0" />
        <div className="absolute -left-40 -top-40 size-[30rem] rounded-full bg-brand-300/40 blur-[100px]" />
        <div className="absolute bottom-0 left-1/3 size-80 rounded-full bg-sky-200/50 blur-[100px]" />
      </div>
      <div className="flex flex-col px-4 pb-10 pt-5 sm:px-8 lg:px-14">
        <Wordmark />
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          <Rise>
            <h1 className="display text-[32px] font-semibold leading-[1.05] text-brand-950 sm:text-[40px]">{title}</h1>
            {description && <p className="mt-3 text-[15px] text-[#4c5c54]">{description}</p>}
            <div className="mt-8 rounded-[26px] bg-white/90 p-5 shadow-[0_30px_60px_-40px_rgba(5,35,26,.5)] ring-1 ring-black/[0.06] backdrop-blur sm:p-7">{children}</div>
          </Rise>
        </div>
      </div>
      <div className="relative hidden p-4 lg:block">
        <div className="relative h-full overflow-hidden rounded-[32px] bg-brand-900">
          <Image src={image} alt="" fill priority sizes="45vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-950/70 via-transparent to-transparent" aria-hidden />
          <div className="glass absolute inset-x-6 bottom-6 rounded-3xl p-5">
            <p className="flex items-center gap-2 text-[13px] font-medium text-brand-700"><VerifiedIcon className="size-4" /> Diverifikasi Disperindag Sumedang</p>
            <p className="display mt-1 text-[22px] font-semibold leading-tight text-brand-950">Satu profil usaha, banyak peluang lapak.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
