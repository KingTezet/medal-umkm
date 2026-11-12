"use client";

import Link from "next/link";
import { resubmitApplicationAction, submitApplicationAction } from "@/app/actions/umkm";
import { Checkbox, Field, FormMessage, SubmitButton, Textarea, useFormAction } from "@/components/ui/form";
import { UploadField } from "@/components/upload-field";
import { Card } from "@/components/ui/misc";
import { BUCKETS } from "@/lib/constants";

export function ApplicationForm({
  mode,
  eventId,
  applicationId,
  userId,
  defaults,
}: {
  mode: "new" | "revise";
  eventId?: string;
  applicationId?: string;
  userId: string;
  defaults?: { products_offered?: string; application_note?: string | null; additional_document_path?: string | null };
}) {
  const { state, pending, fe, onSubmit } = useFormAction(mode === "new" ? submitApplicationAction : resubmitApplicationAction);
  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      {eventId && <input type="hidden" name="event_id" value={eventId} />}
      {applicationId && <input type="hidden" name="application_id" value={applicationId} />}
      <Card className="space-y-5">
        <Field label="Produk yang akan dijual" name="products_offered" errors={fe.products_offered} hint="Sebutkan produk utama, varian, dan kisaran harga jika perlu." required>
          {(p) => <Textarea {...p} name="products_offered" defaultValue={defaults?.products_offered} required minLength={3} maxLength={1000} rows={4} />}
        </Field>
        <Field label="Kebutuhan khusus / catatan (opsional)" name="application_note" errors={fe.application_note} hint="Contoh: butuh listrik, ukuran tenda, dll.">
          {(p) => <Textarea {...p} name="application_note" defaultValue={defaults?.application_note ?? ""} maxLength={1000} rows={3} />}
        </Field>
        <UploadField name="additional_document_path" label="Dokumen tambahan (opsional)" bucket={BUCKETS.applicationDocs} userId={userId} folder="applications" rule="pdfSmall" defaultPath={defaults?.additional_document_path} hint="PDF · maks 5 MB — misal sertifikat halal/PIRT bila diminta event." />
      </Card>
      <Card className="space-y-4">
        <Checkbox name="truth" label="Saya menyatakan bahwa data usaha dan dokumen yang saya kirim adalah benar dan dapat dipertanggungjawabkan." />
        {fe.truth && <p className="text-[13px] text-danger">{fe.truth[0]}</p>}
        <Checkbox name="agree" label={<>Saya menyetujui <Link href="/syarat-ketentuan" target="_blank" className="font-semibold text-emerald underline">ketentuan seleksi</Link>, termasuk bahwa nomor stand final ditetapkan oleh Disperindag.</>} />
        {fe.agree && <p className="text-[13px] text-danger">{fe.agree[0]}</p>}
      </Card>
      <FormMessage state={state} />
      <SubmitButton pending={pending} size="lg" className="w-full sm:w-auto" pendingText="Mengirim…">
        {mode === "new" ? "Kirim pendaftaran stand" : "Kirim ulang revisi"}
      </SubmitButton>
    </form>
  );
}
