import type { Metadata } from "next";
import { Search } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { UmkmCard } from "@/components/cards";
import { Pagination } from "@/components/pagination";
import { Stagger, StaggerItem } from "@/components/motion";
import { EmptyState } from "@/components/ui/misc";
import { ButtonLink } from "@/components/ui/button";
import { getCategories, listPublicUmkm } from "@/lib/queries";
import { SUMEDANG_DISTRICTS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Direktori UMKM",
  description: "Direktori UMKM Kabupaten Sumedang yang telah diverifikasi Disperindag: kuliner, fesyen, kriya, dan lainnya.",
};

type SP = Promise<Record<string, string | string[] | undefined>>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || undefined;

export default async function UmkmDirectoryPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const params = { q: one(sp.q), category: one(sp.category), district: one(sp.district) };
  const [{ items, total, page, pageSize, error }, categories] = await Promise.all([
    listPublicUmkm({ ...params, page: Number(one(sp.page) ?? 1) || 1 }),
    getCategories("umkm"),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Direktori UMKM"
        title={<>Produk lokal, <em className="text-gold-gradient">kebanggaan Sumedang</em></>}
        description="Profil usaha yang telah diverifikasi Disperindag dan menyetujui untuk tampil publik. Ini bukan marketplace — hubungi pelaku usaha langsung bila kontak tersedia."
        image="/images/jajan-pasar.jpg"
      />
      <section className="container-page -mt-8 pb-24">
        <form method="get" role="search" aria-label="Cari UMKM" className="relative z-10 grid gap-3 rounded-3xl border border-line bg-surface p-4 shadow-[0_30px_60px_-40px_rgba(6,34,25,.5)] sm:p-5 lg:grid-cols-[1.6fr_1fr_1fr_auto]">
          <label className="relative">
            <span className="sr-only">Kata kunci</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
            <input name="q" defaultValue={params.q} placeholder="Cari nama usaha atau produk…" className="h-12 w-full rounded-full border border-line bg-ivory/60 pl-11 pr-4 text-[15px] focus:border-emerald focus:outline-none focus:ring-4 focus:ring-emerald/10" />
          </label>
          <label>
            <span className="sr-only">Kategori</span>
            <select name="category" defaultValue={params.category ?? ""} className="h-12 w-full rounded-full border border-line bg-ivory/60 px-4 text-[15px]">
              <option value="">Semua kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </label>
          <label>
            <span className="sr-only">Kecamatan</span>
            <select name="district" defaultValue={params.district ?? ""} className="h-12 w-full rounded-full border border-line bg-ivory/60 px-4 text-[15px]">
              <option value="">Semua kecamatan</option>
              {SUMEDANG_DISTRICTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </label>
          <button className="h-12 rounded-full bg-emerald px-6 font-semibold text-ivory hover:bg-forest">Cari</button>
        </form>

        <p className="mt-8 text-sm text-muted" aria-live="polite">{error ? "Gagal memuat direktori." : `${total} usaha terverifikasi`}</p>
        <div className="mt-6">
          {items.length ? (
            <Stagger className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
              {items.map((u) => (
                <StaggerItem key={u.id}>
                  <UmkmCard item={u} />
                </StaggerItem>
              ))}
            </Stagger>
          ) : (
            <EmptyState
              title="Belum ada UMKM yang cocok"
              description="Coba kata kunci lain. Profil baru tampil setelah diverifikasi Disperindag."
              action={<ButtonLink href="/daftar/umkm">Daftarkan usaha Anda</ButtonLink>}
            />
          )}
        </div>
        <Pagination page={page} total={total} pageSize={pageSize} basePath="/umkm" params={params} />
      </section>
    </>
  );
}
