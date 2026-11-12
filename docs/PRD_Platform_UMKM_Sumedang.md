# PRODUCT REQUIREMENTS DOCUMENT (PRD)

# Platform Pemberdayaan UMKM Kabupaten Sumedang

**Nama produk:** UMKM Sumedang — Platform Event & Direktori UMKM  
**Pemilik/administrator utama:** Dinas Perindustrian dan Perdagangan Kabupaten Sumedang (Disperindag)  
**Jenis produk:** Public website + role-based web application  
**Versi dokumen:** 1.0  
**Tanggal:** 12 November 2026  
**Status:** Product specification untuk implementasi MVP  
**Dokumen acuan:** `Website_UMKM_Sumedang.pdf` dan brief kebutuhan pemilik produk.

---

## 1. Ringkasan Produk

Platform UMKM Sumedang adalah sistem digital satu pintu yang mempertemukan **pelaku UMKM** dengan **penyelenggara event**, dengan **Disperindag Kabupaten Sumedang** sebagai pengelola dan pihak yang melakukan verifikasi serta pengawasan.

Melalui platform ini:

- Pelaku UMKM dapat menemukan event yang sedang membuka pendaftaran stand, membuat profil usaha satu kali, mendaftar ke event, mengunggah dokumen yang diperlukan, dan memantau hasil seleksi.
- Penyelenggara dari komunitas, EO, desa, atau instansi dapat mengajukan event, menunggu verifikasi Disperindag, mengelola pendaftar yang telah lolos pemeriksaan dokumen, menentukan peserta, dan mengunduh rekap peserta.
- Admin Disperindag dapat memverifikasi akun/profil, meninjau proposal event, memublikasikan event, memverifikasi pendaftaran UMKM, mengesahkan hasil seleksi, mengatur nomor stand, serta memantau aktivitas platform.
- Masyarakat umum dapat melihat informasi event dan direktori UMKM tanpa harus login.

Produk ini **bukan marketplace/e-commerce**. MVP tidak memproses pembayaran, komisi, checkout produk, atau transaksi jual beli. Fokusnya adalah informasi, pengajuan, pendaftaran stand, verifikasi, seleksi, dan pelaporan peserta.

## 2. Latar Belakang dan Masalah

Berdasarkan konsep pada mockup, proses pencarian event dan pendaftaran stand perlu disatukan dalam satu kanal. Informasi event, syarat, kuota, dokumen, dan status pendaftaran perlu mudah ditemukan serta dipantau.

Masalah yang ingin diselesaikan:

1. Informasi event dan kesempatan berjualan UMKM tersebar di berbagai kanal.
2. Pelaku UMKM kesulitan mengetahui event yang sedang membuka pendaftaran dan sisa kuota stand.
3. Data usaha yang sama berpotensi diminta berulang kali pada setiap pendaftaran.
4. Penyelenggara membutuhkan mekanisme pengajuan event dan pengelolaan peserta yang terstruktur.
5. Disperindag membutuhkan ruang untuk memverifikasi pengajuan, memantau proses, dan menyimpan riwayat keputusan.
6. Pelaku UMKM membutuhkan status yang transparan mulai dari berkas diterima sampai hasil akhir dan nomor stand.

## 3. Tujuan Produk

### 3.1 Tujuan utama

- Menyediakan satu portal resmi untuk informasi event dan pendaftaran stand UMKM Kabupaten Sumedang.
- Mempermudah penyelenggara mengajukan event serta mengelola peserta.
- Memberikan kontrol verifikasi dan monitoring kepada Disperindag.
- Menyediakan direktori UMKM yang dapat menjadi media pengenalan produk dan usaha.
- Mengurangi proses manual, pengulangan pengisian data, dan ketidakjelasan status pendaftaran.

### 3.2 Indikator keberhasilan MVP

Angka target operasional berikut adalah rekomendasi awal dan dapat disesuaikan Disperindag setelah sistem digunakan.

- Pengunjung dapat menemukan event yang relevan tanpa login.
- UMKM dapat menyelesaikan pendaftaran akun, melengkapi profil usaha, dan mengajukan stand secara online.
- Setiap pendaftaran memiliki status dan riwayat perubahan yang dapat dilihat pemiliknya.
- Penyelenggara dapat melihat peserta yang sudah diverifikasi, mengambil keputusan seleksi, dan mengunduh rekap.
- Admin dapat menyelesaikan verifikasi event serta pendaftaran tanpa mengubah database secara manual.
- Tidak ada pengguna non-admin yang dapat mengakses dokumen privat atau data milik akun lain.
- Aplikasi dapat digunakan dengan baik pada perangkat mobile dan desktop.

### 3.3 Bukan tujuan MVP

- Marketplace, katalog dengan keranjang belanja, pembayaran, invoice, atau pengiriman produk.
- Sistem keuangan dan pencairan dana bantuan.
- Chat real-time antara seluruh pengguna.
- Blog/CMS artikel yang kompleks.
- Portofolio perusahaan atau halaman tim internal.
- Sistem QR check-in, presensi hari-H, penilaian juri kompleks, atau ticketing pengunjung.
- Aplikasi mobile native.

## 4. Pengguna dan Hak Akses

Ada **tiga role akun**. Pengunjung publik bukan role akun dan tidak perlu login untuk membaca konten publik.

### 4.1 Pelaku UMKM (`umkm`)

Tujuan: mendaftarkan usaha dan mengikuti event.

Hak akses:

- Mendaftar dan login.
- Membuat, melihat, dan memperbarui profil usaha miliknya.
- Mengunggah logo, foto produk, foto usaha, NIB, atau surat keterangan usaha.
- Menentukan apakah profil usaha boleh tampil di direktori publik.
- Melihat event yang sudah dipublikasikan.
- Mengajukan satu pendaftaran stand per usaha per event.
- Melihat status, catatan revisi yang ditujukan kepadanya, nomor stand, dan riwayat status.
- Memperbarui data pendaftaran jika diminta revisi, selama status memungkinkan.
- Membatalkan pendaftaran sendiri sebelum batas/status yang ditetapkan.
- Mengelola notifikasi dan data akunnya.

Tidak boleh:

- Melihat data privat UMKM lain.
- Mengubah status verifikasi atau hasil seleksi.
- Mengakses dashboard penyelenggara/admin.
- Mengubah role akun sendiri.

### 4.2 Penyelenggara Event (`organizer`)

Tujuan: mengajukan dan mengelola event serta peserta.

Hak akses:

- Mendaftar dan login sebagai penyelenggara.
- Mengelola profil organisasi miliknya.
- Membuat draft pengajuan event dan mengunggah proposal/izin PDF.
- Mengirim pengajuan event untuk diverifikasi Disperindag.
- Melihat status pengajuan dan catatan revisi.
- Mengelola event miliknya sesuai status dan batasan admin.
- Melihat daftar pendaftar pada event miliknya. Data yang diperlukan untuk seleksi ditampilkan setelah dokumen UMKM diverifikasi admin.
- Menyetujui untuk seleksi, menolak, atau memasukkan pendaftar ke daftar tunggu sesuai kuota.
- Melihat ringkasan kuota dan mengunduh rekap peserta.

Tidak boleh:

- Memublikasikan event sendiri tanpa persetujuan Disperindag.
- Mengakses atau mengunduh dokumen legal privat UMKM kecuali ada izin dan kebutuhan yang secara eksplisit disetujui dalam kebijakan.
- Melihat atau mengubah event milik penyelenggara lain.
- Mengubah hasil verifikasi admin atau mengesahkan nomor stand final.
- Mengubah role akun sendiri.

### 4.3 Admin Disperindag (`admin`)

Tujuan: mengelola dan mengawasi platform.

Hak akses:

- Mengakses dashboard admin.
- Melihat ringkasan event, UMKM, penyelenggara, pendaftaran, dan aktivitas.
- Memeriksa profil dan dokumen UMKM.
- Memeriksa profil penyelenggara serta proposal/izin event.
- Meminta revisi, menyetujui, atau menolak pengajuan sesuai kewenangan.
- Memublikasikan event yang telah memenuhi persyaratan.
- Memverifikasi dokumen pendaftaran UMKM.
- Mengawasi hasil seleksi penyelenggara dan mengesahkan hasil akhir.
- Mengalokasikan nomor stand dan memastikan kuota tidak terlampaui.
- Mengelola kategori, syarat/ketentuan, konten informasi publik, dan akun sesuai kewenangan.
- Melihat audit log.

Admin tidak dibuat melalui pendaftaran publik. Akun admin dibuat melalui proses provisioning yang aman.

### 4.4 Matriks hak akses ringkas

| Fitur/Data | Publik | UMKM | Penyelenggara | Admin |
|---|---:|---:|---:|---:|
| Lihat beranda, event terbit, direktori UMKM publik | Ya | Ya | Ya | Ya |
| Membuat akun UMKM | - | Ya | - | - |
| Membuat akun penyelenggara | - | - | Ya | - |
| Mengelola profil usaha sendiri | - | Ya | - | Admin dapat meninjau |
| Mengelola profil organisasi sendiri | - | - | Ya | Admin dapat meninjau |
| Mendaftar stand | - | Ya | - | Admin dapat memantau |
| Meninjau dokumen legal UMKM | - | Pemilik | Tidak secara default | Ya |
| Mengajukan event | - | - | Ya | Dapat membuat/mengelola |
| Menyetujui publikasi event | - | - | Tidak | Ya |
| Menyeleksi pendaftar terverifikasi | - | - | Ya, event sendiri | Dapat mengawasi |
| Mengesahkan hasil dan nomor stand | - | - | Tidak | Ya |
| Mengelola seluruh akun dan data | - | - | - | Ya |

## 5. Struktur Website dan Sitemap

Pisahkan halaman publik, halaman autentikasi, dan dashboard per role. Jangan menumpuk semua form pada halaman beranda seperti mockup awal.

### 5.1 Area publik

| URL | Halaman | Tujuan dan konten utama |
|---|---|---|
| `/` | Beranda | Hero, CTA cari event/daftar, alur singkat, event unggulan, angka ringkas, kategori UMKM, cuplikan direktori, informasi Disperindag, footer. |
| `/events` | Daftar event | Semua event terbit, pencarian, filter status/kategori/tanggal/lokasi, sorting. |
| `/events/[slug]` | Detail event | Foto cover/galeri, deskripsi, tanggal, lokasi, periode pendaftaran, kategori, kuota, syarat, kontak, CTA daftar stand. |
| `/umkm` | Direktori UMKM | Kumpulan profil usaha yang disetujui dan memilih tampil publik, pencarian dan filter kategori/wilayah. |
| `/umkm/[slug]` | Detail UMKM | Profil, deskripsi, kategori, produk, foto, lokasi umum, kontak publik bila diizinkan. |
| `/tentang` | Tentang program | Penjelasan singkat tujuan platform, alur layanan, peran Disperindag, dan kontak resmi. |
| `/login` | Masuk | Login email/password atau metode yang diaktifkan. |
| `/daftar` | Pilih jenis akun | Dua pilihan: Pelaku UMKM atau Penyelenggara Event. |
| `/daftar/umkm` | Registrasi UMKM | Akun dan data dasar usaha. Profil dapat dilengkapi setelah registrasi. |
| `/daftar/penyelenggara` | Registrasi penyelenggara | Akun dan informasi organisasi. |
| `/lupa-password` | Reset password | Meminta tautan reset password. |
| `/cek-status` | Cek status | Jika belum login, arahkan ke login. Setelah login, tampilkan pendaftaran milik UMKM. Tidak ada pencarian status publik dengan nomor WhatsApp/NIB. |
| `/kebijakan-privasi` | Kebijakan privasi | Penjelasan data yang dikumpulkan dan penggunaannya. |
| `/syarat-ketentuan` | Syarat & ketentuan | Ketentuan penggunaan platform dan proses seleksi. |

### 5.2 Dashboard UMKM

| URL | Halaman | Fungsi |
|---|---|---|
| `/dashboard/umkm` | Ringkasan | Status profil, event aktif, jumlah pendaftaran, pengumuman dan CTA. |
| `/dashboard/umkm/profil` | Profil usaha | Informasi usaha, kategori, alamat, NIB/surat usaha, logo dan galeri. |
| `/dashboard/umkm/events` | Cari event | Daftar event yang sedang membuka pendaftaran. |
| `/dashboard/umkm/pendaftaran` | Pendaftaran saya | Tabel/kartu semua pendaftaran dan statusnya. |
| `/dashboard/umkm/pendaftaran/[id]` | Detail pendaftaran | Timeline status, dokumen, catatan admin, catatan seleksi, dan nomor stand. |
| `/dashboard/umkm/notifikasi` | Notifikasi | Riwayat pemberitahuan akun. |
| `/dashboard/umkm/pengaturan` | Pengaturan akun | Nama, email, nomor kontak, keamanan akun. |

### 5.3 Dashboard Penyelenggara

| URL | Halaman | Fungsi |
|---|---|---|
| `/dashboard/penyelenggara` | Ringkasan | Status akun, total event, event aktif, jumlah peserta, agenda mendatang. |
| `/dashboard/penyelenggara/profil` | Profil organisasi | Nama, jenis, deskripsi, alamat, kontak, dokumen legal. |
| `/dashboard/penyelenggara/events` | Event saya | Daftar draft, menunggu verifikasi, terbit, revisi, selesai. |
| `/dashboard/penyelenggara/events/new` | Ajukan event | Form multi-section untuk data event dan proposal. |
| `/dashboard/penyelenggara/events/[id]` | Detail/kelola event | Ringkasan event, status, kuota, peserta, dan tindakan sesuai status. |
| `/dashboard/penyelenggara/events/[id]/peserta` | Kelola peserta | Pendaftar, filter status, detail ringkas, seleksi, waitlist, export. |
| `/dashboard/penyelenggara/notifikasi` | Notifikasi | Pemberitahuan status event dan pendaftar. |
| `/dashboard/penyelenggara/pengaturan` | Pengaturan akun | Data login dan keamanan. |

### 5.4 Dashboard Admin Disperindag

| URL | Halaman | Fungsi |
|---|---|---|
| `/admin` | Dashboard | Statistik inti dan antrean yang perlu ditindaklanjuti. |
| `/admin/events` | Manajemen event | Semua event, filter status, pencarian, dan tindakan admin. |
| `/admin/events/[id]` | Review event | Detail pengajuan, proposal, riwayat review, setujui/revisi/tolak/publikasi. |
| `/admin/umkm` | Data UMKM | Direktori internal, filter verifikasi, profil dan dokumen. |
| `/admin/umkm/[id]` | Review UMKM | Data usaha, dokumen, verifikasi, catatan internal. |
| `/admin/penyelenggara` | Data penyelenggara | Daftar organisasi dan status verifikasi. |
| `/admin/penyelenggara/[id]` | Detail penyelenggara | Profil dan dokumen, tindakan verifikasi. |
| `/admin/pendaftaran` | Semua pendaftaran | Monitoring seluruh event dan status aplikasi. |
| `/admin/pendaftaran/[id]` | Review pendaftaran | Dokumen dan data pendaftaran, verifikasi, hasil seleksi, penetapan nomor stand. |
| `/admin/kategori` | Kategori | Pengaturan kategori event/UMKM jika diperlukan. |
| `/admin/konten` | Konten publik | Mengelola teks beranda, informasi program, kontak, dan pengumuman sederhana. |
| `/admin/pengguna` | Pengguna | Aktivasi/suspend akun dan pengelolaan akses non-admin. Tidak ada promosi role admin melalui UI publik. |
| `/admin/audit-log` | Audit log | Riwayat tindakan penting. |
| `/admin/pengaturan` | Pengaturan | Identitas Disperindag, kontak publik, dan konfigurasi platform. |

## 6. Detail Kebutuhan Halaman Publik

### 6.1 Beranda (`/`)

Tujuan: dalam beberapa detik pengunjung memahami fungsi platform dan menemukan langkah berikutnya.

Urutan section yang direkomendasikan:

1. **Header / navigation**
   - Logo/wordmark “UMKM Sumedang” dengan penanda Disperindag.
   - Navigasi: Beranda, Event, Direktori UMKM, Tentang.
   - CTA: Masuk dan tombol utama “Daftar Stand” atau “Ajukan Event”.
   - Mobile memakai menu yang ringkas.
2. **Hero section**
   - Headline yang langsung menjelaskan manfaat, misalnya: “Temukan Event. Perluas Pasar. Tumbuhkan UMKM Sumedang.”
   - Deskripsi satu hingga dua kalimat.
   - CTA “Jelajahi Event” dan “Daftarkan Usaha”.
   - Foto editorial asli/berlisensi yang relevan: bazar, produk lokal, aktivitas pelaku UMKM. Gunakan overlay secukupnya agar teks tetap terbaca.
3. **Quick value / alur singkat**
   - Empat langkah: buat akun dan profil usaha, pilih event, verifikasi Disperindag, terima hasil dan nomor stand.
4. **Event pilihan**
   - 3–4 event terbit dengan foto cover, nama, tanggal, lokasi, status pendaftaran, dan sisa kuota jika datanya valid.
   - CTA ke halaman daftar event.
5. **Jelajahi produk dan UMKM lokal**
   - 4–6 kartu UMKM terverifikasi yang telah mengizinkan publikasi.
   - Foto produk/usaha lebih dominan daripada dekorasi.
6. **Section peran pengguna**
   - Dua CTA yang jelas: “Saya Pelaku UMKM” dan “Saya Penyelenggara Event”.
7. **Informasi program / angka ringkas**
   - Hanya menampilkan angka yang bersumber dari database dan disetujui admin. Jangan menampilkan angka demo seolah data resmi.
8. **Footer**
   - Nama Disperindag Kabupaten Sumedang, alamat, WhatsApp/telepon, email, tautan penting, kebijakan privasi.

### 6.2 Daftar event (`/events`)

- Menampilkan event dengan status `published` dan belum disembunyikan/dibatalkan.
- Kartu event wajib memiliki cover/fallback, judul, kategori, tanggal, lokasi, status pendaftaran, dan CTA detail.
- Filter: Semua, Pendaftaran Dibuka, Segera Dibuka, Ditutup/Selesai; kategori; rentang tanggal; kata kunci/lokasi.
- Search dan filter harus bekerja terhadap data Supabase, bukan hanya tampilan.
- Pagination atau load-more yang accessible.
- Event yang belum dibuka boleh tampil dengan tanggal pembukaan, tetapi tombol daftar nonaktif.
- Event yang pendaftarannya tutup tidak dapat menerima aplikasi baru.

### 6.3 Detail event (`/events/[slug]`)

- Cover image dan galeri.
- Nama event, penyelenggara, kategori, jadwal, dan lokasi.
- Status pendaftaran dan periode pendaftaran.
- Kapasitas stand, jumlah terkonfirmasi, dan sisa kapasitas yang dihitung dari data aktual.
- Deskripsi event.
- Syarat dan kriteria seleksi yang jelas.
- Informasi kontak penyelenggara yang disetujui untuk publik.
- CTA “Daftar Stand”. Jika belum login, arahkan ke login lalu kembali ke event. Jika profil belum lengkap, arahkan ke halaman profil terlebih dahulu.
- Jangan memperlihatkan daftar nama pendaftar kepada publik.

### 6.4 Direktori UMKM (`/umkm`)

- Hanya tampilkan profil dengan `is_public = true` dan `verification_status = verified`.
- Kartu memuat foto, nama usaha, kategori, dan kecamatan/lokasi umum.
- Filter berdasarkan kategori dan wilayah yang datanya tersedia.
- Jangan tampilkan NIB, dokumen legal, email login, atau alamat pribadi yang ditandai privat.

### 6.5 Detail UMKM (`/umkm/[slug]`)

- Foto/logo usaha, cover, galeri produk, deskripsi, kategori, dan lokasi publik.
- Daftar produk/layanan dapat berupa nama dan deskripsi singkat, bukan katalog pembelian.
- WhatsApp/tautan sosial hanya tampil jika pemilik menyetujui publikasi.
- Tidak ada fitur chat internal di MVP.

### 6.6 Registrasi

Halaman `/daftar` menampilkan dua pilihan akun dengan deskripsi singkat.

**UMKM:** email, password, nama lengkap penanggung jawab, WhatsApp, nama usaha, kategori, kecamatan/alamat usaha, deskripsi ringkas, pilihan NIB atau surat keterangan usaha. Form dapat dibuat bertahap. Data yang belum lengkap dapat disimpan dan dilanjutkan dari dashboard.

**Penyelenggara:** email, password, nama penanggung jawab, WhatsApp, nama organisasi, jenis organisasi (Komunitas, EO, Desa, Instansi, Lainnya), alamat, deskripsi, dokumen legal/proposal dasar bila dipersyaratkan admin.

Ketentuan:

- Role dipilih melalui alur registrasi yang disediakan, tetapi role `admin` tidak pernah dapat dipilih.
- Verifikasi email mengikuti konfigurasi Supabase Auth.
- Setelah daftar, pengguna diarahkan ke dashboard sesuai role.
- Akun yang menunggu pemeriksaan tidak boleh melakukan tindakan yang membutuhkan status terverifikasi.

## 7. Detail Fitur Dashboard

### 7.1 Dashboard UMKM

**Ringkasan:** status profil usaha, jumlah pendaftaran aktif, event yang pendaftarannya sedang terbuka, status pendaftaran terbaru.

**Profil usaha:**

- Nama usaha.
- Slug/URL publik (dibuat otomatis dan dapat diubah jika belum dipakai).
- Kategori usaha.
- Deskripsi usaha.
- Nama penanggung jawab.
- Nomor WhatsApp.
- Alamat usaha, desa/kelurahan, kecamatan, Kabupaten Sumedang.
- NIB (opsional jika memilih surat keterangan usaha sebagai pengganti; format mengikuti ketentuan yang ditetapkan admin).
- Upload NIB atau surat keterangan usaha.
- Logo dan foto produk/usaha.
- Persetujuan menampilkan profil di direktori publik.
- Status verifikasi profil dan catatan revisi.

Data profil digunakan kembali ketika mendaftar event. Data pendaftaran menyimpan snapshot informasi penting saat pengajuan agar perubahan profil setelahnya tidak mengubah rekam historis pendaftaran.

**Pendaftaran stand:**

- Tombol daftar hanya aktif jika event published, tanggal pendaftaran valid, kuota masih tersedia, profil UMKM memenuhi syarat minimum, dan pengguna tidak memiliki aplikasi aktif/duplikat pada event tersebut.
- Form berisi event terpilih, ringkasan data usaha, produk yang akan dijual, deskripsi produk, kebutuhan khusus (opsional), dokumen tambahan bila diwajibkan, pernyataan kebenaran data, dan persetujuan ketentuan.
- Setelah submit, tampilkan nomor registrasi dan status.
- Pemilik dapat melihat timeline: Berkas diterima → Verifikasi Disperindag → Seleksi penyelenggara → Hasil akhir & nomor stand.
- Catatan revisi harus spesifik dan dapat ditindaklanjuti.

### 7.2 Dashboard Penyelenggara

**Pengajuan event:**

- Nama event dan slug.
- Ringkasan serta deskripsi lengkap.
- Kategori event.
- Foto cover dan galeri.
- Tanggal mulai/selesai event.
- Tanggal mulai/akhir pendaftaran stand.
- Nama tempat, alamat, kecamatan.
- Jumlah stand disediakan.
- Kriteria/syarat peserta.
- Informasi kontak.
- Proposal/izin dalam PDF (dokumen privat).
- Kontak WhatsApp penyelenggara.
- Persetujuan bahwa informasi yang diberikan benar.

Alur: Simpan draft → Kirim pengajuan → Menunggu review Disperindag → Revisi bila diminta → Disetujui dan dipublikasikan / Ditolak.

**Kelola peserta:**

- Tampilkan aplikasi untuk event milik penyelenggara tersebut saja.
- Pisahkan tab/filter: Menunggu verifikasi, Siap diseleksi, Dipilih, Daftar tunggu, Ditolak, Final.
- Penyelenggara hanya dapat mengambil keputusan seleksi pada aplikasi berstatus `verified`.
- Penyelenggara dapat melihat informasi usaha yang dibutuhkan untuk seleksi, ringkasan produk, dan foto publik. Dokumen legal sensitif tetap menjadi kewenangan verifikasi admin.
- Keputusan: Pilih peserta (`selected_by_organizer`), masukkan daftar tunggu (`waitlisted`), atau tolak (`rejected`). Catatan alasan disimpan.
- Perubahan keputusan harus tercatat di audit log dan menghasilkan notifikasi.
- Penyelenggara tidak mengisi nomor stand final. Nomor stand ditetapkan admin setelah hasil seleksi.

**Ekspor:**

- CSV dan/atau XLSX (pilih satu format utama untuk MVP jika implementasi terbatas; CSV wajib).
- Kolom minimal: nomor, nama usaha, kategori, nama penanggung jawab, WhatsApp yang disetujui untuk kebutuhan event, produk, status seleksi, nomor stand jika sudah ditetapkan.
- Ekspor dibatasi untuk event milik penyelenggara.
- Jangan sertakan NIB, password, token, atau dokumen privat.

### 7.3 Dashboard Admin Disperindag

**Dashboard ringkasan:**

- Total UMKM terdaftar dan terverifikasi.
- Total penyelenggara dan status verifikasinya.
- Event menunggu review, event terbit, event berlangsung/selesai.
- Pendaftaran stand berdasarkan status.
- Antrean tindakan: pengajuan event baru, dokumen UMKM yang perlu direview, hasil seleksi yang menunggu pengesahan.
- Grafik sederhana hanya bila datanya nyata dan label rentang waktu jelas.

**Review event:**

- Buka detail event dan proposal PDF.
- Periksa kelengkapan, tanggal, kapasitas, kriteria, lokasi, dan identitas penyelenggara.
- Tindakan: minta revisi, tolak, setujui dan publikasikan.
- Catatan review wajib diisi untuk revisi/penolakan.
- Event published tidak dapat diedit pada bagian sensitif tanpa audit trail. Perubahan besar dapat mengembalikan status ke review.

**Review UMKM dan aplikasi:**

- Periksa NIB/surat usaha dan data profil.
- Verifikasi bahwa domisili usaha berada di Kabupaten Sumedang sesuai dokumen/kebijakan.
- Periksa kecocokan kategori/produk dengan event serta kriteria tambahan yang ditetapkan event.
- Tindakan: verifikasi, minta revisi, atau tolak dengan alasan.
- Dokumen hanya dapat dibaca oleh pemilik dan admin yang berwenang.

**Pengesahan hasil:**

- Lihat peserta yang dipilih penyelenggara.
- Pastikan kapasitas event tidak terlampaui.
- Tetapkan nomor stand yang unik dalam event tersebut.
- Konfirmasi hasil. Status aplikasi berubah menjadi `confirmed`.
- Aplikasi waitlist dapat dipromosikan jika ada kapasitas kosong.
- Sistem menolak nomor stand duplikat dan konfirmasi di atas kapasitas.

**Pengelolaan konten:**

- Pengaturan identitas dan kontak publik Disperindag.
- Pengumuman singkat di beranda.
- Kategori dan daftar kriteria yang dipakai sistem.
- Konten kebijakan dapat menggunakan file/halaman statis pada MVP jika CMS tidak diperlukan.

## 8. Alur Bisnis dan State Machine

### 8.1 Alur penyelenggara mengajukan event

1. Penyelenggara membuat akun.
2. Penyelenggara mengisi profil organisasi dan mengunggah dokumen yang diminta.
3. Penyelenggara membuat event sebagai `draft`.
4. Penyelenggara mengirim event; status menjadi `pending_review`.
5. Admin memeriksa proposal dan informasi event.
6. Admin memilih:
   - `published`: event muncul di publik dan pendaftaran dapat dibuka berdasarkan jadwal.
   - `revision_required`: penyelenggara memperbaiki dan mengirim ulang.
   - `rejected`: pengajuan ditolak dengan catatan.
7. Event yang terbit dapat menerima pendaftaran dalam periode yang ditentukan.
8. Setelah event selesai, status dapat diubah menjadi `completed` oleh admin atau otomatis berdasarkan kebijakan waktu yang disepakati.

**Status event:**

- `draft`
- `pending_review`
- `revision_required`
- `published`
- `rejected`
- `cancelled`
- `completed`

### 8.2 Alur UMKM mendaftar stand

1. UMKM membuat akun dan melengkapi profil.
2. UMKM membuka event yang masih menerima pendaftaran.
3. Sistem memeriksa kelengkapan profil, periode, kuota, dan duplikasi.
4. UMKM mengirim aplikasi; status awal `submitted` lalu masuk antrean `under_verification`.
5. Admin memeriksa dokumen dan kelayakan:
   - `verified`: siap diseleksi penyelenggara.
   - `revision_required`: UMKM perlu melengkapi/perbaiki data.
   - `rejected`: tidak memenuhi syarat, disertai alasan.
6. Penyelenggara menyeleksi aplikasi berstatus `verified`:
   - `selected_by_organizer`
   - `waitlisted`
   - `rejected`
7. Admin meninjau hasil pilihan dan kuota, menentukan nomor stand, lalu mengubah menjadi `confirmed`.
8. UMKM menerima notifikasi hasil dan nomor stand.

**Status aplikasi:**

- `submitted`
- `under_verification`
- `revision_required`
- `verified`
- `selected_by_organizer`
- `waitlisted`
- `rejected`
- `confirmed`
- `withdrawn`

**Pemetaan status pada timeline UMKM:**

| Tahap pada UI | Kondisi status |
|---|---|
| Berkas diterima | `submitted` / `under_verification` |
| Verifikasi Disperindag | `under_verification` / `revision_required` / `verified` |
| Seleksi penyelenggara | `verified` / `selected_by_organizer` / `waitlisted` / `rejected` |
| Hasil akhir & nomor stand | `confirmed` atau hasil final `rejected` |

Status final yang ditolak tetap menampilkan alasan dan tahap terjadinya penolakan. `revision_required` harus dapat dikirim ulang dan masuk antrean verifikasi lagi.

### 8.3 Alur revisi

- Revisi event: admin menulis catatan → penyelenggara mengubah draft revisi → kirim ulang → kembali `pending_review`.
- Revisi profil/aplikasi UMKM: admin menulis catatan → UMKM memperbarui data/dokumen → kirim ulang → kembali `under_verification`.
- Simpan catatan internal dan catatan yang dapat dilihat pengguna secara terpisah bila dibutuhkan.

## 9. Aturan Bisnis

1. Satu akun UMKM mengelola satu profil usaha utama pada MVP. Dukungan multi-cabang/multi-usaha menjadi pengembangan berikutnya.
2. Satu usaha hanya boleh memiliki satu aplikasi aktif untuk satu event. Constraint database wajib mencegah duplikasi.
3. Event hanya terlihat publik jika status `published`.
4. Event hanya menerima pendaftaran jika waktu saat ini berada di antara `registration_opens_at` dan `registration_closes_at`, event belum dibatalkan/selesai, dan kapasitas yang tersedia memenuhi aturan pendaftaran.
5. Sisa kuota dihitung dari kapasitas dikurangi jumlah aplikasi `confirmed`, bukan angka manual yang dapat tidak sinkron.
6. UMKM berdomisili di Sumedang dan memiliki NIB atau surat usaha, sesuai syarat pada mockup. Kriteria tambahan dibuat per-event dan ditampilkan secara terbuka.
7. NIB pada mockup disebut 13 digit. Implementasi sebaiknya memvalidasi format berdasarkan jenis dokumen yang dipilih dan aturan admin, serta tidak mewajibkan NIB jika surat usaha menjadi alternatif yang sah.
8. Penyelenggara hanya melihat/mengelola event miliknya.
9. Penyelenggara hanya menyeleksi peserta setelah verifikasi dokumen oleh admin.
10. Admin adalah satu-satunya role yang dapat mengesahkan hasil akhir dan nomor stand.
11. Nomor stand harus unik per event. Penomoran dapat berupa angka atau kode string, misalnya `A-01`; format final dikonfigurasi/disepakati admin.
12. Kapasitas tidak boleh terlampaui meskipun beberapa admin melakukan konfirmasi berdekatan. Proses konfirmasi harus atomik di database.
13. Dokumen legal bersifat privat dan tidak boleh menggunakan URL publik permanen.
14. Profil UMKM hanya ditampilkan di direktori jika telah diverifikasi dan pemilik menyetujui publikasi.
15. Semua perubahan status penting mencatat aktor, waktu, status sebelum/sesudah, dan catatan.
16. Waktu aplikasi disimpan dalam UTC pada database dan ditampilkan dengan zona waktu `Asia/Jakarta`.
17. Data demo/seed harus jelas sebagai data contoh dan tidak boleh disajikan sebagai data resmi Disperindag.
18. Penutupan event, pembatalan, dan perubahan kapasitas setelah pendaftaran berjalan harus melalui aturan admin dan memiliki audit trail.

## 10. Rancangan UI/UX dan Visual Direction

### 10.1 Arah desain

Bangun tampilan sebagai portal layanan publik yang modern, hangat, terpercaya, dan berorientasi pada foto produk lokal. Jangan membuatnya terasa seperti template dashboard admin generik atau landing page SaaS.

**Karakter visual:**

- Modern, bersih, editorial, mudah dibaca.
- Foto event, bazar, produk, makanan, kerajinan, dan pelaku UMKM menjadi elemen visual utama.
- Layout lapang dengan grid konsisten, heading kuat, dan CTA jelas.
- Kartu sederhana dengan border halus, radius moderat, bayangan sangat tipis bila perlu.
- Animasi kecil dan fungsional, bukan dekorasi berlebihan.
- Mobile-first; form panjang dipisahkan menjadi halaman/wizard, tidak dijejalkan di beranda.

**Palet acuan dari mockup:**

- Forest green sebagai warna identitas/CTA sekunder.
- Warm ivory/off-white sebagai latar utama.
- Terracotta/orange sebagai aksen CTA atau highlight.
- Charcoal untuk teks utama.
- Pale green dan warm sand untuk permukaan/section alternatif.

Contoh token awal (boleh disempurnakan):

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

### 10.2 Foto dan aset visual

- Beranda wajib menyediakan hero image yang relevan dengan UMKM/event lokal.
- Kartu event memakai foto cover masing-masing.
- Kartu UMKM memakai logo/foto produk/usaha.
- Admin dan penyelenggara dapat mengunggah serta mengganti foto melalui Supabase Storage.
- Gunakan rasio foto konsisten: hero 16:9 atau 3:2, kartu event 4:3, kartu produk 1:1 atau 4:3.
- Pastikan gambar dikompresi, punya alt text, ukuran responsif, dan lazy-loaded di luar area awal.
- Jangan mengarang foto identitas UMKM/penyelenggara. Data seed harus menggunakan label demo dan gambar placeholder/stock yang memiliki izin penggunaan.
- Jika foto belum tersedia, tampilkan fallback yang dirancang baik (warna lembut, ikon/kategori, bukan gambar rusak).
- Jangan menggunakan URL gambar acak yang tidak diverifikasi atau membuat production bergantung pada layanan placeholder yang tidak stabil.

### 10.3 Komponen penting

- Public header/footer.
- Event card dan event status label.
- UMKM card.
- Filter/search bar.
- Breadcrumb.
- Form field dengan label, helper text, error, dan loading state.
- Upload zone dengan preview dan validasi file.
- Stepper/timeline pendaftaran.
- Dashboard sidebar dan mobile navigation.
- Data table dengan search, filter, pagination, empty state.
- Confirmation dialog untuk keputusan penting.
- Toast/inline feedback.
- Skeleton loading, empty state, error state, 403, 404, dan 500.

### 10.4 Aksesibilitas

- Kontras warna memadai dan tidak hanya mengandalkan warna untuk status.
- Semua input memiliki label.
- Keyboard navigation dan focus ring jelas.
- Tombol memiliki teks aksi yang jelas.
- Gambar informatif memiliki alt text.
- Tabel memiliki header semantik.
- Dialog dapat ditutup dan dioperasikan dengan keyboard.

## 11. Teknologi dan Arsitektur

### 11.1 Stack wajib

| Area | Teknologi |
|---|---|
| Framework | Next.js App Router |
| Bahasa | TypeScript strict mode |
| UI | React + Tailwind CSS |
| Komponen UI | shadcn/ui atau komponen accessible setara, dipakai konsisten |
| Icons | Lucide React |
| Backend / Database | Supabase PostgreSQL |
| Authentication | Supabase Auth |
| File storage | Supabase Storage |
| Server integration | `@supabase/ssr` + `@supabase/supabase-js` |
| Validation | Zod |
| Form | React Hook Form + Zod resolver bila diperlukan |
| Hosting | Vercel |
| Source control | Git + GitHub CLI (`gh`) |
| Database migration | Supabase CLI migrations |

Tidak perlu backend Express terpisah untuk MVP. Gunakan Server Components untuk data read yang sesuai dan Server Actions/Route Handlers untuk mutasi yang perlu pemeriksaan server-side.

### 11.2 Arsitektur tingkat tinggi

```text
Browser (Public / UMKM / Organizer / Admin)
              |
              v
       Next.js App Router
       - Server Components
       - Server Actions
       - Route Handlers
       - Middleware / route protection
              |
              v
        Supabase Platform
       - Auth
       - PostgreSQL + RLS
       - Storage
       - Database functions / RPC
              |
              v
          Vercel Hosting
              |
              v
       GitHub Repository
       (managed via GitHub CLI)
```

### 11.3 Prinsip implementasi

- Semua akses database dari client tetap tunduk pada RLS.
- Data sensitif diambil dan diproses di server.
- Jangan expose `SUPABASE_SERVICE_ROLE_KEY` ke browser.
- Jangan percaya role dari client, local storage, atau user metadata tanpa validasi database.
- Semua mutation penting memeriksa sesi, role, ownership, status state machine, dan validasi Zod.
- Gunakan database constraint/RPC untuk aturan yang harus atomic seperti kuota dan nomor stand.
- Hindari duplikasi business logic antara client dan server.
- TypeScript generated types dari Supabase harus digunakan.

## 12. Rancangan Data Supabase

Nama tabel/kolom berikut adalah rancangan awal yang harus diterapkan melalui migration SQL. Penamaan akhir boleh disesuaikan secara konsisten, tetapi fungsi dan kontrol akses wajib dipertahankan.

### 12.1 `profiles`

Satu profil aplikasi untuk setiap `auth.users`.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | uuid PK/FK | Referensi `auth.users.id` |
| `role` | enum/text | `umkm`, `organizer`, `admin` |
| `full_name` | text | Nama penanggung jawab |
| `phone` | text nullable | Nomor kontak |
| `account_status` | enum/text | `pending`, `active`, `suspended` |
| `created_at` | timestamptz | Otomatis |
| `updated_at` | timestamptz | Otomatis |

Role admin tidak dapat dibuat melalui sign-up publik. Trigger pembuatan profil hanya menerima role publik `umkm` atau `organizer`; nilai lainnya harus ditolak/default aman.

### 12.2 `business_profiles`

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | uuid PK | ID profil usaha |
| `user_id` | uuid FK unique | Pemilik akun UMKM |
| `business_name` | text | Nama usaha |
| `slug` | text unique | URL publik |
| `category` | text | Kategori usaha |
| `description` | text nullable | Deskripsi |
| `products` | jsonb/text | Daftar ringkas produk; validasi struktur |
| `address` | text | Alamat usaha |
| `village` | text nullable | Desa/kelurahan |
| `district` | text | Kecamatan |
| `regency` | text | Default Sumedang, dapat divalidasi |
| `whatsapp` | text | Kontak usaha |
| `nib` | text nullable | NIB jika digunakan |
| `business_license_path` | text nullable | Path dokumen privat |
| `logo_path` | text nullable | Path aset publik |
| `cover_path` | text nullable | Path aset publik |
| `gallery_paths` | jsonb | Daftar path aset publik |
| `is_public` | boolean | Persetujuan tampil di direktori |
| `verification_status` | enum/text | `pending`, `verified`, `revision_required`, `rejected` |
| `verification_note` | text nullable | Catatan yang dapat dilihat pemilik |
| `verified_at` | timestamptz nullable | Waktu verifikasi |
| `created_at` / `updated_at` | timestamptz | Timestamp |

### 12.3 `organizer_profiles`

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | uuid PK | ID organisasi |
| `user_id` | uuid FK unique | Pemilik akun penyelenggara |
| `organization_name` | text | Nama organisasi |
| `organization_type` | text/enum | `community`, `eo`, `village`, `agency`, `other` |
| `description` | text nullable | Deskripsi organisasi |
| `address` | text | Alamat organisasi |
| `district` | text nullable | Kecamatan |
| `contact_phone` | text | Nomor kontak |
| `legal_document_path` | text nullable | Path dokumen privat |
| `verification_status` | enum/text | `pending`, `verified`, `revision_required`, `rejected` |
| `verification_note` | text nullable | Catatan kepada pemilik |
| `verified_at` | timestamptz nullable | Waktu verifikasi |
| `created_at` / `updated_at` | timestamptz | Timestamp |

### 12.4 `events`

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | uuid PK | ID event |
| `organizer_id` | uuid FK | Pemilik/pengaju event |
| `title` | text | Nama event |
| `slug` | text unique | URL detail |
| `summary` | text | Ringkasan |
| `description` | text | Deskripsi lengkap |
| `category` | text | Kategori event |
| `cover_path` | text nullable | Path cover di storage |
| `gallery_paths` | jsonb | Path galeri |
| `venue_name` | text | Nama lokasi |
| `address` | text | Alamat |
| `district` | text nullable | Kecamatan |
| `starts_at` / `ends_at` | timestamptz | Jadwal event |
| `registration_opens_at` | timestamptz | Pendaftaran dibuka |
| `registration_closes_at` | timestamptz | Pendaftaran ditutup |
| `stand_capacity` | integer | Kuota stand, > 0 |
| `criteria` | jsonb | Syarat/kriteria yang ditampilkan publik |
| `proposal_path` | text nullable | Proposal privat |
| `contact_name` | text nullable | Kontak publik jika disetujui |
| `contact_phone` | text nullable | Kontak publik jika disetujui |
| `status` | enum/text | Status event |
| `review_note` | text nullable | Catatan untuk penyelenggara |
| `reviewed_by` | uuid nullable | Admin reviewer |
| `reviewed_at` | timestamptz nullable | Waktu review |
| `published_at` | timestamptz nullable | Waktu publikasi |
| `created_at` / `updated_at` | timestamptz | Timestamp |

`available_stands` tidak disimpan sebagai angka editable. Nilainya dihitung dari `stand_capacity` dikurangi aplikasi yang telah `confirmed`.

### 12.5 `stand_applications`

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | uuid PK | ID aplikasi |
| `application_code` | text unique | Kode referensi non-sensitif |
| `event_id` | uuid FK | Event tujuan |
| `business_profile_id` | uuid FK | Profil usaha pemohon |
| `submitted_by` | uuid FK | User UMKM |
| `business_snapshot` | jsonb | Snapshot data usaha saat daftar |
| `products_offered` | text | Produk yang akan dijual pada event |
| `application_note` | text nullable | Catatan pemohon |
| `additional_document_path` | text nullable | Dokumen tambahan privat |
| `status` | enum/text | Status aplikasi |
| `admin_note` | text nullable | Catatan verifikasi admin yang dapat dilihat pemohon |
| `organizer_note` | text nullable | Catatan keputusan seleksi |
| `stand_number` | text nullable | Nomor stand final |
| `verified_by` | uuid nullable | Admin verifier |
| `organizer_decided_by` | uuid nullable | Penyelenggara pengambil keputusan |
| `confirmed_by` | uuid nullable | Admin pengesah |
| `submitted_at` | timestamptz | Waktu kirim |
| `verified_at` | timestamptz nullable | Waktu verifikasi |
| `organizer_decided_at` | timestamptz nullable | Waktu seleksi |
| `confirmed_at` | timestamptz nullable | Waktu final |
| `created_at` / `updated_at` | timestamptz | Timestamp |

Constraint wajib:

- Unique (`event_id`, `business_profile_id`) agar usaha tidak mendaftar dua kali pada event yang sama.
- Unique partial (`event_id`, `stand_number`) untuk nomor stand non-null.
- Foreign key dan check constraints yang sesuai.
- Status hanya dapat berubah lewat server-side action/RPC yang memvalidasi state machine.

### 12.6 Tabel pendukung

**`notifications`**

- `id`, `user_id`, `title`, `message`, `href`, `read_at`, `created_at`.
- Pengguna hanya dapat membaca/menandai notifikasi miliknya.

**`audit_logs`**

- `id`, `actor_user_id`, `action`, `entity_type`, `entity_id`, `old_values` jsonb, `new_values` jsonb, `note`, `created_at`.
- Insert dari server/RPC terpercaya; tidak boleh diedit oleh pengguna biasa.
- Data audit hanya dapat dilihat admin.

**`platform_settings`** (opsional untuk MVP)

- `key`, `value` jsonb, `updated_by`, `updated_at`.
- Gunakan untuk kontak publik, label, dan pengaturan sederhana; jangan simpan secret di sini.

**`event_categories`** (opsional)

- `id`, `name`, `slug`, `is_active`, `sort_order`.
- Bila kategori cukup statis, enum/konfigurasi kode dapat dipakai pada MVP.

## 13. Supabase Auth, RLS, dan Storage

### 13.1 Authentication

- Gunakan Supabase Auth email/password untuk MVP.
- Email verification mengikuti konfigurasi proyek Supabase.
- Password reset melalui Supabase Auth.
- Session server/client menggunakan `@supabase/ssr` dengan cookie yang aman.
- Role dibaca dari `profiles` di database, bukan hanya dari user metadata.
- Buat helper server `getCurrentProfile()` dan `requireRole()`.
- Route protection adalah kenyamanan UX, bukan satu-satunya lapisan keamanan; RLS dan server actions tetap wajib.

### 13.2 Role provisioning

- Sign-up publik hanya boleh membuat `umkm` atau `organizer`.
- Pengguna tidak boleh mengubah `profiles.role` atau `account_status`.
- Admin dibuat menggunakan script/invite aman dengan Supabase service role dari environment lokal yang tidak dikomit, atau melalui Supabase Dashboard.
- Jangan pernah menyediakan tombol “jadikan admin” di antarmuka publik.
- Script bootstrap admin harus memverifikasi email target secara eksplisit dan aman.

### 13.3 RLS minimum

Aktifkan RLS pada seluruh tabel yang dapat diakses dari Supabase client.

- `profiles`: pengguna hanya membaca/memperbarui field profil non-role miliknya; admin dapat membaca/mengelola semua. Perubahan role/status hanya admin melalui fungsi terpercaya.
- `business_profiles`: pemilik dapat CRUD data miliknya; publik hanya dapat membaca kolom/record yang telah diverifikasi dan `is_public`; admin dapat review semua.
- `organizer_profiles`: pemilik dapat membaca/memperbarui profilnya; admin dapat review semua. Jangan expose dokumen legal ke publik.
- `events`: publik hanya membaca event `published`; organizer hanya mengelola event miliknya pada state yang diizinkan; admin dapat mengelola semua.
- `stand_applications`: UMKM hanya membaca aplikasi miliknya; organizer hanya membaca aplikasi pada event miliknya dan hanya kolom yang diperlukan untuk proses seleksi; admin memiliki akses penuh.
- `notifications`: user hanya membaca/mengubah `read_at` miliknya.
- `audit_logs`: admin read-only; insert melalui function/server terpercaya.
- `platform_settings`: publik hanya membaca key/value yang secara eksplisit aman; perubahan admin saja.

Jangan membuat satu policy luas seperti `USING (true)` untuk tabel yang mengandung data pribadi.

### 13.4 Storage buckets

| Bucket | Akses | Isi |
|---|---|---|
| `public-event-media` | Public read, write hanya pemilik event/admin dengan policy | Cover dan galeri event |
| `public-umkm-media` | Public read, write hanya pemilik profil/admin | Logo, foto usaha, foto produk |
| `private-verification-documents` | Private; pemilik + admin yang berwenang | NIB, surat usaha, dokumen organisasi |
| `private-event-proposals` | Private; penyelenggara pemilik + admin | Proposal dan izin event |
| `private-application-documents` | Private; pemilik UMKM + admin | Dokumen tambahan aplikasi |

- Gunakan signed URL dengan masa berlaku pendek untuk membaca dokumen privat.
- Validasi MIME type dan ukuran file di server.
- Batasi ekstensi berdasarkan kebutuhan: PDF untuk dokumen; JPG/PNG/WebP untuk gambar.
- Gunakan struktur path berbasis user/entity ID agar ownership dapat diverifikasi.
- Hapus file lama saat diganti jika tidak lagi direferensikan dan prosesnya aman.

## 14. Server Actions / Use Cases

Nama endpoint tidak harus identik, tetapi setiap use case berikut wajib ada.

### Public reads

- List published events dengan pagination/filter.
- Get published event by slug.
- Get public UMKM directory dengan filter.
- Get public UMKM by slug.
- Get safe public settings/content.

### UMKM

- Register UMKM.
- Create/update own business profile.
- Upload/delete own public media and private verification document.
- Submit stand application.
- Resubmit application after revision.
- Withdraw application when allowed.
- Read own applications and timeline.
- Mark own notification as read.

### Organizer

- Register organizer.
- Create/update own organizer profile.
- Create/update draft event.
- Submit event for review.
- Resubmit event after revision.
- Read own events and application summaries.
- Select/waitlist/reject verified applicant for own event.
- Export applicants for own event.

### Admin

- List and review organizers/UMKM.
- Verify/revise/reject business and organizer profile.
- Review, publish, revise, reject, cancel events.
- Verify/revise/reject stand applications.
- Review organizer selection and confirm applicant with stand number.
- Manage categories and public settings.
- Suspend/reactivate eligible accounts.
- Read audit logs and dashboard summaries.

## 15. Validasi dan Error Handling

Validasi minimal:

- Email valid dan unik melalui Supabase Auth.
- Password mengikuti minimum Supabase dan kebijakan keamanan proyek.
- Nomor WhatsApp disimpan dalam format yang konsisten; tampilkan format Indonesia yang mudah dibaca.
- Nama usaha/organisasi wajib.
- Slug harus unik dan aman untuk URL.
- Event: `ends_at > starts_at`; `registration_closes_at > registration_opens_at`; tanggal pendaftaran tidak melampaui ketentuan yang ditetapkan; `stand_capacity > 0`.
- Event harus sudah published dan dalam periode pendaftaran untuk menerima aplikasi.
- Jenis file dan ukuran divalidasi di client dan server.
- Hanya pemilik atau admin dapat mengubah dokumen/entitas terkait.
- Penyelenggara tidak dapat memproses aplikasi yang belum `verified`.
- Nomor stand wajib saat konfirmasi dan harus unik per event.
- Jumlah aplikasi confirmed tidak boleh melebihi kapasitas.

Error UX:

- Jangan tampilkan raw database error, stack trace, token, atau secret.
- Tampilkan pesan singkat berbahasa Indonesia dan langkah perbaikan.
- Pertahankan isian form saat validasi gagal jika aman.
- Tampilkan loading, disabled state, retry, empty state, dan success confirmation.
- Tangani expired session, unauthorized, forbidden, network failure, dan file upload failure.

## 16. Notifikasi

MVP menggunakan notifikasi in-app. Email transaksional dapat diaktifkan setelah konfigurasi provider/email Supabase siap.

Trigger notifikasi:

- Registrasi berhasil dan email perlu diverifikasi.
- Profil perlu revisi / berhasil diverifikasi.
- Event berhasil dikirim / perlu revisi / diterbitkan / ditolak.
- UMKM mengirim pendaftaran stand.
- Dokumen aplikasi perlu revisi / terverifikasi / ditolak.
- Penyelenggara memilih / memasukkan waitlist / menolak peserta.
- Admin mengesahkan hasil dan menetapkan nomor stand.
- Event dibatalkan atau mengalami perubahan penting.

Setiap notifikasi memiliki tautan menuju detail yang relevan dan harus memeriksa otorisasi ketika dibuka.

## 17. Keamanan, Privasi, dan Kepatuhan Operasional

- Terapkan least privilege untuk tiga role.
- Lindungi dokumen identitas/legal dengan private storage dan signed URL.
- Jangan tampilkan NIB, dokumen, atau data pribadi di direktori publik.
- Validasi semua input di server; sanitasi konten teks yang ditampilkan.
- Rate-limit endpoint sensitif seperti registrasi, login, upload, dan submit jika fasilitas tersedia.
- Cegah IDOR: setiap query detail/mutasi wajib memeriksa ownership atau role admin.
- Jangan simpan secret pada repository, client bundle, atau log.
- Gunakan environment variables Vercel dan `.env.local` lokal.
- Sediakan kebijakan privasi dan syarat penggunaan sebelum produksi.
- Terapkan audit trail untuk keputusan admin dan penyelenggara.
- Backup database mengikuti kemampuan/plan Supabase yang digunakan; lakukan pengujian pemulihan sebelum go-live.
- Uji RLS menggunakan minimal akun UMKM A, UMKM B, Organizer A, Organizer B, dan Admin.

## 18. Non-Functional Requirements

- **Responsive:** usable pada lebar mobile mulai sekitar 360px, tablet, dan desktop.
- **Performance:** gunakan server rendering untuk halaman publik, optimasi gambar, pagination, query selektif, dan lazy loading.
- **SEO:** metadata per event/UMKM, title/description, Open Graph, sitemap, robots.
- **Reliability:** status dan kuota ditentukan database; jangan bergantung pada state browser.
- **Maintainability:** folder dan komponen terstruktur, TypeScript strict, reusable form/schema, migration versioned.
- **Accessibility:** label form, keyboard support, semantic HTML, focus states, alt text.
- **Localization:** UI Bahasa Indonesia. Format tanggal `id-ID`, timezone `Asia/Jakarta`, mata uang tidak diperlukan pada MVP.
- **Observability:** error logging yang aman dan audit log aplikasi.

## 19. Struktur Folder Rekomendasi

```text
src/
  app/
    (public)/
      page.tsx
      events/
      umkm/
      tentang/
      login/
      daftar/
      cek-status/
      kebijakan-privasi/
      syarat-ketentuan/
    (auth)/
    dashboard/
      umkm/
      penyelenggara/
    admin/
    api/                 # hanya route handlers yang memang diperlukan
  components/
    ui/
    layout/
    public/
    events/
    umkm/
    forms/
    dashboard/
    admin/
  lib/
    supabase/
      client.ts
      server.ts
      middleware.ts
    auth/
    permissions/
    validations/
    utils/
  types/
  styles/

supabase/
  migrations/
  seed.sql

public/
  images/
  icons/
```

Struktur dapat menyesuaikan versi Next.js dan repository yang sudah ada. Hindari membuat satu file page raksasa.

## 20. Testing dan Quality Assurance

### 20.1 Unit/integration tests

- Validasi schema UMKM, penyelenggara, event, dan aplikasi.
- Perhitungan sisa kuota.
- State transition event dan aplikasi.
- Penetapan nomor stand unik dan batas kapasitas.
- Helper authorization dan ownership.

### 20.2 End-to-end critical paths

1. Pengunjung melihat event published dan direktori UMKM.
2. UMKM daftar, login, melengkapi profil, dan submit aplikasi.
3. Admin memeriksa dokumen dan melakukan verifikasi atau meminta revisi.
4. UMKM memperbaiki dan mengirim ulang.
5. Penyelenggara melihat aplikasi yang terverifikasi dan memilih peserta.
6. Admin mengesahkan hasil dan memberi nomor stand.
7. UMKM melihat hasil dan nomor stand.
8. Penyelenggara mengunduh rekap event miliknya.
9. Penyelenggara A tidak dapat melihat event/pendaftar milik Penyelenggara B.
10. UMKM A tidak dapat melihat profil privat, dokumen, atau aplikasi UMKM B.
11. Akun biasa tidak bisa mengakses `/admin` atau mengubah role.
12. Dua proses konfirmasi bersamaan tidak dapat menyebabkan kuota terlampaui/nomor stand duplikat.

### 20.3 Device/browser checks

- Chrome desktop dan mobile.
- Safari macOS/iOS.
- Browser mobile Android.
- Form upload dari desktop dan mobile.

## 21. Seed Data dan Demo

Sediakan seed data yang secara eksplisit diberi label **DEMO**:

- 3–5 event dengan variasi status (hanya yang published muncul di publik).
- 6–10 profil UMKM dengan kategori yang bervariasi.
- 1–2 organizer.
- Beberapa aplikasi untuk menguji setiap status.

Jangan membuat akun admin publik atau menaruh kredensial default di repository. Sediakan instruksi provisioning admin secara aman. Foto dummy gunakan aset yang legal dan stabil atau placeholder desain lokal.

## 22. Deployment: GitHub CLI, Supabase, dan Vercel

### 22.1 Environment variables

Minimal:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=
```

- `SUPABASE_SERVICE_ROLE_KEY` hanya server-side dan tidak boleh menggunakan prefix `NEXT_PUBLIC_`.
- `.env.local` dan semua file secret harus masuk `.gitignore`.
- Sediakan `.env.example` tanpa nilai rahasia.

### 22.2 Supabase setup

1. Buat project Supabase.
2. Simpan URL dan anon/publishable key di environment lokal.
3. Jalankan Supabase CLI dan inisialisasi `supabase/` jika belum tersedia.
4. Buat migration untuk enum, tabel, trigger, index, function/RPC, RLS, storage policy.
5. Apply migration ke project yang benar.
6. Generate TypeScript database types.
7. Buat bucket sesuai spesifikasi.
8. Seed data demo hanya pada environment development/staging.
9. Provision akun admin secara aman.

### 22.3 GitHub CLI workflow

- Periksa `git status`, branch, dan remote sebelum melakukan perubahan remote.
- Jangan menimpa repository/remote yang telah ada.
- Jika repository belum memiliki remote, autentikasi menggunakan `gh auth status`.
- Buat repository GitHub **private secara default** dengan nama yang jelas, misalnya `umkm-sumedang-platform`, kecuali pemilik meminta public.
- Commit bertahap dengan pesan yang informatif.
- Jangan commit `.env.local`, service role key, dokumen pribadi, upload pengguna, database dump, atau file rahasia.
- Push branch utama setelah test lokal lolos.

### 22.4 Vercel deployment

1. Hubungkan repository GitHub ke Vercel atau gunakan Vercel CLI.
2. Set environment variables untuk Production, Preview, dan Development sesuai kebutuhan.
3. Pastikan Supabase redirect URL mencakup domain deployment dan domain produksi.
4. Deploy preview terlebih dahulu.
5. Verifikasi login, callback, RLS, file upload, dan critical flows pada preview.
6. Deploy production setelah acceptance checklist terpenuhi.
7. Catat URL production dan langkah rollback.

## 23. Prioritas Implementasi

### Phase 0 — Foundation

- Setup Next.js, TypeScript, Tailwind, komponen UI, lint, format.
- Setup Supabase clients, auth, migrations, types.
- Role authorization dan route guards.
- Layout public, dashboard UMKM, dashboard organizer, dashboard admin.

### Phase 1 — Public website

- Beranda editorial dengan foto.
- Daftar event dan detail event.
- Direktori UMKM dan detail UMKM.
- Tentang, footer, metadata/SEO.

### Phase 2 — Authentication dan profil

- Registrasi/login/reset password.
- Profil UMKM dan upload media/dokumen.
- Profil penyelenggara dan upload dokumen.
- Status verifikasi profil.

### Phase 3 — Event management

- Penyelenggara membuat draft dan mengirim event.
- Admin review event, revisi, publish, reject.
- Public event listing terhubung ke database.

### Phase 4 — Stand applications

- UMKM submit aplikasi.
- Admin memverifikasi dokumen.
- Penyelenggara menyeleksi peserta.
- Admin menetapkan nomor stand dan konfirmasi.
- Timeline dan notifikasi in-app.

### Phase 5 — Admin reporting dan hardening

- Dashboard statistik.
- Data management dan audit log.
- Export CSV.
- RLS/security tests, E2E tests, responsive audit, SEO, deployment.

**Prioritas MVP:** selesaikan alur bisnis end-to-end terlebih dahulu. Hindari menghabiskan waktu untuk animasi, CMS kompleks, chat, atau fitur yang tidak membantu proses pengajuan dan pendaftaran.

## 24. Acceptance Criteria MVP

MVP dapat dinyatakan siap untuk UAT ketika:

- [ ] Pengunjung dapat melihat beranda, event published, detail event, dan direktori UMKM publik.
- [ ] Semua halaman publik responsive dan memiliki tampilan foto/fallback yang baik.
- [ ] UMKM dapat daftar/login, mengelola profil, mengunggah dokumen, dan menyetujui publikasi profil.
- [ ] UMKM dapat mendaftar event yang memenuhi syarat dan tidak dapat mendaftar event yang tutup/penuh.
- [ ] UMKM dapat melihat timeline dan catatan status pendaftaran.
- [ ] Penyelenggara dapat daftar/login, melengkapi profil, dan mengirim pengajuan event beserta proposal.
- [ ] Event tidak tampil publik sebelum disetujui admin.
- [ ] Admin dapat menyetujui, meminta revisi, atau menolak pengajuan event.
- [ ] Admin dapat memverifikasi, meminta revisi, atau menolak berkas UMKM.
- [ ] Penyelenggara hanya dapat menyeleksi pendaftar yang telah diverifikasi dan hanya pada event miliknya.
- [ ] Admin dapat mengesahkan hasil dan menetapkan nomor stand yang unik tanpa melampaui kuota.
- [ ] Pengguna mendapat notifikasi in-app atas perubahan status penting.
- [ ] Penyelenggara dapat mengekspor rekap peserta event sendiri.
- [ ] RLS dan storage policies sudah diuji menggunakan akun dari tiap role.
- [ ] Akun non-admin tidak dapat menaikkan role sendiri atau mengakses data admin.
- [ ] Tidak ada secret di GitHub repository atau client bundle.
- [ ] Preview Vercel lulus smoke test dan domain produksi dapat diakses.

## 25. Hal yang Perlu Dikonfirmasi Sebelum Go-Live

Bagian berikut belum ditentukan secara pasti dalam mockup dan harus menjadi keputusan Disperindag/pemilik program. Implementasi MVP dapat menggunakan default yang ditulis di bawah, lalu disesuaikan:

1. **Identitas resmi:** logo, alamat kantor, nomor WhatsApp/telepon, email, dan tautan sosial resmi.
2. **Kriteria UMKM:** apakah NIB dan surat keterangan usaha sama-sama diterima; format dan jenis dokumen yang valid.
3. **Wilayah:** daftar kecamatan/desa yang digunakan untuk form dan filter.
4. **Kriteria event:** syarat wajib global dan kriteria khusus per event.
5. **Wewenang final:** PRD menetapkan admin memverifikasi dokumen, penyelenggara menyeleksi, admin mengesahkan dan memberi nomor stand. Pastikan alur ini disetujui pemilik proses.
6. **Penomoran stand:** angka, huruf, zona, atau format lain.
7. **Kebijakan kapasitas:** apakah kuota dihitung saat dipilih penyelenggara atau ketika admin mengesahkan. Default PRD: kuota final dihitung dari aplikasi `confirmed`.
8. **Email notification:** apakah email transaksional harus aktif pada MVP atau notifikasi in-app cukup untuk pilot.
9. **Kebijakan dokumen dan retensi:** masa penyimpanan NIB, proposal, dan berkas pendaftaran.
10. **Status akun:** apakah penyelenggara harus diverifikasi sebelum dapat mengirim event. Default PRD: boleh membuat draft, tetapi pengajuan/publikasi menunggu verifikasi akun.

---

## Lampiran A — Istilah

- **UMKM:** Pelaku usaha mikro, kecil, dan menengah yang mendaftar untuk memperoleh kesempatan stand.
- **Penyelenggara:** Komunitas, EO, desa, instansi, atau organisasi lain yang mengajukan event.
- **Stand:** Slot/lapak yang disediakan dalam suatu event.
- **Verifikasi:** Pemeriksaan dokumen dan kelayakan oleh Disperindag.
- **Seleksi:** Keputusan penyelenggara terhadap peserta UMKM yang sudah diverifikasi.
- **Konfirmasi:** Pengesahan final admin dan penetapan nomor stand.
- **RLS:** Row Level Security pada PostgreSQL Supabase.

## Lampiran B — Prinsip Implementasi yang Tidak Boleh Dilanggar

1. Jangan membangun semua halaman sebagai satu halaman panjang.
2. Jangan menjadikan public visitor sebagai role keempat pada sistem autentikasi.
3. Jangan menggabungkan dashboard tiga role menjadi satu dashboard tanpa permission boundary.
4. Jangan membuat admin role melalui registrasi publik.
5. Jangan mempublikasikan data/dokumen privat UMKM.
6. Jangan memperlihatkan event yang belum disetujui admin.
7. Jangan mengizinkan penyelenggara menyeleksi pendaftar sebelum verifikasi admin.
8. Jangan mengizinkan kuota atau nomor stand terlampaui/duplikat.
9. Jangan menampilkan data dummy sebagai data resmi.
10. Jangan mengklaim deploy berhasil sebelum URL dan critical flows benar-benar diuji.
