import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarCheck2, CalendarSearch, ClipboardCheck, FileCheck2, Megaphone, Store, Ticket, UserRoundPlus } from "lucide-react";
import { Hero } from "@/components/home/hero";
import { EventCard, UmkmCard } from "@/components/cards";
import { CountUp, Reveal, Stagger, StaggerItem } from "@/components/motion";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState, Notice, SectionTitle } from "@/components/ui/misc";
import { getPublicSettings, getPublicStats, listFeaturedEvents, listPublicUmkm } from "@/lib/queries";

export const dynamic = "force-dynamic";

const SHORTCUTS = [
  { href: "/events", icon: CalendarSearch, title: "Cari event", body: "Bazar, festival, dan pameran yang membuka pendaftaran stand." },
  { href: "/daftar/umkm", icon: Store, title: "Daftarkan usaha", body: "Buat profil usaha sekali, pakai untuk setiap pendaftaran." },
  { href: "/cek-status", icon: ClipboardCheck, title: "Cek status", body: "Pantau berkas hingga nomor stand final." },
];

const STEPS = [
  { icon: UserRoundPlus, title: "Buat akun & profil", body: "Isi data usaha dan dokumen legal satu kali." },
  { icon: CalendarCheck2, title: "Pilih event", body: "Daftar stand pada event yang sedang dibuka." },
  { icon: FileCheck2, title: "Verifikasi & seleksi", body: "Disperindag memeriksa berkas, penyelenggara menyeleksi." },
  { icon: Ticket, title: "Terima nomor stand", body: "Hasil akhir dan nomor lapak tampil di dashboard." },
];

export default async function HomePage() {
  const [settings, stats, events, umkm] = await Promise.all([getPublicSettings(), getPublicStats(), listFeaturedEvents(3), listPublicUmkm({ pageSize: 8 })]);
  const hasStats = stats.events + stats.umkm + stats.stands + stats.organizers > 0;

  return (
    <>
      <Hero headline={settings.hero.headline} subheadline={settings.hero.subheadline} />

      {settings.announcement.enabled && settings.announcement.text && (
        <div className="container-page -mt-2 mb-6">
          <Notice tone="info" title="Pengumuman">{settings.announcement.text}</Notice>
        </div>
      )}

      {/* 1. Akses cepat */}
      <section aria-labelledby="akses-cepat" className="border-y border-line bg-surface-muted">
        <div className="container-page py-8 sm:py-10">
          <h2 id="akses-cepat" className="sr-only">Akses cepat</h2>
          <Stagger className="grid gap-3 sm:grid-cols-3">
            {SHORTCUTS.map((s) => (
              <StaggerItem key={s.href}>
                <Link href={s.href} className="group flex h-full items-start gap-3.5 rounded-xl border border-line bg-white p-4 transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-primary-border sm:p-5">
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary"><s.icon className="size-5" aria-hidden /></span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2 text-[15px] font-semibold text-ink">
                      {s.title}
                      <ArrowRight className="size-4 text-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden />
                    </span>
                    <span className="mt-0.5 block text-[13px] leading-relaxed text-muted">{s.body}</span>
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* 2. Ringkasan data nyata */}
      {hasStats && (
        <section aria-labelledby="ringkasan" className="section !pb-0">
          <div className="container-page">
            <Reveal>
              <SectionTitle eyebrow="Ringkasan platform" title={<span id="ringkasan">Data langsung dari sistem MEDAL</span>} />
            </Reveal>
            <Stagger className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line lg:grid-cols-4">
              {[
                { label: "Event terbit", value: stats.events },
                { label: "UMKM di direktori", value: stats.umkm },
                { label: "Stand dikonfirmasi", value: stats.stands },
                { label: "Penyelenggara terverifikasi", value: stats.organizers },
              ].map((s) => (
                <StaggerItem key={s.label} className="bg-white p-5 sm:p-6">
                  <CountUp value={s.value} className="text-[28px] font-semibold tracking-tight text-ink tabular-nums sm:text-[32px]" />
                  <p className="mt-1 text-[13px] text-muted">{s.label}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* 3. Event */}
      <section aria-labelledby="event-dibuka" className="section">
        <div className="container-page">
          <Reveal>
            <SectionTitle
              eyebrow="Event"
              title={<span id="event-dibuka">Sedang membuka pendaftaran</span>}
              description="Seluruh event telah disetujui Disperindag. Sisa stand dihitung dari stand yang sudah dikonfirmasi."
              action={<ButtonLink href="/events" variant="secondary">Lihat semua event <ArrowRight className="size-4" aria-hidden /></ButtonLink>}
            />
          </Reveal>
          <div className="mt-8">
            {events.length ? (
              <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {events.map((e, i) => (
                  <StaggerItem key={e.id} className="h-full"><EventCard event={e} priority={i === 0} /></StaggerItem>
                ))}
              </Stagger>
            ) : (
              <EmptyState title="Belum ada event yang membuka pendaftaran" description="Event baru tampil setelah disetujui Disperindag." action={<ButtonLink href="/daftar/penyelenggara" variant="secondary">Ajukan event</ButtonLink>} />
            )}
          </div>
        </div>
      </section>

      {/* 4. Direktori */}
      <section aria-labelledby="direktori" className="section border-t border-line bg-surface-muted">
        <div className="container-page">
          <Reveal>
            <SectionTitle
              eyebrow="Direktori UMKM"
              title={<span id="direktori">Produk lokal terverifikasi</span>}
              description="Hanya usaha yang diverifikasi Disperindag dan setuju dipublikasikan."
              action={<ButtonLink href="/umkm" variant="secondary">Buka direktori <ArrowRight className="size-4" aria-hidden /></ButtonLink>}
            />
          </Reveal>
          <div className="mt-8">
            {umkm.items.length ? (
              <Stagger className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
                {umkm.items.map((u) => (
                  <StaggerItem key={u.id} className="h-full"><UmkmCard item={u} /></StaggerItem>
                ))}
              </Stagger>
            ) : (
              <EmptyState title="Direktori sedang disiapkan" description="Profil UMKM tampil setelah diverifikasi." action={<ButtonLink href="/daftar/umkm" variant="secondary">Daftarkan usaha</ButtonLink>} />
            )}
          </div>
        </div>
      </section>

      {/* 5. Alur */}
      <section aria-labelledby="alur" className="section">
        <div className="container-page">
          <Reveal>
            <SectionTitle eyebrow="Cara kerja" title={<span id="alur">Empat langkah, semuanya terpantau</span>} />
          </Reveal>
          <Stagger className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <StaggerItem key={s.title}>
                <div className="h-full rounded-xl border border-line bg-white p-5">
                  <div className="flex items-center justify-between">
                    <span className="grid size-10 place-items-center rounded-lg bg-primary-soft text-primary"><s.icon className="size-5" aria-hidden /></span>
                    <span className="text-[13px] font-medium text-muted tabular-nums">0{i + 1}</span>
                  </div>
                  <h3 className="mt-4 text-[16px] font-semibold text-ink">{s.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{s.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* 6. CTA penyelenggara */}
      <section aria-labelledby="cta-penyelenggara" className="pb-14 sm:pb-20">
        <div className="container-page">
          <Reveal>
            <div className="grid overflow-hidden rounded-xl border border-line bg-white md:grid-cols-2">
              <div className="relative aspect-[16/10] bg-surface-muted md:aspect-auto">
                <Image src="/images/pasar-malam-1.jpg" alt="Suasana bazar malam dengan deretan stand UMKM" fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover" />
              </div>
              <div className="flex flex-col justify-center p-6 sm:p-10">
                <span className="grid size-10 place-items-center rounded-lg bg-primary-soft text-primary"><Megaphone className="size-5" aria-hidden /></span>
                <h2 id="cta-penyelenggara" className="mt-4 text-[22px] font-semibold leading-tight text-ink sm:text-[28px]">Punya event untuk UMKM?</h2>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">Komunitas, EO, desa, dan instansi dapat mengajukan event. Setelah diverifikasi Disperindag, event tampil publik dan Anda dapat menyeleksi peserta yang berkasnya sudah diperiksa.</p>
                <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                  <ButtonLink href="/daftar/penyelenggara">Ajukan Event</ButtonLink>
                  <ButtonLink href="/tentang" variant="secondary">Pelajari alurnya</ButtonLink>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
