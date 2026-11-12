"use client";

import { createCategoryAction, saveContactAction, saveContentAction } from "@/app/actions/admin";
import { Checkbox, Field, FormMessage, Input, Select, SubmitButton, Textarea, useFormAction } from "@/components/ui/form";
import { Card } from "@/components/ui/misc";
import type { PublicSettings } from "@/lib/queries";

export function ContentForm({ settings }: { settings: PublicSettings }) {
  const { state, pending, fe, onSubmit } = useFormAction(saveContentAction);
  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <Card className="space-y-5">
        <h2 className="font-semibold text-lg">Hero beranda</h2>
        <Field label="Headline" name="headline" errors={fe.headline} hint="Singkat dan jelas, maksimal 120 karakter." required>
          {(p) => <Input {...p} name="headline" defaultValue={settings.hero.headline} maxLength={120} required />}
        </Field>
        <Field label="Subheadline" name="subheadline" errors={fe.subheadline} required>
          {(p) => <Textarea {...p} name="subheadline" defaultValue={settings.hero.subheadline} maxLength={300} rows={3} required />}
        </Field>
      </Card>
      <Card className="space-y-5">
        <h2 className="font-semibold text-lg">Pengumuman singkat</h2>
        <Checkbox name="announcement_enabled" defaultChecked={settings.announcement.enabled} label="Tampilkan pengumuman di beranda" />
        <Field label="Teks pengumuman" name="announcement_text" errors={fe.text}>
          {(p) => <Input {...p} name="announcement_text" defaultValue={settings.announcement.text} maxLength={240} />}
        </Field>
      </Card>
      <FormMessage state={state} />
      <SubmitButton pending={pending}>Simpan konten</SubmitButton>
    </form>
  );
}

export function ContactForm({ contact }: { contact: PublicSettings["contact"] }) {
  const { state, pending, fe, onSubmit } = useFormAction(saveContactAction);
  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <Card className="space-y-5">
        <Field label="Nama instansi" name="agency" errors={fe.agency} required>
          {(p) => <Input {...p} name="agency" defaultValue={contact.agency} required />}
        </Field>
        <Field label="Alamat kantor" name="address" errors={fe.address} required>
          {(p) => <Input {...p} name="address" defaultValue={contact.address} required />}
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Telepon" name="phone" errors={fe.phone}>{(p) => <Input {...p} name="phone" defaultValue={contact.phone} />}</Field>
          <Field label="WhatsApp" name="whatsapp" errors={fe.whatsapp}>{(p) => <Input {...p} name="whatsapp" defaultValue={contact.whatsapp} />}</Field>
          <Field label="Email" name="email" errors={fe.email}>{(p) => <Input {...p} name="email" type="email" defaultValue={contact.email} />}</Field>
          <Field label="Instagram" name="instagram" errors={fe.instagram}>{(p) => <Input {...p} name="instagram" defaultValue={contact.instagram} />}</Field>
        </div>
      </Card>
      <FormMessage state={state} />
      <SubmitButton pending={pending}>Simpan kontak publik</SubmitButton>
    </form>
  );
}

export function CategoryForm() {
  const { state, pending, fe, onSubmit } = useFormAction(createCategoryAction);
  return (
    <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-[10rem_1fr_7rem_auto] sm:items-end" noValidate>
      <Field label="Jenis" name="kind">
        {(p) => (
          <Select {...p} name="kind" defaultValue="event">
            <option value="event">Event</option>
            <option value="umkm">UMKM</option>
          </Select>
        )}
      </Field>
      <Field label="Nama kategori" name="name" errors={fe.name} required>
        {(p) => <Input {...p} name="name" required maxLength={60} />}
      </Field>
      <Field label="Urutan" name="sort_order">
        {(p) => <Input {...p} name="sort_order" type="number" min={0} max={999} defaultValue={50} />}
      </Field>
      <SubmitButton pending={pending}>Tambah</SubmitButton>
      <div className="sm:col-span-4"><FormMessage state={state} /></div>
    </form>
  );
}
