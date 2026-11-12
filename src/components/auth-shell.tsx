import Image from "next/image";
import type { ReactNode } from "react";
import { Wordmark } from "@/components/brand";
import { Reveal } from "@/components/motion";

export function AuthShell({ title, description, children, image = "/images/pasar-malam-6.jpg" }: { title: string; description?: ReactNode; children: ReactNode; image?: string; quote?: string }) {
  return (
    <div className="grid min-h-dvh bg-white lg:grid-cols-[1fr_0.9fr]">
      <div className="flex flex-col px-4 pb-10 pt-5 sm:px-8 lg:px-14">
        <Wordmark />
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          <Reveal>
            <h1 className="text-[26px] font-semibold leading-tight sm:text-[30px]">{title}</h1>
            {description && <p className="mt-2 text-[15px] text-muted">{description}</p>}
            <div className="mt-8">{children}</div>
          </Reveal>
        </div>
      </div>
      <div className="relative hidden p-4 lg:block">
        <div className="relative h-full overflow-hidden rounded-2xl bg-surface-muted">
          <Image src={image} alt="" fill priority sizes="45vw" className="object-cover" />
        </div>
      </div>
    </div>
  );
}
