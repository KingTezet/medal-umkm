import type { Database } from "@/types/database";

export type UserRole = Database["public"]["Enums"]["user_role"];
export type EventStatus = Database["public"]["Enums"]["event_status"];
export type ApplicationStatus = Database["public"]["Enums"]["application_status"];
export type VerificationStatus = Database["public"]["Enums"]["verification_status"];
export type OrganizationType = Database["public"]["Enums"]["organization_type"];
export type AccountStatus = Database["public"]["Enums"]["account_status"];
export type PaymentStatus = Database["public"]["Enums"]["payment_status"];

export const APP_NAME = "MEDAL";
export const APP_LONG_NAME = "Media, Event, Dagang & Lapak";
export const APP_TAGLINE = "Platform Event & Direktori UMKM Kabupaten Sumedang";

/** 26 kecamatan di Kabupaten Sumedang. */
export const SUMEDANG_DISTRICTS = [
  "Buahdua", "Cibugel", "Cimalaka", "Cimanggung", "Cisarua", "Cisitu", "Conggeang",
  "Darmaraja", "Ganeas", "Jatigede", "Jatinangor", "Jatinunggal", "Pamulihan", "Paseh",
  "Rancakalong", "Situraja", "Sukasari", "Sumedang Selatan", "Sumedang Utara", "Surian",
  "Tanjungkerta", "Tanjungmedar", "Tanjungsari", "Tomo", "Ujungjaya", "Wado",
] as const;

export const ORGANIZATION_TYPES: Record<OrganizationType, string> = {
  community: "Komunitas",
  eo: "Event Organizer",
  village: "Desa / Kelurahan",
  agency: "Instansi",
  other: "Lainnya",
};

export const ROLE_LABEL: Record<UserRole, string> = {
  umkm: "Pelaku UMKM",
  organizer: "Penyelenggara",
  admin: "Admin Disperindag",
};

export type Tone = "neutral" | "info" | "success" | "warning" | "danger" | "gold" | "verified";

export const EVENT_STATUS: Record<EventStatus, { label: string; tone: Tone }> = {
  draft: { label: "Draft", tone: "neutral" },
  pending_review: { label: "Menunggu Review", tone: "info" },
  revision_required: { label: "Perlu Revisi", tone: "warning" },
  published: { label: "Terbit", tone: "success" },
  rejected: { label: "Ditolak", tone: "danger" },
  cancelled: { label: "Dibatalkan", tone: "danger" },
  completed: { label: "Selesai", tone: "neutral" },
};

export const APPLICATION_STATUS: Record<ApplicationStatus, { label: string; tone: Tone }> = {
  submitted: { label: "Berkas Diterima", tone: "info" },
  under_verification: { label: "Diverifikasi", tone: "info" },
  revision_required: { label: "Perlu Revisi", tone: "warning" },
  verified: { label: "Terverifikasi", tone: "verified" },
  selected_by_organizer: { label: "Dipilih Penyelenggara", tone: "gold" },
  waitlisted: { label: "Daftar Tunggu", tone: "warning" },
  rejected: { label: "Ditolak", tone: "danger" },
  confirmed: { label: "Dikonfirmasi", tone: "success" },
  withdrawn: { label: "Dibatalkan", tone: "neutral" },
};

export const VERIFICATION_STATUS: Record<VerificationStatus, { label: string; tone: Tone }> = {
  pending: { label: "Menunggu Verifikasi", tone: "info" },
  verified: { label: "Terverifikasi", tone: "verified" },
  revision_required: { label: "Perlu Revisi", tone: "warning" },
  rejected: { label: "Ditolak", tone: "danger" },
};

export const PAYMENT_STATUS: Record<PaymentStatus, { label: string; tone: Tone }> = {
  not_required: { label: "Gratis", tone: "neutral" },
  unpaid: { label: "Belum dibayar", tone: "warning" },
  submitted: { label: "Bukti dikirim", tone: "info" },
  verified: { label: "Lunas", tone: "verified" },
  rejected: { label: "Bukti ditolak", tone: "danger" },
};

export const BANKS = ["BRI", "BCA", "BNI", "Mandiri", "BSI", "BJB", "BTN", "CIMB Niaga", "Permata", "Danamon", "SeaBank", "Bank Jago", "Lainnya"] as const;

export function formatRupiah(n: number | null | undefined): string {
  if (!n) return "Gratis";
  return "Rp" + n.toLocaleString("id-ID");
}

export const ACCOUNT_STATUS: Record<AccountStatus, { label: string; tone: Tone }> = {
  pending: { label: "Menunggu", tone: "info" },
  active: { label: "Aktif", tone: "success" },
  suspended: { label: "Ditangguhkan", tone: "danger" },
};

export const BUCKETS = {
  eventMedia: "public-event-media",
  umkmMedia: "public-umkm-media",
  verificationDocs: "private-verification-documents",
  proposals: "private-event-proposals",
  applicationDocs: "private-application-documents",
  paymentProofs: "private-payment-proofs",
} as const;
export type BucketName = (typeof BUCKETS)[keyof typeof BUCKETS];

export const FILE_RULES = {
  image: { mimes: ["image/jpeg", "image/png", "image/webp"], maxBytes: 5 * 1024 * 1024, label: "JPG, PNG, atau WebP · maks 5 MB" },
  pdf: { mimes: ["application/pdf"], maxBytes: 10 * 1024 * 1024, label: "PDF · maks 10 MB" },
  pdfSmall: { mimes: ["application/pdf"], maxBytes: 5 * 1024 * 1024, label: "PDF · maks 5 MB" },
  legal: { mimes: ["application/pdf", "image/jpeg", "image/png"], maxBytes: 5 * 1024 * 1024, label: "PDF, JPG, atau PNG · maks 5 MB" },
  proof: { mimes: ["application/pdf", "image/jpeg", "image/png", "image/webp"], maxBytes: 5 * 1024 * 1024, label: "Foto/screenshot (JPG, PNG, WebP) atau PDF · maks 5 MB" },
} as const;
export type FileRuleKey = keyof typeof FILE_RULES;

export const FALLBACK_IMAGES = [
  "/images/p-keranjang-bambu.jpg",
  "/images/p-kopi.jpg",
  "/images/p-rempah.jpg",
  "/images/p-gerabah.jpg",
  "/images/p-sambal-sendok.jpg",
  "/images/p-lampu-bambu.jpg",
  "/images/p-nasi-daun.jpg",
  "/images/p-batik-biru.jpg",
] as const;
