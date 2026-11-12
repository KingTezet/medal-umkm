"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, MailCheck } from "lucide-react";
import { forgotPasswordAction, loginAction, registerOrganizerAction, registerUmkmAction, updatePasswordAction } from "@/app/actions/auth";
import { Checkbox, Field, FormMessage, Input, Select, SubmitButton, Textarea, useFormAction } from "@/components/ui/form";
import { Notice } from "@/components/ui/misc";
import { ORGANIZATION_TYPES, SUMEDANG_DISTRICTS } from "@/lib/constants";

function PasswordInput(props: React.ComponentProps<"input">) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input type={show ? "text" : "password"} {...props} className="pr-12" />
      <button type="button" onClick={() => setShow((v) => !v)} className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-muted hover:bg-sage" aria-label={show ? "Sembunyikan password" : "Tampilkan password"}>
        {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}

export function LoginForm({ next }: { next?: string }) {
  const { state, pending, onSubmit } = useFormAction(loginAction);
  const fe = state.fieldErrors ?? {};
  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <input type="hidden" name="next" value={next ?? ""} />
      <Field label="Email" name="email" errors={fe.email} required>
        {(p) => <Input {...p} name="email" type="email" autoComplete="email" required placeholder="nama@email.com" />}
      </Field>
      <Field label="Password" name="password" errors={fe.password} required>
        {(p) => <PasswordInput {...p} name="password" autoComplete="current-password" required />}
      </Field>
      <div className="flex justify-end">
        <Link href="/lupa-password" className="text-sm font-semibold text-emerald hover:underline">Lupa password?</Link>
      </div>
      <FormMessage state={state} />
      <SubmitButton pending={pending} size="lg" className="w-full" pendingText="Masuk…">Masuk</SubmitButton>
      <p className="text-center text-sm text-muted">
        Belum punya akun? <Link href="/daftar" className="font-semibold text-emerald hover:underline">Daftar di sini</Link>
      </p>
    </form>
  );
}

function SuccessPanel({ message }: { message: string }) {
  return (
    <div className="rounded-3xl border border-emerald/20 bg-mint/40 p-8 text-center">
      <MailCheck className="mx-auto size-12 text-emerald" aria-hidden />
      <p className="mt-4 font-display text-2xl">Hampir selesai!</p>
      <p className="mt-2 text-sm text-forest">{message}</p>
      <Link href="/login" className="mt-6 inline-block font-semibold text-emerald hover:underline">Ke halaman masuk</Link>
    </div>
  );
}

function AccountFields({ fe }: { fe: Record<string, string[] | undefined> }) {
  return (
    <fieldset className="space-y-4">
      <legend className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-gold-deep">Data akun</legend>
      <Field label="Nama lengkap penanggung jawab" name="full_name" errors={fe.full_name} required>
        {(p) => <Input {...p} name="full_name" autoComplete="name" required />}
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Email" name="email" errors={fe.email} required>
          {(p) => <Input {...p} name="email" type="email" autoComplete="email" required />}
        </Field>
        <Field label="Nomor WhatsApp" name="phone" errors={fe.phone} required>
          {(p) => <Input {...p} name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="0812xxxxxxxx" required />}
        </Field>
      </div>
      <Field label="Password" name="password" errors={fe.password} hint="Minimal 8 karakter, kombinasi huruf dan angka." required>
        {(p) => <PasswordInput {...p} name="password" autoComplete="new-password" required minLength={8} />}
      </Field>
    </fieldset>
  );
}

export function RegisterUmkmForm({ categories, next }: { categories: { id: string; name: string }[]; next?: string }) {
  const { state, pending, onSubmit } = useFormAction(registerUmkmAction);
  const fe = state.fieldErrors ?? {};
  if (state.ok && state.message) return <SuccessPanel message={state.message} />;
  return (
    <form onSubmit={onSubmit} className="space-y-8" noValidate>
      <input type="hidden" name="next" value={next ?? ""} />
      <AccountFields fe={fe} />
      <fieldset className="space-y-4">
        <legend className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-gold-deep">Data usaha</legend>
        <Field label="Nama usaha" name="business_name" errors={fe.business_name} required>
          {(p) => <Input {...p} name="business_name" required />}
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Kategori usaha" name="category" errors={fe.category} required>
            {(p) => (
              <Select {...p} name="category" defaultValue="" required>
                <option value="" disabled>Pilih kategori</option>
                {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
              </Select>
            )}
          </Field>
          <Field label="Kecamatan" name="district" errors={fe.district} required>
            {(p) => (
              <Select {...p} name="district" defaultValue="" required>
                <option value="" disabled>Pilih kecamatan</option>
                {SUMEDANG_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </Select>
            )}
          </Field>
        </div>
        <Field label="Alamat usaha" name="address" errors={fe.address} required>
          {(p) => <Input {...p} name="address" required placeholder="Jalan, RT/RW, desa/kelurahan" />}
        </Field>
        <Field label="Deskripsi singkat (opsional)" name="description" errors={fe.description}>
          {(p) => <Textarea {...p} name="description" maxLength={2000} placeholder="Ceritakan produk unggulan Anda…" />}
        </Field>
        <Notice tone="info">NIB atau surat keterangan usaha dapat diunggah setelah akun dibuat, melalui menu Profil Usaha.</Notice>
      </fieldset>
      <Checkbox name="agree" label={<>Saya menyetujui <Link href="/syarat-ketentuan" target="_blank" className="font-semibold text-emerald underline">Syarat &amp; Ketentuan</Link> dan <Link href="/kebijakan-privasi" target="_blank" className="font-semibold text-emerald underline">Kebijakan Privasi</Link> MEDAL.</>} />
      {fe.agree && <p className="-mt-6 text-[13px] text-danger">{fe.agree[0]}</p>}
      <FormMessage state={state} />
      <SubmitButton pending={pending} size="lg" className="w-full" pendingText="Membuat akun…">Buat akun UMKM</SubmitButton>
    </form>
  );
}

export function RegisterOrganizerForm() {
  const { state, pending, onSubmit } = useFormAction(registerOrganizerAction);
  const fe = state.fieldErrors ?? {};
  if (state.ok && state.message) return <SuccessPanel message={state.message} />;
  return (
    <form onSubmit={onSubmit} className="space-y-8" noValidate>
      <AccountFields fe={fe} />
      <fieldset className="space-y-4">
        <legend className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-gold-deep">Data organisasi</legend>
        <Field label="Nama organisasi" name="organization_name" errors={fe.organization_name} required>
          {(p) => <Input {...p} name="organization_name" required />}
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Jenis organisasi" name="organization_type" errors={fe.organization_type} required>
            {(p) => (
              <Select {...p} name="organization_type" defaultValue="" required>
                <option value="" disabled>Pilih jenis</option>
                {Object.entries(ORGANIZATION_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </Select>
            )}
          </Field>
          <Field label="Kecamatan (opsional)" name="district" errors={fe.district}>
            {(p) => (
              <Select {...p} name="district" defaultValue="">
                <option value="">Di luar/tidak spesifik</option>
                {SUMEDANG_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </Select>
            )}
          </Field>
        </div>
        <Field label="Alamat organisasi" name="address" errors={fe.address} required>
          {(p) => <Input {...p} name="address" required />}
        </Field>
        <Field label="Deskripsi (opsional)" name="description" errors={fe.description}>
          {(p) => <Textarea {...p} name="description" maxLength={2000} />}
        </Field>
        <Notice tone="info">Dokumen legal organisasi diunggah di menu Profil Organisasi. Pengajuan event dapat dikirim setelah profil diverifikasi Disperindag.</Notice>
      </fieldset>
      <Checkbox name="agree" label={<>Saya menyetujui <Link href="/syarat-ketentuan" target="_blank" className="font-semibold text-emerald underline">Syarat &amp; Ketentuan</Link> dan <Link href="/kebijakan-privasi" target="_blank" className="font-semibold text-emerald underline">Kebijakan Privasi</Link> MEDAL.</>} />
      {fe.agree && <p className="-mt-6 text-[13px] text-danger">{fe.agree[0]}</p>}
      <FormMessage state={state} />
      <SubmitButton pending={pending} size="lg" className="w-full" pendingText="Membuat akun…">Buat akun penyelenggara</SubmitButton>
    </form>
  );
}

export function ForgotPasswordForm() {
  const { state, pending, onSubmit } = useFormAction(forgotPasswordAction);
  if (state.ok && state.message) return <Notice tone="success" title="Permintaan terkirim">{state.message}</Notice>;
  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <Field label="Email akun" name="email" errors={state.fieldErrors?.email} required>
        {(p) => <Input {...p} name="email" type="email" autoComplete="email" required />}
      </Field>
      <FormMessage state={state} />
      <SubmitButton pending={pending} size="lg" className="w-full">Kirim tautan reset</SubmitButton>
      <p className="text-center text-sm"><Link href="/login" className="font-semibold text-emerald hover:underline">Kembali ke halaman masuk</Link></p>
    </form>
  );
}

export function ResetPasswordForm() {
  const { state, pending, onSubmit } = useFormAction(updatePasswordAction);
  if (state.ok) return <Notice tone="success" title="Berhasil">Password diperbarui. <Link href="/login" className="font-semibold underline">Masuk sekarang</Link></Notice>;
  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <Field label="Password baru" name="password" errors={state.fieldErrors?.password} required>
        {(p) => <PasswordInput {...p} name="password" autoComplete="new-password" required />}
      </Field>
      <Field label="Ulangi password" name="confirm" errors={state.fieldErrors?.confirm} required>
        {(p) => <PasswordInput {...p} name="confirm" autoComplete="new-password" required />}
      </Field>
      <FormMessage state={state} />
      <SubmitButton pending={pending} size="lg" className="w-full">Simpan password</SubmitButton>
    </form>
  );
}
