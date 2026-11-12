import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, MapPin } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { createPublicClient } from "@/lib/supabase/server";
import { availableStands, registrationState, REGISTRATION_LABEL } from "@/lib/domain";
import { formatDateRange, formatDateTime } from "@/lib/format";
import { Breadcrumb, Card, Notice, PageHeader } from "@/components/ui/misc";
import { ButtonLink } from "@/components/ui/button";
import { ApplicationForm } from "@/components/forms/application-form";

export const metadata: Metadata = { title: "Daftar Stand" };

export default async function ApplyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, user } = await requireRole("umkm", `/dashboard/umkm/events/${id}/daftar`);
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const [{ data: event }, { data: bp }, { data: existing }] = await Promise.all([
    createPublicClient().from("public_events").select("*").eq("id", id).maybeSingle(),
    supabase.from("business_profiles").select("*").eq("user_id", user.id).maybeSingle(),
    supabase.from("stand_applications").select("id, status").eq("event_id", id).eq("submitted_by", user.id).maybeSingle(),
  ]);
  if (!event) notFound();

  const state = registrationState(event);
  const missing: string[] = [];
  if (!bp?.whatsapp) missing.push("nomor WhatsApp usaha");
  if (!bp?.address) missing.push("alamat usaha");
  if (!bp?.district) missing.push("kecamatan");
  if (!bp?.nib && !bp?.business_license_path) missing.push("NIB atau surat keterangan usaha");

  let block: React.ReactNode = null;
  if (existing && existing.status !== "withdrawn") {
    block = <Notice tone="info" title="Anda sudah terdaftar di event ini">Lihat status pendaftaran Anda <Link className="font-semibold underline" href={`/dashboard/umkm/pendaftaran/${existing.id}`}>di sini</Link>.</Notice>;
  } else if (state !== "open") {
    block = <Notice tone="warning" title={REGISTRATION_LABEL[state]}>{state === "upcoming" ? `Pendaftaran dibuka ${formatDateTime(event.registration_opens_at)}.` : "Event ini tidak menerima pendaftaran saat ini."}</Notice>;
  } else if (bp?.verification_status === "rejected") {
    block = <Notice tone="danger" title="Profil usaha ditolak">Hubungi Disperindag untuk informasi lebih lanjut.</Notice>;
  } else if (missing.length) {
    block = (
      <Notice tone="warning" title="Lengkapi profil usaha terlebih dahulu">
        Data yang belum lengkap: {missing.join(", ")}.
        <div className="mt-3"><ButtonLink href="/dashboard/umkm/profil" size="sm">Lengkapi profil</ButtonLink></div>
      </Notice>
    );
  }

  return (
    <>
      <Breadcrumb items={[{ label: "Cari event", href: "/dashboard/umkm/events" }, { label: "Daftar stand" }]} />
      <PageHeader eyebrow="Pendaftaran stand" title={event.title} />
      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div>{block ?? <ApplicationForm mode="new" eventId={event.id!} userId={user.id} />}</div>
        <aside className="space-y-4">
          <Card className="space-y-3 text-sm">
            <p className="flex gap-2"><CalendarDays className="size-4 text-gold-deep" />{formatDateRange(event.starts_at, event.ends_at)}</p>
            <p className="flex gap-2"><MapPin className="size-4 text-gold-deep" />{event.venue_name}</p>
            <p>Pendaftaran ditutup <strong>{formatDateTime(event.registration_closes_at)}</strong></p>
            <p>Sisa stand: <strong>{availableStands(event.stand_capacity, event.confirmed_count)}</strong> dari {event.stand_capacity}</p>
            <Link href={`/events/${event.slug}`} className="inline-block font-semibold text-emerald hover:underline" target="_blank">Lihat detail & syarat →</Link>
          </Card>
          {bp && (
            <Card className="space-y-1 text-sm">
              <p className="eyebrow">Data usaha yang dikirim</p>
              <p className="font-semibold">{bp.business_name}</p>
              <p className="text-muted">{bp.category} · {bp.district}</p>
              <p className="text-muted">WA {bp.whatsapp}</p>
              <p className="pt-2 text-xs text-muted">Snapshot data ini disimpan bersama pendaftaran.</p>
            </Card>
          )}
        </aside>
      </div>
    </>
  );
}
