# MEDAL Design System v2 — White-first, Green Accent

Addendum implementasi untuk [`DESIGN_REVISION_MEDAL_UMKM_SUMEDANG.md`](DESIGN_REVISION_MEDAL_UMKM_SUMEDANG.md). Dokumen ini adalah **sumber kebenaran visual** untuk perubahan UI berikutnya (publik, dashboard UMKM, penyelenggara, dan admin). Baca sebelum menyentuh komponen.

## 0. Referensi motion (wajib dicek)

**https://vt.tiktok.com/ZSpHL1twt/**

→ redirect ke `https://www.tiktok.com/@settigation/video/7698039896967073044`.

> Catatan jujur (12 Nov 2026): dari lingkungan Claude Code, halaman ini hanya mengembalikan placeholder "TikTok - Make Your Day" dan oEmbed kosong — **video tidak bisa dilihat**. Motion di bawah diimplementasikan dari pedoman tertulis addendum (§8), bukan dari video. Agen berikutnya: coba buka lagi dengan browser sungguhan (Claude in Chrome / built-in browser). Jika berhasil, sesuaikan timing/easing di `src/components/motion.tsx` dan catat perubahannya di sini.

## 1. Prinsip

1. **Putih adalah warna utama** (80–90% area). Hijau = aksen identitas.
2. **Tanpa kuning/emas, gradient, glow, glass, blur tebal, serif dekoratif.**
3. **Satu font**: Geist (`next/font/google`), Geist Mono untuk kode/NPM.
4. **Border tipis > shadow.** Shadow hanya saat hover kartu (sangat halus).
5. **Setiap section punya satu judul jelas** (eyebrow kecil hijau + H2). Section dipisah dengan border tipis atau latar `surface-muted`, tidak dengan dekorasi.
6. **Mobile dirancang sendiri**, bukan desktop yang dikecilkan.

## 2. Tokens (`src/app/globals.css`)

| Token CSS | Kelas Tailwind | Nilai | Pakai untuk |
|---|---|---|---|
| `--primary` | `primary` | `#174B3A` | Tombol utama, link aktif, ikon brand |
| `--primary-hover` | `primary-hover` | `#103B2D` | Hover tombol |
| `--primary-soft` | `primary-soft` | `#EAF2EE` | Container ikon, menu aktif, selected |
| `--primary-border` | `primary-border` | `#C9DAD1` | Border selected/hover kartu |
| `--page` / `--surface` | `bg-white` | `#FFFFFF` | Latar halaman & kartu |
| `--surface-muted` | `surface-muted` | `#F7F9F8` | Section alternatif, latar dashboard |
| `--text` | `ink` | `#18231E` | Heading & teks utama |
| `--text-muted` | `muted` | `#5F6C65` | Deskripsi, metadata (kontras AA) |
| `--border` | `line` | `#E5EBE7` | Border & separator |
| `--success/--warning/--danger` | `success/warning/danger` | `#26734D / #946515 / #B54747` | Status semantik saja |

Alias lama (`emerald`, `forest`, `mint`, `sage`, `ivory`) masih dipetakan ke palet baru agar kode lama tidak rusak — **jangan dipakai di kode baru**.

## 3. Tipografi

| Peran | Mobile | Desktop | Weight |
|---|---|---|---|
| Hero | 34 px | 52 px | 600, `tracking-[-0.025em]`, lh 1.1 |
| H1 halaman | 26–30 px | 30–40 px | 600 |
| H2 section | 22 px | 28 px | 600 |
| H3 / judul kartu | 15–17 px | 17–20 px | 600 |
| Body | 15 px | 15–16 px | 400, lh 1.6 |
| Meta / label | 13 px | 13 px | 400–500 |

Tidak ada uppercase + letter-spacing massal. Hierarki dari ukuran & weight, bukan warna.

## 4. Bentuk & spacing

- Radius: tombol 9–11 px, input 9–10 px, kartu 12 px (`rounded-xl`), media besar 16 px (`rounded-2xl`, hanya hero/banner).
- Tidak ada tombol pill. `rounded-full` hanya untuk avatar, dot status, progress bar.
- Kontainer `container-page` max 72rem, padding 16/24 px. Section `.section` = 56 px mobile / 80 px desktop.

## 5. Komponen

| Komponen | File | Catatan |
|---|---|---|
| Button / ButtonLink | `components/ui/button.tsx` | `primary`, `secondary`, `ghost`, `link`, `danger`, `danger-outline`. Tinggi 36/44/48. `active:scale-[0.98]` 150 ms |
| Badge / StatusBadge | `components/ui/misc.tsx` | Label + ikon (tidak hanya warna) |
| Card, StatCard, Notice, EmptyState, PageHeader, SectionTitle | `components/ui/misc.tsx` | Border tipis, tanpa shadow |
| DataTable | `components/ui/misc.tsx` | Tabel ≥768 px; **kartu label/nilai di mobile** (label otomatis dari `head`) |
| Field, Input, Select, Textarea, Checkbox | `components/ui/form.tsx` | Label selalu di atas; Select pakai ikon chevron |
| FilterBar | `components/filter-bar.tsx` | Desktop inline; mobile **bottom sheet** |
| StatusTabs | `components/status-tabs.tsx` | Tab bergaris bawah, scroll horizontal di mobile |
| ActionDialog | `components/action-form.tsx` | Mobile = bottom sheet, desktop = dialog tengah |
| EventCard / UmkmCard | `components/cards.tsx` | Foto 16:10 / 4:3, judul maks 2 baris, metadata, CTA teks |
| SiteHeader / SiteFooter | `components/site-*.tsx` | Putih, border tipis, underline aktif hijau |
| DashboardShell | `components/dashboard-shell.tsx` | Lihat §7 |

## 6. Struktur halaman publik

**Beranda** (`app/(public)/page.tsx`), urutan section:
1. Hero putih 2 kolom (copy + 1 foto). Mobile: copy → CTA penuh lebar → foto.
2. Akses cepat (3 shortcut).
3. Ringkasan platform — hanya bila ada data nyata dari `get_public_stats`.
4. Event sedang dibuka (grid 1/2/3 kolom).
5. Direktori UMKM pilihan (grid 2/3/4).
6. Cara kerja (4 langkah).
7. CTA penyelenggara.
8. Footer putih.

**Event / Direktori**: header halaman sederhana → FilterBar → tab status → grid → paginasi.
**Detail event**: banner → judul & status → fakta (grid) → deskripsi → syarat; kanan: kartu kuota & CTA. Mobile: **CTA sticky di bawah artikel** (tidak menutupi footer).
**Tentang**: latar belakang, arti nama, peran, tim 7 anggota (`src/data/team.ts`), kontak & kredit foto.

## 7. Dashboard (3 role, satu sistem)

- Desktop: sidebar putih 252 px, grup menu berjudul, item aktif = `primary-soft` + teks `primary` dengan indikator yang **bergeser halus** (`layoutId`, 250 ms). Topbar 64 px berisi role + notifikasi. Konten max 72rem di atas `surface-muted`.
- Mobile: topbar 56 px + **bottom navigation** (4 menu utama + "Menu") + drawer kiri (280 ms) untuk seluruh menu. Konten `pb-28` agar tidak tertutup.
- Tabel → kartu di mobile (otomatis via `DataTable`).
- Form panjang: section bernomor, satu kolom di mobile, action bar sticky di atas bottom nav.
- Admin Overview: kartu statistik dari `admin_dashboard_stats` (tanpa data karangan), antrean "perlu tindakan" (event, berkas, pengesahan), distribusi status pendaftaran berupa bar horizontal berlabel.

## 8. Motion (`components/motion.tsx`)

| Interaksi | Durasi | Detail |
|---|---|---|
| Tombol press | 150 ms | `scale(0.98)` |
| Hover kartu | 200 ms | `translateY(-2px)`, border → `primary-border`, shadow sangat tipis |
| Underline nav / indikator menu | 250 ms | shared layout (`layoutId`) |
| Drawer / bottom sheet / dialog | 260–300 ms | slide + fade backdrop |
| Section reveal | 450 ms | opacity + `translateY(12px)`, sekali saja |
| Stagger grid | 60 ms antar item | |
| Count-up angka | 900 ms | hanya angka ringkasan nyata |

Easing tunggal: `cubic-bezier(0.22, 1, 0.36, 1)` (`EASE`). Tidak ada parallax, floating, marquee, atau animasi tak berujung. Semua menghormati `prefers-reduced-motion`.

## 9. Checklist saat menambah UI

- [ ] Tidak ada warna di luar token.
- [ ] Tidak ada gradient / glow / kuning.
- [ ] Teks ≥ 13 px, warna `muted` atau lebih gelap.
- [ ] Diuji 320, 375, 430, 768, 1366, 1440 px tanpa horizontal overflow.
- [ ] Target sentuh ≥ 44 px di mobile.
- [ ] Status punya teks + ikon.
- [ ] Data dari Supabase, bukan mock.
