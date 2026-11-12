# Implementation Plan — MEDAL

Status per 12 Nov 2026. ✅ selesai & diuji · 🟡 selesai, uji manual terbatas · ⬜ belum.

## Milestone

| Fase | Isi | Status |
|---|---|---|
| A. Audit & rencana | Repo kosong → scaffold Next.js 16; baca PRD/prompt; dokumen ini + DECISIONS | ✅ |
| B. Foundation | TS strict, Tailwind v4 tokens, Supabase SSR client + `proxy.ts`, migrations, RLS, storage, generated types, role guards | ✅ |
| C. Public | Beranda (link-in-bio mobile), `/events`, `/events/[slug]`, `/umkm`, `/umkm/[slug]`, `/tentang` (+tim, kredit), legal, SEO (metadata, OG, sitemap, robots) | ✅ |
| D. Workflow | Registrasi 2 role, profil + upload, pengajuan event, review admin, pendaftaran stand, verifikasi, seleksi, finalisasi, notifikasi, CSV | ✅ |
| E. Admin & hardening | Dashboard, antrean, data UMKM/organizer, pengguna, kategori, konten, audit log; lint/typecheck/test/build | ✅ |
| F. GitHub | `gh repo create medal-umkm --public` + push | lihat DEPLOYMENT |
| G. Deploy | Supabase project `medal-umkm` + Vercel | lihat DEPLOYMENT |

## Mapping requirement → implementasi

| PRD | Implementasi |
|---|---|
| §4 Role & akses | `profiles.role`, trigger `handle_new_user` (whitelist umkm/organizer), `guard_profiles`, `requireRole()` |
| §5 Sitemap | Semua route publik, `/dashboard/umkm/*`, `/dashboard/penyelenggara/*`, `/admin/*` (+ `/admin/notifikasi`, `/dashboard/umkm/events/[id]/daftar`, `/reset-password`, `/auth/callback`, `/api/events/[id]/export`) |
| §8 State machine | RPC: `submit_event`, `admin_review_event`, `submit_application`, `resubmit_application`, `withdraw_application`, `admin_verify_application`, `organizer_decide_application`, `admin_finalize_application`, `admin_review_profile`, `admin_set_account_status` |
| §9 Aturan bisnis | Unique `(event_id, business_profile_id)`, unique partial stand, row lock kuota, snapshot usaha, UTC + Asia/Jakarta |
| §12 Data | `supabase/migrations/2026111200000{1..5}_*.sql` |
| §13 RLS & storage | Migration 2 & 4 & 5; diuji `npm run test:rls` |
| §16 Notifikasi | `_notify`, `_notify_admins` di setiap RPC; halaman notifikasi + badge |
| §20 Testing | `tests/*.test.ts` (27 unit), `scripts/e2e-rls.mjs` (44 assertion integrasi) |

## Belum / berikutnya

- ⬜ Email transaksional (butuh SMTP kustom).
- ⬜ Rate limiting endpoint auth/upload di level aplikasi (Supabase Auth sudah punya rate limit bawaan).
- ⬜ Admin membuat event atas nama penyelenggara (PRD "dapat membuat/mengelola") — saat ini admin meninjau saja.
- ⬜ Penghapusan file storage lama saat diganti.
- ⬜ E2E browser otomatis di CI (saat ini skrip puppeteer manual, lihat QA_CHECKLIST).
