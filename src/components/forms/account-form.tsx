"use client";

import Link from "next/link";
import { updateAccountAction } from "@/app/actions/account";
import { Field, FormMessage, Input, SubmitButton, useFormAction } from "@/components/ui/form";
import { Card } from "@/components/ui/misc";

export function AccountForm({ fullName, phone, email, roleLabel }: { fullName: string; phone: string | null; email: string; roleLabel: string }) {
  const { state, pending, fe, onSubmit } = useFormAction(updateAccountAction);
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <Card>
        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          <Field label="Nama lengkap" name="full_name" errors={fe.full_name} required>
            {(p) => <Input {...p} name="full_name" defaultValue={fullName} required />}
          </Field>
          <Field label="Nomor WhatsApp" name="phone" errors={fe.phone} required>
            {(p) => <Input {...p} name="phone" type="tel" defaultValue={phone ?? ""} required />}
          </Field>
          <Field label="Email login" name="email" hint="Email tidak dapat diubah dari sini. Hubungi admin bila perlu.">
            {(p) => <Input {...p} name="email_display" value={email} disabled readOnly />}
          </Field>
          <FormMessage state={state} />
          <SubmitButton pending={pending}>Simpan perubahan</SubmitButton>
        </form>
      </Card>
      <Card className="h-fit space-y-3">
        <p className="text-[13px] font-medium text-primary">Keamanan akun</p>
        <p className="text-sm text-muted">Peran akun: <strong className="text-ink">{roleLabel}</strong>. Peran tidak dapat diubah oleh pengguna.</p>
        <Link href="/lupa-password" className="inline-block text-sm font-semibold text-emerald hover:underline">Ganti password melalui email →</Link>
      </Card>
    </div>
  );
}
