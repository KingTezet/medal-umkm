import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Download } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { APPLICATION_STATUS, type ApplicationStatus } from "@/lib/constants";
import { formatPhone, formatShortDate } from "@/lib/format";
import { organizerCanDecide } from "@/lib/domain";
import { Breadcrumb, Card, EmptyState, Notice, PageHeader, StatusBadge } from "@/components/ui/misc";
import { buttonClass } from "@/components/ui/button";
import { ActionDialog } from "@/components/action-form";
import { decideApplicationAction, verifyPaymentAction } from "@/app/actions/organizer";
import { PrivateDocLink } from "@/components/dashboard/shared";
import { BUCKETS, PAYMENT_STATUS, formatRupiah } from "@/lib/constants";
import { StatusTabs } from "@/components/status-tabs";

export const metadata: Metadata = { title: "Kelola Peserta" };

const TABS: { key: string; label: string; statuses: ApplicationStatus[] }[] = [
  { key: "ready", label: "Siap diseleksi", statuses: ["verified"] },
  { key: "selected", label: "Diterima", statuses: ["selected_by_organizer"] },
  { key: "waitlist", label: "Daftar tunggu", statuses: ["waitlisted"] },
  { key: "final", label: "Final", statuses: ["confirmed"] },
  { key: "rejected", label: "Ditolak", statuses: ["rejected"] },
];

interface Snapshot { business_name?: string; category?: string; owner_name?: string; whatsapp?: string; district?: string; description?: string; slug?: string }

export default async function Page({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | undefined>> }) {
  const { id } = await params;
  const sp = await searchParams;
  const { supabase } = await requireRole("organizer");
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const { data: e } = await supabase.from("events").select("id, title, status, stand_capacity, stand_fee").eq("id", id).maybeSingle();
  if (!e) notFound();
  const [{ data: apps }, { data: counts }] = await Promise.all([
    supabase.from("stand_applications").select("id, application_code, status, payment_status, payment_amount, payment_proof_path, payment_note, business_snapshot, products_offered, application_note, organizer_note, stand_number, verified_at").eq("event_id", id).order("verified_at"),
    supabase.rpc("get_event_application_counts", { p_event_id: id }),
  ]);
  const c = Object.fromEntries((counts ?? []).map((x) => [x.status, Number(x.total)]));
  const pendingVerification = (c.submitted ?? 0) + (c.under_verification ?? 0) + (c.revision_required ?? 0);
  const tab = TABS.find((t) => t.key === (sp.status ?? sp.tab)) ?? TABS[0];
  const list = (apps ?? []).filter((a) => tab.statuses.includes(a.status));
  const confirmed = c.confirmed ?? 0;
  const selected = c.selected_by_organizer ?? 0;

  return (
    <>
      <Breadcrumb items={[{ label: "Event saya", href: "/dashboard/penyelenggara/events" }, { label: e.title, href: `/dashboard/penyelenggara/events/${e.id}` }, { label: "Peserta" }]} />
      <PageHeader eyebrow="Kelola peserta" title={e.title} action={<a href={`/api/events/${e.id}/export`} className={buttonClass("outline", "sm")}><Download className="size-4" /> Ekspor CSV</a>} />
      <div className="mb-6 grid gap-3 sm:grid-cols-4">
        {[{ l: "Kapasitas", v: e.stand_capacity }, { l: "Dikonfirmasi", v: confirmed }, { l: "Dipilih", v: selected }, { l: "Biaya stand", v: formatRupiah(e.stand_fee) }].map((x) => (
          <Card key={x.l} className="p-4 sm:p-4"><p className="text-xs text-muted">{x.l}</p><p className="font-semibold text-[22px]">{x.v}</p></Card>
        ))}
      </div>
      {selected + confirmed > e.stand_capacity && <div className="mb-4"><Notice tone="warning">Jumlah dipilih + dikonfirmasi melebihi kapasitas. Disperindag hanya akan mengesahkan sesuai kuota.</Notice></div>}
      <Notice tone="info">Anda hanya dapat menyeleksi pendaftar yang berkasnya sudah diverifikasi Disperindag. Nomor stand final ditetapkan oleh Disperindag.</Notice>

      <div className="mt-6"><StatusTabs basePath="" active={tab.key} tabs={TABS.map((t) => ({ key: t.key, label: t.label, count: t.statuses.reduce((n, st) => n + (c[st] ?? 0), 0) }))} /></div>

      {list.length ? (
        <ul className="grid gap-4">
          {list.map((a) => {
            const s = (a.business_snapshot ?? {}) as Snapshot;
            const canDecide = organizerCanDecide(a.status) && e.status === "published";
            return (
              <li key={a.id}>
                <Card className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-xl">{s.business_name}</p>
                      <StatusBadge map={APPLICATION_STATUS} status={a.status} />
                      {a.stand_number && <span className="rounded-lg bg-forest px-2 py-0.5 text-sm font-semibold text-white">Stand {a.stand_number}</span>}
                    </div>
                    <p className="text-sm text-muted">{s.category} · {s.district} · {s.owner_name} · WA {formatPhone(s.whatsapp)}</p>
                    <p className="text-sm"><span className="font-semibold">Produk:</span> {a.products_offered}</p>
                    {a.application_note && <p className="text-sm text-muted">Catatan: {a.application_note}</p>}
                    {a.organizer_note && <p className="text-sm text-muted">Keputusan Anda: “{a.organizer_note}”</p>}
                    {a.payment_status !== "not_required" && (
                      <div className="mt-2 flex flex-wrap items-center gap-2 rounded-2xl bg-brand-50/70 px-3 py-2 ring-1 ring-brand-300/40">
                        <span className="text-[13px] text-muted">Pembayaran {formatRupiah(a.payment_amount)}:</span>
                        <StatusBadge map={PAYMENT_STATUS} status={a.payment_status} />
                        {a.payment_proof_path && <PrivateDocLink supabase={supabase} bucket={BUCKETS.paymentProofs} path={a.payment_proof_path} label="Bukti transfer" />}
                        {a.payment_status === "submitted" && (
                          <span className="flex gap-2">
                            <ActionDialog action={verifyPaymentAction} hidden={{ application_id: a.id, action: "verify" }} trigger="Verifikasi pembayaran" title="Pembayaran sudah masuk?" description="Pastikan dana sudah diterima di rekening Anda sesuai jumlah." confirmLabel="Ya, lunas" />
                            <ActionDialog action={verifyPaymentAction} hidden={{ application_id: a.id, action: "reject" }} trigger="Tolak bukti" triggerVariant="danger-outline" title="Tolak bukti transfer" confirmLabel="Tolak" confirmVariant="danger" noteLabel="Alasan (mis. nominal kurang, bukti tidak terbaca)" noteRequired />
                          </span>
                        )}
                        {a.payment_status === "rejected" && a.payment_note && <span className="text-xs text-muted">Alasan: {a.payment_note}</span>}
                      </div>
                    )}
                    <p className="text-xs text-muted">{a.application_code} · terverifikasi {formatShortDate(a.verified_at)}</p>
                  </div>
                  {canDecide && (
                    <div className="flex flex-wrap gap-2">
                      {a.status !== "selected_by_organizer" && <ActionDialog action={decideApplicationAction} hidden={{ application_id: a.id, decision: "select" }} trigger="Terima" title="Terima peserta?" description={`${s.business_name} akan diusulkan ke Disperindag untuk pengesahan.`} confirmLabel="Terima" noteLabel="Catatan (opsional)" />}
                      {a.status !== "waitlisted" && <ActionDialog action={decideApplicationAction} hidden={{ application_id: a.id, decision: "waitlist" }} trigger="Daftar tunggu" triggerVariant="outline" title="Masukkan daftar tunggu?" confirmLabel="Simpan" noteLabel="Catatan (opsional)" />}
                      <ActionDialog action={decideApplicationAction} hidden={{ application_id: a.id, decision: "reject" }} trigger="Tolak" triggerVariant="danger-outline" title="Tolak peserta?" confirmLabel="Tolak" confirmVariant="danger" noteLabel="Alasan penolakan" noteRequired />
                    </div>
                  )}
                </Card>
              </li>
            );
          })}
        </ul>
      ) : (
        <EmptyState title="Tidak ada peserta pada tab ini" description={tab.key === "ready" ? `${pendingVerification} pendaftar sedang menunggu verifikasi Disperindag.` : undefined} />
      )}
    </>
  );
}
