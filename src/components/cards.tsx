import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, MapPin, Store } from "lucide-react";
import type { PublicBusiness, PublicEvent } from "@/lib/queries";
import { availableStands, registrationState, REGISTRATION_LABEL, type RegistrationState } from "@/lib/domain";
import { dayParts, formatDateRange } from "@/lib/format";
import { eventCover, umkmImage } from "@/lib/storage";
import { Badge } from "@/components/ui/misc";
import type { Tone } from "@/lib/constants";

const REG_TONE: Record<RegistrationState, Tone> = {
  open: "success",
  upcoming: "gold",
  closed: "neutral",
  full: "danger",
  unavailable: "neutral",
};

export function EventCard({ event, priority }: { event: PublicEvent; priority?: boolean }) {
  const state = event.status === "completed" ? "closed" : registrationState(event);
  const remaining = availableStands(event.stand_capacity, event.confirmed_count);
  const { day, month } = dayParts(event.starts_at);
  return (
    <Link
      href={`/events/${event.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface transition duration-500 hover:-translate-y-1 hover:border-emerald/30 hover:shadow-[0_30px_60px_-30px_rgba(6,34,25,.45)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={eventCover(event.cover_path, event.slug)}
          alt={`Foto ${event.title}`}
          fill
          priority={priority}
          sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-night/70 via-night/0 to-night/10" aria-hidden />
        <div className="absolute left-4 top-4 grid min-w-14 place-items-center rounded-2xl bg-ivory/95 px-2.5 py-2 text-center shadow-lg backdrop-blur">
          <span className="font-display text-2xl leading-none text-forest">{day}</span>
          <span className="mt-0.5 text-[0.65rem] font-bold uppercase tracking-widest text-gold-deep">{month}</span>
        </div>
        <div className="absolute right-4 top-4">
          <Badge tone={REG_TONE[state]} className="bg-ivory/95 backdrop-blur">{REGISTRATION_LABEL[state]}</Badge>
        </div>
        <p className="absolute bottom-4 left-4 rounded-full bg-night/50 px-3 py-1 text-xs font-semibold text-ivory backdrop-blur">{event.category}</p>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl leading-snug text-ink transition group-hover:text-emerald">{event.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{event.summary}</p>
        <div className="mt-4 space-y-1.5 text-sm text-ink/80">
          <p className="flex items-center gap-2"><CalendarDays className="size-4 text-gold-deep" aria-hidden />{formatDateRange(event.starts_at, event.ends_at)}</p>
          <p className="flex items-center gap-2"><MapPin className="size-4 text-gold-deep" aria-hidden /><span className="truncate">{event.venue_name}{event.district ? `, ${event.district}` : ""}</span></p>
        </div>
        <div className="mt-auto flex items-center justify-between border-t border-line pt-4 mt-5">
          <p className="text-sm">
            <span className="font-semibold text-forest">{remaining}</span>
            <span className="text-muted"> / {event.stand_capacity} stand tersisa</span>
          </p>
          <span className="grid size-9 place-items-center rounded-full bg-sage text-emerald transition group-hover:bg-emerald group-hover:text-ivory">
            <ArrowUpRight className="size-4" aria-hidden />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function UmkmCard({ item }: { item: PublicBusiness }) {
  return (
    <Link
      href={`/umkm/${item.slug}`}
      className="group relative block overflow-hidden rounded-3xl border border-line bg-surface transition duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(6,34,25,.45)]"
    >
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={umkmImage(item.cover_path ?? item.logo_path, item.slug ?? "")}
          alt={`Foto usaha ${item.business_name}`}
          fill
          sizes="(min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-night/85 via-night/10 to-transparent" aria-hidden />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-gold-soft">{item.category}</p>
          <h3 className="mt-1 font-display text-lg leading-tight text-ivory">{item.business_name}</h3>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-ivory/70">
            <MapPin className="size-3.5" aria-hidden />
            {item.district || "Sumedang"}
          </p>
        </div>
        {item.logo_path && item.cover_path && (
          <div className="absolute right-3 top-3 size-11 overflow-hidden rounded-full border-2 border-ivory/80 bg-ivory">
            <Image src={umkmImage(item.logo_path)} alt="" fill sizes="44px" className="object-cover" />
          </div>
        )}
        {!item.logo_path && !item.cover_path && (
          <span className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-ivory/90 text-emerald">
            <Store className="size-4" aria-hidden />
          </span>
        )}
      </div>
    </Link>
  );
}
