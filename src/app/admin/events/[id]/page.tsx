import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { BUCKETS, EVENT_STATUS, ORGANIZATION_TYPES, VERIFICATION_STATUS } from "@/lib/constants";
import { formatRupiah } from "@/lib/constants";
import { formatDateTime, formatPhone } from "@/lib/format";
import { asStringArray, eventCover } from "@/lib/storage";
import { Breadcrumb, Card, DefinitionList, Notice, PageHeader, StatusBadge } from "@/components/ui/misc";
import { ButtonLink, buttonClass } from "@/components/ui/button";
import { ActionDialog } from "@/components/action-form";
import { PrivateDocLink } from "@/components/dashboard/shared";
import { reviewEventAction } from "@/app/actions/admin";

export const metadata = { title: "Review Event" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase } = await requireRole("admin");
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const { data: e } = await supabase.from("events").select("*, organizer_profiles(*)").eq("id", id).maybeSingle();
  if (!e) notFound();
  const [{ data: counts }, { data: logs }] = await Promise.all([
    supabase.rpc("get_event_application_counts", { p_event_id: id }),
    supabase.from("audit_logs").select("id, action, note, created_at").eq("entity_type", "event").eq("entity_id", id).order("created_at", { ascending: false }).limit(20),
  ]);
  const c = Object.fromEntries((counts ?? []).map((x) => [x.status, Number(x.total)]));
  const org = e.organizer_profiles;
  const h = { event_id: e.id };

  return (
    <>
      <Breadcrumb items={[{ label: "Event", href: "/admin/events" }, { label: e.title }]} />
      <PageHeader
        eyebrow="Review event"
        title={e.title}
        action={<>
          <StatusBadge map={EVENT_STATUS} status={e.status} />
          {e.status === "pending_review" && <>
            <ActionDialog action={reviewEventAction} hidden={{ ...h, action: "publish" }} trigger="Setujui & publikasikan" title="Publikasikan event?" description="Event akan tampil di website publik dan menerima pendaftaran sesuai jadwal." confirmLabel="Publikasikan" noteLabel="Catatan (opsional)" />
            <ActionDialog action={reviewEventAction} hidden={{ ...h, action: "revise" }} trigger="Minta revisi" triggerVariant="outline" title="Minta revisi" confirmLabel="Kirim" noteLabel="Hal yang perlu diperbaiki" noteRequired />
            <ActionDialog action={reviewEventAction} hidden={{ ...h, action: "reject" }} trigger="Tolak" triggerVariant="danger-outline" title="Tolak pengajuan" confirmLabel="Tolak" confirmVariant="danger" noteLabel="Alasan penolakan" noteRequired />
          </>}
          {e.status === "published" && <>
            <ButtonLink href={`/events/${e.slug}`} target="_blank" variant="outline" size="sm">Halaman publik</ButtonLink>
            <a href={`/api/events/${e.id}/export`} className={buttonClass("outline", "sm")}>Ekspor CSV</a>
            <ActionDialog action={reviewEventAction} hidden={{ ...h, action: "complete" }} trigger="Tandai selesai" triggerVariant="outline" title="Tandai selesai?" confirmLabel="Simpan" />
            <ActionDialog action={reviewEventAction} hidden={{ ...h, action: "cancel" }} trigger="Batalkan event" triggerVariant="danger-outline" title="Batalkan event?" description="Seluruh pendaftar aktif akan menerima notifikasi." confirmLabel="Batalkan event" confirmVariant="danger" noteLabel="Alasan pembatalan" noteRequired />
          </>}
        </>}
      />
      {org && org.verification_status !== "verified" && e.status === "pending_review" && (
        <div className="mb-6"><Notice tone="warning">Profil penyelenggara belum diverifikasi. <Link href={`/admin/penyelenggara/${org.id}`} className="font-semibold underline">Verifikasi dulu</Link> sebelum mempublikasikan.</Notice></div>
      )}
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <div className="relative mb-5 aspect-[16/9] overflow-hidden rounded-xl"><Image src={eventCover(e.cover_path, e.slug)} alt={e.title} fill sizes="50vw" className="object-cover" /></div>
          <DefinitionList items={[
            { label: "Ringkasan", value: e.summary },
            { label: "Deskripsi", value: <span className="whitespace-pre-line font-normal">{e.description}</span> },
            { label: "Kategori", value: e.category },
            { label: "Pelaksanaan", value: `${formatDateTime(e.starts_at)} — ${formatDateTime(e.ends_at)}` },
            { label: "Pendaftaran", value: `${formatDateTime(e.registration_opens_at)} — ${formatDateTime(e.registration_closes_at)}` },
            { label: "Lokasi", value: `${e.venue_name}, ${e.address}${e.district ? `, ${e.district}` : ""}` },
            { label: "Kapasitas", value: `${e.stand_capacity} stand` },
            { label: "Biaya stand", value: formatRupiah(e.stand_fee) },
            { label: "Kriteria", value: asStringArray(e.criteria).join(" · ") },
            { label: "Kontak publik", value: [e.contact_name, formatPhone(e.contact_phone)].filter(Boolean).join(" · ") },
            { label: "Proposal", value: <PrivateDocLink supabase={supabase} bucket={BUCKETS.proposals} path={e.proposal_path} label="Buka proposal" /> },
            { label: "Catatan review", value: e.review_note },
          ]} />
        </Card>
        <div className="space-y-6">
          {org && (
            <Card>
              <p className="text-[13px] font-medium text-primary">Penyelenggara</p>
              <Link href={`/admin/penyelenggara/${org.id}`} className="mt-1 block font-semibold text-xl hover:text-emerald">{org.organization_name}</Link>
              <p className="text-sm text-muted">{ORGANIZATION_TYPES[org.organization_type]} · {formatPhone(org.contact_phone)}</p>
              <div className="mt-2"><StatusBadge map={VERIFICATION_STATUS} status={org.verification_status} /></div>
            </Card>
          )}
          <Card>
            <p className="text-[13px] font-medium text-primary">Peserta</p>
            <DefinitionList items={[
              { label: "Menunggu verifikasi", value: (c.submitted ?? 0) + (c.under_verification ?? 0) },
              { label: "Terverifikasi", value: c.verified ?? 0 },
              { label: "Dipilih", value: c.selected_by_organizer ?? 0 },
              { label: "Dikonfirmasi", value: `${c.confirmed ?? 0} / ${e.stand_capacity}` },
            ]} />
            <Link href={`/admin/pendaftaran?event=${e.id}`} className="mt-3 inline-block text-sm font-semibold text-emerald hover:underline">Lihat pendaftaran event →</Link>
          </Card>
          <Card>
            <p className="text-[13px] font-medium text-primary mb-3">Riwayat review</p>
            {logs?.length ? (
              <ul className="space-y-3 text-sm">
                {logs.map((l) => <li key={l.id}><span className="font-semibold">{l.action}</span>{l.note && <span className="text-muted"> — {l.note}</span>}<p className="text-xs text-muted">{formatDateTime(l.created_at)}</p></li>)}
              </ul>
            ) : <p className="text-sm text-muted">Belum ada riwayat.</p>}
          </Card>
        </div>
      </div>
    </>
  );
}
