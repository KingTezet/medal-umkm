import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarDays, CheckCircle2, Clock, MapPin, Phone, Store, UsersRound } from "lucide-react";
import { getPublicEvent } from "@/lib/queries";
import { availableStands, registrationState, REGISTRATION_LABEL } from "@/lib/domain";
import { formatDateTime, formatPhone, waLink } from "@/lib/format";
import { asStringArray, eventCover, publicMediaUrl } from "@/lib/storage";
import { BUCKETS, ORGANIZATION_TYPES } from "@/lib/constants";
import { Badge, Breadcrumb } from "@/components/ui/misc";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/motion";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const e = await getPublicEvent(slug);
  if (!e) return { title: "Event tidak ditemukan" };
  return { title: e.title, description: e.summary, openGraph: { title: e.title, description: e.summary, images: [{ url: eventCover(e.cover_path, e.slug) }] } };
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
  const applyHref = `/dashboard/umkm/events/${e.id}/daftar`;

  const facts = [
    { icon: CalendarDays, label: "Pelaksanaan", value: `${formatDateTime(e.starts_at)} – ${formatDateTime(e.ends_at)}` },
    { icon: Clock, label: "Pendaftaran stand", value: `${formatDateTime(e.registration_opens_at)} – ${formatDateTime(e.registration_closes_at)}` },
    { icon: MapPin, label: "Lokasi", value: `${e.venue_name}, ${e.address}${e.district ? `, Kec. ${e.district}` : ""}` },
    { icon: UsersRound, label: "Penyelenggara", value: `${e.organization_name} · ${ORGANIZATION_TYPES[e.organization_type]}` },
  ];

  return (
    <article className="relative isolate -mt-[68px] pt-[68px] sm:-mt-[76px] sm:pt-[76px]">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-100/70 via-brand-50/40 to-white" />
        <div className="bg-grid fade-mask absolute inset-0" />
        <div className="absolute -left-32 -top-40 size-[28rem] rounded-full bg-brand-300/40 blur-[100px]" />
      </div>
      <div className="container-page pt-6 sm:pt-8">
        <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Event", href: "/events" }, { label: e.title }]} />
        <div className="relative aspect-[16/9] overflow-hidden rounded-[28px] bg-brand-50 shadow-[0_30px_60px_-35px_rgba(5,35,26,.5)] sm:aspect-[21/9]">
          <Image src={eventCover(e.cover_path, e.slug)} alt={`Foto ${e.title}`} fill priority sizes="(min-width:1200px) 1150px, 100vw" className="object-cover" />
        </div>
      </div>

      <div className="container-page grid gap-10 py-8 lg:grid-cols-[1fr_20rem] lg:gap-12">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={state === "open" ? "success" : state === "upcoming" ? "info" : state === "full" ? "danger" : "neutral"}>{REGISTRATION_LABEL[state]}</Badge>
            <span className="text-[13px] text-muted">{e.category}</span>
          </div>
          <h1 className="mt-3 display text-[32px] font-semibold leading-[1.05] text-brand-950 sm:text-[44px]">{e.title}</h1>
          <p className="mt-3 text-base leading-relaxed text-muted">{e.summary}</p>

          <dl className="mt-8 grid gap-px overflow-hidden rounded-[22px] border border-black/[0.06] bg-black/[0.06] sm:grid-cols-2">
            {facts.map((f) => (
              <div key={f.label} className="bg-white p-4">
                <dt className="flex items-center gap-2 text-[13px] text-muted"><f.icon className="size-4 text-primary" aria-hidden />{f.label}</dt>
                <dd className="mt-1 text-sm font-medium text-ink">{f.value}</dd>
              </div>
            ))}
          </dl>

          <Reveal className="mt-10">
            <h2 className="display text-[24px] font-semibold text-brand-950">Tentang event</h2>
            <div className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-ink/85">{e.description}</div>
          </Reveal>

          <Reveal className="mt-10">
            <h2 className="display text-[24px] font-semibold text-brand-950">Syarat peserta</h2>
            <ul className="mt-3 divide-y divide-line rounded-[22px] bg-white ring-1 ring-black/[0.06]">
              {[...criteria, "Usaha berdomisili di Kabupaten Sumedang dan memiliki NIB atau surat keterangan usaha."].map((c) => (
                <li key={c} className="flex gap-3 px-4 py-3 text-sm">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden /> {c}
                </li>
              ))}
            </ul>
          </Reveal>

          {gallery.length > 0 && (
            <Reveal className="mt-10">
              <h2 className="display text-[24px] font-semibold text-brand-950">Galeri</h2>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {gallery.map((g, i) => (
                  <div key={g} className="relative aspect-[4/3] overflow-hidden rounded-xl bg-surface-muted">
                    <Image src={g} alt={`Galeri ${e.title} ${i + 1}`} fill sizes="(min-width:640px) 33vw, 50vw" className="object-cover" />
                  </div>
                ))}
              </div>
            </Reveal>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[26px] bg-white p-6 shadow-[0_24px_50px_-30px_rgba(5,35,26,.35)] ring-1 ring-black/[0.06]">
            <p className="text-[13px] text-muted">Stand tersedia</p>
            <p className="mt-1 display text-[40px] font-semibold leading-none tabular-nums text-brand-950">{remaining}<span className="text-base font-normal text-muted"> / {e.stand_capacity}</span></p>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-surface-muted" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Stand terkonfirmasi">
              <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
            </div>
            <p className="mt-2 text-xs text-muted">{e.confirmed_count ?? 0} stand dikonfirmasi Disperindag</p>
            <div className="mt-5 hidden lg:block">
              {state === "open" ? (
                <ButtonLink href={applyHref} size="lg" className="w-full"><Store className="size-4" aria-hidden /> Daftar Stand</ButtonLink>
              ) : (
                <p className="rounded-lg bg-surface-muted p-3 text-sm text-muted">{state === "upcoming" ? `Pendaftaran dibuka ${formatDateTime(e.registration_opens_at)}.` : "Event ini tidak menerima pendaftaran baru."}</p>
              )}
            </div>
            {(e.contact_name || e.contact_phone) && (
              <div className="mt-5 border-t border-line pt-4">
                <p className="text-[13px] text-muted">Kontak penyelenggara</p>
                <p className="mt-0.5 text-sm font-medium">{e.contact_name ?? e.organization_name}</p>
                {e.contact_phone && wa && (
                  <a href={wa} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
                    <Phone className="size-4" aria-hidden /> {formatPhone(e.contact_phone)}
                  </a>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Mobile sticky action */}
      <div className="sticky bottom-0 z-40 border-t border-line bg-white/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-sm lg:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{REGISTRATION_LABEL[state]}</p>
            <p className="text-xs text-muted">{remaining} dari {e.stand_capacity} stand tersedia</p>
          </div>
          {state === "open" ? <ButtonLink href={applyHref}>Daftar Stand</ButtonLink> : <span className="text-xs text-muted">Tidak menerima pendaftaran</span>}
        </div>
      </div>
    </article>
  );
}
