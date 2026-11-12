"use client";

import { saveEventAction, saveOrganizerProfileAction } from "@/app/actions/organizer";
import { Checkbox, Field, FormMessage, Input, Select, SubmitButton, Textarea, useFormAction } from "@/components/ui/form";
import { GalleryField, UploadField } from "@/components/upload-field";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/misc";
import { BANKS, BUCKETS, ORGANIZATION_TYPES, SUMEDANG_DISTRICTS } from "@/lib/constants";
import { toJakartaInput } from "@/lib/format";
import type { Database } from "@/types/database";

type OP = Database["public"]["Tables"]["organizer_profiles"]["Row"];
type EV = Database["public"]["Tables"]["events"]["Row"];

export function OrganizerProfileForm({ profile, userId }: { profile: OP; userId: string }) {
  const { state, pending, fe, onSubmit } = useFormAction(saveOrganizerProfileAction);
  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <Card className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Nama organisasi" name="organization_name" errors={fe.organization_name} required>
            {(p) => <Input {...p} name="organization_name" defaultValue={profile.organization_name} required />}
          </Field>
          <Field label="Jenis organisasi" name="organization_type" errors={fe.organization_type} required>
            {(p) => (
              <Select {...p} name="organization_type" defaultValue={profile.organization_type}>
                {Object.entries(ORGANIZATION_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </Select>
            )}
          </Field>
        </div>
        <Field label="Deskripsi" name="description" errors={fe.description}>
          {(p) => <Textarea {...p} name="description" defaultValue={profile.description ?? ""} maxLength={2000} />}
        </Field>
        <Field label="Alamat" name="address" errors={fe.address} required>
          {(p) => <Input {...p} name="address" defaultValue={profile.address} required />}
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Kecamatan" name="district" errors={fe.district}>
            {(p) => (
              <Select {...p} name="district" defaultValue={profile.district ?? ""}>
                <option value="">Di luar/tidak spesifik</option>
                {SUMEDANG_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </Select>
            )}
          </Field>
          <Field label="Nomor kontak" name="contact_phone" errors={fe.contact_phone} required>
            {(p) => <Input {...p} name="contact_phone" type="tel" defaultValue={profile.contact_phone} required />}
          </Field>
        </div>
        <UploadField name="legal_document_path" label="Dokumen legal organisasi" bucket={BUCKETS.verificationDocs} userId={userId} folder="organization" rule="legal" defaultPath={profile.legal_document_path} hint="Akta/SK/surat keterangan · PDF, JPG, PNG · maks 5 MB" />
      </Card>
      <Card className="space-y-5">
        <div>
          <h2 className="display text-[20px] font-semibold text-brand-950">Rekening pembayaran stand</h2>
          <p className="mt-1 text-sm text-muted">Dipakai bila event Anda memasang biaya stand. Rekening hanya ditampilkan kepada UMKM yang sudah Anda terima — tidak tampil publik. MEDAL tidak memproses pembayaran; UMKM mentransfer langsung lalu mengunggah bukti untuk Anda verifikasi.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Bank" name="bank_name" errors={fe.bank_name}>
            {(p) => (
              <Select {...p} name="bank_name" defaultValue={profile.bank_name ?? ""}>
                <option value="">Pilih bank</option>
                {BANKS.map((b) => <option key={b} value={b}>{b}</option>)}
                {profile.bank_name && !(BANKS as readonly string[]).includes(profile.bank_name) && <option value={profile.bank_name}>{profile.bank_name}</option>}
              </Select>
            )}
          </Field>
          <Field label="Nomor rekening" name="bank_account_number" errors={fe.bank_account_number}>
            {(p) => <Input {...p} name="bank_account_number" inputMode="numeric" defaultValue={profile.bank_account_number ?? ""} placeholder="Hanya angka" />}
          </Field>
          <Field label="Atas nama" name="bank_account_holder" errors={fe.bank_account_holder}>
            {(p) => <Input {...p} name="bank_account_holder" defaultValue={profile.bank_account_holder ?? ""} />}
          </Field>
        </div>
      </Card>
      <FormMessage state={state} />
      <SubmitButton pending={pending} size="lg">Simpan profil</SubmitButton>
    </form>
  );
}

function SectionTitle({ n, title, desc }: { n: number; title: string; desc?: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="display grid size-9 shrink-0 place-items-center rounded-xl bg-brand-900 font-semibold text-brand-300">{n}</span>
      <div>
        <h2 className="display text-[20px] font-semibold leading-tight text-brand-950">{title}</h2>
        {desc && <p className="text-sm text-muted">{desc}</p>}
      </div>
    </div>
  );
}

export function EventForm({ event, categories, userId, canSubmit }: { event?: EV; categories: { id: string; name: string }[]; userId: string; canSubmit: boolean }) {
  const { state, pending, fe, onSubmit } = useFormAction(saveEventAction);
  const criteria = Array.isArray(event?.criteria) ? (event!.criteria as string[]).join("\n") : "";
  const gallery = Array.isArray(event?.gallery_paths) ? (event!.gallery_paths as string[]) : [];

  return (
    <form
      onSubmit={(e) => {
        const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
        const intent = e.currentTarget.elements.namedItem("intent") as HTMLInputElement;
        intent.value = submitter?.value ?? "draft";
        onSubmit(e);
      }}
      className="space-y-6"
      noValidate
    >
      {event && <input type="hidden" name="id" value={event.id} />}
      <input type="hidden" name="intent" defaultValue="draft" />

      <Card className="space-y-5">
        <SectionTitle n={1} title="Informasi event" />
        <Field label="Nama event" name="title" errors={fe.title} required>
          {(p) => <Input {...p} name="title" defaultValue={event?.title} required maxLength={140} />}
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Kategori" name="category" errors={fe.category} required>
            {(p) => (
              <Select {...p} name="category" defaultValue={event?.category ?? ""} required>
                <option value="" disabled>Pilih kategori</option>
                {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
              </Select>
            )}
          </Field>
          <Field label="Kapasitas stand" name="stand_capacity" errors={fe.stand_capacity} required>
            {(p) => <Input {...p} name="stand_capacity" type="number" min={1} max={5000} defaultValue={event?.stand_capacity ?? 20} required />}
          </Field>
          <Field label="Biaya stand (Rp)" name="stand_fee" errors={fe.stand_fee} hint="Isi 0 bila gratis. Dibayar UMKM via transfer ke rekening Anda setelah diterima.">
            {(p) => <Input {...p} name="stand_fee" type="number" min={0} step={1000} defaultValue={event?.stand_fee ?? 0} />}
          </Field>
        </div>
        <Field label="Ringkasan" name="summary" errors={fe.summary} hint="1–2 kalimat untuk kartu event (maks 300 karakter)." required>
          {(p) => <Textarea {...p} name="summary" defaultValue={event?.summary} rows={2} maxLength={300} required />}
        </Field>
        <Field label="Deskripsi lengkap" name="description" errors={fe.description} required>
          {(p) => <Textarea {...p} name="description" defaultValue={event?.description} rows={7} maxLength={8000} required />}
        </Field>
      </Card>

      <Card className="space-y-5">
        <SectionTitle n={2} title="Jadwal" desc="Waktu dalam WIB (Asia/Jakarta)." />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Event dimulai" name="starts_at" errors={fe.starts_at} required>
            {(p) => <Input {...p} name="starts_at" type="datetime-local" defaultValue={toJakartaInput(event?.starts_at)} required />}
          </Field>
          <Field label="Event selesai" name="ends_at" errors={fe.ends_at} required>
            {(p) => <Input {...p} name="ends_at" type="datetime-local" defaultValue={toJakartaInput(event?.ends_at)} required />}
          </Field>
          <Field label="Pendaftaran stand dibuka" name="registration_opens_at" errors={fe.registration_opens_at} required>
            {(p) => <Input {...p} name="registration_opens_at" type="datetime-local" defaultValue={toJakartaInput(event?.registration_opens_at)} required />}
          </Field>
          <Field label="Pendaftaran stand ditutup" name="registration_closes_at" errors={fe.registration_closes_at} required>
            {(p) => <Input {...p} name="registration_closes_at" type="datetime-local" defaultValue={toJakartaInput(event?.registration_closes_at)} required />}
          </Field>
        </div>
      </Card>

      <Card className="space-y-5">
        <SectionTitle n={3} title="Lokasi" />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Nama tempat" name="venue_name" errors={fe.venue_name} required>
            {(p) => <Input {...p} name="venue_name" defaultValue={event?.venue_name} required />}
          </Field>
          <Field label="Kecamatan" name="district" errors={fe.district} required>
            {(p) => (
              <Select {...p} name="district" defaultValue={event?.district ?? ""} required>
                <option value="" disabled>Pilih kecamatan</option>
                {SUMEDANG_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </Select>
            )}
          </Field>
        </div>
        <Field label="Alamat lengkap" name="address" errors={fe.address} required>
          {(p) => <Input {...p} name="address" defaultValue={event?.address} required />}
        </Field>
      </Card>

      <Card className="space-y-5">
        <SectionTitle n={4} title="Kriteria & kontak" />
        <Field label="Kriteria peserta" name="criteria" errors={fe.criteria} hint="Satu kriteria per baris. Ditampilkan publik.">
          {(p) => <Textarea {...p} name="criteria" defaultValue={criteria} rows={4} placeholder={"Produk olahan pangan lokal\nMemiliki PIRT/Halal"} />}
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Nama kontak publik" name="contact_name" errors={fe.contact_name}>
            {(p) => <Input {...p} name="contact_name" defaultValue={event?.contact_name ?? ""} />}
          </Field>
          <Field label="WhatsApp kontak publik" name="contact_phone" errors={fe.contact_phone}>
            {(p) => <Input {...p} name="contact_phone" type="tel" defaultValue={event?.contact_phone ?? ""} />}
          </Field>
        </div>
      </Card>

      <Card className="space-y-5">
        <SectionTitle n={5} title="Foto & proposal" />
        <UploadField name="cover_path" label="Foto cover" bucket={BUCKETS.eventMedia} userId={userId} folder="events" rule="image" variant="image" defaultPath={event?.cover_path} hint="Rasio 4:3 atau 16:9 · JPG/PNG/WebP · maks 5 MB" />
        <GalleryField name="gallery_paths" label="Galeri" bucket={BUCKETS.eventMedia} userId={userId} folder="events" defaultPaths={gallery} />
        <UploadField name="proposal_path" label="Proposal / izin event (wajib saat diajukan)" bucket={BUCKETS.proposals} userId={userId} folder="proposals" rule="pdf" defaultPath={event?.proposal_path} hint="PDF · maks 10 MB · bersifat privat" />
      </Card>

      <Card className="space-y-4">
        <Checkbox name="agree" label="Saya menyatakan informasi event ini benar dan dapat dipertanggungjawabkan." />
        {fe.agree && <p className="text-[13px] text-danger">{fe.agree[0]}</p>}
      </Card>

      <div className="sticky bottom-20 z-10 lg:bottom-4 flex flex-col gap-3 rounded-[22px] bg-white/90 p-4 shadow-[0_20px_50px_-25px_rgba(5,35,26,.5)] ring-1 ring-black/[0.06] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-end">
        <FormMessage state={state} />
        <Button type="submit" name="intent" value="draft" variant="outline" disabled={pending}>Simpan draft</Button>
        <SubmitButton pending={pending} name="intent" value="submit" disabled={!canSubmit} title={canSubmit ? undefined : "Profil organisasi harus diverifikasi terlebih dahulu"}>
          Simpan &amp; ajukan ke Disperindag
        </SubmitButton>
      </div>
      {!canSubmit && <p className="text-right text-xs text-muted">Pengajuan aktif setelah profil organisasi diverifikasi Disperindag. Anda tetap dapat menyimpan draft.</p>}
    </form>
  );
}
