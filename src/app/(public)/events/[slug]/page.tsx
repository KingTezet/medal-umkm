import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarDays, CheckCircle2, Clock, MapPin, Phone, Store, UsersRound } from "lucide-react";
import { getPublicEvent } from "@/lib/queries";
import { availableStands, registrationState, REGISTRATION_LABEL } from "@/lib/domain";
import { formatDateRange, formatDateTime, formatPhone, waLink } from "@/lib/format";
import { asStringArray, eventCover, publicMediaUrl } from "@/lib/storage";
import { BUCKETS, ORGANIZATION_TYPES } from "@/lib/constants";
import { Breadcrumb, Badge } from "@/components/ui/misc";
import { ButtonLink } from "@/components/ui/button";
import { ParallaxImage, Reveal } from "@/components/motion";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const e = await getPublicEvent(slug);
  if (!e) return { title: "Event tidak ditemukan" };
  return {
    title: e.title,
    description: e.summary,
    openGraph: { title: e.title, description: e.summary, images: [{ url: eventCover(e.cover_path, e.slug) }] },
  };
}

export default async function EventDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const e = await getPublicEvent(slug);
  if (!e) notFound();

  const state = e.status === "completed" ? "closed" : registrationState(e);
  const remaining = availableStands(e.stand_capacity, e.confirmed_count);
  const criteria = asStringArray(e.criteria);
  const gallery = asStringArray(e.gallery_paths).map((p) => publicMediaUrl(BUCKETS.eventMedia, p)!).filter(Boolean);
  const wa = waLink(e.contact_phone, `Halo, saya ingin bertanya tentang ${e.title}`);
  const pct = Math.min(100, Math.round(((e.confirmed_count ?? 0) / e.stand_capacity) * 100));

  return (
    <article>
      <section className="relative isolate overflow-hidden bg-night text-ivory">
        <ParallaxImage src={eventCover(e.cover_path, e.slug)} alt={`Foto ${e.title}`} priority className="!absolute inset-0 -z-20" strength={90} />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-night via-night/75 to-night/30" aria-hidden />
        <div className="container-page flex min-h-[68svh] flex-col justify-end pb-12 pt-32">
          <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Event", href: "/events" }, { label: e.title }]} />
          <div className="flex flex-wrap gap-2">
            <Badge tone={state === "open" ? "success" : state === "upcoming" ? "gold" : "neutral"}>{REGISTRATION_LABEL[state]}</Badge>
            <Badge tone="neutral" dot={false}>{e.category}</Badge>
          </div>
          <h1 className="mt-4 max-w-4xl font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl">{e.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-ivory/80">{e.summary}</p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ivory/85">
            <span className="flex items-center gap-2"><CalendarDays className="size-4 text-gold" aria-hidden />{formatDateRange(e.starts_at, e.ends_at)}</span>
            <span className="flex items-center gap-2"><MapPin className="size-4 text-gold" aria-hidden />{e.venue_name}{e.district ? `, ${e.district}` : ""}</span>
            <span className="flex items-center gap-2"><UsersRound className="size-4 text-gold" aria-hidden />{e.organization_name}</span>
          </div>
        </div>
      </section>

      <div className="container-page grid gap-10 py-14 lg:grid-cols-[1fr_22rem] lg:gap-14">
        <div className="min-w-0 space-y-12">
          <Reveal>
            <h2 className="font-display text-3xl">Tentang event</h2>
            <div className="mt-4 whitespace-pre-line text-[16px] leading-relaxed text-ink/85">{e.description}</div>
          </Reveal>

          {criteria.length > 0 && (
            <Reveal>
              <h2 className="font-display text-3xl">Syarat &amp; kriteria peserta</h2>
              <ul className="mt-5 grid gap-3">
                {criteria.map((c) => (
                  <li key={c} className="flex gap-3 rounded-2xl border border-line bg-surface p-4 text-[15px]">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald" aria-hidden />
                    {c}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-muted">Syarat umum: usaha berdomisili di Kabupaten Sumedang dan memiliki NIB atau surat keterangan usaha.</p>
            </Reveal>
          )}

          <Reveal>
            <h2 className="font-display text-3xl">Jadwal &amp; lokasi</h2>
            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                { icon: CalendarDays, label: "Pelaksanaan", value: `${formatDateTime(e.starts_at)} — ${formatDateTime(e.ends_at)}` },
                { icon: Clock, label: "Pendaftaran stand", value: `${formatDateTime(e.registration_opens_at)} — ${formatDateTime(e.registration_closes_at)}` },
                { icon: MapPin, label: "Lokasi", value: `${e.venue_name}, ${e.address}${e.district ? `, Kec. ${e.district}` : ""}` },
                { icon: UsersRound, label: "Penyelenggara", value: `${e.organization_name} · ${ORGANIZATION_TYPES[e.organization_type]}` },
              ].map((d) => (
                <div key={d.label} className="rounded-2xl border border-line bg-surface p-4">
                  <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gold-deep"><d.icon className="size-4" aria-hidden />{d.label}</dt>
                  <dd className="mt-2 text-[15px] text-ink">{d.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          {gallery.length > 0 && (
            <Reveal>
              <h2 className="font-display text-3xl">Galeri</h2>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {gallery.map((g, i) => (
                  <div key={g} className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                    <Image src={g} alt={`Galeri ${e.title} ${i + 1}`} fill sizes="(min-width:640px) 33vw, 50vw" className="object-cover" />
                  </div>
                ))}
              </div>
            </Reveal>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="overflow-hidden rounded-3xl border border-line bg-surface">
            <div className="bg-forest p-6 text-ivory">
              <p className="text-sm text-ivory/70">Sisa stand</p>
              <p className="mt-1 font-display text-5xl text-gold-gradient">{remaining}<span className="text-2xl text-ivory/60"> / {e.stand_capacity}</span></p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/15" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Stand terkonfirmasi">
                <div className="h-full rounded-full bg-gold" style={{ width: `${pct}%` }} />
              </div>
              <p className="mt-2 text-xs text-ivory/60">{e.confirmed_count ?? 0} stand telah dikonfirmasi Disperindag</p>
            </div>
            <div className="space-y-4 p-6">
              {state === "open" ? (
                <ButtonLink href={`/dashboard/umkm/events/${e.id}/daftar`} size="lg" className="w-full">
                  <Store className="size-5" aria-hidden /> Daftar Stand
                </ButtonLink>
              ) : (
                <div className="rounded-2xl bg-sage p-4 text-sm text-forest">
                  <p className="font-semibold">{REGISTRATION_LABEL[state]}</p>
                  {state === "upcoming" && <p className="mt-1">Pendaftaran dibuka {formatDateTime(e.registration_opens_at)}.</p>}
                  {state === "closed" && <p className="mt-1">Event ini tidak lagi menerima pendaftaran baru.</p>}
                  {state === "full" && <p className="mt-1">Seluruh stand telah terisi.</p>}
                </div>
              )}
              <p className="text-xs leading-relaxed text-muted">Belum punya akun? Anda akan diarahkan untuk masuk/daftar, lalu kembali ke formulir pendaftaran event ini.</p>
              {(e.contact_name || e.contact_phone) && (
                <div className="border-t border-line pt-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-gold-deep">Kontak penyelenggara</p>
                  <p className="mt-1 text-sm font-semibold">{e.contact_name ?? e.organization_name}</p>
                  {e.contact_phone && (
                    <a href={wa ?? "#"} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-emerald hover:underline">
                      <Phone className="size-4" aria-hidden /> {formatPhone(e.contact_phone)}
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
