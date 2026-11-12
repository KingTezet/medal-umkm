import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { APPLICATION_STATUS, BUCKETS, VERIFICATION_STATUS } from "@/lib/constants";
import { formatDateTime, formatPhone } from "@/lib/format";
import { asProducts } from "@/lib/storage";
import { Breadcrumb, Card, DefinitionList, Notice, PageHeader, StatusBadge } from "@/components/ui/misc";
import { ActionDialog } from "@/components/action-form";
import { ApplicationTimeline, HistoryList, PrivateDocLink } from "@/components/dashboard/shared";
import { finalizeApplicationAction, verifyApplicationAction } from "@/app/actions/admin";
import { Input } from "@/components/ui/form";

export const metadata = { title: "Review Pendaftaran" };

type Snap = { business_name?: string; category?: string; owner_name?: string; whatsapp?: string; address?: string; village?: string; district?: string; description?: string; products?: unknown; has_nib?: boolean; has_license?: boolean };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase } = await requireRole("admin");
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const { data: a } = await supabase.from("stand_applications").select("*, events(id, title, stand_capacity, status), business_profiles(id, nib, business_license_path, verification_status)").eq("id", id).maybeSingle();
  if (!a) notFound();
  const [{ data: history }, { data: used }] = await Promise.all([
    supabase.from("application_status_history").select("*").eq("application_id", id).order("created_at"),
    supabase.from("stand_applications").select("stand_number").eq("event_id", a.event_id).eq("status", "confirmed").not("stand_number", "is", null),
  ]);
  const s = (a.business_snapshot ?? {}) as Snap;
  const bp = a.business_profiles;
  const confirmedCount = used?.length ?? 0;
  const cap = a.events?.stand_capacity ?? 0;
  const h = { application_id: a.id };
  const canVerify = a.status === "submitted" || a.status === "under_verification";
  const canFinalize = a.status === "selected_by_organizer" || a.status === "waitlisted";

  return (
    <>
      <Breadcrumb items={[{ label: "Pendaftaran", href: "/admin/pendaftaran" }, { label: a.application_code }]} />
      <PageHeader
        eyebrow={a.application_code}
        title={s.business_name ?? "Pendaftaran"}
        description={<>Event: <Link className="font-semibold text-emerald hover:underline" href={`/admin/events/${a.events?.id}`}>{a.events?.title}</Link></>}
        action={<>
          <StatusBadge map={APPLICATION_STATUS} status={a.status} />
          {canVerify && <>
            <ActionDialog action={verifyApplicationAction} hidden={{ ...h, action: "verify" }} trigger="Verifikasi berkas" title="Verifikasi berkas?" description="Pendaftar akan diteruskan ke penyelenggara untuk seleksi." confirmLabel="Verifikasi" noteLabel="Catatan (opsional)" />
            <ActionDialog action={verifyApplicationAction} hidden={{ ...h, action: "revise" }} trigger="Minta revisi" triggerVariant="outline" title="Minta revisi" confirmLabel="Kirim" noteLabel="Hal yang perlu diperbaiki" noteRequired />
            <ActionDialog action={verifyApplicationAction} hidden={{ ...h, action: "reject" }} trigger="Tolak" triggerVariant="danger-outline" title="Tolak pendaftaran" confirmLabel="Tolak" confirmVariant="danger" noteLabel="Alasan penolakan" noteRequired />
          </>}
          {canFinalize && <>
            <ActionDialog
              action={finalizeApplicationAction}
              hidden={{ ...h, action: "confirm" }}
              trigger="Sahkan & tetapkan stand"
              title="Sahkan peserta"
              description={`Kapasitas terpakai ${confirmedCount}/${cap}. Nomor stand wajib unik dalam event.`}
              confirmLabel="Sahkan"
              noteLabel="Catatan (opsional)"
              extra={
                <div className="space-y-1.5">
                  <label htmlFor="stand_number" className="text-sm font-semibold">Nomor stand <span className="text-danger">*</span></label>
                  <Input id="stand_number" name="stand_number" required maxLength={16} placeholder="A-01" className="uppercase" />
                  {used?.length ? <p className="text-xs text-muted">Sudah dipakai: {used.map((u) => u.stand_number).join(", ")}</p> : null}
                </div>
              }
            />
            <ActionDialog action={finalizeApplicationAction} hidden={{ ...h, action: "reject" }} trigger="Tidak disahkan" triggerVariant="danger-outline" title="Tidak mengesahkan" confirmLabel="Simpan" confirmVariant="danger" noteLabel="Alasan" noteRequired />
          </>}
        </>}
      />
      {canFinalize && confirmedCount >= cap && <div className="mb-6"><Notice tone="danger">Kapasitas event sudah penuh ({confirmedCount}/{cap}). Konfirmasi akan ditolak sistem.</Notice></div>}
      <Card className="mb-6"><ApplicationTimeline status={a.status} history={history ?? []} /></Card>
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Card>
          <h2 className="display text-[20px] font-semibold leading-tight text-brand-950">Data usaha (snapshot saat daftar)</h2>
          <DefinitionList items={[
            { label: "Nama usaha", value: s.business_name },
            { label: "Kategori", value: s.category },
            { label: "Penanggung jawab", value: s.owner_name },
            { label: "WhatsApp", value: formatPhone(s.whatsapp) },
            { label: "Alamat", value: [s.address, s.village, s.district, "Sumedang"].filter(Boolean).join(", ") },
            { label: "Produk profil", value: asProducts(s.products).map((p) => p.name).join(", ") },
            { label: "Produk yang dijual", value: a.products_offered },
            { label: "Catatan pemohon", value: a.application_note },
          ]} />
        </Card>
        <div className="space-y-6">
          <Card>
            <h2 className="display text-[20px] font-semibold leading-tight text-brand-950">Dokumen</h2>
            <DefinitionList items={[
              { label: "NIB", value: bp?.nib ?? "-" },
              { label: "NIB / SKU", value: <PrivateDocLink supabase={supabase} bucket={BUCKETS.verificationDocs} path={bp?.business_license_path ?? null} label="Buka dokumen" /> },
              { label: "Dokumen tambahan", value: <PrivateDocLink supabase={supabase} bucket={BUCKETS.applicationDocs} path={a.additional_document_path} label="Buka dokumen" /> },
              { label: "Status profil usaha", value: bp ? <Link href={`/admin/umkm/${bp.id}`} className="inline-flex"><StatusBadge map={VERIFICATION_STATUS} status={bp.verification_status} /></Link> : "-" },
            ]} />
          </Card>
          <Card>
            <h2 className="mb-4 display text-[20px] font-semibold leading-tight text-brand-950">Riwayat</h2>
            <HistoryList items={history ?? []} />
            <p className="mt-4 text-xs text-muted">Dikirim {formatDateTime(a.submitted_at)}</p>
          </Card>
        </div>
      </div>
    </>
  );
}
