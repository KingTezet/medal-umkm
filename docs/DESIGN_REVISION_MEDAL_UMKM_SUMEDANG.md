# DESIGN REVISION BRIEF — MEDAL UMKM SUMEDANG
## Tambahan PRD dan arahan redesign untuk Claude Code

**Nama produk:** MEDAL — Media, Event, Dagang & Lapak  
**Konteks:** Platform penghubung pelaku UMKM dan penyelenggara event, dengan Disperindag Kabupaten Sumedang sebagai administrator/pengelola.  
**Dokumen ini:** Addendum desain dan UX. Gunakan bersama `PRD_Platform_UMKM_Sumedang.md` dan `PROMPT_Claude_Code_UMKM_Sumedang.md`.

---

# 1. Tujuan redesign

Redesign website MEDAL yang sudah berjalan. Tampilan saat ini sudah memiliki identitas hijau, tetapi masih terasa seperti hasil generasi AI: terlalu banyak efek dekoratif, kombinasi warna hijau-gold yang kurang elegan, tipografi saling berebut perhatian, komposisi hero terlalu ramai, kartu akses terlalu tebal, dan pengalaman mobile belum rapi.

Arah baru yang wajib dicapai:

- **Putih adalah warna utama.** Website harus terasa terang, bersih, lapang, tenang, dan mudah dipindai.
- **Hijau adalah aksen identitas.** Gunakan hijau tua yang matang dan terasa premium, bukan memenuhi seluruh latar halaman.
- **Hilangkan aksen kuning/emas.** Jangan gunakan tombol gold, garis gold, badge gold, glow kuning, atau gradasi kuning-hijau. Warna kuning pada desain saat ini dianggap tidak sesuai.
- **Sederhana tetapi berkelas.** Kurangi ornamen, efek kaca, blur, glow, border berlapis, dan dekorasi yang tidak membantu pengguna.
- **Mobile-first dan benar-benar responsif.** Bukan sekadar mengecilkan layout desktop. Setiap halaman harus dirancang ulang untuk layar ponsel.
- **Konsisten untuk seluruh role.** Area publik, dashboard UMKM, dashboard penyelenggara, dan dashboard admin Disperindag harus memiliki satu design system.
- **Tetap terasa sebagai platform resmi daerah.** Profesional, ramah untuk pelaku UMKM, dapat dipercaya, dan tidak terlihat seperti landing page startup AI generik.

Jangan mengubah proses bisnis, role, aturan persetujuan, atau skema data yang sudah didefinisikan di PRD utama hanya demi desain. Fokus dokumen ini adalah visual, UX, responsivitas, dan interaksi.

# 2. Referensi yang wajib diperiksa

## Screenshot kondisi saat ini

Gunakan screenshot yang dilampirkan bersama instruksi ini sebagai baseline visual. Screenshot menunjukkan halaman beranda desktop MEDAL pada `localhost:3000`.

Masalah yang perlu diperbaiki dari screenshot:

1. Latar seluruh hero terlalu gelap dan dominan hijau; halaman publik seharusnya mayoritas putih.
2. Aksen gold/kuning pada CTA, garis aktif, dan elemen dekoratif harus dihapus.
3. Judul hero memakai serif besar dengan pemenggalan baris yang terlalu dominan. Hirarki tipografi perlu lebih tenang.
4. Kolase foto, kartu akses cepat, blur, transparansi, dan panel gelap bertumpuk membuat hero terlalu padat.
5. Terlalu banyak elemen bersudut sangat bulat dan efek dekoratif yang membuatnya terasa seperti template AI.
6. Navigasi, CTA, dan konten harus lebih proporsional serta punya jarak yang konsisten.
7. Tampilan mobile harus diperiksa secara terpisah; jangan menganggap layout desktop otomatis akan baik di mobile.

## Referensi animasi

**WAJIB buka dan pelajari referensi berikut sebelum mengimplementasikan motion:**

https://vt.tiktok.com/ZSpHL1twt/

Instruksi untuk Claude Code:
- Coba buka tautan tersebut menggunakan browser yang tersedia di lingkungan kerja.
- Jika tautan pendek mengalihkan ke halaman lain, ikuti redirect dan amati video/referensi yang dimaksud.
- Pelajari karakter gerak, timing, transisi, easing, dan cara elemen muncul/berinteraksi.
- Adaptasikan prinsip motion yang relevan ke MEDAL; jangan menyalin mentah tampilan atau identitas visual referensi.
- Jika tautan tidak dapat diakses dari lingkungan Claude Code, laporkan keterbatasannya secara eksplisit. Jangan mengaku sudah melihat referensi. Tetap implementasikan motion yang dijelaskan pada dokumen ini sebagai fallback.

# 3. Arah visual dan design tokens

## 3.1 Palet warna

Gunakan palet berikut sebagai dasar. Boleh menyesuaikan sedikit setelah melihat keseluruhan UI, tetapi jangan menggeser arah menjadi kuning, krem, atau hijau gelap full-screen.

| Token | Nilai awal | Penggunaan |
|---|---|---|
| `--color-primary` | `#174B3A` | Tombol utama, link aktif, ikon penting, aksen brand |
| `--color-primary-hover` | `#103B2D` | Hover/focus tombol hijau |
| `--color-primary-soft` | `#EAF2EE` | Latar lembut untuk icon container atau selected state |
| `--color-primary-border` | `#C9DAD1` | Border selected state |
| `--color-page` | `#FFFFFF` | Latar utama halaman |
| `--color-surface` | `#FFFFFF` | Kartu dan panel |
| `--color-surface-muted` | `#F7F9F8` | Section alternatif yang sangat tipis |
| `--color-text` | `#18231E` | Heading dan teks utama |
| `--color-text-muted` | `#68756E` | Deskripsi dan metadata |
| `--color-border` | `#E5EBE7` | Border dan separator |
| `--color-success` | `#26734D` | Status berhasil |
| `--color-warning` | `#946515` | Peringatan/status perlu perhatian, hanya jika dibutuhkan |
| `--color-danger` | `#B54747` | Error/penolakan |

Aturan warna:
- 80–90% area halaman publik harus putih atau neutral-white.
- Hijau digunakan sebagai aksen terukur, bukan sebagai latar seluruh halaman.
- Jangan memakai gold/yellow sebagai warna brand atau CTA.
- Hindari gradient. Gunakan warna solid.
- Jangan gunakan teks abu-abu terlalu pucat sehingga sulit dibaca.
- Status harus dibedakan dengan label teks dan ikon, bukan warna saja.
- Status warning boleh memakai warna amber yang redup secara semantik, tetapi bukan sebagai dekorasi atau warna brand.

## 3.2 Tipografi

Gunakan satu keluarga font sans-serif modern untuk seluruh UI. Prioritas:
1. Geist, jika sudah tersedia/kompatibel dengan project.
2. Inter, jika Geist belum tersedia.
3. Jangan menambahkan banyak font hanya untuk membuat tampilan terlihat mewah.

Hindari kombinasi heading serif editorial yang sangat besar dengan body font berbeda seperti pada screenshot sekarang. MEDAL adalah platform layanan publik dan transaksi pendaftaran; keterbacaan dan konsistensi lebih penting.

Skala tipografi desktop:
- Display/hero: 48–56 px, weight 600–650, line-height 1.08–1.15.
- H1 halaman: 36–42 px, weight 600.
- H2 section: 26–32 px, weight 600.
- H3/card title: 18–20 px, weight 600.
- Body: 15–16 px, line-height 1.6.
- Caption/metadata: 13–14 px, line-height 1.45.
- Label form: 13–14 px, weight 500–600.

Skala mobile:
- Hero title: 34–40 px, line-height 1.12.
- H1: 28–32 px.
- H2: 22–26 px.
- Body: 14–16 px.
- Jangan memaksa judul menjadi banyak baris pendek yang membuat layar penuh teks.

Aturan:
- Maksimal 2–3 tingkat ukuran heading yang terlihat dalam satu section.
- Hindari uppercase letter-spacing pada banyak teks.
- Gunakan font weight untuk hierarki, bukan warna dekoratif.
- Jangan gunakan teks terlalu tipis pada background putih.
- Pastikan heading tidak menabrak gambar atau CTA.

## 3.3 Bentuk, border, dan shadow

- Gunakan radius yang konsisten: 10–14 px untuk card, 8–10 px untuk input, 9–12 px untuk tombol.
- Hindari semua elemen berbentuk pill. Pill hanya untuk status kecil atau filter chip jika memang tepat.
- Border tipis `#E5EBE7` lebih diutamakan daripada shadow besar.
- Shadow harus sangat halus dan hanya untuk elevasi yang memang diperlukan.
- Jangan membuat card di dalam card di dalam card.
- Hindari glassmorphism, backdrop blur tebal, glow, neon, dan outline dekoratif.
- Gunakan ruang kosong dan alignment sebagai pembentuk hierarki.

# 4. Design system komponen

Buat atau rapikan komponen bersama agar semua halaman konsisten.

## 4.1 Buttons

Sediakan varian:
- **Primary:** background hijau tua, teks putih.
- **Secondary:** putih, border netral, teks gelap.
- **Tertiary/Ghost:** tanpa background, teks hijau/gelap.
- **Destructive:** merah untuk aksi berisiko.

Ketentuan:
- Tinggi tombol standar 42–46 px desktop.
- Tinggi tombol mobile minimal 44 px.
- Hover cukup dengan perubahan warna solid yang halus.
- Focus state terlihat jelas.
- Loading state memiliki spinner/indikator dan mencegah double-submit.
- Jangan gunakan tombol gold atau gradient.

## 4.2 Cards

Card harus membantu pengguna memahami informasi, bukan menjadi dekorasi utama.

Event card:
- Foto event yang konsisten (rasio 16:9 atau 4:3 sesuai layout).
- Kategori/status kecil di atas atau dekat judul.
- Nama event maksimal 2 baris.
- Tanggal, lokasi, dan ketersediaan stand ditampilkan sebagai metadata yang mudah dipindai.
- CTA jelas: “Lihat Detail” atau “Daftar Stand”.
- Hover: naik sangat tipis atau border berubah; jangan membesar berlebihan.
- Jika foto tidak tersedia, gunakan placeholder netral dengan ikon/ilustrasi sederhana, bukan gradient.

UMKM card:
- Foto produk/brand bila tersedia.
- Nama usaha, kategori, lokasi kecamatan, dan ringkasan produk.
- CTA “Lihat Profil”.
- Jangan menampilkan data sensitif atau nomor pribadi ke publik tanpa persetujuan/aturan yang sesuai.

Dashboard statistic card:
- Label ringkas.
- Angka utama jelas.
- Ikon sederhana dengan container hijau sangat muda atau netral.
- Informasi pembanding hanya jika ada data yang valid.
- Hindari chart mini dekoratif yang tidak bermakna.

## 4.3 Form

- Label selalu terlihat di atas field; jangan hanya mengandalkan placeholder.
- Gunakan jarak vertikal yang konsisten.
- Tampilkan helper text untuk format dokumen atau input yang membingungkan.
- Error muncul dekat field terkait dan menjelaskan cara memperbaikinya.
- Kelompokkan form panjang menjadi beberapa section/step.
- Pada mobile, semua field satu kolom.
- File upload harus punya area klik yang jelas, nama file, ukuran/format yang diterima, progress, dan aksi hapus/ganti.
- Jangan membuat form panjang dalam modal kecil.

## 4.4 Navigation

Area publik:
- Navbar putih, bisa sticky dengan border bawah tipis.
- Logo MEDAL di kiri.
- Navigasi utama: Beranda, Event, Direktori UMKM, Tentang.
- Aksi Masuk dan Daftar menggunakan button yang proporsional.
- Link aktif ditandai dengan teks/underline hijau tipis, bukan gold.

Dashboard:
- Desktop memakai sidebar yang bersih dan stabil.
- Mobile memakai drawer/sidebar yang bisa dibuka dari tombol menu atau navigasi bawah jika lebih nyaman.
- Sidebar menampilkan identitas MEDAL dan role akun.
- Menu aktif memakai background hijau sangat muda dan teks hijau tua.
- Hindari sidebar gelap besar yang membuat dashboard terasa berat.

# 5. Redesign halaman publik

## 5.1 Beranda

Struktur yang disarankan:

1. **Navbar putih**
   - Tinggi proporsional.
   - Logo dan menu rapi.
   - Mobile: logo + menu button; menu tampil sebagai drawer/dropdown yang mudah ditutup.

2. **Hero section**
   - Background putih.
   - Layout desktop dua kolom: copy di kiri, satu visual utama di kanan.
   - Headline ringkas dan jelas, misalnya:
     “Temukan Event. Kembangkan Usaha.”
   - Deskripsi satu atau dua kalimat yang menjelaskan MEDAL sebagai penghubung UMKM dan penyelenggara event dengan proses terpantau oleh Disperindag.
   - CTA utama: “Jelajahi Event”.
   - CTA sekunder: “Daftarkan Usaha”.
   - Visual: satu foto event/aktivitas UMKM Sumedang yang kuat dan autentik. Jika memakai foto tambahan, maksimal satu thumbnail pendukung. Jangan membuat kolase bertumpuk dengan banyak panel.
   - Tidak perlu panel “Akses Cepat” besar yang mengambang di atas foto. Jika akses cepat dibutuhkan, letakkan sebagai tiga shortcut sederhana di bawah hero atau section berikutnya.

3. **Trust / ringkasan platform**
   - Tampilkan angka hanya jika berasal dari data nyata.
   - Jika belum ada data, jangan mengarang jumlah UMKM, event, peserta, atau stand.
   - Bisa menampilkan tiga manfaat: satu pintu informasi event, pendaftaran terpantau, direktori UMKM lokal.

4. **Event yang sedang dibuka**
   - Grid 3 kolom desktop, 2 kolom tablet, 1 kolom mobile.
   - Card foto, nama, tanggal, lokasi, status pendaftaran, dan CTA.
   - Tampilkan link “Lihat Semua Event”.

5. **Direktori UMKM pilihan**
   - Grid sederhana dengan foto produk/UMKM.
   - Filter kategori jika datanya tersedia.
   - CTA menuju direktori lengkap.

6. **Alur penggunaan**
   - Tampilkan 3–4 langkah dalam layout horizontal desktop dan vertikal mobile.
   - Gunakan ikon outline sederhana.
   - Jangan menggunakan ilustrasi dekoratif berlebihan.

7. **CTA penyelenggara**
   - Section putih atau neutral-white dengan aksen hijau yang terukur.
   - Jelaskan bahwa komunitas, EO, desa, dan instansi dapat mengajukan event untuk diverifikasi Disperindag.
   - CTA “Ajukan Event”.

8. **Footer**
   - Putih atau neutral-white dengan border atas.
   - Identitas MEDAL dan Disperindag.
   - Navigasi, kontak resmi, alamat, dan sosial media hanya jika datanya telah disediakan.
   - Jangan mengarang nomor telepon, email, alamat, atau akun sosial media.

## 5.2 Halaman Event

- Header halaman sederhana: judul, deskripsi singkat, dan breadcrumb bila diperlukan.
- Search bar dan filter yang tidak mendominasi.
- Filter kategori, status pendaftaran, serta tanggal/lokasi jika tersedia.
- Grid event responsif.
- Empty state yang menjelaskan belum ada event yang sesuai dan cara menghapus filter.
- Loading skeleton sederhana.
- Pagination atau load more sesuai implementasi data.
- Jangan menumpuk banyak filter chip di satu baris pada mobile; gunakan filter drawer.

## 5.3 Detail Event

- Foto/banner event yang jelas.
- Nama, penyelenggara, tanggal, lokasi, status, dan sisa kuota jika tersedia.
- Deskripsi dan persyaratan dalam section yang mudah dipindai.
- CTA pendaftaran stand yang jelas dan mengikuti status autentikasi serta periode pendaftaran.
- Mobile: CTA dapat menjadi sticky bottom action, tetapi tidak menutupi konten atau navigasi.
- Informasi status harus bersumber dari database, bukan teks statis.

## 5.4 Direktori UMKM

- Search dan filter kategori/lokasi.
- Grid profil usaha dengan foto.
- Detail profil usaha menampilkan informasi publik yang memang diizinkan.
- Jangan menampilkan NIB, dokumen legal, email pribadi, atau nomor pribadi secara terbuka.
- Gunakan placeholder netral jika foto belum ada.

## 5.5 Tentang MEDAL

- Jelaskan fungsi MEDAL dan hubungan platform dengan Disperindag.
- Tampilkan alur kerja dan manfaat untuk UMKM maupun penyelenggara.
- Hindari halaman company profile generik yang berisi tim/portofolio yang tidak relevan.
- Logo/identitas instansi hanya gunakan aset resmi yang disediakan.

## 5.6 Autentikasi dan registrasi

- Halaman masuk dan daftar harus fokus, ringan, dan nyaman di mobile.
- Jelaskan pilihan jenis akun: Pelaku UMKM atau Penyelenggara.
- Jangan meminta pengguna memilih role admin saat registrasi publik.
- Form registrasi UMKM dan penyelenggara disesuaikan dengan PRD utama.
- Gunakan validasi inline dan error message yang jelas.

# 6. Redesign dashboard untuk tiga role

Dashboard harus menggunakan design system yang sama dengan area publik. Perbedaan tiap role terletak pada navigasi, data, dan aksi yang tersedia, bukan pada tema visual yang berbeda-beda.

## 6.1 Pola layout dashboard

Desktop:
- Sidebar kiri dengan lebar konsisten sekitar 240–260 px.
- Topbar berisi breadcrumb/judul halaman, notifikasi bila tersedia, dan menu profil.
- Konten utama memiliki max-width yang wajar dan padding konsisten.
- Grid statistik responsif.
- Tabel menggunakan header jelas, row height nyaman, dan aksi tidak berdesakan.

Tablet:
- Sidebar dapat diperkecil menjadi icon rail atau drawer.
- Konten tidak boleh memiliki horizontal overflow.
- Tabel lebar dapat menggunakan container scroll horizontal yang terkontrol atau layout list.

Mobile:
- Sidebar menjadi drawer atau bottom navigation untuk menu yang paling sering digunakan.
- Topbar ringkas.
- Statistik 2 kolom jika cukup, jika tidak satu kolom.
- Tabel penting diubah menjadi card/list view; jangan memaksa tabel desktop diperkecil.
- Tombol aksi utama mudah dijangkau.
- Filter dan pencarian menggunakan drawer/accordion.
- Modal desktop harus berubah menjadi full-screen sheet/page jika form terlalu panjang.

## 6.2 Dashboard Pelaku UMKM

Navigasi yang disarankan:
- Ringkasan
- Profil Usaha
- Jelajahi Event
- Pendaftaran Saya
- Dokumen
- Notifikasi
- Pengaturan Akun

Ringkasan:
- Sapaan singkat dan status kelengkapan profil.
- Statistik yang relevan: total pendaftaran, menunggu verifikasi, diproses, diterima/ditolak.
- Event yang sedang dibuka.
- Aktivitas/status pendaftaran terbaru.
- Checklist tindakan berikutnya jika profil atau dokumen belum lengkap.

Profil Usaha:
- Form dibagi ke section: identitas usaha, kategori/produk, lokasi, kontak, dokumen.
- Tampilkan status kelengkapan dan status verifikasi.
- Aksi edit jelas.
- Data sensitif tidak boleh tampil pada direktori publik.

Pendaftaran Saya:
- List/card pendaftaran dengan nama event, tanggal, waktu pengajuan, status, dan aksi detail.
- Detail status memakai timeline yang jelas: dikirim, pemeriksaan berkas, seleksi penyelenggara, keputusan akhir/nomor stand.
- Berikan penjelasan jika perlu perbaikan dokumen atau ada alasan penolakan yang boleh ditampilkan.

## 6.3 Dashboard Penyelenggara Event

Navigasi yang disarankan:
- Ringkasan
- Event Saya
- Ajukan Event
- Pendaftar UMKM
- Peserta Diterima
- Rekap & Laporan
- Notifikasi
- Profil Penyelenggara

Ringkasan:
- Jumlah event aktif, menunggu verifikasi, pendaftar, dan peserta diterima.
- Status event terbaru.
- Daftar pendaftar terbaru.
- Aksi utama “Ajukan Event” atau “Kelola Event”.

Event Saya:
- Card/list event dengan status draft, menunggu verifikasi, revisi, disetujui, berlangsung, atau selesai sesuai state yang ada di PRD.
- Detail event memiliki ringkasan kuota dan daftar pendaftar.

Pendaftar UMKM:
- Daftar peserta dengan identitas usaha yang boleh diakses penyelenggara.
- Filter status dan kategori.
- Detail aplikasi menampilkan data yang diperlukan untuk seleksi, tidak menampilkan dokumen/atribut sensitif yang tidak relevan.
- Aksi seleksi harus jelas, disertai konfirmasi untuk aksi penting.
- Penyelenggara tidak boleh mengubah status verifikasi administrasi Disperindag.

Rekap & Laporan:
- Tabel peserta dan status.
- Export CSV/XLSX/PDF hanya jika sudah didukung implementasi dan sesuai kebutuhan PRD.
- Tampilkan filter event dan tanggal.

## 6.4 Dashboard Admin Disperindag

Dashboard admin adalah area operasional paling penting. Buat tampilannya modern, profesional, informatif, dan efisien. Jangan hanya membuat dashboard penuh kartu angka dan chart dekoratif.

Navigasi yang disarankan:
- Overview
- Verifikasi UMKM
- Pengajuan Event
- Manajemen Event
- Pendaftaran Stand
- Data UMKM
- Data Penyelenggara
- Laporan
- Pengguna & Role
- Pengaturan

Overview admin:
- Ringkasan jumlah UMKM terdaftar, penyelenggara, event aktif, pengajuan event menunggu, pendaftaran stand menunggu verifikasi.
- Angka harus berasal dari query database nyata.
- Grafik tren pendaftaran/event hanya jika data cukup dan label/sumbu jelas.
- Panel “Perlu Tindakan” berisi antrean verifikasi paling mendesak.
- Aktivitas terbaru dengan waktu dan aktor yang jelas.
- Quick actions untuk membuka antrean penting.
- Jangan membuat angka dummy seolah-olah data produksi. Untuk development, beri label “Data Demo”.

Verifikasi UMKM:
- Table/list dengan pencarian dan filter status.
- Detail profil dan dokumen dalam layout dua kolom desktop; satu kolom mobile.
- Preview dokumen dengan aman.
- Aksi: verifikasi, minta perbaikan, atau tolak sesuai aturan PRD.
- Wajib ada catatan/alasan untuk permintaan perbaikan atau penolakan jika proses bisnis mengharuskannya.
- Setiap keputusan tercatat di audit log.

Pengajuan Event:
- Antrean pengajuan event.
- Detail proposal, penyelenggara, tanggal, lokasi, kapasitas, dan dokumen.
- Aksi setujui, minta revisi, atau tolak sesuai aturan PRD.
- Event tidak tampil publik sebelum status persetujuan yang diwajibkan tercapai.

Manajemen Event:
- Cari dan filter event.
- Lihat detail, status, kuota, pendaftar, dan penyelenggara.
- Admin dapat melakukan tindakan sesuai permission dan business rule.
- Perubahan penting harus tercatat.

Pendaftaran Stand:
- Pantau keseluruhan pendaftaran.
- Filter event, UMKM, tanggal, dan status.
- Pastikan proses verifikasi admin dan seleksi penyelenggara tidak tercampur.
- Pengesahan akhir dan nomor stand mengikuti alur PRD utama.

Laporan:
- Ringkasan event, UMKM, pendaftaran, dan hasil seleksi.
- Filter periode/kategori/lokasi.
- Export harus mengikuti hak akses.
- Jangan tampilkan data pribadi yang tidak diperlukan dalam laporan umum.

Pengguna & Role:
- Admin dapat mengelola akun sesuai permission yang ditetapkan.
- Pembuatan/peningkatan role admin tidak boleh terbuka untuk registrasi publik.
- Aksi sensitif membutuhkan konfirmasi dan audit log.

# 7. Responsive design — kriteria wajib

Gunakan pendekatan mobile-first. Uji minimal pada viewport berikut:

| Device profile | Viewport |
|---|---:|
| Small mobile | 320 × 700 |
| Standard mobile | 375 × 812 |
| Large mobile | 430 × 932 |
| Tablet | 768 × 1024 |
| Laptop | 1366 × 768 |
| Desktop | 1440 × 900 |

Checklist:
- Tidak ada horizontal scroll pada body.
- Tidak ada teks terpotong atau keluar dari card.
- Tidak ada tombol bertumpuk atau terlalu kecil.
- Navbar mobile memiliki menu yang bisa dibuka/tutup dan tidak menutupi konten.
- Hero berubah menjadi satu kolom pada mobile; visual tidak mendorong headline keluar layar.
- Card grid berubah menjadi 1 kolom pada mobile dan 2 kolom pada tablet bila ruang cukup.
- Form satu kolom pada mobile.
- Tabel dashboard memiliki mobile list/card alternative atau scroll container yang jelas.
- Modal panjang berubah menjadi full-screen page/sheet.
- Sticky CTA tidak menutupi footer, input, atau navigasi.
- Gambar menggunakan `object-fit` yang tepat dan tidak merusak rasio.
- Sidebar tidak memaksa konten menjadi terlalu sempit.
- Semua aksi penting bisa digunakan dengan sentuhan jari.
- Uji orientasi portrait dan, jika relevan, landscape.

Jangan menyelesaikan responsivitas dengan sekadar menambahkan `overflow-x-hidden` pada body. Temukan dan perbaiki sumber overflow.

# 8. Motion dan animasi

Motion harus terasa halus, presisi, dan membantu orientasi pengguna. Gunakan referensi TikTok pada Bagian 2 untuk mempelajari gaya geraknya.

Jika project sudah menggunakan Framer Motion, manfaatkan dependency tersebut. Jika belum, periksa stack dan pilih solusi paling ringan; jangan menambah library besar tanpa alasan.

Animasi yang direkomendasikan:
- Page/section entrance: opacity + translateY kecil (8–16 px).
- Stagger pada event cards atau statistik, dengan jeda pendek.
- Hover card: perubahan border/shadow ringan dan translateY maksimal 2–3 px.
- Button: feedback press kecil, bukan scale berlebihan.
- Sidebar/drawer: slide yang halus dengan backdrop sederhana.
- Tab/filter: transisi state yang cepat.
- Number count-up hanya untuk angka ringkasan yang bermakna dan tidak mengganggu.
- Skeleton loading dengan shimmer sangat halus atau placeholder statis; jangan gunakan animasi mencolok.

Panduan timing:
- Micro interaction: 120–180 ms.
- Hover/focus transition: 150–220 ms.
- Drawer/modal: 220–300 ms.
- Section reveal: 350–550 ms.
- Gunakan easing yang natural, misalnya ease-out.
- Hindari semua elemen bergerak sekaligus.
- Jangan gunakan parallax berlebihan, infinite floating, bouncing, cursor-following, atau animasi yang berjalan terus tanpa tujuan.
- Hormati `prefers-reduced-motion`; sediakan pengalaman minim animasi.
- Animasi tidak boleh menunda interaksi atau membuat konten terlambat bisa digunakan.

# 9. Foto, ilustrasi, dan aset

- Prioritaskan foto asli UMKM, produk lokal, kegiatan bazar, event, dan suasana Sumedang yang disediakan pemilik proyek.
- Jangan menggunakan foto AI yang terlihat tidak autentik untuk menggambarkan UMKM lokal.
- Jangan mengarang foto/identitas pelaku UMKM.
- Jika foto belum tersedia, gunakan placeholder netral yang konsisten.
- Pastikan setiap gambar memiliki alt text yang bermakna.
- Kompres dan optimalkan ukuran gambar.
- Gunakan rasio foto yang konsisten pada card.
- Jangan menumpuk banyak gambar kecil sebagai dekorasi hero.
- Pastikan logo MEDAL dan logo instansi memakai file resmi yang diberikan; jangan menggambar ulang logo secara asal.

# 10. Dashboard data visualization

- Chart hanya ditampilkan jika menjawab pertanyaan operasional.
- Gunakan chart sederhana dengan grid tipis, label terbaca, dan tooltip yang berguna.
- Hindari pie chart dengan terlalu banyak kategori.
- Hindari gradient fill, glow, 3D chart, dan animasi chart yang berlebihan.
- Warna chart menggunakan hijau utama dan variasi netral yang kontras.
- Selalu sediakan ringkasan angka/tabel sebagai alternatif visual.
- Pastikan chart responsif dan tidak menyebabkan overflow.
- Jangan menampilkan statistik palsu atau data dummy tanpa label.

# 11. Aksesibilitas dan usability

- Kontras teks dan background harus memadai.
- Gunakan semantic HTML: heading berurutan, button untuk aksi, link untuk navigasi.
- Semua input memiliki label.
- Navigasi keyboard harus berfungsi.
- Focus ring terlihat.
- Icon-only button memiliki accessible label.
- Status tidak dibedakan melalui warna saja.
- Error form jelas dan terhubung dengan field.
- Ukuran target sentuh minimal sekitar 44 × 44 px.
- Modal/drawer memiliki fokus dan dapat ditutup dengan keyboard.
- Gunakan `prefers-reduced-motion`.

# 12. Instruksi teknis untuk Claude Code

## 12.1 Sebelum mengubah kode

1. Audit struktur repository, framework, routing, komponen, CSS, dependency, dan halaman yang sudah ada.
2. Baca PRD utama dan prompt implementasi utama.
3. Identifikasi semua halaman publik dan dashboard yang sudah dibuat.
4. Jalankan aplikasi dan periksa screenshot aktual desktop serta mobile.
5. Catat komponen yang bisa dipakai ulang dan komponen yang perlu direfaktor.
6. Jangan menghapus fitur atau mengubah business logic yang sudah berjalan tanpa alasan dan laporan.

## 12.2 Implementasi

1. Buat design tokens sebagai sumber warna, spacing, radius, typography, shadow, dan breakpoint.
2. Rapikan komponen global: Button, Card, Input, Badge/Status, Container, SectionHeading, EmptyState, LoadingState, Modal/Drawer, Sidebar, dan Topbar.
3. Redesign area publik terlebih dahulu.
4. Redesign dashboard UMKM.
5. Redesign dashboard penyelenggara.
6. Redesign dashboard admin Disperindag.
7. Terapkan responsive behavior di setiap halaman, bukan hanya di homepage.
8. Terapkan motion sesuai prinsip pada Bagian 8.
9. Pastikan loading, empty, error, success, disabled, dan permission states tetap tersedia.
10. Jangan mengganti data Supabase dengan hardcoded mock data untuk membuat UI terlihat penuh.

## 12.3 Aturan implementasi

- Pertahankan stack dan arsitektur yang sudah ditetapkan dalam PRD utama.
- Jangan membuat project baru atau mengganti framework tanpa alasan yang kuat.
- Jangan merusak Supabase Auth, RLS, Storage, query, server actions, API, atau alur pendaftaran.
- Jangan memindahkan secret ke client.
- Jangan menonaktifkan RLS untuk mempermudah tampilan.
- Jangan membuat tombol palsu atau interaksi dekoratif yang tidak bekerja.
- Semua link, filter, form, tab, drawer, dropdown, pagination, dan CTA harus berfungsi.
- Jangan menambahkan data statistik fiktif.
- Jangan membuat satu komponen raksasa untuk seluruh dashboard; pecah berdasarkan tanggung jawab.
- Gunakan komponen bersama agar visual konsisten, tetapi jangan memaksakan abstraksi yang berlebihan.
- Pastikan state loading/error/empty dan permission denied dirancang dengan baik.

# 13. QA dan acceptance criteria

Redesign dianggap selesai hanya jika semua poin berikut terpenuhi:

## Visual
- [ ] Putih menjadi warna dominan.
- [ ] Hijau tua menjadi aksen utama.
- [ ] Tidak ada aksen gold/kuning dekoratif.
- [ ] Tidak ada gradient/glow/glassmorphism yang tidak diperlukan.
- [ ] Tipografi konsisten dan tidak membuat halaman terasa penuh.
- [ ] Foto dan card memiliki rasio serta alignment konsisten.
- [ ] Public website dan semua dashboard menggunakan design system yang sama.

## Responsivitas
- [ ] Semua halaman diuji pada 320, 375, 430, 768, 1366, dan 1440 px.
- [ ] Tidak ada horizontal overflow yang tidak disengaja.
- [ ] Mobile navigation berfungsi.
- [ ] Dashboard mobile tidak memaksakan tabel desktop.
- [ ] Form dan modal nyaman digunakan di ponsel.
- [ ] CTA dan kontrol mudah disentuh.

## Motion
- [ ] Animasi halus dan tidak berlebihan.
- [ ] Tidak ada animasi yang menghalangi interaksi.
- [ ] Drawer, modal, hover, dan section reveal berjalan konsisten.
- [ ] `prefers-reduced-motion` dihormati.
- [ ] Referensi TikTok telah diperiksa atau keterbatasan aksesnya dilaporkan.

## Fungsional dan keamanan
- [ ] Seluruh fitur dan alur bisnis dari PRD utama tetap bekerja.
- [ ] Role UMKM, penyelenggara, dan admin memiliki akses sesuai permission.
- [ ] Data real berasal dari Supabase.
- [ ] Tidak ada dokumen privat yang terbuka secara publik.
- [ ] Tidak ada secret di client bundle.
- [ ] Form memiliki validasi dan feedback.
- [ ] Semua CTA dan menu bekerja.

## Testing dan laporan
- [ ] Jalankan lint/typecheck/build sesuai script project.
- [ ] Uji halaman publik dan dashboard.
- [ ] Uji mobile viewport.
- [ ] Periksa console error dan network error yang relevan.
- [ ] Ambil screenshot before/after untuk desktop dan mobile.
- [ ] Laporkan file/komponen utama yang diubah.
- [ ] Laporkan bug yang ditemukan dan yang belum terselesaikan.
- [ ] Jangan mengklaim test berhasil jika belum benar-benar dijalankan.

# 14. Output yang diminta dari Claude Code

Setelah pekerjaan selesai, berikan laporan dengan format:

1. **Ringkasan redesign** — perubahan visual utama.
2. **Halaman yang diperbarui** — daftar halaman publik dan dashboard.
3. **Design system** — warna, font, spacing, radius, dan komponen.
4. **Responsive QA** — hasil uji setiap viewport.
5. **Motion** — animasi yang ditambahkan dan hasil pemeriksaan referensi.
6. **Functional regression** — fitur yang diuji untuk memastikan tidak rusak.
7. **Build/test result** — command dan hasil aktual.
8. **Known issues** — hal yang belum selesai, jangan disembunyikan.
9. **Screenshots** — lokasi screenshot desktop dan mobile.

---

# 15. MASTER PROMPT — tempel ke Claude Code

Baca dokumen `PRD_Platform_UMKM_Sumedang.md`, `PROMPT_Claude_Code_UMKM_Sumedang.md`, dan addendum `DESIGN_REVISION_MEDAL_UMKM_SUMEDANG.md` ini sampai selesai. Gunakan screenshot website yang dilampirkan sebagai baseline kondisi sekarang.

Tugasmu adalah melakukan **redesign UI/UX menyeluruh untuk MEDAL UMKM Sumedang**, bukan membuat ulang produk dari nol.

Masalah desain saat ini:
- Tampilan terlalu terasa seperti AI-generated template.
- Hijau memenuhi terlalu banyak area.
- Warna gold/kuning tidak disukai dan harus dihilangkan dari aksen dekoratif.
- Background terlihat kekuningan/keruh, bukan putih bersih.
- Tipografi terlalu ramai dan hirarkinya membingungkan.
- Hero dan card terlalu banyak layer, blur, efek, dan ornamen.
- Layout mobile masih berantakan dan belum benar-benar responsif.
- Dashboard admin juga harus didesain ulang, bukan hanya landing page.

Arah desain final:
- White-first, clean, elegant, modern, calm, dan professional.
- Putih bersih sebagai warna utama.
- Hijau tua premium sebagai aksen brand.
- Netral abu-abu untuk teks sekunder, border, dan surface.
- Tidak menggunakan gold/yellow sebagai aksen brand.
- Tidak menggunakan gradient, glow, glassmorphism, atau dekorasi AI-template.
- Satu keluarga font sans-serif yang konsisten.
- Card sederhana, foto autentik, border tipis, radius terukur, dan shadow minimal.
- Mobile-first dan benar-benar nyaman digunakan.

**Referensi motion wajib diperiksa:** https://vt.tiktok.com/ZSpHL1twt/

Buka referensi tersebut jika browser tersedia, amati motion-nya, lalu adaptasikan timing/easing/transisi yang relevan. Jika tidak dapat diakses, katakan dengan jujur di laporan dan gunakan pedoman motion pada addendum ini.

Kerjakan dengan urutan:
1. Audit project dan baca seluruh dokumen.
2. Buat ringkasan temuan UI/UX sebelum perubahan.
3. Buat design tokens dan shared components.
4. Redesign seluruh halaman publik.
5. Redesign dashboard UMKM.
6. Redesign dashboard penyelenggara.
7. Redesign dashboard admin Disperindag.
8. Rapikan seluruh responsive behavior, terutama mobile.
9. Implementasikan motion yang halus dan aksesibel.
10. Jalankan lint, typecheck, build, dan pengujian yang tersedia.
11. Periksa ulang semua alur Supabase dan permission agar tidak rusak.
12. Ambil screenshot hasil desktop dan mobile.
13. Buat laporan akhir sesuai Bagian 14.

Jangan berhenti setelah homepage terlihat bagus. Seluruh halaman dan role harus konsisten. Jangan mengarang data, jangan membuat tombol palsu, jangan menonaktifkan keamanan, dan jangan mengubah business logic tanpa alasan.

**Prioritas tertinggi:** hasil harus terlihat seperti produk digital resmi yang dirancang oleh product design team berpengalaman — bersih, elegan, ringan, mudah dipahami, dan nyaman digunakan — bukan seperti template AI yang penuh efek. Jika harus memilih antara dekorasi dan kejelasan, selalu pilih kejelasan.
