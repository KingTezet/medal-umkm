import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { UmkmCard } from "@/components/cards";
import { Pagination } from "@/components/pagination";
import { Stagger, StaggerItem } from "@/components/motion";
import { EmptyState } from "@/components/ui/misc";
import { ButtonLink } from "@/components/ui/button";
import { FilterBar, FilterSelect } from "@/components/filter-bar";
import { getCategories, listPublicUmkm } from "@/lib/queries";
import { SUMEDANG_DISTRICTS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Direktori UMKM",
  description: "Direktori UMKM Kabupaten Sumedang yang telah diverifikasi Disperindag.",
};

type SP = Promise<Record<string, string | string[] | undefined>>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || undefined;

export default async function UmkmDirectoryPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const params = { q: one(sp.q), category: one(sp.category), district: one(sp.district) };
  const [{ items, total, page, pageSize, error }, categories] = await Promise.all([listPublicUmkm({ ...params, page: Number(one(sp.page) ?? 1) || 1 }), getCategories("umkm")]);
  const activeCount = [params.category, params.district].filter(Boolean).length;

  return (
    <>
      <PageHero eyebrow="Direktori UMKM" title="Produk lokal Kabupaten Sumedang" description="Profil usaha yang telah diverifikasi Disperindag dan setuju tampil publik. MEDAL bukan marketplace — hubungi pelaku usaha langsung bila kontak tersedia." />
      <section className="container-page py-8 sm:py-10">
        <FilterBar q={params.q} placeholder="Cari nama usaha atau produk" activeCount={activeCount}>
          <FilterSelect label="Kategori" name="category" defaultValue={params.category} options={[{ value: "", label: "Semua kategori" }, ...categories.map((c) => ({ value: c.name, label: c.name }))]} />
          <FilterSelect label="Kecamatan" name="district" defaultValue={params.district} options={[{ value: "", label: "Semua kecamatan" }, ...SUMEDANG_DISTRICTS.map((d) => ({ value: d, label: d }))]} />
        </FilterBar>
        <p className="mt-6 border-b border-line pb-3 text-[13px] text-muted" aria-live="polite">{error ? "Gagal memuat direktori." : `${total} usaha terverifikasi`}</p>
        <div className="mt-6">
          {items.length ? (
            <Stagger className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
              {items.map((u) => (
                <StaggerItem key={u.id} className="h-full"><UmkmCard item={u} /></StaggerItem>
              ))}
            </Stagger>
          ) : (
            <EmptyState title="Belum ada UMKM yang sesuai" description="Coba kata kunci lain atau hapus filter." action={<ButtonLink href="/umkm" variant="secondary">Hapus filter</ButtonLink>} />
          )}
        </div>
        <Pagination page={page} total={total} pageSize={pageSize} basePath="/umkm" params={params} />
      </section>
    </>
  );
}
