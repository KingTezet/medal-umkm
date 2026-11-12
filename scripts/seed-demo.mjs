#!/usr/bin/env node
/**
 * Seed clearly-labelled DEMO data for development/staging.
 * Env: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, DEMO_PASSWORD (min 10 chars)
 * Usage: node --env-file=.env.local scripts/seed-demo.mjs
 * Idempotent: re-running reuses existing demo users/rows.
 */
import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";

const { NEXT_PUBLIC_SUPABASE_URL: url, SUPABASE_SERVICE_ROLE_KEY: key, DEMO_PASSWORD: password } = process.env;
if (!url || !key) throw new Error("Supabase env belum diatur.");
if (!password || password.length < 10) throw new Error("DEMO_PASSWORD wajib minimal 10 karakter.");

const sb = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
const DOMAIN = "demo.medal-sumedang.id";
const day = 24 * 60 * 60 * 1000;
const at = (offsetDays, hour = 9) => {
  const d = new Date(Date.now() + offsetDays * day);
  d.setUTCHours(hour - 7, 0, 0, 0);
  return d.toISOString();
};

const { data: existing } = await sb.auth.admin.listUsers({ page: 1, perPage: 1000 });
async function ensureUser(local, meta) {
  const email = `${local}@${DOMAIN}`;
  const found = existing.users.find((u) => u.email === email);
  if (found) return found.id;
  const { data, error } = await sb.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: meta });
  if (error) throw new Error(`${email}: ${error.message}`);
  return data.user.id;
}

async function uploadPublic(bucket, userId, file) {
  const path = `${userId}/demo/${file}`;
  const body = await readFile(new URL(`../public/images/${file}`, import.meta.url));
  await sb.storage.from(bucket).upload(path, body, { contentType: "image/jpeg", upsert: true });
  return path;
}

// ---------------------------------------------------------------- organizers
const organizers = [
  { local: "penyelenggara1", full_name: "Rina Kusumawati", phone: "081200000001", organization_name: "Komunitas Kreatif Sumedang (DEMO)", organization_type: "community", district: "Sumedang Utara", address: "Jl. Prabu Geusan Ulun No. 10, Sumedang (DEMO)" },
  { local: "penyelenggara2", full_name: "Dedi Mulyana", phone: "081200000002", organization_name: "Karya Event Organizer (DEMO)", organization_type: "eo", district: "Jatinangor", address: "Jl. Raya Jatinangor No. 21 (DEMO)" },
  { local: "nataspace", full_name: "Moch Sugih Nugraha", phone: "081200000004", organization_name: "NATA Space", organization_type: "eo", district: "Sumedang Utara", address: "Sumedang (contoh penyelenggara dengan biaya stand)",
    bank: { bank_name: "BRI", bank_account_number: "009401100754508", bank_account_holder: "MOCH SUGIH NUGRAHA" } },
];
const orgIds = [];
for (const o of organizers) {
  const uid = await ensureUser(o.local, { role: "organizer", ...o });
  const { data } = await sb.from("organizer_profiles").update({ verification_status: "verified", verified_at: new Date().toISOString(), description: "Akun contoh untuk demonstrasi platform MEDAL. Bukan data resmi.", ...(o.bank ?? {}) }).eq("user_id", uid).select("id, user_id").single();
  orgIds.push(data);
}

// ---------------------------------------------------------------- UMKM
const umkm = [
  { local: "umkm1", full_name: "Euis Sumarni", business_name: "Tahu Bungkeng Bu Euis", category: "Kuliner", district: "Sumedang Selatan", img: "p-sambal-sendok.jpg", products: [{ name: "Tahu Sumedang original", description: "Digoreng dadakan, renyah di luar" }, { name: "Tahu isi pedas", description: "" }] },
  { local: "umkm2", full_name: "Asep Saepudin", business_name: "Batik Kasumedangan Asep", category: "Fesyen", district: "Sumedang Utara", img: "p-batik-biru.jpg", products: [{ name: "Kain batik tulis motif Kasumedangan", description: "" }] },
  { local: "umkm3", full_name: "Neng Siti", business_name: "Jajanan Pasar Neng Siti", category: "Kuliner", district: "Tanjungsari", img: "p-nasi-daun.jpg", products: [{ name: "Kue serabi", description: "" }, { name: "Kue lumpur pandan", description: "" }] },
  { local: "umkm4", full_name: "Ujang Hermawan", business_name: "Rempah Sehat Ujang", category: "Pertanian & Olahan", district: "Rancakalong", img: "p-rempah.jpg", products: [{ name: "Jahe merah bubuk", description: "" }, { name: "Kunyit kering", description: "" }] },
  { local: "umkm5", full_name: "Lilis Suryani", business_name: "Canting Lilis Craft", category: "Kriya & Kerajinan", district: "Cimalaka", img: "p-keranjang-bambu.jpg", products: [{ name: "Workshop membatik", description: "Kelas singkat 2 jam" }] },
  { local: "umkm6", full_name: "Dewi Lestari", business_name: "Kue Lumpur Dewi", category: "Kuliner", district: "Jatinangor", img: "p-keripik.jpg", products: [{ name: "Kue lumpur pandan", description: "" }] },
  { local: "umkm7", full_name: "Hendra Gunawan", business_name: "Tahu Sumedang Hendra", category: "Kuliner", district: "Paseh", img: "p-sambal.jpg", products: [{ name: "Tahu goreng + cabai rawit", description: "" }] },
  { local: "umkm8", full_name: "Yayan Sopyan", business_name: "Kopi Rancakalong Yayan", category: "Pertanian & Olahan", district: "Rancakalong", img: "p-kopi.jpg", products: [{ name: "Kopi arabika bubuk", description: "" }] },
];
const bps = [];
for (const [i, u] of umkm.entries()) {
  const uid = await ensureUser(u.local, {
    role: "umkm", full_name: u.full_name, phone: `08130000000${i + 1}`, business_name: `${u.business_name} (DEMO)`,
    category: u.category, district: u.district, address: `Alamat contoh No. ${i + 1}, ${u.district} (DEMO)`,
  });
  const cover = await uploadPublic("public-umkm-media", uid, u.img);
  const verified = i < 6; // 2 left pending for the admin queue
  const { data, error } = await sb.from("business_profiles").update({
    description: `Profil contoh (DEMO) untuk demonstrasi MEDAL. ${u.business_name} adalah usaha fiktif di Kecamatan ${u.district}.`,
    products: u.products, cover_path: cover, nib: `91200000000${String(i).padStart(2, "0")}`,
    is_public: true, show_whatsapp: true,
    verification_status: verified ? "verified" : "pending", verified_at: verified ? new Date().toISOString() : null,
  }).eq("user_id", uid).select("id, user_id, business_name, slug, category, district, whatsapp, address, products").single();
  if (error) throw error;
  bps.push({ ...data, owner: u.full_name });
}

// ---------------------------------------------------------------- events
const events = [
  { org: 0, title: "Festival Tahu & Kuliner Sumedang 2026 (DEMO)", category: "Festival", img: "pasar-malam-2.jpg", venue: "Alun-alun Sumedang", district: "Sumedang Utara", start: 20, end: 22, open: -5, close: 12, cap: 40, status: "published" },
  { org: 1, title: "Bazar UMKM Jatinangor Akhir Tahun (DEMO)", category: "Bazar", img: "pasar-malam-1.jpg", venue: "Lapangan Jatinangor", district: "Jatinangor", start: 30, end: 31, open: -2, close: 20, cap: 25, status: "published" },
  { org: 0, title: "Pameran Batik & Kriya Kasumedangan (DEMO)", category: "Pameran", img: "batik.jpg", venue: "Gedung Negara Sumedang", district: "Sumedang Selatan", start: 45, end: 47, open: 10, close: 35, cap: 30, status: "published" },
  { org: 1, title: "Pasar Malam Rancakalong (DEMO)", category: "Pasar Malam", img: "pasar-malam-6.jpg", venue: "Desa Wisata Rancakalong", district: "Rancakalong", start: 14, end: 15, open: -10, close: 7, cap: 3, status: "published" },
  { org: 2, title: "Pasar Kreatif NATA Space (DEMO)", category: "Bazar", img: "p-gerabah.jpg", venue: "NATA Space", district: "Sumedang Utara", start: 25, end: 26, open: -1, close: 18, cap: 25, fee: 100000, status: "published" },
  { org: 0, title: "Expo Produk Olahan Pangan (DEMO)", category: "Expo & Business Matching", img: "rempah.jpg", venue: "Gedung PKK Sumedang", district: "Sumedang Utara", start: 60, end: 61, open: 15, close: 50, cap: 20, status: "pending_review" },
];
const eventRows = [];
for (const e of events) {
  const org = orgIds[e.org];
  const slug = e.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const cover = await uploadPublic("public-event-media", org.user_id, e.img);
  const row = {
    organizer_id: org.id, title: e.title, slug,
    summary: `Event contoh (DEMO) di ${e.venue}. Data ini hanya untuk demonstrasi platform MEDAL.`,
    description: `${e.title} adalah event fiktif untuk demonstrasi alur MEDAL: pendaftaran stand, verifikasi Disperindag, seleksi penyelenggara, hingga penetapan nomor stand.\n\nBukan pengumuman resmi Disperindag Kabupaten Sumedang.`,
    category: e.category, cover_path: cover, venue_name: e.venue, address: `${e.venue}, Kabupaten Sumedang`, district: e.district,
    starts_at: at(e.start, 9), ends_at: at(e.end, 21), registration_opens_at: at(e.open, 8), registration_closes_at: at(e.close, 23),
    stand_capacity: e.cap, stand_fee: e.fee ?? 0, criteria: ["Usaha berdomisili di Kabupaten Sumedang", "Memiliki NIB atau surat keterangan usaha", "Produk sesuai tema event"],
    contact_name: "Panitia (DEMO)", contact_phone: "081200000099", status: e.status,
    published_at: e.status === "published" ? new Date().toISOString() : null,
  };
  const { data, error } = await sb.from("events").upsert(row, { onConflict: "slug" }).select("id, title").single();
  if (error) throw error;
  eventRows.push(data);
}

// ---------------------------------------------------------------- applications (various statuses on event 0)
const snapshot = (b) => ({ business_name: b.business_name, slug: b.slug, category: b.category, owner_name: b.owner, whatsapp: b.whatsapp, address: b.address, district: b.district, products: b.products, has_nib: true, has_license: false });
const appPlan = [
  { b: 0, e: 0, status: "confirmed", stand: "A-01" },
  { b: 1, e: 0, status: "selected_by_organizer" },
  { b: 2, e: 0, status: "verified" },
  { b: 3, e: 0, status: "submitted" },
  { b: 4, e: 0, status: "revision_required", note: "Mohon unggah foto produk yang lebih jelas. (DEMO)" },
  { b: 5, e: 0, status: "waitlisted" },
  { b: 0, e: 1, status: "verified" },
  { b: 2, e: 1, status: "submitted" },
];
for (const [i, p] of appPlan.entries()) {
  const b = bps[p.b];
  const now = new Date().toISOString();
  const row = {
    application_code: `MDL-DEMO-${String(i + 1).padStart(3, "0")}`,
    event_id: eventRows[p.e].id, business_profile_id: b.id, submitted_by: b.user_id, business_snapshot: snapshot(b),
    products_offered: b.products.map((x) => x.name).join(", "), status: p.status, stand_number: p.stand ?? null,
    admin_note: p.note ?? null,
    verified_at: ["verified", "selected_by_organizer", "waitlisted", "confirmed"].includes(p.status) ? now : null,
    organizer_decided_at: ["selected_by_organizer", "waitlisted", "confirmed"].includes(p.status) ? now : null,
    confirmed_at: p.status === "confirmed" ? now : null,
  };
  const { data, error } = await sb.from("stand_applications").upsert(row, { onConflict: "event_id,business_profile_id" }).select("id").single();
  if (error) throw error;
  await sb.from("application_status_history").delete().eq("application_id", data.id);
  await sb.from("application_status_history").insert({ application_id: data.id, from_status: null, to_status: p.status, note: "Data contoh (DEMO)" });
}

console.log(`DEMO siap: ${organizers.length} penyelenggara, ${umkm.length} UMKM, ${events.length} event, ${appPlan.length} pendaftaran.`);
console.log(`Login demo: umkm1@${DOMAIN} / penyelenggara1@${DOMAIN} (password = DEMO_PASSWORD)`);
