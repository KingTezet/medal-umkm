# Alur MEDAL & Video Demo

Video ada di folder lokal `demo-videos/` (tidak di-commit karena ukuran). Semua video direkam dari aplikasi asli yang terhubung ke Supabase, jadi setiap aksi benar-benar mengubah data. Suaranya efek UI hasil sintesis (klik, ketik, whoosh saat scroll, pop saat berhasil, transisi judul), tanpa musik. Kursor, caption, dan efek ripple klik ditambahkan sebagai overlay saat merekam.

| File | Durasi | Isi |
|---|---|---|
| `00-demo-lengkap.mp4` | 3:54 | Gabungan 01–07 |
| `01-landing-desktop.mp4` | 0:46 | Hero (judul blur→tajam, kartu kaca), parallax, bento, angka count-up, kartu event, garis langkah, mosaik UMKM, CTA, footer |
| `02-landing-mobile.mp4` | 0:30 | Link-in-bio mobile, menu kaca, scroll |
| `03-umkm-daftar-stand.mp4` | 0:35 | **Langkah 1** UMKM login → jelajahi event → isi formulir → kirim → timeline |
| `04-admin-verifikasi.mp4` | 0:42 | **Langkah 2** Admin: verifikasi **penyelenggara baru** + verifikasi **berkas UMKM** |
| `05-penyelenggara-seleksi.mp4` | 0:30 | **Langkah 3** Penyelenggara **menerima** UMKM terverifikasi (atau daftar tunggu/tolak), rekap CSV |
| `06-admin-pengesahan.mp4` | 0:27 | **Langkah 4** Admin mengesahkan & menetapkan nomor stand **R-01** |
| `07-umkm-hasil.mp4` | 0:25 | **Langkah 5** UMKM melihat notifikasi & nomor stand final |

## Siapa memverifikasi siapa

```
Penyelenggara daftar ──► Admin Disperindag: Verifikasi / Minta revisi / Tolak
                          (belum terverifikasi = boleh buat draft, belum bisa mengajukan event)
Penyelenggara ajukan event ──► Admin: Publikasikan / Minta revisi / Tolak  ──► event tampil publik

UMKM daftar stand
   │
   ├─► Admin Disperindag   : cek berkas legal (NIB/SKU, dokumen)  → Verifikasi / Minta revisi / Tolak
   ├─► Penyelenggara event : seleksi peserta terverifikasi        → Terima / Daftar tunggu / Tolak
   └─► Admin Disperindag   : pengesahan + nomor stand unik        → Dikonfirmasi (atau tidak disahkan)
```

Penyelenggara memutuskan **siapa yang ikut event-nya** (terima/tolak). Pemeriksaan **dokumen legal UMKM** tetap dilakukan Admin Disperindag sesuai PRD, karena dokumen bersifat privat dan penyelenggara tidak boleh membukanya. Setiap keputusan meminta konfirmasi, mengirim notifikasi, dan tercatat di audit log.

Admin juga menerima notifikasi setiap kali ada penyelenggara atau UMKM baru yang mendaftar. Antrean "Verifikasi penyelenggara" tampil di Overview admin.

## Merekam ulang

Perekamnya berupa skrip lokal (puppeteer + CDP screencast dengan timestamp asli, ffmpeg, dan efek suara dari numpy), tidak disimpan di repo. Langkahnya:

1. Kembalikan data demo ke kondisi awal: penyelenggara3 → `pending`, dan pendaftaran di event Rancakalong dihapus.
2. Rekam scene 01–07.
3. Encode hasilnya.

## Biaya stand & pembayaran manual (tambahan 12 Nov 2026)

1. **Penyelenggara** mengisi rekening di Profil Penyelenggara dan memasang **Biaya stand** di form event. Isi 0 bila gratis.
2. UMKM mendaftar → admin memverifikasi berkas → penyelenggara **Terima**. Status pembayaran berubah menjadi **Belum dibayar** dan UMKM mendapat notifikasi.
3. **UMKM** melihat nominal dan rekening tujuan (hanya terlihat oleh pemohon yang diterima), mentransfer manual, lalu mengunggah **bukti transfer**.
4. **Penyelenggara** membuka bukti tersebut, lalu memilih **Verifikasi pembayaran** (→ Lunas) atau **Tolak bukti** (UMKM unggah ulang).
5. **Admin** baru bisa mengesahkan dan memberi nomor stand setelah pembayaran **Lunas**. Ketentuan ini dikunci di database.

Contoh data: penyelenggara **NATA Space** (`nataspace@demo.medal-sumedang.id`), event *Pasar Kreatif NATA Space (DEMO)* dengan biaya stand Rp100.000, rekening BRI. UMKM `umkm2` sudah diterima dan menunggu pembayaran.

MEDAL tidak memproses uang. Pembayaran dilakukan langsung antara UMKM dan penyelenggara.
