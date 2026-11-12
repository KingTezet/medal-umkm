# Deployment — MEDAL

## Status (12 Nov 2026)

| Item | Nilai |
|---|---|
| GitHub | https://github.com/KingTezet/medal-umkm (public, branch `main`) |
| Vercel project | `medal-umkm` (terhubung ke GitHub; push ke `main` = deploy production) |
| Production | https://medal-umkm.vercel.app |
| Supabase project | `medal-umkm` (ref `arrgfpznnwanltnrdqgj`, region ap-southeast-1) |
| Migrations | `20261112000001` … `20261112000005` — semua applied |
| Auth | Site URL production; redirect `https://medal-umkm.vercel.app/**`, preview `https://*-kingtezets-projects.vercel.app/**`, `http://localhost:3000/**`; konfirmasi email **off** (lihat DECISIONS #6) |

## Environment variables (nama saja)

Vercel (Production + Preview + Development):

- `NEXT_PUBLIC_SUPABASE_URL` (public config)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (public by design; data dilindungi RLS)
- `NEXT_PUBLIC_APP_URL`

Hanya lokal (`.env.local`, tidak di-commit, **tidak** dipasang di Vercel karena aplikasi tidak memakainya saat runtime):

- `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_DB_PASSWORD`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`, `DEMO_PASSWORD`

## Langkah ulang dari nol

```bash
# Supabase
npx supabase link --project-ref <ref>
npx supabase db push
npm run db:types
npm run admin:create          # ADMIN_EMAIL / ADMIN_PASSWORD di .env.local
npm run seed:demo             # opsional (staging)

# Auth config (site_url, redirect, confirmations) — pakai config.toml minimal lalu:
npx supabase config diff
npx supabase config push

# Vercel
npx vercel link --project medal-umkm
npx vercel env add NEXT_PUBLIC_SUPABASE_URL production --type config
npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production --type config
npx vercel env add NEXT_PUBLIC_APP_URL production --type config
npx vercel deploy            # preview
npx vercel deploy --prod     # production
```

## Smoke test pasca-deploy

```bash
for p in / /events /umkm /tentang /login /sitemap.xml; do curl -s -o /dev/null -w "%{http_code} $p\n" https://medal-umkm.vercel.app$p; done
npm run test:rls
```

## Rollback

- Aplikasi: `npx vercel rollback` (atau Vercel Dashboard → Deployments → Promote deployment sebelumnya).
- Database: migration bersifat additive. Untuk membatalkan, buat migration baru yang membalik perubahan; jangan edit migration yang sudah applied. Backup mengikuti plan Supabase.

## Sebelum go-live resmi

1. Konfigurasi SMTP kustom di Supabase → aktifkan kembali konfirmasi email.
2. Ganti admin demo dengan akun admin resmi (`npm run admin:create`), lalu suspend/hapus admin demo.
3. Hapus data DEMO (user `*@demo.medal-sumedang.id`) dari production.
4. Isi kontak resmi di `/admin/pengaturan`; isi data tim di `src/data/team.ts`.
5. Pertimbangkan domain kustom + ubah Site URL Supabase.
