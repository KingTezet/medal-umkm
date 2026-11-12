import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { EventCard } from "@/components/cards";
import { Pagination } from "@/components/pagination";
import { Stagger, StaggerItem } from "@/components/motion";
import { EmptyState } from "@/components/ui/misc";
import { ButtonLink } from "@/components/ui/button";
import { FilterBar, FilterDate, FilterSelect } from "@/components/filter-bar";
import { getCategories, listPublicEvents, type EventFilter } from "@/lib/queries";
import { SUMEDANG_DISTRICTS } from "@/lib/constants";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Event & Bazar",
  description: "Daftar event, bazar, festival, dan pameran UMKM di Kabupaten Sumedang yang telah disetujui Disperindag.",
};

const FILTERS: { key: EventFilter; label: string }[] = [
  { key: "all", label: "Semua" },
  { key: "open", label: "Dibuka" },
  { key: "upcoming", label: "Segera dibuka" },
  { key: "closed", label: "Ditutup" },
];

type SP = Promise<Record<string, string | string[] | undefined>>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || undefined;

export default async function EventsPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const params = { q: one(sp.q), category: one(sp.category), district: one(sp.district), status: one(sp.status) as EventFilter | undefined, from: one(sp.from), to: one(sp.to) };
  const filter = FILTERS.some((f) => f.key === params.status) ? params.status! : "all";
  const dateOk = (d?: string) => (d && /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : undefined);
  const [{ events, total, page, pageSize, error }, categories] = await Promise.all([
    listPublicEvents({ ...params, from: dateOk(params.from), to: dateOk(params.to), filter, page: Number(one(sp.page) ?? 1) || 1 }),
    getCategories("event"),
  ]);
  const linkFor = (status: EventFilter) => {
    const s = new URLSearchParams();
    Object.entries({ ...params, status: status === "all" ? undefined : status }).forEach(([k, v]) => v && s.set(k, v));
    return `/events${s.toString() ? `?${s}` : ""}`;
  };
  const activeCount = [params.category, params.district, params.from, params.to].filter(Boolean).length;
  const hasFilter = activeCount > 0 || !!params.q || filter !== "all";

  return (
    <>
      <PageHero eyebrow="Event" title="Event & bazar UMKM" description="Semua event telah disetujui Disperindag Kabupaten Sumedang. Daftar stand dari halaman detail event." />
      <section className="container-page py-8 sm:py-10">
        <FilterBar q={params.q} placeholder="Cari nama event, lokasi, atau penyelenggara" activeCount={activeCount} hidden={{ status: filter === "all" ? undefined : filter }}>
          <FilterSelect label="Kategori" name="category" defaultValue={params.category} options={[{ value: "", label: "Semua kategori" }, ...categories.map((c) => ({ value: c.name, label: c.name }))]} />
          <FilterSelect label="Kecamatan" name="district" defaultValue={params.district} options={[{ value: "", label: "Semua kecamatan" }, ...SUMEDANG_DISTRICTS.map((d) => ({ value: d, label: d }))]} />
          <FilterDate label="Mulai dari" name="from" defaultValue={params.from} />
          <FilterDate label="Sampai" name="to" defaultValue={params.to} />
        </FilterBar>

        <div className="mt-6 flex items-center justify-between gap-4">
          <nav aria-label="Status pendaftaran" className="flex w-fit max-w-full gap-1 overflow-x-auto rounded-full bg-brand-900/[0.05] p-1 [scrollbar-width:none]">
            {FILTERS.map((f) => (
              <Link key={f.key} href={linkFor(f.key)} aria-current={filter === f.key ? "page" : undefined} className={cn("flex h-9 items-center whitespace-nowrap rounded-full px-4 text-sm font-medium transition-colors duration-200", filter === f.key ? "bg-white text-brand-950 shadow-sm ring-1 ring-black/[0.05]" : "text-[#5b6b63] hover:text-brand-950")}>
                {f.label}
              </Link>
            ))}
          </nav>
          <p className="hidden shrink-0 text-[13px] text-muted sm:block" aria-live="polite">{error ? "Gagal memuat" : `${total} event`}</p>
        </div>

        <div className="mt-6">
          {events.length ? (
            <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 [&>*]:min-w-0">
              {events.map((e, i) => (
                <StaggerItem key={e.id} className="h-full"><EventCard event={e} priority={i < 3} /></StaggerItem>
              ))}
            </Stagger>
          ) : (
            <EmptyState title="Tidak ada event yang sesuai" description={hasFilter ? "Coba ubah kata kunci atau hapus filter." : "Event baru tampil setelah disetujui Disperindag."} action={hasFilter ? <ButtonLink href="/events" variant="secondary">Hapus filter</ButtonLink> : undefined} />
          )}
        </div>
        <Pagination page={page} total={total} pageSize={pageSize} basePath="/events" params={{ ...params, status: filter === "all" ? undefined : filter }} />
      </section>
    </>
  );
}
