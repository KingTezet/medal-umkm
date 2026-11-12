import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin, Store } from "lucide-react";
import type { PublicBusiness, PublicEvent } from "@/lib/queries";
import { availableStands, registrationState, REGISTRATION_LABEL, type RegistrationState } from "@/lib/domain";
import { formatDateRange } from "@/lib/format";
import { eventCover, umkmImage } from "@/lib/storage";
import { Badge } from "@/components/ui/misc";
import type { Tone } from "@/lib/constants";

const REG_TONE: Record<RegistrationState, Tone> = {
  open: "success",
  upcoming: "info",
  closed: "neutral",
  full: "danger",
  unavailable: "neutral",
};

const cardBase =
  "group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white transition-[border-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-primary-border hover:shadow-[0_8px_24px_-16px_rgba(16,59,45,0.35)]";

export function EventCard({ event, priority }: { event: PublicEvent; priority?: boolean }) {
  const state = event.status === "completed" ? "closed" : registrationState(event);
  const remaining = availableStands(event.stand_capacity, event.confirmed_count);
  return (
    <Link href={`/events/${event.slug}`} className={cardBase}>
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-muted">
        <Image
          src={eventCover(event.cover_path, event.slug)}
          alt={`Foto ${event.title}`}
          fill
          priority={priority}
          sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={REG_TONE[state]}>{REGISTRATION_LABEL[state]}</Badge>
          <span className="text-xs text-muted">{event.category}</span>
        </div>
        <h3 className="mt-3 line-clamp-2 text-[17px] font-semibold leading-snug text-ink group-hover:text-primary">{event.title}</h3>
        <div className="mt-3 space-y-1.5 text-[13px] text-muted">
          <p className="flex items-center gap-2"><CalendarDays className="size-4 shrink-0" aria-hidden />{formatDateRange(event.starts_at, event.ends_at)}</p>
          <p className="flex items-center gap-2"><MapPin className="size-4 shrink-0" aria-hidden /><span className="truncate">{event.venue_name}{event.district ? `, ${event.district}` : ""}</span></p>
        </div>
        <div className="mt-auto pt-4">
          <div className="flex items-center justify-between border-t border-line pt-3.5">
            <p className="text-[13px] text-muted">
              <span className="font-semibold text-ink tabular-nums">{remaining}</span> dari {event.stand_capacity} stand tersedia
            </p>
            <span className="inline-flex items-center gap-1 text-[13px] font-medium text-primary">
              Detail <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function UmkmCard({ item }: { item: PublicBusiness }) {
  return (
    <Link href={`/umkm/${item.slug}`} className={cardBase}>
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-muted">
        {item.cover_path || item.logo_path ? (
          <Image src={umkmImage(item.cover_path ?? item.logo_path, item.slug ?? "")} alt={`Foto usaha ${item.business_name}`} fill sizes="(min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw" className="object-cover" />
        ) : (
          <div className="grid size-full place-items-center text-muted"><Store className="size-8" aria-hidden /></div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <p className="text-xs text-muted">{item.category}</p>
        <h3 className="mt-1 line-clamp-2 text-[15px] font-semibold leading-snug text-ink group-hover:text-primary">{item.business_name}</h3>
        <p className="mt-auto flex items-center gap-1.5 pt-2 text-xs text-muted">
          <MapPin className="size-3.5 shrink-0" aria-hidden />
          <span className="truncate">{item.district || "Sumedang"}</span>
        </p>
      </div>
    </Link>
  );
}
