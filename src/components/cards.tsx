import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, MapPin, Store } from "lucide-react";
import type { PublicBusiness, PublicEvent } from "@/lib/queries";
import { availableStands, registrationState, REGISTRATION_LABEL } from "@/lib/domain";
import { dayParts, formatDateRange } from "@/lib/format";
import { eventCover, umkmImage } from "@/lib/storage";
import { VerifiedIcon } from "@/components/icons";
import { formatRupiah } from "@/lib/constants";
import { cn } from "@/lib/cn";

export function EventCard({ event, priority }: { event: PublicEvent; priority?: boolean }) {
  const state = event.status === "completed" ? "closed" : registrationState(event);
  const open = state === "open";
  const remaining = availableStands(event.stand_capacity, event.confirmed_count);
  const pct = event.stand_capacity ? Math.round(((event.stand_capacity - remaining) / event.stand_capacity) * 100) : 0;
  const { day, month } = dayParts(event.starts_at);
  return (
    <Link href={`/events/${event.slug}`} className="group block h-full overflow-hidden rounded-[26px] bg-white p-2 ring-1 ring-black/[0.06] transition-[box-shadow,transform] duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(5,35,26,.4)]">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-brand-50">
        <Image src={eventCover(event.cover_path, event.slug)} alt={`Foto ${event.title}`} fill priority={priority} sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]" />
        <div className="glass absolute left-3 top-3 rounded-2xl px-3 py-1.5 text-center">
          <p className="display text-[20px] font-semibold leading-none text-brand-950">{day}</p>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-brand-700">{month}</p>
        </div>
        <span className={cn("absolute right-3 top-3 rounded-full px-3 py-1 text-[12px] font-medium backdrop-blur", open ? "bg-brand-900/90 text-white" : "bg-white/95 text-brand-950 shadow-sm")}>
          {open && <span className="mr-1.5 inline-block size-1.5 animate-pulse rounded-full bg-brand-300 align-middle" />}
          {REGISTRATION_LABEL[state]}
        </span>
      </div>
      <div className="px-3 pb-3 pt-4">
        <p className="flex items-center justify-between gap-2 text-[12px] font-medium text-brand-700"><span>{event.category}</span><span className="rounded-full bg-brand-50 px-2 py-0.5 text-brand-800 ring-1 ring-brand-300/50">{event.stand_fee ? `Stand ${formatRupiah(event.stand_fee)}` : "Stand gratis"}</span></p>
        <h3 className="display mt-1 line-clamp-2 text-[19px] font-semibold leading-snug text-brand-950">{event.title}</h3>
        <div className="mt-3 space-y-1 text-[13px] text-[#5b6b63]">
          <p className="flex items-center gap-2"><CalendarDays className="size-4 shrink-0" aria-hidden />{formatDateRange(event.starts_at, event.ends_at)}</p>
          <p className="flex items-center gap-2"><MapPin className="size-4 shrink-0" aria-hidden /><span className="truncate">{event.venue_name}{event.district ? `, ${event.district}` : ""}</span></p>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-black/[0.06]"><div className="h-full rounded-full bg-brand-500" style={{ width: `${pct}%` }} /></div>
          <span className="shrink-0 text-[12px] text-[#5b6b63]"><strong className="text-brand-950">{remaining}</strong>/{event.stand_capacity} sisa</span>
        </div>
      </div>
    </Link>
  );
}

export function UmkmCard({ item }: { item: PublicBusiness }) {
  const has = !!(item.cover_path || item.logo_path);
  return (
    <Link href={`/umkm/${item.slug}`} className="group relative block aspect-[4/5] overflow-hidden rounded-[24px] bg-brand-50 ring-1 ring-black/[0.04]">
      {has ? (
        <Image src={umkmImage(item.cover_path ?? item.logo_path, item.slug ?? "")} alt={`Foto usaha ${item.business_name}`} fill sizes="(min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
      ) : (
        <div className="grid size-full place-items-center text-brand-700/50"><Store className="size-10" aria-hidden /></div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-950/90 via-brand-950/20 to-transparent" aria-hidden />
      <span className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-white/95 text-brand-950 opacity-0 transition-[opacity,transform] duration-300 group-hover:rotate-45 group-hover:opacity-100"><ArrowUpRight className="size-4" aria-hidden /></span>
      <div className="absolute inset-x-3.5 bottom-3.5 text-white [text-shadow:0_1px_12px_rgba(0,0,0,.35)]">
        <p className="flex items-center gap-1 text-[11px] text-white/85"><VerifiedIcon className="size-3.5 text-brand-300" />{item.category}</p>
        <h3 className="display mt-0.5 line-clamp-2 text-[16px] font-semibold leading-tight sm:text-[17px]">{item.business_name}</h3>
        <p className="mt-1 flex items-center gap-1 text-[11px] text-white/75"><MapPin className="size-3" aria-hidden />{item.district || "Sumedang"}</p>
      </div>
    </Link>
  );
}
