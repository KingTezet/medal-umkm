# MEDAL — Media, Event, Dagang & Lapak

Platform event & direktori UMKM Kabupaten Sumedang. Menghubungkan **pelaku UMKM** dengan **penyelenggara event**, dikelola **Admin Disperindag**. Bukan marketplace — fokus pada informasi event, pendaftaran stand, verifikasi, seleksi, dan nomor lapak final.

- Spesifikasi: [`docs/PRD_Platform_UMKM_Sumedang.md`](docs/PRD_Platform_UMKM_Sumedang.md)
- Rencana & status: [`docs/IMPLEMENTATION_PLAN.md`](docs/IMPLEMENTATION_PLAN.md)
- Keputusan/asumsi: [`docs/DECISIONS.md`](docs/DECISIONS.md)
- QA: [`docs/QA_CHECKLIST.md`](docs/QA_CHECKLIST.md) · Deploy: [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)

## Stack

Next.js 16 (App Router, TypeScript strict) · Tailwind CSS v4 · Motion (animasi scroll/parallax) · Supabase (Auth, Postgres + RLS, Storage, RPC) · Zod · Vitest · Vercel.

## Fitur utama

| Role | Kemampuan |
|---|---|
| Publik | Beranda (mobile ala link-in-bio), daftar & detail event, direktori UMKM, tentang kami + tim |
| UMKM | Registrasi, profil usaha + dokumen privat, daftar stand, timeline status, revisi, batal, notifikasi |
| Penyelenggara | Profil organisasi, draft & ajukan event + proposal PDF, seleksi peserta terverifikasi, ekspor CSV |
| Admin Disperindag | Review/publish event, verifikasi UMKM/penyelenggara/berkas, pengesahan + nomor stand atomik, kategori, konten, pengguna, audit log |

Keamanan: RLS di semua tabel, transisi status hanya lewat RPC `SECURITY DEFINER` dengan `search_path` kosong, trigger penjaga kolom role/status, view publik tanpa PII, storage berbasis folder `{user_id}/…`, signed URL 5 menit.

## Setup lokal

```bash
npm install
cp .env.example .env.local      # isi nilai Supabase
npx supabase link --project-ref <ref>
npx supabase db push            # apply supabase/migrations
npm run db:types                # regenerate src/types/database.ts
npm run admin:create            # butuh ADMIN_EMAIL & ADMIN_PASSWORD di .env.local
npm run seed:demo               # opsional, data berlabel DEMO
npm run dev
```

## Perintah

| Perintah | Fungsi |
|---|---|
| `npm run dev` / `build` / `start` | Next.js |
| `npm run lint` / `typecheck` | ESLint / `tsc --noEmit` |
| `npm test` | Unit test (domain rules, validasi) |
| `npm run test:rls` | Integrasi ke Supabase: RLS, storage, RPC, kuota atomik (membuat & menghapus akun uji) |
| `npm run seed:demo` | Data DEMO |
| `npm run admin:create` | Provisioning admin aman |

## Tim

Data anggota kelompok (nama, NPM, peran) ada di [`src/data/team.ts`](src/data/team.ts) dan tampil di `/tentang#tim`.

## Kredit foto

Foto ilustrasi dari Wikimedia Commons (CC BY / CC BY-SA). Daftar lengkap di [`src/data/credits.ts`](src/data/credits.ts) dan halaman `/tentang#kredit`.
