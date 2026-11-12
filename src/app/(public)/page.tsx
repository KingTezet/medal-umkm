import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, CalendarCheck2, FileCheck2, Megaphone, ShieldCheck, Sparkles, Store, Ticket, UserRoundPlus } from "lucide-react";
import { Hero } from "@/components/home/hero";
import { EventCard, UmkmCard } from "@/components/cards";
import { CountUp, ParallaxImage, Reveal, Stagger, StaggerItem } from "@/components/motion";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState, SectionTitle } from "@/components/ui/misc";
import { getCategories, getPublicSettings, getPublicStats, listFeaturedEvents, listPublicUmkm } from "@/lib/queries";
import { SUMEDANG_DISTRICTS } from "@/lib/constants";

export const dynamic = "force-dynamic";

const STEPS = [
  { icon: UserRoundPlus, title: "Buat akun & profil usaha", body: "Isi profil usaha sekali — data dipakai ulang untuk setiap pendaftaran event." },
  { icon: CalendarCheck2, title: "Pilih event & daftar stand", body: "Temukan bazar, festival, dan pameran yang sedang membuka pendaftaran." },
  { icon: FileCheck2, title: "Verifikasi Disperindag", body: "Berkas diperiksa Disperindag, lalu penyelenggara menyeleksi peserta." },
  { icon: Ticket, title: "Terima hasil & nomor stand", body: "Pantau status secara transparan hingga nomor lapak final ditetapkan." },
];

export default async function HomePage() {
  const [settings, stats, events, umkm, umkmCats] = await Promise.all([
    getPublicSettings(),
    getPublicStats(),
    listFeaturedEvents(3),
    listPublicUmkm({ pageSize: 6 }),
    getCategories("umkm"),
  ]);

  const marquee = [...umkmCats.map((c) => c.name), ...SUMEDANG_DISTRICTS.slice(0, 10)];

  return (
    <>
      <Hero headline={settings.hero.headline} subheadline={settings.hero.subheadline} />

      {settings.announcement.enabled && settings.announcement.text && (
        <div className="bg-gold text-night">
          <p className="container-page flex items-center gap-2 py-3 text-sm font-semibold">
            <Megaphone className="size-4 shrink-0" aria-hidden /> {settings.announcement.text}
          </p>
        </div>
      )}

      {/* Marquee */}
      <div className="overflow-hidden border-y border-gold/20 bg-forest py-4 text-ivory" aria-hidden>
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
          {[...marquee, ...marquee].map((m, i) => (
            <span key={i} className="flex items-center gap-10 font-display text-xl italic text-ivory/85">
              {m}
              <Sparkles className="size-4 text-gold" />
            </span>
          ))}
        </div>
      </div>

      {/* Cara kerja */}
      <section id="cara-kerja" className="scroll-mt-20 py-20 sm:py-28">
        <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <p className="eyebrow">Cara kerja</p>
              <h2 className="mt-3 font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl">
                Dari dapur rumah ke <em className="text-emerald">lapak festival</em>, dalam empat langkah.
              </h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-muted">
                Tidak ada lagi informasi event yang tercecer. Semua pendaftaran, verifikasi, dan hasil seleksi tercatat rapi dan bisa dipantau.
              </p>
              <ParallaxImage src="/images/batik.jpg" alt="Perajin membatik tulis" className="mt-10 hidden aspect-[4/3] rounded-3xl lg:block" strength={40} sizes="40vw" />
            </Reveal>
          </div>
          <Stagger className="grid gap-4">
            {STEPS.map((s, i) => (
              <StaggerItem key={s.title}>
                <div className="group relative overflow-hidden rounded-3xl border border-line bg-surface p-6 transition duration-500 hover:border-emerald/30 hover:shadow-[0_24px_60px_-30px_rgba(6,34,25,.35)] sm:p-8">
                  <span className="pointer-events-none absolute -right-2 -top-6 font-display text-[7.5rem] leading-none text-sage transition group-hover:text-mint" aria-hidden>
                    0{i + 1}
                  </span>
                  <div className="relative flex gap-5">
                    <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-forest text-gold">
                      <s.icon className="size-6" aria-hidden />
                    </span>
                    <div>
                      <h3 className="font-display text-2xl text-ink">{s.title}</h3>
                      <p className="mt-2 max-w-md text-[15px] leading-relaxed text-muted">{s.body}</p>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Event pilihan */}
      <section className="bg-sage/60 py-20 sm:py-28">
        <div className="container-page">
          <Reveal>
            <SectionTitle
              eyebrow="Sedang dibuka"
              title={<>Event &amp; bazar <em className="text-emerald">pilihan</em></>}
              description="Event terbit yang telah disetujui Disperindag. Sisa kuota dihitung langsung dari stand yang sudah dikonfirmasi."
              action={<ButtonLink href="/events" variant="outline">Lihat semua event <ArrowRight className="size-4" /></ButtonLink>}
            />
          </Reveal>
          <div className="mt-12">
            {events.length ? (
              <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {events.map((e, i) => (
                  <StaggerItem key={e.id} className="h-full">
                    <EventCard event={e} priority={i === 0} />
                  </StaggerItem>
                ))}
              </Stagger>
            ) : (
              <EmptyState
                title="Belum ada event yang membuka pendaftaran"
                description="Event baru akan tampil di sini setelah disetujui Disperindag. Penyelenggara dapat mengajukan event sekarang."
                action={<ButtonLink href="/daftar/penyelenggara">Ajukan Event</ButtonLink>}
              />
            )}
          </div>
        </div>
      </section>

      {/* Parallax band */}
      <section className="relative isolate overflow-hidden bg-night py-28 text-ivory sm:py-40">
        <ParallaxImage src="/images/tahu-bungseng.jpg" alt="" className="!absolute inset-0 -z-10 opacity-45" strength={120} />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-night via-night/80 to-night/30" aria-hidden />
        <div className="container-page">
          <Reveal>
            <p className="eyebrow !text-gold">Bangga produk Sumedang</p>
            <blockquote className="mt-5 max-w-3xl font-display text-4xl leading-[1.1] tracking-tight sm:text-6xl">
              “Dari <span className="text-gold-gradient italic">tahu Bungkeng</span> hingga batik dan kriya — setiap usaha layak mendapat panggung.”
            </blockquote>
            <p className="mt-6 max-w-xl text-ivory/70">MEDAL membuka akses yang sama bagi seluruh pelaku UMKM di 26 kecamatan Kabupaten Sumedang.</p>
          </Reveal>
        </div>
      </section>

      {/* Direktori */}
      <section className="py-20 sm:py-28">
        <div className="container-page">
          <Reveal>
            <SectionTitle
              eyebrow="Direktori UMKM"
              title={<>Kenali produk <em className="text-emerald">lokal terverifikasi</em></>}
              description="Hanya usaha yang telah diverifikasi Disperindag dan menyetujui publikasi profil yang tampil di sini."
              action={<ButtonLink href="/umkm" variant="outline">Buka direktori <ArrowRight className="size-4" /></ButtonLink>}
            />
          </Reveal>
          <div className="mt-12">
            {umkm.items.length ? (
              <Stagger className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5">
                {umkm.items.map((u) => (
                  <StaggerItem key={u.id}>
                    <UmkmCard item={u} />
                  </StaggerItem>
                ))}
              </Stagger>
            ) : (
              <EmptyState
                title="Direktori sedang disiapkan"
                description="Profil UMKM akan muncul setelah diverifikasi Disperindag dan pemiliknya menyetujui publikasi."
                action={<ButtonLink href="/daftar/umkm">Daftarkan Usaha</ButtonLink>}
              />
            )}
          </div>
        </div>
      </section>

      {/* Role CTA */}
      <section className="pb-20 sm:pb-28">
        <div className="container-page grid gap-5 lg:grid-cols-2">
          {[
            { href: "/daftar/umkm", eyebrow: "Saya pelaku UMKM", title: "Buka lapak di event terbaik Sumedang", body: "Profil sekali isi, daftar ke banyak event, dan pantau status hingga nomor stand.", img: "/images/jajan-pasar.jpg", icon: Store, cta: "Daftarkan usaha" },
            { href: "/daftar/penyelenggara", eyebrow: "Saya penyelenggara event", title: "Ajukan event & kelola peserta dengan rapi", body: "Komunitas, EO, desa, dan instansi dapat mengajukan event, menyeleksi peserta terverifikasi, dan ekspor rekap.", img: "/images/pasar-malam-1.jpg", icon: Megaphone, cta: "Ajukan event" },
          ].map((c, i) => (
            <Reveal key={c.href} delay={i * 0.1}>
              <Link href={c.href} className="group relative isolate flex min-h-[26rem] flex-col justify-end overflow-hidden rounded-[2rem] p-7 text-ivory sm:p-10">
                <Image src={c.img} alt="" fill sizes="(min-width:1024px) 50vw, 100vw" className="-z-20 object-cover transition duration-[1.2s] group-hover:scale-105" />
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-night via-night/70 to-night/10" aria-hidden />
                <span className="mb-auto grid size-12 place-items-center rounded-2xl bg-gold text-night">
                  <c.icon className="size-6" aria-hidden />
                </span>
                <p className="eyebrow !text-gold-soft">{c.eyebrow}</p>
                <h3 className="mt-3 max-w-md font-display text-3xl leading-tight sm:text-4xl">{c.title}</h3>
                <p className="mt-3 max-w-md text-ivory/75">{c.body}</p>
                <span className="mt-6 inline-flex items-center gap-2 font-semibold text-gold-soft">
                  {c.cta} <ArrowRight className="size-4 transition group-hover:translate-x-1" aria-hidden />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Stats from DB */}
      <section className="relative overflow-hidden bg-forest py-20 text-ivory sm:py-24">
        <div className="bg-emerald-mesh absolute inset-0 opacity-70" aria-hidden />
        <div className="container-page relative">
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <p className="eyebrow !text-gold">Angka ringkas</p>
                <h2 className="mt-3 max-w-xl font-display text-4xl leading-tight sm:text-5xl">Tumbuh bersama, tercatat transparan.</h2>
              </div>
              <p className="flex items-center gap-2 text-sm text-ivory/60">
                <ShieldCheck className="size-4 text-gold" aria-hidden /> Data langsung dari sistem MEDAL, diperbarui otomatis.
              </p>
            </div>
          </Reveal>
          <Stagger className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 lg:grid-cols-4">
            {[
              { label: "Event terbit", value: stats.events },
              { label: "UMKM di direktori", value: stats.umkm },
              { label: "Stand dikonfirmasi", value: stats.stands },
              { label: "Penyelenggara terverifikasi", value: stats.organizers },
            ].map((s) => (
              <StaggerItem key={s.label} className="bg-forest/90 p-6 sm:p-8">
                <CountUp value={s.value} className="font-display text-5xl text-gold-gradient sm:text-6xl" />
                <p className="mt-2 text-sm text-ivory/70">{s.label}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Disperindag */}
      <section className="py-20 sm:py-28">
        <div className="container-page">
          <Reveal>
            <div className="grid items-center gap-10 overflow-hidden rounded-[2rem] border border-line bg-surface p-6 sm:p-10 lg:grid-cols-[1fr_1.1fr]">
              <ParallaxImage src="/images/canting.jpg" alt="Proses mencanting batik tulis" className="aspect-[4/3] rounded-3xl lg:aspect-square" strength={50} sizes="(min-width:1024px) 45vw, 100vw" />
              <div>
                <p className="eyebrow">Bersama Disperindag Kabupaten Sumedang</p>
                <h2 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">Satu pintu resmi, terverifikasi &amp; aman.</h2>
                <ul className="mt-6 space-y-3.5 text-[15px] text-ink/80">
                  {[
                    "Event hanya tampil setelah disetujui Disperindag.",
                    "Dokumen legal UMKM tersimpan privat — tidak pernah dipublikasikan.",
                    "Kuota & nomor stand dijaga sistem agar tidak ganda atau melebihi kapasitas.",
                    "Setiap keputusan tercatat dalam riwayat yang dapat diaudit.",
                  ].map((t) => (
                    <li key={t} className="flex gap-3">
                      <BadgeCheck className="mt-0.5 size-5 shrink-0 text-emerald" aria-hidden />
                      {t}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap gap-3">
                  <ButtonLink href="/daftar">Mulai sekarang</ButtonLink>
                  <ButtonLink href="/tentang" variant="outline">Tentang MEDAL</ButtonLink>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
