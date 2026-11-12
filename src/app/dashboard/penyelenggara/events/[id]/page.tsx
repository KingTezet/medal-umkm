import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { getCategories } from "@/lib/queries";
import { BUCKETS, EVENT_STATUS } from "@/lib/constants";
import { formatRupiah } from "@/lib/constants";
import { formatDateTime } from "@/lib/format";
import { organizerCanEditEvent } from "@/lib/domain";
import { asStringArray, eventCover } from "@/lib/storage";
import { Breadcrumb, Card, DefinitionList, Notice, PageHeader, StatusBadge } from "@/components/ui/misc";
import { ButtonLink } from "@/components/ui/button";
import { EventForm } from "@/components/forms/organizer-forms";
import { PrivateDocLink } from "@/components/dashboard/shared";
import { ActionDialog } from "@/components/action-form";
import { deleteDraftEventAction, submitEventAction } from "@/app/actions/organizer";

export const metadata: Metadata = { title: "Kelola Event" };

export default async function Page({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | undefined>> }) {
  const { id } = await params;
  const sp = await searchParams;
  const { supabase, user } = await requireRole("organizer");
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  // RLS limits to own events.
  const { data: e } = await supabase.from("events").select("*").eq("id", id).maybeSingle();
  if (!e) notFound();
  const [{ data: org }, categories, { data: counts }] = await Promise.all([
    supabase.from("organizer_profiles").select("verification_status").eq("user_id", user.id).maybeSingle(),
    getCategories("event"),
    supabase.rpc("get_event_application_counts", { p_event_id: id }),
  ]);
  const editable = organizerCanEditEvent(e.status);
  const c = Object.fromEntries((counts ?? []).map((x) => [x.status, Number(x.total)]));
  const verified = org?.verification_status === "verified";

  return (
    <>
      <Breadcrumb items={[{ label: "Event saya", href: "/dashboard/penyelenggara/events" }, { label: e.title }]} />
      <PageHeader
        eyebrow="Kelola event"
        title={e.title}
        action={<>
          <StatusBadge map={EVENT_STATUS} status={e.status} />
          {e.status === "published" && <ButtonLink href={`/events/${e.slug}`} variant="outline" size="sm" target="_blank">Halaman publik</ButtonLink>}
          {["published", "completed"].includes(e.status) && <ButtonLink href={`/dashboard/penyelenggara/events/${e.id}/peserta`} size="sm">Kelola peserta</ButtonLink>}
          {editable && verified && <ActionDialog action={submitEventAction} hidden={{ event_id: e.id }} trigger="Ajukan ke Disperindag" title="Ajukan event?" description="Pastikan data dan proposal sudah benar. Event tidak dapat diubah selama ditinjau." confirmLabel="Ajukan" />}
          {e.status === "draft" && <ActionDialog action={deleteDraftEventAction} hidden={{ event_id: e.id }} trigger="Hapus draft" triggerVariant="danger-outline" title="Hapus draft?" description="Draft yang dihapus tidak dapat dikembalikan." confirmLabel="Hapus" confirmVariant="danger" />}
        </>}
      />
      <div className="mb-6 space-y-3">
        {sp.saved === "draft" && <Notice tone="success">Draft tersimpan.</Notice>}
        {sp.saved === "submitted" && <Notice tone="success" title="Event diajukan">Disperindag akan meninjau pengajuan Anda. Anda akan menerima notifikasi hasilnya.</Notice>}
        {sp.error && <Notice tone="danger" title="Pengajuan belum terkirim">{sp.error}</Notice>}
        {e.status === "revision_required" && <Notice tone="warning" title="Disperindag meminta revisi">{e.review_note}</Notice>}
        {e.status === "rejected" && <Notice tone="danger" title="Pengajuan ditolak">{e.review_note}</Notice>}
        {e.status === "cancelled" && <Notice tone="danger" title="Event dibatalkan">{e.review_note}</Notice>}
        {e.status === "pending_review" && <Notice tone="info">Event sedang ditinjau Disperindag dan tidak dapat diubah.</Notice>}
        {editable && !verified && <Notice tone="warning">Profil organisasi belum diverifikasi. Anda dapat menyimpan draft, tetapi belum dapat mengajukan.</Notice>}
      </div>

      {editable ? (
        <EventForm event={e} categories={categories} userId={user.id} canSubmit={verified} />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Card>
            <div className="relative mb-5 aspect-[16/9] overflow-hidden rounded-xl">
              <Image src={eventCover(e.cover_path, e.slug)} alt={e.title} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
            </div>
            <DefinitionList items={[
              { label: "Ringkasan", value: e.summary },
              { label: "Kategori", value: e.category },
              { label: "Pelaksanaan", value: `${formatDateTime(e.starts_at)} — ${formatDateTime(e.ends_at)}` },
              { label: "Pendaftaran", value: `${formatDateTime(e.registration_opens_at)} — ${formatDateTime(e.registration_closes_at)}` },
              { label: "Lokasi", value: `${e.venue_name}, ${e.address}${e.district ? `, ${e.district}` : ""}` },
              { label: "Kriteria", value: asStringArray(e.criteria).join(" · ") },
              { label: "Proposal", value: <PrivateDocLink supabase={supabase} bucket={BUCKETS.proposals} path={e.proposal_path} label="Buka proposal" /> },
            ]} />
          </Card>
          <Card className="h-fit">
            <h2 className="display text-[20px] font-semibold leading-tight text-brand-950">Kuota & peserta</h2>
            <DefinitionList items={[
              { label: "Kapasitas", value: e.stand_capacity },
              { label: "Biaya stand", value: formatRupiah(e.stand_fee) },
              { label: "Dikonfirmasi", value: c.confirmed ?? 0 },
              { label: "Dipilih (menunggu sah)", value: c.selected_by_organizer ?? 0 },
              { label: "Siap diseleksi", value: c.verified ?? 0 },
              { label: "Menunggu verifikasi", value: (c.submitted ?? 0) + (c.under_verification ?? 0) },
              { label: "Daftar tunggu", value: c.waitlisted ?? 0 },
            ]} />
          </Card>
        </div>
      )}
    </>
  );
}
