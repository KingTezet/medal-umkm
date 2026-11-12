"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { saveBusinessProfileAction } from "@/app/actions/umkm";
import { Checkbox, Field, FormMessage, Input, Select, SubmitButton, Textarea, useFormAction } from "@/components/ui/form";
import { GalleryField, UploadField } from "@/components/upload-field";
import { Card } from "@/components/ui/misc";
import { BUCKETS, SUMEDANG_DISTRICTS } from "@/lib/constants";
import type { ProductItem } from "@/lib/storage";
import type { Database } from "@/types/database";

type BP = Database["public"]["Tables"]["business_profiles"]["Row"];

export function BusinessProfileForm({ profile, categories, userId, products: initialProducts, gallery }: { profile: BP; categories: { id: string; name: string }[]; userId: string; products: ProductItem[]; gallery: string[] }) {
  const { state, pending, fe, onSubmit } = useFormAction(saveBusinessProfileAction);
  const [products, setProducts] = useState<ProductItem[]>(initialProducts.length ? initialProducts : [{ name: "", description: "" }]);
  const cleanProducts = products.filter((p) => p.name.trim());

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <input type="hidden" name="products" value={JSON.stringify(cleanProducts)} />
      <Card className="space-y-5">
        <h2 className="display text-[20px] font-semibold leading-tight text-brand-950">Informasi usaha</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Nama usaha" name="business_name" errors={fe.business_name} required>
            {(p) => <Input {...p} name="business_name" defaultValue={profile.business_name} required />}
          </Field>
          <Field label="Kategori" name="category" errors={fe.category} required>
            {(p) => (
              <Select {...p} name="category" defaultValue={profile.category} required>
                {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                {!categories.some((c) => c.name === profile.category) && <option value={profile.category}>{profile.category}</option>}
              </Select>
            )}
          </Field>
        </div>
        <Field label="URL publik" name="slug" errors={fe.slug} hint={`medal-sumedang/umkm/${profile.slug}`} required>
          {(p) => <Input {...p} name="slug" defaultValue={profile.slug} required pattern="[a-z0-9-]+" />}
        </Field>
        <Field label="Deskripsi usaha" name="description" errors={fe.description}>
          {(p) => <Textarea {...p} name="description" defaultValue={profile.description ?? ""} maxLength={2000} rows={5} />}
        </Field>
      </Card>

      <Card className="space-y-5">
        <h2 className="display text-[20px] font-semibold leading-tight text-brand-950">Lokasi &amp; kontak</h2>
        <Field label="Alamat usaha" name="address" errors={fe.address} required>
          {(p) => <Input {...p} name="address" defaultValue={profile.address} required />}
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Desa/Kelurahan" name="village" errors={fe.village}>
            {(p) => <Input {...p} name="village" defaultValue={profile.village ?? ""} />}
          </Field>
          <Field label="Kecamatan" name="district" errors={fe.district} required>
            {(p) => (
              <Select {...p} name="district" defaultValue={profile.district} required>
                <option value="" disabled>Pilih kecamatan</option>
                {SUMEDANG_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </Select>
            )}
          </Field>
          <Field label="WhatsApp usaha" name="whatsapp" errors={fe.whatsapp} required>
            {(p) => <Input {...p} name="whatsapp" type="tel" defaultValue={profile.whatsapp} required />}
          </Field>
          <Field label="Instagram (opsional)" name="instagram" errors={fe.instagram}>
            {(p) => <Input {...p} name="instagram" defaultValue={profile.instagram ?? ""} placeholder="namausaha" />}
          </Field>
        </div>
      </Card>

      <Card className="space-y-5">
        <h2 className="display text-[20px] font-semibold leading-tight text-brand-950">Legalitas</h2>
        <p className="-mt-3 text-sm text-muted">Isi NIB dan/atau unggah surat keterangan usaha. Dokumen bersifat privat dan hanya dapat dilihat Anda serta Disperindag.</p>
        <Field label="NIB (13 digit)" name="nib" errors={fe.nib}>
          {(p) => <Input {...p} name="nib" inputMode="numeric" maxLength={13} defaultValue={profile.nib ?? ""} />}
        </Field>
        <UploadField name="business_license_path" label="NIB / Surat keterangan usaha" bucket={BUCKETS.verificationDocs} userId={userId} folder="legal" rule="legal" defaultPath={profile.business_license_path} />
      </Card>

      <Card className="space-y-5">
        <h2 className="display text-[20px] font-semibold leading-tight text-brand-950">Produk &amp; layanan</h2>
        <ul className="space-y-3">
          {products.map((p, i) => (
            <li key={i} className="grid gap-2 rounded-2xl bg-brand-50/50 p-3 ring-1 ring-black/[0.05] sm:grid-cols-[1fr_1.6fr_auto] sm:items-center">
              <Input aria-label={`Nama produk ${i + 1}`} placeholder="Nama produk" value={p.name} maxLength={80} onChange={(e) => setProducts((x) => x.map((y, j) => (j === i ? { ...y, name: e.target.value } : y)))} />
              <Input aria-label={`Deskripsi produk ${i + 1}`} placeholder="Deskripsi singkat (opsional)" value={p.description ?? ""} maxLength={240} onChange={(e) => setProducts((x) => x.map((y, j) => (j === i ? { ...y, description: e.target.value } : y)))} />
              <button type="button" onClick={() => setProducts((x) => x.filter((_, j) => j !== i))} className="grid size-10 place-items-center justify-self-end rounded-full text-muted hover:bg-red-50 hover:text-danger" aria-label={`Hapus produk ${i + 1}`}>
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>
        {products.length < 20 && (
          <button type="button" onClick={() => setProducts((x) => [...x, { name: "", description: "" }])} className="inline-flex items-center gap-2 text-sm font-semibold text-emerald">
            <Plus className="size-4" /> Tambah produk
          </button>
        )}
        {fe.products && <p className="text-[13px] text-danger">{fe.products[0]}</p>}
      </Card>

      <Card className="space-y-5">
        <h2 className="display text-[20px] font-semibold leading-tight text-brand-950">Foto publik</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <UploadField name="logo_path" label="Logo usaha" bucket={BUCKETS.umkmMedia} userId={userId} folder="logo" rule="image" variant="image" defaultPath={profile.logo_path} />
          <UploadField name="cover_path" label="Foto sampul" bucket={BUCKETS.umkmMedia} userId={userId} folder="cover" rule="image" variant="image" defaultPath={profile.cover_path} />
        </div>
        <GalleryField name="gallery_paths" label="Galeri produk" bucket={BUCKETS.umkmMedia} userId={userId} folder="gallery" defaultPaths={gallery} />
      </Card>

      <Card className="space-y-4">
        <h2 className="display text-[20px] font-semibold leading-tight text-brand-950">Privasi</h2>
        <Checkbox name="is_public" defaultChecked={profile.is_public} label={<><strong>Tampilkan profil di direktori publik.</strong> Profil hanya tampil setelah diverifikasi Disperindag.</>} />
        <Checkbox name="show_whatsapp" defaultChecked={profile.show_whatsapp} label={<><strong>Tampilkan nomor WhatsApp</strong> pada profil publik agar calon pembeli dapat menghubungi.</>} />
      </Card>

      <div className="sticky bottom-20 z-10 lg:bottom-4 flex flex-col gap-3 rounded-[22px] bg-white/90 p-4 shadow-[0_20px_50px_-25px_rgba(5,35,26,.5)] ring-1 ring-black/[0.06] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
        <FormMessage state={state} />
        <p className="text-sm text-muted">{profile.verification_status === "revision_required" ? "Menyimpan akan mengirim ulang profil ke antrean verifikasi." : "Perubahan tersimpan setelah Anda menekan Simpan."}</p>
        <SubmitButton pending={pending} size="lg">Simpan profil</SubmitButton>
      </div>
    </form>
  );
}
