import type { Metadata } from "next";
import Link from "next/link";
import { Search, SlidersHorizontal } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { EventCard } from "@/components/cards";
import { Pagination } from "@/components/pagination";
import { Stagger, StaggerItem } from "@/components/motion";
import { EmptyState } from "@/components/ui/misc";
import { ButtonLink } from "@/components/ui/button";
import { getCategories, listPublicEvents, type EventFilter } from "@/lib/queries";
import { SUMEDANG_DISTRICTS } from "@/lib/constants";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Event & Bazar",
  description: "Daftar event, bazar, festival, dan pameran UMKM di Kabupaten Sumedang yang telah disetujui Disperindag.",
};

const FILTERS: { key: EventFilter; label: string }[] = [
  { key: "all", label: "Semua" },
  { key: "open", label: "Pendaftaran Dibuka" },
  { key: "upcoming", label: "Segera Dibuka" },
  { key: "closed", label: "Ditutup / Selesai" },
];

type SP = Promise<Record<string, string | string[] | undefined>>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || undefined;

export default async function EventsPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const params = {
    q: one(sp.q),
    category: one(sp.category),
    district: one(sp.district),
    status: one(sp.status) as EventFilter | undefined,
    from: one(sp.from),
    to: one(sp.to),
  };
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

  return (
    <>
      <PageHero
        eyebrow="Event & Bazar"
        title={<>Temukan panggung untuk <em className="text-gold-gradient">usaha Anda</em></>}
        description="Semua event di bawah ini telah disetujui Disperindag Kabupaten Sumedang. Daftar stand langsung dari halaman detail event."
        image="/images/pasar-malam-1.jpg"
      />
      <section className="container-page -mt-8 pb-24">
        <form method="get" className="relative z-10 rounded-3xl border border-line bg-surface p-4 shadow-[0_30px_60px_-40px_rgba(6,34,25,.5)] sm:p-5" role="search" aria-label="Cari event">
          <div className="grid gap-3 lg:grid-cols-[1.6fr_1fr_1fr_auto]">
            <label className="relative">
              <span className="sr-only">Kata kunci</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
              <input name="q" defaultValue={params.q} placeholder="Cari nama event, lokasi, penyelenggara…" className="h-12 w-full rounded-full border border-line bg-ivory/60 pl-11 pr-4 text-[15px] focus:border-emerald focus:outline-none focus:ring-4 focus:ring-emerald/10" />
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
          </div>
          <details className="group mt-3" open={!!(params.from || params.to)}>
            <summary className="inline-flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-emerald">
              <SlidersHorizontal className="size-4" aria-hidden /> Filter tanggal
            </summary>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:max-w-xl">
              <label className="text-sm">
                <span className="mb-1 block text-muted">Mulai dari</span>
                <input type="date" name="from" defaultValue={params.from} className="h-11 w-full rounded-xl border border-line px-3" />
              </label>
              <label className="text-sm">
                <span className="mb-1 block text-muted">Sampai</span>
                <input type="date" name="to" defaultValue={params.to} className="h-11 w-full rounded-xl border border-line px-3" />
              </label>
            </div>
          </details>
          {filter !== "all" && <input type="hidden" name="status" value={filter} />}
        </form>

        <div className="mt-8 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none]" role="tablist" aria-label="Status pendaftaran">
          {FILTERS.map((f) => (
            <Link
              key={f.key}
              href={linkFor(f.key)}
              role="tab"
              aria-selected={filter === f.key}
              className={cn(
                "whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition",
                filter === f.key ? "border-forest bg-forest text-ivory" : "border-line bg-surface text-ink/75 hover:border-emerald",
              )}
            >
              {f.label}
            </Link>
          ))}
        </div>

        <p className="mt-6 text-sm text-muted" aria-live="polite">
          {error ? "Gagal memuat event. Muat ulang halaman." : `${total} event ditemukan`}
        </p>

        <div className="mt-6">
          {events.length ? (
            <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((e, i) => (
                <StaggerItem key={e.id} className="h-full">
                  <EventCard event={e} priority={i < 3} />
                </StaggerItem>
              ))}
            </Stagger>
          ) : (
            <EmptyState
              title="Tidak ada event yang cocok"
              description="Coba ubah kata kunci atau filter. Event baru tampil setelah disetujui Disperindag."
              action={<ButtonLink href="/events" variant="outline">Reset filter</ButtonLink>}
            />
          )}
        </div>
        <Pagination page={page} total={total} pageSize={pageSize} basePath="/events" params={{ ...params, status: filter === "all" ? undefined : filter }} />
      </section>
    </>
  );
}
