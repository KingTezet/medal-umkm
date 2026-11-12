# MASTER PROMPT — Claude Code

## Project: UMKM Sumedang — Platform Event & Direktori UMKM

Kamu bertindak sebagai **Senior Full-Stack Engineer, Product Designer, Database Engineer, dan QA Engineer**. Bangun aplikasi web production-minded berdasarkan dokumen `PRD_Platform_UMKM_Sumedang.md` yang berada di root repository.

Aplikasi ini adalah platform penghubung Pelaku UMKM dengan Penyelenggara Event dan dikelola oleh Admin Disperindag Kabupaten Sumedang. Ikuti PRD sebagai sumber requirement utama. Jangan mengubah tujuan produk menjadi marketplace/e-commerce.

---

# 1. Cara Kerja dan Aturan Utama

1. **Mulai dengan audit repository.** Periksa struktur folder, `package.json`, dependency, file yang sudah ada, branch, `git status`, remote Git, dan dokumentasi. Jangan menimpa project yang sudah ada tanpa memahami kondisinya.
2. Baca PRD sampai selesai sebelum membuat implementasi. Buat checklist requirement dan mapping halaman, role, database, serta critical flow.
3. Jika repository kosong, inisialisasi project Next.js App Router + TypeScript + Tailwind. Jika sudah ada project yang relevan, pertahankan stack dan struktur yang sehat lalu adaptasikan.
4. Gunakan **Supabase sebagai satu-satunya backend utama**: Auth, PostgreSQL, Row Level Security, dan Storage. Jangan membuat Express/Nest backend terpisah.
5. Gunakan **GitHub CLI (`gh`)** untuk workflow repository. Gunakan **Vercel** sebagai target deployment.
6. Jangan menanyakan ulang keputusan yang sudah dijelaskan dalam PRD. Untuk detail yang belum ditentukan, gunakan default PRD dan catat asumsi di `docs/DECISIONS.md`.
7. Jangan berhenti setelah membuat mockup statis. Seluruh critical flow harus terhubung ke Supabase dan memiliki validasi serta authorization yang benar.
8. Jangan mengklaim fitur selesai, test lulus, repository ter-push, atau deployment berhasil sebelum benar-benar dijalankan dan diverifikasi.
9. Jangan menghapus data atau konfigurasi lama secara destruktif. Buat backup/commit sebelum refactor besar.
10. Jangan memasukkan secret, file dokumen pengguna, atau data sensitif ke Git.
11. Gunakan Bahasa Indonesia untuk UI. Nama variabel, fungsi, tabel, dan code boleh menggunakan Bahasa Inggris secara konsisten.
12. Kerjakan sampai hasil terbaik yang dapat diselesaikan di environment saat ini. Jika suatu langkah membutuhkan autentikasi/manual input pemilik, selesaikan bagian lain yang tidak terblokir, lalu berikan instruksi singkat untuk bagian tersebut.

---

# 2. Produk dan Tiga Role

Implementasikan tiga role akun berikut:

- `umkm`: membuat profil usaha, menemukan event, mendaftar stand, melengkapi dokumen, memantau status.
- `organizer`: membuat profil organisasi, mengajukan event, melihat pendaftar terverifikasi, menyeleksi peserta, ekspor rekap.
- `admin`: Admin Disperindag; review profil/dokumen, review dan publish event, verifikasi pendaftaran, mengesahkan hasil serta nomor stand, mengelola data dan audit.

Pengunjung umum bukan role akun. Pengunjung boleh mengakses halaman publik tanpa login.

**Keamanan wajib:** sign-up publik hanya boleh menghasilkan role `umkm` atau `organizer`. Tidak boleh ada cara bagi user biasa mengirim `role=admin`, mengubah role melalui profile form, local storage, metadata client, atau request langsung. Admin dibuat melalui proses provisioning aman.

---

# 3. UX dan Visual Direction

Gunakan mockup `Website_UMKM_Sumedang.pdf` sebagai referensi struktur dan identitas warna, bukan sebagai desain yang harus disalin mentah. Jika PDF tersedia di workspace, periksa juga visualnya; jika tidak tersedia, PRD sudah memuat ringkasan kebutuhan dan menjadi sumber implementasi utama. Jangan berhenti atau meminta file ulang hanya karena PDF tidak ada.

Arah visual:

- Modern, hangat, editorial, rapi, terpercaya, dan mudah digunakan oleh pelaku UMKM.
- Palet: forest green, warm ivory/off-white, terracotta/orange sebagai aksen, charcoal, pale sage, dan warm sand.
- Hero dan event card harus menggunakan foto relevan (event/bazar/produk UMKM) jika aset tersedia dan legal. Jangan menggunakan gambar acak yang rusak/tidak diverifikasi.
- Tambahkan sistem upload gambar melalui Supabase Storage agar Admin/Penyelenggara/UMKM dapat mengelola foto sesuai permission.
- Jika foto belum tersedia, siapkan fallback lokal yang dirancang dengan baik dan tidak tampak seperti broken image.
- Hindari tampilan template dashboard generik, gradient berlebihan, dekorasi berlebihan, dan animasi yang mengganggu.
- Gunakan whitespace yang cukup, tipografi tegas, hierarchy jelas, grid konsisten, foto yang proporsional, dan CTA yang mudah ditemukan.
- Mobile-first dan harus terlihat matang pada desktop.
- Buat public pages dan dashboard terpisah secara visual tetapi tetap dalam satu design system.

Token warna awal (boleh disempurnakan):

```css
:root {
  --color-forest: #1f624d;
  --color-forest-dark: #174a3b;
  --color-terracotta: #c65316;
  --color-ivory: #fbf8f2;
  --color-surface: #ffffff;
  --color-sage: #e7f0e9;
  --color-sand: #f5e9dd;
  --color-charcoal: #20231f;
  --color-muted: #6c706b;
  --color-border: #e8e3da;
}
```

Jangan menampilkan angka statistik palsu. Semua statistik harus berasal dari query database atau diberi label DEMO dengan jelas.

---

# 4. Sitemap yang Harus Dibangun

## Public

- `/` — Beranda.
- `/events` — Daftar event.
- `/events/[slug]` — Detail event.
- `/umkm` — Direktori UMKM terverifikasi dan public opt-in.
- `/umkm/[slug]` — Detail UMKM.
- `/tentang` — Tentang program.
- `/login` — Login.
- `/daftar` — Pilih tipe akun.
- `/daftar/umkm` — Registrasi UMKM.
- `/daftar/penyelenggara` — Registrasi penyelenggara.
- `/lupa-password` — Reset password.
- `/cek-status` — Protected; redirect ke login jika belum authenticated.
- `/kebijakan-privasi` — Kebijakan privasi.
- `/syarat-ketentuan` — Syarat dan ketentuan.

## UMKM dashboard

- `/dashboard/umkm`
- `/dashboard/umkm/profil`
- `/dashboard/umkm/events`
- `/dashboard/umkm/pendaftaran`
- `/dashboard/umkm/pendaftaran/[id]`
- `/dashboard/umkm/notifikasi`
- `/dashboard/umkm/pengaturan`

## Organizer dashboard

- `/dashboard/penyelenggara`
- `/dashboard/penyelenggara/profil`
- `/dashboard/penyelenggara/events`
- `/dashboard/penyelenggara/events/new`
- `/dashboard/penyelenggara/events/[id]`
- `/dashboard/penyelenggara/events/[id]/peserta`
- `/dashboard/penyelenggara/notifikasi`
- `/dashboard/penyelenggara/pengaturan`

## Admin dashboard

- `/admin`
- `/admin/events`
- `/admin/events/[id]`
- `/admin/umkm`
- `/admin/umkm/[id]`
- `/admin/penyelenggara`
- `/admin/penyelenggara/[id]`
- `/admin/pendaftaran`
- `/admin/pendaftaran/[id]`
- `/admin/kategori`
- `/admin/konten`
- `/admin/pengguna`
- `/admin/audit-log`
- `/admin/pengaturan`

Jangan membuat semua form di beranda. Beranda fokus untuk pengenalan dan discovery. Proses daftar, pengajuan, dan verifikasi ada di halaman khusus.

---

# 5. Alur Bisnis Wajib

## 5.1 Pengajuan Event

1. Organizer membuat akun dan melengkapi profil organisasi.
2. Organizer membuat event dengan status `draft`.
3. Organizer mengisi nama, deskripsi, kategori, cover/galeri, tanggal event, periode pendaftaran, lokasi, kapasitas stand, kriteria, kontak, dan mengunggah proposal PDF.
4. Organizer mengirim pengajuan → `pending_review`.
5. Admin meninjau dan memilih:
   - `published`: event muncul di website publik.
   - `revision_required`: organizer memperbaiki dan mengirim kembali.
   - `rejected`: ditolak beserta alasan.
6. Hanya event `published` yang boleh tampil pada halaman publik.

Status event:

`draft`, `pending_review`, `revision_required`, `published`, `rejected`, `cancelled`, `completed`.

## 5.2 Pendaftaran Stand UMKM

1. UMKM registrasi dan melengkapi profil usaha satu kali.
2. UMKM memilih event published yang sedang membuka pendaftaran.
3. Sistem memvalidasi profil, tanggal, kapasitas, dan duplikasi.
4. UMKM submit → `submitted` / antrean `under_verification`.
5. Admin memeriksa dokumen:
   - `verified`
   - `revision_required`
   - `rejected`
6. Hanya aplikasi `verified` yang bisa diproses oleh organizer.
7. Organizer memilih:
   - `selected_by_organizer`
   - `waitlisted`
   - `rejected`
8. Admin memeriksa hasil, memastikan kapasitas, menentukan nomor stand, dan finalisasi → `confirmed`.
9. UMKM melihat timeline dan nomor stand final.

Status aplikasi:

`submitted`, `under_verification`, `revision_required`, `verified`, `selected_by_organizer`, `waitlisted`, `rejected`, `confirmed`, `withdrawn`.

Jangan mengubah pembagian kewenangan ini tanpa alasan kuat dan dokumentasikan keputusan bila ada kebutuhan baru.

---

# 6. Database Supabase dan Migrations

Buat seluruh schema menggunakan **Supabase CLI migrations** yang versioned, bukan hanya membuat tabel manual di dashboard.

Minimal tabel:

1. `profiles`
2. `business_profiles`
3. `organizer_profiles`
4. `events`
5. `stand_applications`
6. `notifications`
7. `audit_logs`
8. `platform_settings` (opsional bila konten/kontak publik ingin dikelola admin)
9. `event_categories` (opsional bila kategori dinamis diperlukan)

Ikuti definisi kolom, status, relasi, dan constraints di PRD. Tambahkan index untuk kolom filter/search/foreign key yang relevan. Gunakan UUID, timestamp, foreign key, unique, check constraint, dan updated-at trigger seperlunya.

Ketentuan database penting:

- `profiles.id` referensi `auth.users.id`.
- Setiap account hanya memiliki role valid.
- Sign-up trigger tidak boleh menerima `admin` dari metadata user.
- Satu `business_profile` per user pada MVP.
- Unique `(event_id, business_profile_id)` pada `stand_applications`.
- Unique partial `(event_id, stand_number)` jika nomor stand tidak null.
- Validasi kapasitas dan konfirmasi stand harus atomic di database (gunakan RPC/transaction/row lock yang benar).
- Status transition harus divalidasi, tidak cukup hanya mengganti status melalui update bebas.
- `available_stands` dihitung dari kapasitas dikurangi `confirmed`, jangan menyimpan angka sisa yang bisa stale.
- Simpan `business_snapshot` saat aplikasi dibuat agar riwayat tidak berubah ketika profil usaha diedit.
- Waktu database UTC; formatting UI menggunakan `Asia/Jakarta`.

Buat Supabase generated TypeScript types dan gunakan pada query/mutation. Jangan memakai `any` sebagai jalan pintas untuk tipe database.

---

# 7. Row Level Security (RLS) — WAJIB

Aktifkan RLS pada seluruh tabel yang dapat diakses melalui Supabase client. Buat policy least-privilege.

- Public hanya bisa membaca event `published`.
- Public hanya bisa membaca UMKM `verified` dengan `is_public=true` dan hanya field yang aman dipublikasikan.
- UMKM hanya bisa membaca/mengubah profil dan aplikasi miliknya.
- Organizer hanya bisa mengelola event miliknya.
- Organizer hanya bisa membaca aplikasi untuk event miliknya dan mengambil keputusan pada aplikasi yang sudah `verified`.
- Admin bisa mengakses data operasional sesuai kewenangan.
- Notifications hanya bisa dibaca dan ditandai oleh penerima.
- Audit log hanya bisa dibaca admin; penulisan dilakukan melalui server/function terpercaya.
- User tidak bisa mengubah `profiles.role` atau `account_status` miliknya sendiri.

Buat helper/function yang aman untuk pemeriksaan role, misalnya `is_admin()` atau fungsi setara. Jika menggunakan `SECURITY DEFINER`, tetapkan `search_path` secara eksplisit dan batasi grant execute.

**Jangan membuat policy `USING (true)` pada tabel privat atau tabel yang mengandung PII.** Jangan berasumsi middleware cukup untuk keamanan. Uji RLS dari sesi user yang berbeda.

---

# 8. Supabase Storage

Buat bucket:

- `public-event-media` — cover/galeri event, public read; upload hanya organizer pemilik event/admin.
- `public-umkm-media` — foto publik usaha/produk; public read; upload hanya pemilik/admin.
- `private-verification-documents` — NIB/surat usaha/dokumen organisasi; private.
- `private-event-proposals` — proposal/izin event; private.
- `private-application-documents` — dokumen tambahan aplikasi; private.

Aturan:

- Gunakan signed URL singkat untuk file privat.
- Storage path harus memudahkan verifikasi ownership, misalnya user ID/entity ID.
- Validasi MIME type dan ukuran file pada client dan server.
- PDF untuk dokumen; JPG/PNG/WebP untuk gambar.
- Jangan pernah membuat dokumen legal dapat diakses publik.
- Jangan expose service role key di client.

---

# 9. Authentication dan Authorization

- Gunakan Supabase Auth email/password.
- Gunakan `@supabase/ssr` untuk server/client browser session yang benar.
- Implementasikan route protection dan role-aware layout.
- Buat helper yang konsisten seperti `getCurrentProfile`, `requireAuth`, `requireRole`, `assertOwnership`.
- Redirect user ke dashboard role yang sesuai setelah login.
- Jika user login ke route dashboard role berbeda, kembalikan ke dashboard yang benar atau tampilkan 403.
- Admin tidak tersedia pada pilihan daftar.
- Provision admin melalui script server-only yang membaca env lokal secara aman atau lewat Supabase Dashboard. Jangan hardcode email/password admin pada kode.
- Implementasikan reset password dan callback redirect yang sesuai.

---

# 10. Kebutuhan UI per Area

## Public homepage

Buat beranda dengan urutan:

1. Header dengan wordmark “UMKM Sumedang” dan penanda “Disperindag”.
2. Hero editorial dengan headline kuat, deskripsi, dua CTA, dan foto UMKM/event yang relevan.
3. Alur singkat empat langkah.
4. Event yang sedang dibuka (3–4 kartu dari database).
5. Direktori UMKM pilihan (4–6 kartu dari database).
6. Dua CTA role: pelaku UMKM dan penyelenggara event.
7. Angka statistik hanya dari data aktual.
8. Footer kontak resmi dan tautan kebijakan.

## Event discovery

- Filter kategori, status pendaftaran, tanggal, dan lokasi.
- Search keyword.
- Card image, title, date, location, capacity/remaining, status, CTA.
- Empty state dan skeleton.
- Detail event memuat syarat, kriteria, jadwal, lokasi, foto, dan CTA daftar.

## UMKM directory

- Hanya UMKM verified dan public opt-in.
- Search dan filter kategori/wilayah.
- Detail profil menampilkan foto, deskripsi, produk, dan kontak hanya jika diizinkan.

## UMKM dashboard

- Ringkasan status profil dan aplikasi.
- Form profil lengkap, upload dokumen privat, foto publik, privacy toggle.
- Daftar event terbuka.
- Form pendaftaran stand.
- List aplikasi, detail aplikasi, timeline, revisi, nomor stand.
- Notifikasi.

## Organizer dashboard

- Ringkasan event dan peserta.
- Form profil organisasi.
- Event table dengan status.
- Form event terstruktur/multi-section, image upload, proposal PDF.
- Review peserta yang sudah verified.
- Seleksi, waitlist, reject dengan catatan.
- Export CSV.

## Admin dashboard

- Statistik operasional dari database.
- Queue pengajuan event.
- Queue verifikasi UMKM dan aplikasi.
- Review organizer.
- Finalisasi peserta dan nomor stand.
- Manajemen data, user, konten sederhana, kategori, audit log.

---

# 11. Design System dan Komponen

Bangun reusable component untuk:

- Public header/footer.
- Dashboard sidebar/topbar/mobile nav.
- Event card, UMKM card.
- Status label dengan teks eksplisit.
- Search/filter toolbar.
- Data table.
- Breadcrumb.
- Form field, select, textarea, checkbox, date/time inputs.
- Upload zone dengan preview.
- Stepper/timeline status.
- Dialog konfirmasi.
- Toast/feedback.
- Skeleton, empty, error, loading, 403, 404, 500 states.

Pakai satu sistem spacing, typography, radius, border, dan color tokens. Hindari style berbeda-beda untuk setiap halaman. Semua komponen interaktif harus benar-benar berfungsi.

---

# 12. Validasi dan Business Logic

Gunakan Zod schemas yang reusable untuk validasi di client/server.

Validasi wajib:

- Email, password, phone/WhatsApp.
- Nama usaha dan organisasi wajib.
- Slug unik.
- Event end date setelah start date.
- Registration close setelah registration open.
- Stand capacity lebih besar dari 0.
- Upload file berdasarkan MIME type dan ukuran.
- Event published dan periode pendaftaran sedang aktif sebelum aplikasi dibuat.
- Satu usaha tidak boleh daftar dua kali pada event yang sama.
- Organizer tidak dapat mengubah status aplikasi yang belum verified.
- Nomor stand wajib dan unik saat admin mengonfirmasi.
- Kapasitas event tidak boleh terlampaui.

Jalankan semua pengecekan penting di server/database. Client validation hanya untuk UX, bukan keamanan.

---

# 13. Notifications, Audit, dan Export

## In-app notifications

Buat notifikasi saat:

- Event diajukan, direvisi, disetujui, ditolak, atau dibatalkan.
- Profil UMKM/organizer diverifikasi atau diminta revisi.
- Aplikasi stand dikirim, diminta revisi, verified, dipilih, waitlist, rejected, confirmed.
- Nomor stand ditetapkan.

Notifikasi memiliki link ke halaman yang membutuhkan autentikasi dan authorization.

## Audit log

Catat minimal:

- Admin publish/revise/reject event.
- Admin verify/revise/reject UMKM atau aplikasi.
- Organizer select/waitlist/reject peserta.
- Admin confirm dan assign stand.
- Suspend/reactivate user.

## Export

- CSV wajib untuk rekap peserta.
- Scope export hanya event milik organizer yang sedang login atau admin.
- Kolom sesuai PRD.
- Jangan memasukkan NIB, dokumen privat, secret, atau data login.

---

# 14. Testing Wajib

Buat test untuk validasi, helper authorization, status transition, kuota, nomor stand, dan akses ownership.

Lakukan E2E/smoke test untuk:

1. Public browse event dan UMKM.
2. UMKM register/login/profile/application.
3. Admin verify atau minta revisi aplikasi.
4. UMKM resubmit setelah revisi.
5. Organizer melihat peserta verified dan memilih peserta.
6. Admin finalisasi dan menetapkan nomor stand.
7. UMKM melihat hasil akhir.
8. Organizer export peserta event sendiri.
9. Organizer A tidak dapat melihat event/aplikasi organizer B.
10. UMKM A tidak dapat membaca aplikasi/dokumen UMKM B.
11. Non-admin tidak dapat mengakses admin endpoints atau menaikkan role.
12. Kapasitas tidak bisa oversell pada konfirmasi bersamaan.

Jika tool testing/browser tidak tersedia, jalankan lint, typecheck, build, test suite yang ada, dan dokumentasikan manual test yang belum bisa dilakukan. Jangan menandai test yang tidak dijalankan sebagai lulus.

---

# 15. Development Workflow

## Tahap A — Repository audit dan rencana

- Inspect repository dan environment.
- Baca PRD.
- Buat `docs/IMPLEMENTATION_PLAN.md` berisi milestone dan checklist.
- Buat `docs/DECISIONS.md` untuk asumsi yang belum ditentukan.
- Berikan ringkasan temuan singkat, lalu mulai implementasi tanpa menunggu konfirmasi untuk keputusan yang sudah ada di PRD.

## Tahap B — Foundation

- Setup/rapikan Next.js App Router dan TypeScript strict.
- Setup Tailwind dan design tokens.
- Setup Supabase client, server client, middleware/session refresh.
- Buat migrations, schema, RLS, storage policies, generated types.
- Buat role-aware layouts dan guards.
- Buat auth screens.

## Tahap C — Public experience

- Build beranda, daftar event, detail event, direktori UMKM, detail UMKM, tentang, footer.
- Hubungkan semua data public ke Supabase.
- Buat fallback foto dan empty/loading/error states.
- Implementasikan metadata SEO.

## Tahap D — User workflows

- Build dashboard UMKM dan organizer.
- Implementasikan profile forms dan uploads.
- Implementasikan event submission dan admin review.
- Implementasikan stand applications dan verification.
- Implementasikan organizer selection dan admin finalization.
- Implementasikan notification dan export.

## Tahap E — Admin, hardening, QA

- Build dashboard admin dan CRUD/review screens.
- Audit RLS, server actions, ownership, storage, status transitions.
- Test semua critical flows.
- Run formatter, lint, typecheck, tests, production build.
- Fix semua error yang ditemukan.
- Review responsive layout desktop/mobile.

## Tahap F — GitHub CLI

1. Cek `git status`, branch, dan remote terlebih dahulu.
2. Jika belum ada Git repository, jalankan `git init` dan buat `.gitignore` yang benar.
3. Jalankan `gh auth status`.
4. Jika belum ada remote GitHub, buat repository **private** dengan nama `umkm-sumedang-platform` (atau nama project existing bila sudah ditentukan) menggunakan GitHub CLI.
5. Jika remote sudah ada, jangan mengganti atau membuat repository duplikat. Verifikasi remote sebelum push.
6. Buat commit per milestone dengan pesan jelas.
7. Push ke branch utama setelah build dan test lulus.
8. Jangan pernah force push tanpa instruksi eksplisit.
9. Jangan commit `.env`, `.env.local`, service role key, dokumen upload, atau data sensitif.

Contoh alur CLI hanya jika kondisi repository sesuai:

```bash
gh auth status
git status
git remote -v
# Jika belum ada remote dan repo belum ada:
gh repo create umkm-sumedang-platform --private --source=. --remote=origin --push
```

Jangan jalankan `gh repo create` jika remote sudah terhubung.

## Tahap G — Supabase dan Vercel deployment

- Verifikasi Supabase project yang digunakan; jangan menimpa project/database lain.
- Jalankan migration dengan Supabase CLI setelah memastikan target project benar.
- Generate types dan cek konsistensi.
- Set environment variables di Vercel melalui dashboard/CLI; jangan menulis secret ke file tracked.
- Hubungkan GitHub repository ke Vercel atau gunakan Vercel CLI.
- Deploy preview terlebih dahulu.
- Jalankan smoke test pada preview: home, events, login/callback, dashboard, RLS, upload, aplikasi, seleksi, finalisasi.
- Deploy production setelah preview lolos dan credentials tersedia.
- Catat production URL, preview URL, commit SHA, migration status, env variables yang dibutuhkan (nama saja), dan rollback steps.

Jika belum login ke GitHub/Vercel/Supabase, tetap selesaikan kode, migrations, build, dan dokumentasi yang bisa diselesaikan. Berikan perintah persis yang perlu dijalankan pemilik untuk membuka blokir deployment. Jangan mengarang URL production.

---

# 16. Definition of Done

Sebuah milestone hanya selesai jika:

- UI terimplementasi dan responsive.
- Data benar-benar terhubung ke Supabase jika membutuhkan data.
- Validasi berjalan.
- Authorization dan ownership berjalan di server/database.
- Loading, empty, success, dan error states tersedia.
- TypeScript/lint/build tidak memiliki error baru.
- Critical path terkait sudah diuji.
- Dokumentasi diperbarui.

Aplikasi dianggap MVP complete ketika seluruh Acceptance Criteria pada `PRD_Platform_UMKM_Sumedang.md` terpenuhi.

---

# 17. Deliverables yang Harus Ada

Minimal repository berisi:

- Aplikasi Next.js yang berjalan.
- `README.md` dengan setup lokal dan deployment.
- `.env.example` tanpa secret.
- `.gitignore` aman.
- `supabase/migrations/*` untuk schema, triggers, RLS, functions, storage policies.
- `supabase/seed.sql` untuk data demo (tanpa akun admin rahasia).
- Supabase generated types.
- `docs/PRD_Platform_UMKM_Sumedang.md` (salin PRD ke repository).
- `docs/IMPLEMENTATION_PLAN.md`.
- `docs/DECISIONS.md`.
- `docs/QA_CHECKLIST.md`.
- `docs/DEPLOYMENT.md`.
- UI public dan dashboard untuk ketiga role.
- Test untuk business logic dan authorization.

---

# 18. Format Laporan Akhir Claude Code

Pada akhir pekerjaan, tulis laporan dengan struktur:

1. **Ringkasan:** apa yang berhasil dibangun.
2. **Halaman selesai:** kelompok public, UMKM, organizer, admin.
3. **Database:** migration yang dibuat dan status apply.
4. **Security:** ringkasan RLS, role guard, storage policy, dan hasil test akses.
5. **Testing:** perintah yang dijalankan dan hasil aktual (lint/typecheck/test/build/E2E).
6. **GitHub:** repository, visibility, branch, commit terakhir, status push. Jangan mengklaim jika belum terjadi.
7. **Vercel:** preview/production URL hanya jika benar-benar berhasil deploy.
8. **Environment variables:** tulis nama variabel yang dibutuhkan, jangan tulis nilainya.
9. **Known issues:** semua yang belum selesai, belum teruji, atau membutuhkan keputusan Disperindag.
10. **Next actions:** langkah manual yang masih perlu dilakukan pemilik.

**Mulai sekarang:** audit repository, baca PRD, buat implementation plan, lalu implementasikan platform secara bertahap sampai critical flow berfungsi. Jangan berhenti pada desain visual saja.
