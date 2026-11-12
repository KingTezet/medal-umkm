"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { submitPaymentProofAction } from "@/app/actions/umkm";
import { FormMessage, SubmitButton, useFormAction } from "@/components/ui/form";
import { UploadField } from "@/components/upload-field";
import { BUCKETS } from "@/lib/constants";

export function CopyButton({ value, label }: { value: string; label: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(value).then(() => {
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        });
      }}
      className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-brand-800 ring-1 ring-brand-300/60 hover:bg-brand-50"
      aria-label={`Salin ${label}`}
    >
      {done ? <Check className="size-3.5" /> : <Copy className="size-3.5" />} {done ? "Tersalin" : "Salin"}
    </button>
  );
}

export function PaymentProofForm({ applicationId, userId }: { applicationId: string; userId: string }) {
  const { state, pending, fe, onSubmit } = useFormAction(submitPaymentProofAction);
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <input type="hidden" name="application_id" value={applicationId} />
      <UploadField name="payment_proof_path" label="Bukti transfer" bucket={BUCKETS.paymentProofs} userId={userId} folder={`payments/${applicationId}`} rule="proof" variant="file" required error={fe.payment_proof_path} />
      <FormMessage state={state} />
      <SubmitButton pending={pending} pendingText="Mengirim…">Kirim bukti transfer</SubmitButton>
    </form>
  );
}
