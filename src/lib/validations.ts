import { z } from "zod";
import { SUMEDANG_DISTRICTS } from "@/lib/constants";
import { normalizePhone } from "@/lib/format";

const trimmed = (min: number, max: number, label: string) =>
  z
    .string({ error: `${label} wajib diisi.` })
    .trim()
    .min(min, min <= 1 ? `${label} wajib diisi.` : `${label} minimal ${min} karakter.`)
    .max(max, `${label} maksimal ${max} karakter.`);

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Maksimal ${max} karakter.`)
    .optional()
    .transform((v) => (v ? v : null));

export const phoneSchema = z
  .string({ error: "Nomor WhatsApp wajib diisi." })
  .transform(normalizePhone)
  .refine((v) => /^08[0-9]{8,12}$/.test(v), "Nomor WhatsApp tidak valid (contoh: 081234567890).");

export const emailSchema = z.string().trim().toLowerCase().email("Email tidak valid.");
export const passwordSchema = z
  .string()
  .min(8, "Password minimal 8 karakter.")
  .max(72, "Password maksimal 72 karakter.")
  .refine((v) => /[A-Za-z]/.test(v) && /[0-9]/.test(v), "Password harus mengandung huruf dan angka.");

export const districtSchema = z.enum(SUMEDANG_DISTRICTS, { error: "Pilih kecamatan di Kabupaten Sumedang." });

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password wajib diisi."),
});

const consent = z.literal("on", { error: "Anda harus menyetujui syarat & ketentuan." });

export const registerUmkmSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  full_name: trimmed(3, 120, "Nama penanggung jawab"),
  phone: phoneSchema,
  business_name: trimmed(2, 120, "Nama usaha"),
  category: trimmed(2, 60, "Kategori"),
  district: districtSchema,
  address: trimmed(5, 300, "Alamat usaha"),
  description: optionalText(2000),
  agree: consent,
});

export const registerOrganizerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  full_name: trimmed(3, 120, "Nama penanggung jawab"),
  phone: phoneSchema,
  organization_name: trimmed(2, 120, "Nama organisasi"),
  organization_type: z.enum(["community", "eo", "village", "agency", "other"], { error: "Pilih jenis organisasi." }),
  district: districtSchema.optional().or(z.literal("").transform(() => undefined)),
  address: trimmed(5, 300, "Alamat organisasi"),
  description: optionalText(2000),
  agree: consent,
});

export const productItemSchema = z.object({
  name: trimmed(2, 80, "Nama produk"),
  description: z.string().trim().max(240).optional().default(""),
});

export const slugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, "Slug minimal 3 karakter.")
  .max(70, "Slug maksimal 70 karakter.")
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug hanya huruf kecil, angka, dan tanda hubung.");

export const nibSchema = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? v : null))
  .refine((v) => v === null || /^[0-9]{13}$/.test(v), "NIB harus 13 digit angka.");

export const businessProfileSchema = z.object({
  business_name: trimmed(2, 120, "Nama usaha"),
  slug: slugSchema,
  category: trimmed(2, 60, "Kategori"),
  description: optionalText(2000),
  address: trimmed(5, 300, "Alamat usaha"),
  village: optionalText(80),
  district: districtSchema,
  whatsapp: phoneSchema,
  instagram: z
    .string()
    .trim()
    .max(40)
    .optional()
    .transform((v) => (v ? v.replace(/^@/, "") : null))
    .refine((v) => v === null || /^[A-Za-z0-9._]{1,30}$/.test(v), "Username Instagram tidak valid."),
  nib: nibSchema,
  products: z.array(productItemSchema).max(20, "Maksimal 20 produk."),
  is_public: z.boolean(),
  show_whatsapp: z.boolean(),
});

const optionalTrim = (max: number) =>
  z.string().trim().max(max).optional().transform((v) => (v ? v : null));

export const organizerProfileSchema = z
  .object({
    organization_name: trimmed(2, 120, "Nama organisasi"),
    organization_type: z.enum(["community", "eo", "village", "agency", "other"]),
    description: optionalText(2000),
    address: trimmed(5, 300, "Alamat organisasi"),
    district: districtSchema.nullable(),
    contact_phone: phoneSchema,
    bank_name: optionalTrim(60),
    bank_account_number: z
      .string()
      .optional()
      .transform((v) => (v ? v.replace(/[^0-9]/g, "") : null))
      .refine((v) => v === null || /^[0-9]{5,30}$/.test(v), "Nomor rekening harus 5–30 digit angka."),
    bank_account_holder: optionalTrim(120),
  })
  .refine((d) => [d.bank_name, d.bank_account_number, d.bank_account_holder].every(Boolean) || [d.bank_name, d.bank_account_number, d.bank_account_holder].every((x) => !x), {
    path: ["bank_account_number"],
    message: "Lengkapi nama bank, nomor rekening, dan nama pemilik rekening (atau kosongkan ketiganya).",
  });

const dateTimeLocal = (label: string) =>
  z
    .string({ error: `${label} wajib diisi.` })
    .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, `${label} tidak valid.`);

export const eventSchema = z
  .object({
    title: trimmed(5, 140, "Nama event"),
    summary: trimmed(10, 300, "Ringkasan"),
    description: trimmed(20, 8000, "Deskripsi"),
    category: trimmed(2, 60, "Kategori"),
    venue_name: trimmed(3, 140, "Nama tempat"),
    address: trimmed(5, 300, "Alamat"),
    district: districtSchema,
    starts_at: dateTimeLocal("Tanggal mulai"),
    ends_at: dateTimeLocal("Tanggal selesai"),
    registration_opens_at: dateTimeLocal("Pendaftaran dibuka"),
    registration_closes_at: dateTimeLocal("Pendaftaran ditutup"),
    stand_capacity: z.coerce
      .number({ error: "Kapasitas wajib berupa angka." })
      .int("Kapasitas harus bilangan bulat.")
      .min(1, "Kapasitas stand harus lebih dari 0.")
      .max(5000, "Kapasitas maksimal 5000 stand."),
    stand_fee: z.coerce
      .number({ error: "Biaya stand harus berupa angka." })
      .int("Biaya stand harus bilangan bulat.")
      .min(0, "Biaya stand tidak boleh negatif.")
      .max(100000000, "Biaya stand terlalu besar.")
      .default(0),
    criteria: z.array(z.string().trim().min(3).max(200)).max(15, "Maksimal 15 kriteria."),
    contact_name: optionalText(120),
    contact_phone: z
      .string()
      .optional()
      .transform((v) => (v ? normalizePhone(v) : null))
      .refine((v) => v === null || /^08[0-9]{8,12}$/.test(v), "Nomor kontak tidak valid."),
    agree: consent,
  })
  .refine((d) => d.ends_at > d.starts_at, { path: ["ends_at"], message: "Tanggal selesai harus setelah tanggal mulai." })
  .refine((d) => d.registration_closes_at > d.registration_opens_at, {
    path: ["registration_closes_at"],
    message: "Penutupan pendaftaran harus setelah pembukaan.",
  })
  .refine((d) => d.registration_closes_at <= d.ends_at, {
    path: ["registration_closes_at"],
    message: "Pendaftaran harus ditutup sebelum event berakhir.",
  });

export const applicationSchema = z.object({
  products_offered: trimmed(3, 1000, "Produk yang akan dijual"),
  application_note: optionalText(1000),
  additional_document_path: z.string().trim().optional().transform((v) => (v ? v : null)),
  truth: z.literal("on", { error: "Centang pernyataan kebenaran data." }),
  agree: consent,
});

export const reviewNoteSchema = z.string().trim().max(1000).optional().transform((v) => (v ? v : null));

export const standNumberSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z0-9][A-Z0-9-]{0,15}$/, "Format nomor stand tidak valid (contoh: A-01).");

export const categorySchema = z.object({
  kind: z.enum(["event", "umkm"]),
  name: trimmed(2, 60, "Nama kategori"),
  sort_order: z.coerce.number().int().min(0).max(999).default(0),
});

export const contactSettingsSchema = z.object({
  agency: trimmed(3, 160, "Nama instansi"),
  address: trimmed(3, 300, "Alamat"),
  phone: z.string().trim().max(30).default(""),
  whatsapp: z.string().trim().max(30).default(""),
  email: z.union([z.literal(""), z.string().trim().email("Email tidak valid.")]).default(""),
  instagram: z.string().trim().max(40).default(""),
});

export const announcementSchema = z.object({
  enabled: z.boolean(),
  text: z.string().trim().max(240, "Pengumuman maksimal 240 karakter."),
});

export const heroSchema = z.object({
  headline: trimmed(10, 120, "Headline"),
  subheadline: trimmed(10, 300, "Subheadline"),
});

/** Storage path must live in the caller's own folder. */
export function isOwnedPath(path: string | null | undefined, userId: string): boolean {
  if (!path) return true;
  return path.split("/")[0] === userId && !path.includes("..");
}

export type FieldErrors = Record<string, string[] | undefined>;

export function zodFieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_form";
    (out[key] ??= []).push(issue.message);
  }
  return out;
}
