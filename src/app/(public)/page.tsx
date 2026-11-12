import { LandingHero } from "@/components/landing/hero";
import { Bento, EventTile, FinalCta, Heading, Marquee, StatsBand, Steps, UmkmTiles, type LandingEvent } from "@/components/landing/sections";
import { PillLink, Rise, RiseGroup, RiseItem, ScrollProgress } from "@/components/landing/kit";
import { Notice } from "@/components/ui/misc";
import { getCategories, getPublicSettings, getPublicStats, listFeaturedEvents, listPublicUmkm } from "@/lib/queries";
import { availableStands, registrationState, REGISTRATION_LABEL } from "@/lib/domain";
import { dayParts, formatDateRange } from "@/lib/format";
import { eventCover, publicMediaUrl } from "@/lib/storage";
import { BUCKETS, SUMEDANG_DISTRICTS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [settings, stats, events, umkm, cats] = await Promise.all([
    getPublicSettings(),
    getPublicStats(),
    listFeaturedEvents(6),
    listPublicUmkm({ pageSize: 5 }),
    getCategories("umkm"),
  ]);

  const tiles: LandingEvent[] = events.map((e) => {
    const st = registrationState(e);
    const { day, month } = dayParts(e.starts_at);
    return {
      id: e.id!,
      slug: e.slug!,
      title: e.title!,
      category: e.category!,
      cover: eventCover(e.cover_path, e.slug ?? ""),
      dateLabel: formatDateRange(e.starts_at, e.ends_at),
      day,
      month,
      place: `${e.venue_name}${e.district ? `, ${e.district}` : ""}`,
      remaining: availableStands(e.stand_capacity, e.confirmed_count),
      capacity: e.stand_capacity,
      stateLabel: REGISTRATION_LABEL[st],
      open: st === "open",
    };
  });
  const top = [...events].sort((a, b) => b.stand_capacity - a.stand_capacity)[0];
  const thumbs = umkm.items.map((u) => publicMediaUrl(BUCKETS.umkmMedia, u.cover_path ?? u.logo_path)).filter((x): x is string => !!x);

  return (
    <>
      <ScrollProgress />
      <LandingHero headline={settings.hero.headline} subheadline={settings.hero.subheadline} stats={stats} thumbs={thumbs} />

      {settings.announcement.enabled && settings.announcement.text && (
        <div className="container-page mb-8"><Notice tone="info" title="Pengumuman">{settings.announcement.text}</Notice></div>
      )}

      <Marquee items={[...cats.map((c) => c.name), ...SUMEDANG_DISTRICTS.slice(0, 8)]} />

      {/* Kenapa MEDAL */}
      <section aria-labelledby="kenapa" className="bg-white py-20 sm:py-28">
        <div className="container-page">
          <Heading kicker="Kenapa MEDAL" title={<span id="kenapa">Lebih mudah tampil,<br className="hidden sm:block" /> lebih jelas prosesnya.</span>} sub="Dirancang untuk pelaku UMKM, penyelenggara, dan Disperindag dalam satu alur yang transparan." />
          <Bento rows={tiles.slice(0, 3).map((t) => ({ title: t.title, state: t.stateLabel, open: t.open }))} confirmed={top?.confirmed_count ?? 0} capacity={top?.stand_capacity ?? 0} />
        </div>
      </section>

      {/* Angka */}
      <section aria-labelledby="angka" className="bg-canvas py-20 sm:py-24">
        <div className="container-page">
          <Heading kicker="Dalam angka" title={<span id="angka">Tumbuh bersama, tercatat transparan.</span>} sub="Langsung dari database MEDAL — bukan angka karangan." />
          <div className="mt-14"><StatsBand stats={stats} /></div>
        </div>
      </section>

      {/* Event */}
      <section aria-labelledby="event" className="bg-white py-20 sm:py-28">
        <div className="container-page">
          <Heading kicker="Event pilihan" title={<span id="event">Sedang membuka pendaftaran</span>} sub="Disetujui Disperindag. Sisa stand dihitung dari stand yang sudah dikonfirmasi." action={<PillLink href="/events" tone="light">Semua event</PillLink>} />
          {tiles.length ? (
            <RiseGroup className="-mx-4 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 lg:grid-cols-3">
              {tiles.slice(0, 3).map((t) => (
                <RiseItem key={t.id} className="w-[82%] shrink-0 snap-start sm:w-[60%] md:w-auto">
                  <EventTile e={t} />
                </RiseItem>
              ))}
            </RiseGroup>
          ) : (
            <Rise className="mt-12 rounded-[28px] bg-canvas p-10 text-center text-[#4c5c54]">Belum ada event yang membuka pendaftaran. Event baru tampil setelah disetujui Disperindag.</Rise>
          )}
        </div>
      </section>

      {/* Cara kerja */}
      <section aria-labelledby="alur" className="bg-canvas py-20 sm:py-28">
        <div className="container-page">
          <Heading kicker="Cara kerja" title={<span id="alur">Empat langkah ke lapak final.</span>} />
          <Steps />
        </div>
      </section>

      {/* UMKM */}
      {umkm.items.length > 0 && (
        <section aria-labelledby="umkm" className="bg-white py-20 sm:py-28">
          <div className="container-page">
            <Heading kicker="Direktori UMKM" title={<span id="umkm">Kenali produk lokal Sumedang.</span>} sub="Hanya usaha terverifikasi yang setuju dipublikasikan." action={<PillLink href="/umkm" tone="light">Buka direktori</PillLink>} />
            <div className="mt-12">
              <UmkmTiles items={umkm.items.map((u) => ({ id: u.id!, slug: u.slug!, name: u.business_name!, category: u.category!, district: u.district || "Sumedang", img: publicMediaUrl(BUCKETS.umkmMedia, u.cover_path ?? u.logo_path) }))} />
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-white pb-20 sm:pb-28">
        <div className="container-page">
          <RiseGroup>
            <RiseItem><FinalCta /></RiseItem>
          </RiseGroup>
        </div>
      </section>
    </>
  );
}
