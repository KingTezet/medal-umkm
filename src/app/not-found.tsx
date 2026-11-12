import Link from "next/link";
import { MedalMark } from "@/components/brand";
import { buttonClass } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main id="main" className="grid min-h-dvh place-items-center bg-white px-6 text-center">
      <div>
        <MedalMark className="mx-auto size-10" />
        <p className="mt-6 text-sm font-medium text-primary">404</p>
        <h1 className="mt-1 text-[26px] font-semibold">Halaman tidak ditemukan</h1>
        <p className="mx-auto mt-2 max-w-md text-[15px] text-muted">Halaman mungkin sudah dipindahkan, belum dipublikasikan, atau Anda tidak memiliki akses.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Link href="/" className={buttonClass("primary")}>Ke beranda</Link>
          <Link href="/events" className={buttonClass("secondary")}>Lihat event</Link>
        </div>
      </div>
    </main>
  );
}
