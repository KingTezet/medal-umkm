# MEDAL Design v3 — Landing (menunggu approval pemilik)

Status: **landing page saja**. Setelah disetujui, gaya ini diterapkan ke halaman publik lain lalu dashboard.

## Referensi

- Dribbble — *Website for an Investment Platform ✦ Univest*:
  https://dribbble.com/shots/27769171-Website-for-an-Investment-Platform-Univest
  > Catatan jujur: Dribbble mengembalikan halaman kosong (HTTP 202) ke klien otomatis, jadi shot ini **belum terlihat** oleh Claude. v3 dibangun dari pola umum landing fintech premium. Kirim screenshot shot tersebut agar detail (struktur, ukuran tipe, warna) bisa dicocokkan.
- Motion: https://vt.tiktok.com/ZSpHL1twt/ (juga belum dapat dibuka, lihat `DESIGN_SYSTEM_V2.md` §0).

## Arah

- Putih + kanvas `#F5F7F6`, skala hijau hidup (`brand-950 … brand-50`), aksen sekunder **sky** (info) dan **coral** (sentuhan kecil). Tanpa emas.
- Tipografi: **Inter Tight** untuk display (600, tracking −0.035em, 52–76 px desktop / 32–34 px mobile), **Geist** untuk teks.
- Bentuk: radius besar & lembut (22–36 px), tombol pill dengan lingkaran panah beranimasi, kartu kaca (`.glass`) di atas foto, blob blur lembut sebagai latar.
- Mobile: hero **link-in-bio** dipertahankan (logo, nama, ringkasan angka, 6 tautan).

## Struktur landing

1. Header pill melayang (blur saat scroll, indikator menu bergeser).
2. Hero: badge "Resmi", headline 2 baris (baris 2 hijau), CTA pill, showcase foto besar dengan **parallax** + 3 kartu kaca melayang (angka nyata, alur, avatar UMKM) yang bergerak beda kecepatan.
3. Marquee kategori & kecamatan.
4. Bento "Kenapa MEDAL" (sel gelap berisi event nyata, kuota real-time, verifikasi, privasi, foto direktori).
5. "Dalam angka" — count-up besar dari database.
6. Event pilihan — kartu bingkai, chip tanggal kaca, bar kuota terisi saat terlihat; geser horizontal di mobile.
7. Cara kerja — garis progres **tergambar mengikuti scroll**.
8. Direktori UMKM — grid mosaik, tile pertama besar.
9. CTA gelap dengan blob blur & foto parallax.
10. Footer dengan wordmark raksasa.

## Motion

Kata judul muncul satu-satu dengan blur→tajam (60 ms/kata), section rise + unblur 0,9 s, stagger 80 ms, count-up 1,6 s, parallax ber-spring, progress bar scroll di atas halaman, panah tombol "berpindah" saat hover. Hanya transform/opacity/filter (ringan). `prefers-reduced-motion` dihormati.

## File

`src/components/landing/{kit,hero,sections}.tsx`, `src/app/(public)/page.tsx`, `src/components/site-header.tsx`, `src/components/site-footer.tsx`, token di `src/app/globals.css`.

## Revisi 1 (feedback: "bg polos, tombol putih, teks di foto nyaru")

- Latar hero: gradasi mint → putih, grid tipis ber-mask, blob mint/sky/coral, cincin elips dekoratif; hero kini memanjang ke bawah header (header transparan sebelum scroll).
- Section bergantian: titik pola + blob (Kenapa, Direktori), blob kiri (Event), mint + titik (Cara kerja), **hijau gelap + grid** (Dalam angka).
- Kartu kaca di atas foto dibuat hampir opak (93% putih, blur 20px, bayangan lebih dalam) agar "Event terbit" dll. terbaca.
- Tombol sekunder bukan putih lagi: mint `brand-100` + ring hijau.
- Overlay foto UMKM/bento lebih pekat + text-shadow halus; chip status event lebih kontras.
- Baris event di bento ditumpuk di mobile (tidak terpotong).
- Footer bergradasi putih → mint, wordmark lebih terlihat.
