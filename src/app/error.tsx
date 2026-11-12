"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error.digest ?? "error");
  }, [error]);
  return (
    <main id="main" className="grid min-h-[70vh] place-items-center px-6 text-center">
      <div>
        <p className="font-semibold text-[30px] text-emerald">500</p>
        <h1 className="mt-2 font-semibold text-[22px]">Terjadi kesalahan</h1>
        <p className="mx-auto mt-3 max-w-md text-muted">Maaf, sesuatu tidak berjalan semestinya. Coba muat ulang halaman.</p>
        {error.digest && <p className="mt-2 font-mono text-xs text-muted">Kode: {error.digest}</p>}
        <Button className="mt-8" onClick={reset}>Coba lagi</Button>
      </div>
    </main>
  );
}
