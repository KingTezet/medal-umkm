# QA Checklist — MEDAL

Terakhir dijalankan: 12 Nov 2026. ✅ = dijalankan & lulus · 🟡 = sebagian/manual · ⬜ = belum diuji.

## Otomatis

| Perintah | Hasil |
|---|---|
| `npm run lint` | ✅ 0 error |
| `npm run typecheck` | ✅ 0 error |
| `npm test` | ✅ 27/27 (domain rules, state machine, kuota, nomor stand, validasi Zod, open-redirect, CSV injection) |
| `npm run build` | ✅ |
| `npm run test:rls` (Supabase nyata) | ✅ 44/44 |

### Cakupan `test:rls` (PRD §20.2)

| # | Skenario | Status |
|---|---|---|
| 1 | Publik melihat event published saja & direktori tanpa NIB/alamat | ✅ |
| 2 | UMKM submit pendaftaran; duplikat & event draft ditolak | ✅ |
| 3 | Admin minta revisi | ✅ |
| 4 | UMKM kirim ulang → `under_verification` | ✅ |
| 5 | Organizer hanya melihat & memilih aplikasi `verified` di event miliknya | ✅ |
| 6 | Admin mengesahkan + nomor stand; organizer tidak bisa | ✅ |
| 7 | UMKM melihat hasil, notifikasi, riwayat; audit tercatat | ✅ |
| 8 | Ekspor CSV organizer | 🟡 route diuji 401 tanpa sesi; isi CSV diuji manual |
| 9 | Organizer A ≠ event/aplikasi Organizer B | ✅ |
| 10 | UMKM A ≠ aplikasi/dokumen UMKM B; organizer & anon tidak bisa unduh dokumen legal | ✅ |
| 11 | Non-admin tidak bisa RPC admin, baca audit, naikkan role, verifikasi diri | ✅ |
| 12 | Konfirmasi bersamaan: tidak oversell, nomor stand ganda hanya 1 berhasil | ✅ |
| – | Sign-up dengan metadata `role=admin` → tetap `umkm` | ✅ |
| – | Storage: upload ke folder orang lain, MIME salah, bucket salah role → ditolak | ✅ |

## E2E browser (puppeteer, Chrome lokal) — terhadap production

| Langkah | Hasil |
|---|---|
| Registrasi UMKM via form; validasi gagal tetap mempertahankan isian | ✅ |
| Redirect ke `/dashboard/umkm` setelah daftar | ✅ |
| Simpan profil (NIB) → daftar stand → halaman detail "Pendaftaran terkirim" | ✅ |
| UMKM membuka `/admin` → diarahkan ke dashboard sendiri (`?forbidden=1`) | ✅ |
| Admin login → verifikasi berkas via dialog → UMKM menerima notifikasi | ✅ |
| Halaman admin ter-refresh setelah aksi | ✅ setelah perbaikan `revalidatePath` |
| Tidak ada JS error di console | ✅ |

## Responsif

| Viewport | Halaman | Hasil |
|---|---|---|
| 390×844 | `/`, `/events`, `/umkm`, `/tentang`, `/login`, `/daftar/umkm`, `/admin/pendaftaran` | ✅ tanpa horizontal overflow |
| 1440×900 | beranda, tentang, dashboard UMKM/organizer/admin | ✅ |

## Belum diuji

- ⬜ Safari iOS / Android browser fisik.
- ⬜ Upload file dari perangkat mobile fisik.
- ⬜ Reset password end-to-end (butuh SMTP kustom; SMTP bawaan Supabase hanya ke anggota tim).
- ⬜ Uji beban / performa Lighthouse.

## Redesign v2 (12 Nov 2026) — white-first

| Cek | Hasil |
|---|---|
| Overflow horizontal di 320/375/430/768/1366/1440 px: `/`, `/events`, `/umkm`, `/tentang`, detail event, `/login` | ✅ 0 px semua |
| Dashboard admin/UMKM/penyelenggara 375 & 1440 px | ✅ 0 px; tabel jadi kartu di mobile; bottom nav + drawer |
| `npm run lint`, `typecheck`, `build` | ✅ |
| `npm test` | ✅ 27/27 |
| `npm run test:rls` | ✅ 44/44 |
| E2E UI lokal (daftar → profil → daftar stand → admin verifikasi via dialog → notifikasi) | ✅, 0 JS error |
| Referensi motion TikTok | ⚠️ tidak bisa dibuka dari environment (placeholder saja) — lihat `DESIGN_SYSTEM_V2.md` §0 |
| Screenshot before/after | `docs/screenshots/` |
