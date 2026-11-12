import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { APPLICATION_STATUS, BUCKETS } from "@/lib/constants";
import { formatDateRange, formatDateTime } from "@/lib/format";
import { Breadcrumb, Card, DefinitionList, Notice, PageHeader, StatusBadge } from "@/components/ui/misc";
import { ApplicationTimeline, HistoryList, PrivateDocLink } from "@/components/dashboard/shared";
import { ApplicationForm } from "@/components/forms/application-form";
import { ActionDialog } from "@/components/action-form";
import { withdrawApplicationAction } from "@/app/actions/umkm";

export const metadata: Metadata = { title: "Detail Pendaftaran" };

export default async function ApplicationDetailPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | undefined>> }) {
  const { id } = await params;
  const sp = await searchParams;
  const { supabase, user } = await requireRole("umkm");
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  // RLS: only returns the row if the caller owns it.
  const { data: a } = await supabase
    .from("stand_applications")
    .select("*, events(title, slug, starts_at, ends_at, venue_name, address)")
    .eq("id", id)
    .eq("submitted_by", user.id)
    .maybeSingle();
  if (!a) notFound();
  const { data: history } = await supabase.from("application_status_history").select("*").eq("application_id", id).order("created_at");
  const canWithdraw = ["submitted", "under_verification", "revision_required", "verified", "waitlisted", "selected_by_organizer"].includes(a.status);

  return (
    <>
      <Breadcrumb items={[{ label: "Pendaftaran saya", href: "/dashboard/umkm/pendaftaran" }, { label: a.application_code }]} />
      <PageHeader
        eyebrow={a.application_code}
        title={a.events?.title ?? "Pendaftaran"}
        description={a.events ? `${formatDateRange(a.events.starts_at, a.events.ends_at)} · ${a.events.venue_name}` : undefined}
        action={<>
          <StatusBadge map={APPLICATION_STATUS} status={a.status} />
          {canWithdraw && (
            <ActionDialog action={withdrawApplicationAction} hidden={{ application_id: a.id }} trigger="Batalkan" triggerVariant="danger-outline" title="Batalkan pendaftaran?" description="Pendaftaran yang dibatalkan dapat diajukan kembali selama periode pendaftaran masih dibuka." confirmLabel="Ya, batalkan" confirmVariant="danger" />
          )}
        </>}
      />
      {sp.submitted && <div className="mb-6"><Notice tone="success" title="Pendaftaran terkirim!">Nomor registrasi Anda <strong>{a.application_code}</strong>. Kami akan memberi notifikasi setiap ada perubahan status.</Notice></div>}

      {a.status === "confirmed" && a.stand_number && (
        <div className="mb-6 flex flex-col gap-4 rounded-xl border border-primary-border bg-primary-soft p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
          <p className="text-[13px] font-medium text-primary">Hasil akhir · Disahkan Disperindag</p>
          <p className="mt-1 text-sm text-primary-hover">Dikonfirmasi {formatDateTime(a.confirmed_at)}. Simpan nomor ini untuk hari pelaksanaan.</p>
          </div>
          <p className="shrink-0 rounded-lg bg-primary px-4 py-2.5 text-center text-[22px] font-semibold tabular-nums text-white">Stand {a.stand_number}</p>
        </div>
      )}

      <Card className="mb-6">
        <h2 className="mb-6 font-semibold text-lg">Progres pendaftaran</h2>
        <ApplicationTimeline status={a.status} history={history ?? []} />
      </Card>

      {a.status === "revision_required" && (
        <div className="mb-6 space-y-4">
          <Notice tone="warning" title="Disperindag meminta revisi">{a.admin_note}</Notice>
          <ApplicationForm mode="revise" applicationId={a.id} userId={user.id} defaults={{ products_offered: a.products_offered, application_note: a.application_note, additional_document_path: a.additional_document_path }} />
        </div>
      )}
      {a.status === "rejected" && <div className="mb-6"><Notice tone="danger" title="Pendaftaran tidak lolos">{a.organizer_note ?? a.admin_note ?? "Tidak ada catatan."}</Notice></div>}

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Card>
          <h2 className="font-semibold text-lg">Data pendaftaran</h2>
          <DefinitionList items={[
            { label: "Produk yang dijual", value: a.products_offered },
            { label: "Catatan pemohon", value: a.application_note },
            { label: "Dokumen tambahan", value: <PrivateDocLink supabase={supabase} bucket={BUCKETS.applicationDocs} path={a.additional_document_path} label="Buka dokumen" /> },
            { label: "Catatan Disperindag", value: a.admin_note },
            { label: "Catatan penyelenggara", value: a.organizer_note },
            { label: "Dikirim", value: formatDateTime(a.submitted_at) },
          ]} />
          {a.events?.slug && <Link href={`/events/${a.events.slug}`} className="mt-4 inline-block text-sm font-semibold text-emerald hover:underline">Lihat halaman event →</Link>}
        </Card>
        <Card>
          <h2 className="mb-4 font-semibold text-lg">Riwayat status</h2>
          <HistoryList items={history ?? []} />
        </Card>
      </div>
    </>
  );
}
