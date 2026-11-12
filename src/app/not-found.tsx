import Link from "next/link";
import { MedalMark } from "@/components/brand";
import { buttonClass } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main id="main" className="bg-emerald-mesh grid min-h-dvh place-items-center px-6 text-center text-ivory">
      <div>
        <MedalMark className="mx-auto size-16" />
        <p className="mt-6 font-display text-8xl text-gold-gradient">404</p>
        <h1 className="mt-2 font-display text-3xl">Halaman tidak ditemukan</h1>
        <p className="mx-auto mt-3 max-w-md text-ivory/70">Halaman mungkin sudah dipindahkan, belum dipublikasikan, atau Anda tidak memiliki akses.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className={buttonClass("gold")}>Ke beranda</Link>
          <Link href="/events" className={buttonClass("outline-light")}>Lihat event</Link>
        </div>
      </div>
    </main>
  );
}
