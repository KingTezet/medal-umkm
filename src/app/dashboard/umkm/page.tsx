import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, CheckCircle2, ClipboardList, Circle, Store, Ticket } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { APPLICATION_STATUS, VERIFICATION_STATUS } from "@/lib/constants";
import { formatShortDate } from "@/lib/format";
import { Card, EmptyState, Notice, PageHeader, StatCard, StatusBadge } from "@/components/ui/misc";
import { ButtonLink } from "@/components/ui/button";
import { EventCard } from "@/components/cards";
import { listFeaturedEvents } from "@/lib/queries";

export const metadata: Metadata = { title: "Ringkasan UMKM" };

export default async function UmkmHome() {
  const { supabase, profile, user } = await requireRole("umkm");
  const [{ data: bp }, { data: apps }, events] = await Promise.all([
    supabase.from("business_profiles").select("*").eq("user_id", user.id).maybeSingle(),
    supabase.from("stand_applications").select("id, application_code, status, stand_number, submitted_at, events(title)").eq("submitted_by", user.id).order("submitted_at", { ascending: false }),
    listFeaturedEvents(2),
  ]);
  const list = apps ?? [];
  const active = list.filter((a) => !["withdrawn", "rejected", "confirmed"].includes(a.status)).length;
  const confirmed = list.filter((a) => a.status === "confirmed").length;

  const checklist = bp
    ? [
        { label: "Nama, kategori & deskripsi usaha", done: !!bp.description },
        { label: "Alamat, kecamatan & WhatsApp", done: !!(bp.address && bp.district && bp.whatsapp) },
        { label: "NIB atau surat keterangan usaha", done: !!(bp.nib || bp.business_license_path) },
        { label: "Logo atau foto usaha", done: !!(bp.logo_path || bp.cover_path) },
        { label: "Daftar produk", done: Array.isArray(bp.products) && bp.products.length > 0 },
      ]
    : [];
  const pct = checklist.length ? Math.round((checklist.filter((c) => c.done).length / checklist.length) * 100) : 0;

  return (
    <>
      <PageHeader eyebrow="Dashboard UMKM" title={`Halo, ${profile.full_name.split(" ")[0] || "Pelaku UMKM"}!`} description={bp ? bp.business_name : undefined} action={<ButtonLink href="/dashboard/umkm/events"><CalendarDays className="size-4" /> Cari event</ButtonLink>} />
      {bp?.verification_status === "revision_required" && (
        <div className="mb-6"><Notice tone="warning" title="Profil usaha perlu revisi">{bp.verification_note} <Link className="font-semibold underline" href="/dashboard/umkm/profil">Perbarui profil</Link></Notice></div>
      )}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 [&>*:last-child]:col-span-2 sm:[&>*:last-child]:col-span-1">
        <StatCard accent label="Pendaftaran aktif" value={active} icon={<ClipboardList className="size-5" />} />
        <StatCard label="Stand dikonfirmasi" value={confirmed} icon={<Ticket className="size-5" />} />
        <StatCard label="Status profil" value={<span className="text-2xl">{bp ? VERIFICATION_STATUS[bp.verification_status].label : "-"}</span>} icon={<Store className="size-5" />} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">Pendaftaran terbaru</h2>
            <Link href="/dashboard/umkm/pendaftaran" className="text-sm font-semibold text-emerald hover:underline">Semua</Link>
          </div>
          {list.length ? (
            <ul className="mt-4 divide-y divide-line">
              {list.slice(0, 5).map((a) => (
                <li key={a.id}>
                  <Link href={`/dashboard/umkm/pendaftaran/${a.id}`} className="flex items-center justify-between gap-3 py-3 hover:text-emerald">
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{a.events?.title}</p>
                      <p className="text-xs text-muted">{a.application_code} · {formatShortDate(a.submitted_at)}{a.stand_number ? ` · Stand ${a.stand_number}` : ""}</p>
                    </div>
                    <StatusBadge map={APPLICATION_STATUS} status={a.status} />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-4"><EmptyState title="Belum ada pendaftaran" description="Temukan event yang sedang membuka pendaftaran stand." action={<ButtonLink href="/dashboard/umkm/events">Cari event</ButtonLink>} /></div>
          )}
        </Card>
        <Card>
          <h2 className="font-semibold text-lg">Kelengkapan profil</h2>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-surface-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} /></div>
          <p className="mt-2 text-sm text-muted">{pct}% lengkap</p>
          <ul className="mt-4 space-y-2.5">
            {checklist.map((c) => (
              <li key={c.label} className="flex items-center gap-2.5 text-sm">
                {c.done ? <CheckCircle2 className="size-4 text-emerald" /> : <Circle className="size-4 text-muted" />}
                <span className={c.done ? "text-ink" : "text-muted"}>{c.label}</span>
              </li>
            ))}
          </ul>
          <ButtonLink href="/dashboard/umkm/profil" variant="outline" className="mt-5">Lengkapi profil <ArrowRight className="size-4" /></ButtonLink>
        </Card>
      </div>

      {events.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 font-semibold text-lg">Event yang sedang dibuka</h2>
          <div className="grid gap-5 sm:grid-cols-2">{events.map((e) => <EventCard key={e.id} event={e} />)}</div>
        </section>
      )}
    </>
  );
}
