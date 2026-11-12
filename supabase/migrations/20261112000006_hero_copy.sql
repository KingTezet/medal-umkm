-- Design v2: shorter, calmer hero copy (only if still the original default).
update public.platform_settings
set value = jsonb_build_object(
  'headline', 'Temukan Event. Kembangkan Usaha.',
  'subheadline', 'MEDAL menghubungkan pelaku UMKM Sumedang dengan penyelenggara event. Pendaftaran stand, verifikasi Disperindag, hingga nomor lapak final — semuanya terpantau dalam satu tempat.'
)
where key = 'hero' and value ->> 'headline' = 'Temukan Event. Perluas Pasar. Tumbuhkan UMKM Sumedang.';
