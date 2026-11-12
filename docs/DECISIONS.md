# Keputusan & Asumsi Implementasi

Tanggal: 12 November 2026. Default PRD dipakai bila tidak ada arahan lain.

| # | Topik | Keputusan | Alasan |
|---|---|---|---|
| 1 | Nama produk | **MEDAL** — Media, Event, Dagang & Lapak; tetap menyebut "UMKM Sumedang · Disperindag" | Permintaan pemilik |
| 2 | Visual | Palet "ijo mahal": emerald/forest gelap + champagne gold di atas ivory; terracotta hanya aksen. Font Fraunces (display) + Plus Jakarta Sans | Permintaan pemilik; tetap selaras token PRD |
| 3 | Landing mobile | Hero mobile berbentuk link-in-bio (avatar, judul, tumpukan tombol); desktop editorial split + parallax | Permintaan pemilik |
| 4 | Animasi | `motion` (Framer Motion): reveal on scroll, stagger, parallax, count-up. Hormati `prefers-reduced-motion` | Permintaan pemilik; PRD minta animasi tidak mengganggu |
| 5 | Foto | Wikimedia Commons (CC BY/CC BY-SA) disimpan lokal di `/public/images`, kredit di `/tentang#kredit`. Unsplash tidak dapat diakses dari environment | PRD: aset legal & stabil |
| 6 | Konfirmasi email | **Dimatikan** untuk pilot (`enable_confirmations=false`) | SMTP bawaan Supabase hanya mengirim ke anggota tim; pendaftar publik tidak akan menerima email. Aktifkan kembali setelah SMTP kustom dikonfigurasi |
| 7 | Verifikasi penyelenggara | Boleh membuat draft; **mengajukan** event wajib profil organisasi `verified`; publish juga mensyaratkan organizer verified | PRD §25.10 |
| 8 | Syarat minimum daftar stand | WhatsApp, alamat, kecamatan, dan NIB **atau** surat keterangan usaha. Profil usaha tidak wajib `verified` (berkas diverifikasi per pendaftaran); profil `rejected` diblok | PRD §7.1, §9.6–9.7 |
| 9 | Status awal aplikasi | `submitted`; revisi kirim ulang → `under_verification`. Antrean admin = keduanya | PRD §8.2 |
| 10 | Kuota | Dihitung dari aplikasi `confirmed`; dikunci `SELECT … FOR UPDATE` pada baris event saat konfirmasi | PRD §9.5, §9.12 |
| 11 | Nomor stand | Format `^[A-Z0-9][A-Z0-9-]{0,15}$` (mis. `A-01`), disimpan uppercase, unik per event (index `upper(stand_number)`) | PRD §9.11 |
| 12 | Visibilitas aplikasi bagi organizer | Hanya status `verified`, `selected_by_organizer`, `waitlisted`, `confirmed`, atau `rejected` setelah keputusan organizer. Jumlah per status tersedia lewat RPC | PRD §4.2 |
| 13 | Data publik | Dibaca lewat view `public_events` & `public_business_profiles` (kolom aman saja). Tabel mentah tidak punya policy anon | PRD §6.4, §13.3 |
| 14 | Pemohon membaca event | Pemohon dapat membaca baris event yang ia daftari (untuk dashboard) via policy `events_select_applicant` | Riwayat tetap tampil meski event selesai/batal |
| 15 | Pembatalan oleh UMKM | Boleh hingga sebelum `confirmed`; pendaftaran `withdrawn` dapat diajukan ulang (baris yang sama dipakai ulang) | PRD §4.1 |
| 16 | Kategori | Tabel `event_categories` dengan `kind` (`event`/`umkm`), dikelola admin | PRD §12.6 |
| 17 | Konten publik | `platform_settings` key `hero`, `announcement`, `contact` | PRD §7.3 |
| 18 | Kontak resmi Disperindag | Placeholder "menunggu konfirmasi" sampai admin mengisi di `/admin/pengaturan` | PRD §25.1 |
| 19 | Email transaksional | Belum; notifikasi in-app saja | PRD §16 |
| 20 | Ekspor | CSV (UTF-8 BOM, anti formula-injection), tanpa NIB/dokumen | PRD §7.2 |
| 21 | Admin | Hanya lewat `npm run admin:create` (service role, env lokal). Tidak ada UI promosi admin | PRD §13.2 |
| 22 | Anggota tim | Placeholder 7 anggota di `src/data/team.ts` — **perlu diganti** dengan nama/NPM/peran asli | Data belum diberikan |
| 23 | Repo | GitHub **public** `medal-umkm` | Dipilih pemilik (PRD default private) |
