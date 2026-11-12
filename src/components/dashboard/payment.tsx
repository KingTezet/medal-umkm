import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { Landmark } from "lucide-react";
import { BUCKETS, PAYMENT_STATUS, formatRupiah, type PaymentStatus } from "@/lib/constants";
import { formatDateTime } from "@/lib/format";
import { Card, Notice, StatusBadge } from "@/components/ui/misc";
import { PrivateDocLink } from "@/components/dashboard/shared";
import { CopyButton, PaymentProofForm } from "@/components/forms/payment-form";

type SB = SupabaseClient<Database>;
interface PayApp {
  id: string;
  status: string;
  payment_status: PaymentStatus;
  payment_amount: number | null;
  payment_proof_path: string | null;
  payment_note: string | null;
  payment_submitted_at: string | null;
  payment_verified_at: string | null;
}

/** UMKM view: where to transfer, how much, and proof upload. */
export async function UmkmPaymentPanel({ supabase, app, userId }: { supabase: SB; app: PayApp; userId: string }) {
  if (app.payment_status === "not_required") return null;
  const { data } = await supabase.rpc("get_payment_instructions", { p_application_id: app.id });
  const info = data?.[0];
  const canUpload = app.status === "selected_by_organizer" && (app.payment_status === "unpaid" || app.payment_status === "rejected");
  return (
    <Card className="mb-6 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="display flex items-center gap-2 text-[20px] font-semibold text-brand-950"><Landmark className="size-5 text-brand-700" aria-hidden /> Pembayaran stand</h2>
        <StatusBadge map={PAYMENT_STATUS} status={app.payment_status} />
      </div>
      {app.payment_status === "rejected" && app.payment_note && <Notice tone="danger" title="Bukti transfer ditolak penyelenggara">{app.payment_note}</Notice>}
      {app.payment_status === "verified" && <Notice tone="success" title="Pembayaran lunas">Diverifikasi penyelenggara {formatDateTime(app.payment_verified_at)}. Menunggu pengesahan & nomor stand dari Disperindag.</Notice>}
      {info && (
        <div className="grid gap-px overflow-hidden rounded-[18px] bg-black/[0.06] ring-1 ring-black/[0.06] sm:grid-cols-2">
          <div className="bg-brand-900 p-5 text-white sm:row-span-2">
            <p className="text-[13px] text-brand-300">Jumlah yang ditransfer</p>
            <p className="display mt-1 text-[34px] font-semibold leading-none">{formatRupiah(info.amount)}</p>
            <p className="mt-2 text-xs text-white/70">Biaya stand “{info.event_title}”</p>
          </div>
          <div className="bg-white p-4">
            <p className="text-[12px] text-muted">Bank tujuan · atas nama</p>
            <p className="mt-0.5 text-sm font-semibold text-brand-950">{info.bank_name ?? "-"} · {info.bank_account_holder ?? "-"}</p>
            <p className="text-[12px] text-muted">Penyelenggara: {info.organization_name}</p>
          </div>
          <div className="flex items-center justify-between gap-3 bg-white p-4">
            <div>
              <p className="text-[12px] text-muted">Nomor rekening</p>
              <p className="font-mono text-[17px] font-semibold tracking-wide text-brand-950">{info.bank_account_number ?? "-"}</p>
            </div>
            {info.bank_account_number && <CopyButton value={info.bank_account_number} label="nomor rekening" />}
          </div>
        </div>
      )}
      {canUpload ? (
        <>
          <p className="text-sm text-muted">Transfer sesuai jumlah di atas, lalu unggah foto/screenshot bukti transfer. Penyelenggara akan memverifikasi pembayaran Anda.</p>
          <PaymentProofForm applicationId={app.id} userId={userId} />
        </>
      ) : app.payment_proof_path ? (
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <PrivateDocLink supabase={supabase} bucket={BUCKETS.paymentProofs} path={app.payment_proof_path} label="Lihat bukti transfer" />
          {app.payment_submitted_at && <span className="text-muted">Dikirim {formatDateTime(app.payment_submitted_at)}</span>}
        </div>
      ) : null}
    </Card>
  );
}
