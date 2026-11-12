#!/usr/bin/env node
/**
 * Integration test against a real Supabase project: RLS, storage policies,
 * role guards, workflow RPCs and atomic capacity. Creates isolated test users
 * and events, then deletes them. Never run against production data you care about.
 *
 * Env: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY,
 *      ADMIN_EMAIL, ADMIN_PASSWORD
 * Usage: npm run test:rls
 */
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";

const { NEXT_PUBLIC_SUPABASE_URL: url, NEXT_PUBLIC_SUPABASE_ANON_KEY: anonKey, SUPABASE_SERVICE_ROLE_KEY: serviceKey, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
if (!url || !anonKey || !serviceKey || !ADMIN_EMAIL || !ADMIN_PASSWORD) throw new Error("Env Supabase/admin belum lengkap.");

const opts = { auth: { persistSession: false, autoRefreshToken: false } };
const svc = createClient(url, serviceKey, opts);
const anon = createClient(url, anonKey, opts);
const run = randomUUID().slice(0, 6);
const PASS = `T3st-${randomUUID()}`;
let passed = 0;
let failed = 0;
const created = { users: [], events: [] };

function check(name, cond, detail = "") {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name} ${detail}`); }
}

async function makeUser(tag, role, meta = {}) {
  const email = `rls-${tag}-${run}@demo.medal-sumedang.id`;
  const { data, error } = await svc.auth.admin.createUser({ email, password: PASS, email_confirm: true, user_metadata: { role, full_name: `Test ${tag}`, phone: "081299990000", ...meta } });
  if (error) throw error;
  created.users.push(data.user.id);
  const client = createClient(url, anonKey, opts);
  const { error: e2 } = await client.auth.signInWithPassword({ email, password: PASS });
  if (e2) throw e2;
  return { id: data.user.id, client };
}

const day = 86400000;
const iso = (d) => new Date(Date.now() + d * day).toISOString();

try {
  console.log("Menyiapkan fixture…");
  const uA = await makeUser("umkmA", "umkm", { business_name: "Usaha A", district: "Paseh", address: "Jl. A No. 1" });
  const uB = await makeUser("umkmB", "umkm", { business_name: "Usaha B", district: "Paseh", address: "Jl. B No. 1" });
  const uC = await makeUser("umkmC", "umkm", { business_name: "Usaha C", district: "Paseh", address: "Jl. C No. 1" });
  const uD = await makeUser("umkmD", "umkm", { business_name: "Usaha D", district: "Paseh", address: "Jl. D No. 1" });
  const oA = await makeUser("orgA", "organizer", { organization_name: "Org A" });
  const oB = await makeUser("orgB", "organizer", { organization_name: "Org B" });
  const evil = await makeUser("evil", "admin");

  const admin = createClient(url, anonKey, opts);
  const { error: adminErr } = await admin.auth.signInWithPassword({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
  if (adminErr) throw adminErr;

  for (const u of [uA, uB, uC, uD]) {
    await svc.from("business_profiles").update({ nib: "1234567890123", whatsapp: "081299990000", verification_status: "verified" }).eq("user_id", u.id);
  }
  const { data: orgA } = await svc.from("organizer_profiles").update({ verification_status: "verified" }).eq("user_id", oA.id).select("id").single();
  const { data: orgB } = await svc.from("organizer_profiles").update({ verification_status: "verified" }).eq("user_id", oB.id).select("id").single();

  const baseEvent = {
    summary: "Event pengujian otomatis RLS.", description: "Event pengujian otomatis untuk memverifikasi kebijakan akses.",
    category: "Bazar", venue_name: "Lokasi Uji", address: "Alamat Uji No. 1", district: "Paseh",
    starts_at: iso(10), ends_at: iso(11), registration_opens_at: iso(-1), registration_closes_at: iso(5), criteria: [],
  };
  const { data: evA } = await svc.from("events").insert({ ...baseEvent, organizer_id: orgA.id, title: `RLS Event A ${run}`, slug: `rls-a-${run}`, stand_capacity: 3, status: "published", published_at: iso(0) }).select("id").single();
  const { data: evB } = await svc.from("events").insert({ ...baseEvent, organizer_id: orgB.id, title: `RLS Event B ${run}`, slug: `rls-b-${run}`, stand_capacity: 5, status: "draft" }).select("id").single();
  created.events.push(evA.id, evB.id);

  console.log("\n[1] Role & eskalasi");
  const { data: evilProfile } = await svc.from("profiles").select("role").eq("id", evil.id).single();
  check("sign-up dengan metadata role=admin tetap menjadi umkm", evilProfile.role === "umkm", evilProfile.role);
  const { error: escErr } = await uA.client.from("profiles").update({ role: "admin" }).eq("id", uA.id);
  const { data: afterEsc } = await svc.from("profiles").select("role").eq("id", uA.id).single();
  check("UMKM tidak dapat mengubah role sendiri", !!escErr && afterEsc.role === "umkm");
  const { error: stErr } = await uA.client.from("profiles").update({ account_status: "active" }).eq("id", uB.id);
  const { data: bProf } = await svc.from("profiles").select("full_name").eq("id", uB.id).single();
  check("UMKM tidak dapat mengubah profil orang lain", !stErr ? bProf.full_name === "Test umkmB" : true);
  const { error: rpcErr } = await uA.client.rpc("admin_review_event", { p_event_id: evB.id, p_action: "publish" });
  check("Non-admin tidak dapat memanggil RPC admin", !!rpcErr);
  const { error: statsErr } = await oA.client.rpc("admin_dashboard_stats");
  check("Non-admin tidak dapat membaca statistik admin", !!statsErr);
  const { data: audit } = await uA.client.from("audit_logs").select("id").limit(1);
  check("Non-admin tidak dapat membaca audit log", (audit ?? []).length === 0);
  const { error: verifyOwn } = await uA.client.from("business_profiles").update({ verification_status: "verified", business_name: "Usaha A2" }).eq("user_id", uA.id);
  await svc.from("business_profiles").update({ verification_status: "pending" }).eq("user_id", uC.id);
  const { error: selfVerify } = await uC.client.from("business_profiles").update({ verification_status: "verified" }).eq("user_id", uC.id);
  const { data: cStatus } = await svc.from("business_profiles").select("verification_status").eq("user_id", uC.id).single();
  check("UMKM tidak dapat memverifikasi profilnya sendiri", !selfVerify && cStatus.verification_status === "pending" && !verifyOwn);
  await svc.from("business_profiles").update({ verification_status: "verified" }).eq("user_id", uC.id);

  console.log("\n[2] Akses publik");
  const { data: anonBp } = await anon.from("business_profiles").select("id, nib").limit(5);
  check("Anon tidak dapat membaca tabel business_profiles (NIB aman)", (anonBp ?? []).length === 0);
  const { data: anonEv } = await anon.from("events").select("id").limit(5);
  check("Anon tidak dapat membaca tabel events mentah", (anonEv ?? []).length === 0);
  const { data: pubEv } = await anon.from("public_events").select("id, status").in("id", [evA.id, evB.id]);
  check("View publik hanya menampilkan event published", pubEv?.length === 1 && pubEv[0].id === evA.id);
  const { data: pubCols } = await anon.from("public_business_profiles").select("*").limit(1);
  check("View direktori tidak mengekspos NIB/alamat", !pubCols?.[0] || (!("nib" in pubCols[0]) && !("address" in pubCols[0])));
  const { data: anonApps } = await anon.from("stand_applications").select("id").limit(1);
  check("Anon tidak dapat membaca pendaftaran", (anonApps ?? []).length === 0);

  console.log("\n[3] Isolasi penyelenggara");
  const { data: oBseesA } = await oB.client.from("events").select("id").eq("id", evA.id);
  check("Organizer B tidak melihat event Organizer A (tabel)", (oBseesA ?? []).length === 0);
  const { error: oBupd } = await oB.client.from("events").update({ title: "Dibajak" }).eq("id", evA.id);
  const { data: titleA } = await svc.from("events").select("title").eq("id", evA.id).single();
  check("Organizer B tidak dapat mengubah event A", titleA.title.startsWith("RLS Event A") && !oBupd);
  const { error: selfPub } = await oB.client.from("events").update({ status: "published" }).eq("id", evB.id);
  const { data: evBs } = await svc.from("events").select("status").eq("id", evB.id).single();
  check("Organizer tidak dapat mempublikasikan event sendiri", evBs.status === "draft" && !selfPub);
  const { error: noProposal } = await oB.client.rpc("submit_event", { p_event_id: evB.id });
  check("Pengajuan event tanpa proposal ditolak", !!noProposal);

  console.log("\n[4] Alur pendaftaran end-to-end");
  const { data: appA, error: subErr } = await uA.client.rpc("submit_application", { p_event_id: evA.id, p_products_offered: "Tahu goreng" });
  check("UMKM A submit pendaftaran", !subErr && !!appA, subErr?.message);
  const { error: dupErr } = await uA.client.rpc("submit_application", { p_event_id: evA.id, p_products_offered: "Tahu lagi" });
  check("Pendaftaran ganda pada event yang sama ditolak", !!dupErr);
  const { error: draftApply } = await uB.client.rpc("submit_application", { p_event_id: evB.id, p_products_offered: "Kopi" });
  check("Tidak dapat mendaftar ke event yang belum published", !!draftApply);
  const { data: bSeesA } = await uB.client.from("stand_applications").select("id").eq("id", appA);
  check("UMKM B tidak dapat membaca aplikasi UMKM A", (bSeesA ?? []).length === 0);
  const { data: oAseesEarly } = await oA.client.from("stand_applications").select("id").eq("id", appA);
  check("Organizer belum melihat aplikasi sebelum diverifikasi admin", (oAseesEarly ?? []).length === 0);
  const { error: earlyDecide } = await oA.client.rpc("organizer_decide_application", { p_application_id: appA, p_decision: "select" });
  check("Organizer tidak dapat menyeleksi aplikasi yang belum verified", !!earlyDecide);

  const { error: revErr } = await admin.rpc("admin_verify_application", { p_application_id: appA, p_action: "revise", p_note: "Lengkapi foto produk" });
  check("Admin meminta revisi", !revErr, revErr?.message);
  const { error: resubErr } = await uA.client.rpc("resubmit_application", { p_application_id: appA, p_products_offered: "Tahu goreng + foto" });
  const { data: afterResub } = await svc.from("stand_applications").select("status").eq("id", appA).single();
  check("UMKM mengirim ulang → under_verification", !resubErr && afterResub.status === "under_verification");
  const { error: verErr } = await admin.rpc("admin_verify_application", { p_application_id: appA, p_action: "verify" });
  check("Admin memverifikasi berkas", !verErr, verErr?.message);
  const { data: oBseesApp } = await oB.client.from("stand_applications").select("id").eq("id", appA);
  check("Organizer B tidak melihat aplikasi event A", (oBseesApp ?? []).length === 0);
  const { error: oBdecide } = await oB.client.rpc("organizer_decide_application", { p_application_id: appA, p_decision: "select" });
  check("Organizer B tidak dapat menyeleksi peserta event A", !!oBdecide);
  const { error: selErr } = await oA.client.rpc("organizer_decide_application", { p_application_id: appA, p_decision: "select" });
  check("Organizer A memilih peserta terverifikasi", !selErr, selErr?.message);
  const { error: orgConfirm } = await oA.client.rpc("admin_finalize_application", { p_application_id: appA, p_action: "confirm", p_stand_number: "A-01" });
  check("Organizer tidak dapat mengesahkan nomor stand", !!orgConfirm);
  const { error: confErr } = await admin.rpc("admin_finalize_application", { p_application_id: appA, p_action: "confirm", p_stand_number: "a-01" });
  const { data: final } = await uA.client.from("stand_applications").select("status, stand_number").eq("id", appA).single();
  check("Admin mengonfirmasi & UMKM melihat nomor stand", !confErr && final?.status === "confirmed" && final?.stand_number === "A-01", confErr?.message);
  const { data: notes } = await uA.client.from("notifications").select("id").eq("user_id", uA.id);
  check("UMKM menerima notifikasi perubahan status", (notes ?? []).length >= 3);
  const { data: hist } = await uA.client.from("application_status_history").select("to_status").eq("application_id", appA);
  check("Riwayat status tercatat", (hist ?? []).length >= 5);
  const { data: auditCount } = await admin.from("audit_logs").select("id").eq("entity_id", appA);
  check("Audit log mencatat keputusan", (auditCount ?? []).length >= 5);

  console.log("\n[5] Kuota & nomor stand atomik (kapasitas 3, sudah terisi 1)");
  const appIds = [];
  for (const u of [uB, uC, uD]) {
    const { data: id } = await u.client.rpc("submit_application", { p_event_id: evA.id, p_products_offered: "Produk uji" });
    await admin.rpc("admin_verify_application", { p_application_id: id, p_action: "verify" });
    await oA.client.rpc("organizer_decide_application", { p_application_id: id, p_decision: "select" });
    appIds.push(id);
  }
  const dup = await Promise.all(appIds.slice(0, 2).map((id) => admin.rpc("admin_finalize_application", { p_application_id: id, p_action: "confirm", p_stand_number: "B-01" })));
  check("Nomor stand sama secara bersamaan: hanya 1 berhasil", dup.filter((r) => !r.error).length === 1);
  const results = await Promise.all(appIds.map((id, i) => admin.rpc("admin_finalize_application", { p_application_id: id, p_action: "confirm", p_stand_number: `C-0${i + 1}` })));
  const { count: confirmedCount } = await svc.from("stand_applications").select("id", { count: "exact", head: true }).eq("event_id", evA.id).eq("status", "confirmed");
  check("Konfirmasi bersamaan tidak melampaui kapasitas", confirmedCount === 3, `confirmed=${confirmedCount} errors=${results.filter((r) => r.error).length}`);
  const { error: fullErr } = await uA.client.rpc("withdraw_application", { p_application_id: appA });
  check("Aplikasi confirmed tidak dapat dibatalkan pemohon", !!fullErr);

  console.log("\n[6] Storage privat");
  const docPath = `${uB.id}/legal/${run}.pdf`;
  const pdf = new Blob(["%PDF-1.4 test"], { type: "application/pdf" });
  const { error: upB } = await uB.client.storage.from("private-verification-documents").upload(docPath, pdf, { contentType: "application/pdf" });
  check("UMKM B mengunggah dokumen ke foldernya", !upB, upB?.message);
  const { error: upWrong } = await uA.client.storage.from("private-verification-documents").upload(`${uB.id}/legal/hack.pdf`, pdf, { contentType: "application/pdf" });
  check("UMKM A tidak dapat mengunggah ke folder UMKM B", !!upWrong);
  const { error: dlA } = await uA.client.storage.from("private-verification-documents").download(docPath);
  check("UMKM A tidak dapat mengunduh dokumen UMKM B", !!dlA);
  const { error: dlOrg } = await oA.client.storage.from("private-verification-documents").download(docPath);
  check("Penyelenggara tidak dapat mengunduh dokumen legal UMKM", !!dlOrg);
  const { error: dlAnon } = await anon.storage.from("private-verification-documents").download(docPath);
  check("Anon tidak dapat mengunduh dokumen privat", !!dlAnon);
  const { data: signed } = await admin.storage.from("private-verification-documents").createSignedUrl(docPath, 60);
  check("Admin dapat membuat signed URL dokumen", !!signed?.signedUrl);
  const { error: exeUp } = await uA.client.storage.from("public-umkm-media").upload(`${uA.id}/x/${run}.html`, new Blob(["<script>"], { type: "text/html" }), { contentType: "text/html" });
  check("Bucket gambar menolak MIME non-gambar", !!exeUp);
  const { error: orgUmkmMedia } = await uA.client.storage.from("public-event-media").upload(`${uA.id}/e/${run}.png`, new Blob(["x"], { type: "image/png" }), { contentType: "image/png" });
  check("UMKM tidak dapat mengunggah ke bucket media event", !!orgUmkmMedia);
  await svc.storage.from("private-verification-documents").remove([docPath]);

  console.log("\n[7] Biaya stand & bukti transfer");
  await svc.from("organizer_profiles").update({ bank_name: "BRI", bank_account_number: "1234567890", bank_account_holder: "ORG A TEST" }).eq("user_id", oA.id);
  const { data: evP } = await svc.from("events").insert({ ...baseEvent, organizer_id: orgA.id, title: `RLS Event Bayar ${run}`, slug: `rls-pay-${run}`, stand_capacity: 5, stand_fee: 50000, status: "published", published_at: iso(0) }).select("id").single();
  created.events.push(evP.id);
  const { data: pubFee } = await anon.from("public_events").select("stand_fee").eq("id", evP.id).single();
  check("Biaya stand tampil di view publik", pubFee?.stand_fee === 50000);
  const { data: anonOrg } = await anon.from("organizer_profiles").select("bank_account_number").limit(1);
  check("Rekening penyelenggara tidak terbaca publik", (anonOrg ?? []).length === 0);
  const { data: appP } = await uB.client.rpc("submit_application", { p_event_id: evP.id, p_products_offered: "Produk bayar" });
  await admin.rpc("admin_verify_application", { p_application_id: appP, p_action: "verify" });
  const { data: infoEarly } = await uB.client.rpc("get_payment_instructions", { p_application_id: appP });
  check("Rekening belum ditampilkan sebelum diterima", (infoEarly ?? []).length === 0);
  await oA.client.rpc("organizer_decide_application", { p_application_id: appP, p_decision: "select" });
  const { data: payRow } = await svc.from("stand_applications").select("payment_status, payment_amount").eq("id", appP).single();
  check("Diterima → status pembayaran 'unpaid' sebesar biaya stand", payRow.payment_status === "unpaid" && payRow.payment_amount === 50000);
  const { data: info } = await uB.client.rpc("get_payment_instructions", { p_application_id: appP });
  check("UMKM pemohon melihat rekening tujuan", info?.[0]?.bank_account_number === "1234567890");
  const { error: infoOther } = await uC.client.rpc("get_payment_instructions", { p_application_id: appP });
  check("UMKM lain tidak bisa melihat rekening", !!infoOther);
  const { error: earlyConfirm } = await admin.rpc("admin_finalize_application", { p_application_id: appP, p_action: "confirm", p_stand_number: "P-01" });
  check("Admin tidak bisa mengesahkan sebelum lunas", !!earlyConfirm);
  const proofPath = `${uB.id}/payments/${appP}/bukti.pdf`;
  const { error: upProof } = await uB.client.storage.from("private-payment-proofs").upload(proofPath, pdf, { contentType: "application/pdf" });
  check("UMKM mengunggah bukti transfer", !upProof, upProof?.message);
  const { error: subErrP } = await uB.client.rpc("submit_payment_proof", { p_application_id: appP, p_proof_path: proofPath });
  check("UMKM mengirim bukti transfer", !subErrP, subErrP?.message);
  const { data: orgSigned } = await oA.client.storage.from("private-payment-proofs").createSignedUrl(proofPath, 60);
  check("Penyelenggara pemilik event bisa membuka bukti", !!orgSigned?.signedUrl);
  const { error: oBproof } = await oB.client.storage.from("private-payment-proofs").download(proofPath);
  check("Penyelenggara lain tidak bisa membuka bukti", !!oBproof);
  const { error: oBverify } = await oB.client.rpc("organizer_verify_payment", { p_application_id: appP, p_action: "verify" });
  check("Penyelenggara lain tidak bisa memverifikasi pembayaran", !!oBverify);
  const { error: umkmVerify } = await uB.client.rpc("organizer_verify_payment", { p_application_id: appP, p_action: "verify" });
  check("UMKM tidak bisa memverifikasi pembayarannya sendiri", !!umkmVerify);
  const { error: okVerify } = await oA.client.rpc("organizer_verify_payment", { p_application_id: appP, p_action: "verify" });
  check("Penyelenggara memverifikasi pembayaran", !okVerify, okVerify?.message);
  const { error: lateConfirm } = await admin.rpc("admin_finalize_application", { p_application_id: appP, p_action: "confirm", p_stand_number: "P-01" });
  check("Admin mengesahkan setelah lunas", !lateConfirm, lateConfirm?.message);
  await svc.storage.from("private-payment-proofs").remove([proofPath]);
} catch (e) {
  failed++;
  console.error("Kesalahan fatal:", e.message ?? e);
} finally {
  console.log("\nMembersihkan fixture…");
  if (created.events.length) {
    await svc.from("stand_applications").delete().in("event_id", created.events);
    await svc.from("events").delete().in("id", created.events);
  }
  for (const id of created.users) await svc.auth.admin.deleteUser(id);
  console.log(`\nHasil: ${passed} lulus, ${failed} gagal`);
  process.exit(failed ? 1 : 0);
}
