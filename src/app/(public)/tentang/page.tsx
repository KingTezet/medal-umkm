import type { Metadata } from "next";
import { Building2, CalendarCheck2, Handshake, Megaphone, ShieldCheck, Store } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { ParallaxImage, Reveal, Stagger, StaggerItem } from "@/components/motion";
import { ButtonLink } from "@/components/ui/button";
import { TEAM } from "@/data/team";
import { PHOTO_CREDITS } from "@/data/credits";
import { getPublicSettings } from "@/lib/queries";
import { formatPhone } from "@/lib/format";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description: "Tentang MEDAL (Media, Event, Dagang & Lapak): tujuan program, peran Disperindag Kabupaten Sumedang, dan tim pengembang.",
};

const LETTERS = [
  { l: "M", word: "Media", body: "Etalase digital untuk mengenalkan usaha & produk lokal melalui direktori terverifikasi." },
  { l: "E", word: "Event", body: "Informasi bazar, festival, dan pameran yang telah disetujui Disperindag." },
  { l: "D", word: "Dagang", body: "Membuka peluang pasar baru bagi pelaku UMKM di seluruh kecamatan." },
  { l: "AL", word: "& Lapak", body: "Pendaftaran stand yang transparan hingga nomor lapak final." },
];

const ROLES = [
  { icon: Store, title: "Pelaku UMKM", body: "Membuat profil usaha, mendaftar stand, melengkapi dokumen, dan memantau status." },
  { icon: Megaphone, title: "Penyelenggara Event", body: "Mengajukan event, menyeleksi peserta yang lolos verifikasi, dan mengekspor rekap." },
  { icon: Building2, title: "Disperindag Sumedang", body: "Memverifikasi akun & berkas, memublikasikan event, dan mengesahkan nomor stand." },
];

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

export default async function AboutPage() {
  const { contact } = await getPublicSettings();
  return (
    <>
      <PageHero
        eyebrow="Tentang Kami"
        title={<>Satu pintu untuk <em className="text-gold-gradient">UMKM Sumedang</em> naik panggung</>}
        description="MEDAL adalah platform yang mempertemukan pelaku UMKM dengan penyelenggara event, dikelola bersama Dinas Perindustrian dan Perdagangan Kabupaten Sumedang."
        image="/images/sawah.jpg"
      />

      {/* Acronym */}
      <section className="py-20 sm:py-28">
        <div className="container-page">
          <Reveal>
            <p className="eyebrow">Arti nama</p>
            <h2 className="mt-3 max-w-2xl font-display text-4xl leading-tight sm:text-5xl">MEDAL — penghargaan untuk setiap usaha yang berani tampil.</h2>
          </Reveal>
          <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {LETTERS.map((x) => (
              <StaggerItem key={x.word}>
                <div className="group h-full rounded-3xl border border-line bg-surface p-6 transition hover:-translate-y-1 hover:border-gold/50">
                  <span className="font-display text-7xl leading-none text-gold-gradient">{x.l}</span>
                  <h3 className="mt-4 font-display text-2xl text-forest">{x.word}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{x.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Program */}
      <section className="bg-sage/60 py-20 sm:py-28">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <ParallaxImage src="/images/rempah.jpg" alt="Rempah tradisional di pasar" className="aspect-[4/5] rounded-[2rem]" strength={60} sizes="(min-width:1024px) 50vw, 100vw" />
          <div>
            <Reveal>
              <p className="eyebrow">Program</p>
              <h2 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">Mengapa MEDAL dibangun?</h2>
              <p className="mt-5 text-[16px] leading-relaxed text-ink/80">
                Informasi event dan kesempatan berjualan sering tersebar di banyak kanal. Pelaku UMKM kesulitan mengetahui event yang membuka pendaftaran,
                sisa kuota, dan status berkasnya. MEDAL menyatukan semuanya: profil usaha cukup diisi sekali, setiap pendaftaran tercatat, dan setiap keputusan transparan.
              </p>
            </Reveal>
            <Stagger className="mt-8 grid gap-3">
              {ROLES.map((r) => (
                <StaggerItem key={r.title}>
                  <div className="flex gap-4 rounded-2xl border border-line bg-surface p-5">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-forest text-gold"><r.icon className="size-5" aria-hidden /></span>
                    <div>
                      <h3 className="font-semibold text-ink">{r.title}</h3>
                      <p className="mt-1 text-sm text-muted">{r.body}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="tim" className="relative scroll-mt-20 overflow-hidden bg-night py-20 text-ivory sm:py-28">
        <div className="bg-emerald-mesh absolute inset-0 opacity-80" aria-hidden />
        <div className="bg-grain absolute inset-0" aria-hidden />
        <div className="container-page relative">
          <Reveal>
            <p className="eyebrow !text-gold">About us · Tim pengembang</p>
            <h2 className="mt-3 max-w-2xl font-display text-4xl leading-tight sm:text-5xl">Tujuh orang di balik MEDAL.</h2>
            <p className="mt-4 max-w-xl text-ivory/70">Kami merancang, membangun, dan menguji MEDAL sebagai proyek kelompok untuk mendukung digitalisasi UMKM Kabupaten Sumedang.</p>
          </Reveal>
          <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" gap={0.07}>
            {TEAM.map((m, i) => (
              <StaggerItem key={m.npm + i} className={i === 0 ? "sm:col-span-2 lg:col-span-1" : undefined}>
                <div className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur transition duration-500 hover:-translate-y-1 hover:border-gold/40 hover:bg-white/[0.08]">
                  <div className="flex items-center gap-4">
                    <div className="relative grid size-16 shrink-0 place-items-center rounded-full bg-[conic-gradient(from_180deg,#c6a15b,#f3e2b6,#2b8a67,#c6a15b)] p-[2px]">
                      <div className="relative grid size-full place-items-center overflow-hidden rounded-full bg-forest font-display text-xl text-gold-soft">
                        {m.photo ? <Image src={m.photo} alt={`Foto ${m.name}`} fill sizes="64px" className="object-cover" /> : initials(m.name)}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-gold">{m.role}</p>
                      <h3 className="mt-1 font-display text-xl leading-tight">{m.name}</h3>
                    </div>
                  </div>
                  <p className="mt-5 inline-flex rounded-full border border-gold/30 bg-gold/10 px-3 py-1 font-mono text-xs tracking-wider text-gold-soft">{m.npm}</p>
                  <p className="mt-4 text-sm leading-relaxed text-ivory/65">{m.focus}</p>
                </div>
              </StaggerItem>
            ))}
            <StaggerItem>
              <div className="flex h-full flex-col justify-between rounded-3xl bg-gold p-6 text-night">
                <p className="font-display text-2xl leading-snug">Ingin berkolaborasi atau memberi masukan?</p>
                <ButtonLink href="/daftar" variant="dark" className="mt-6 self-start">Gabung MEDAL</ButtonLink>
              </div>
            </StaggerItem>
          </Stagger>
        </div>
      </section>

      {/* Contact + credits */}
      <section className="py-20">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">Kontak resmi</p>
            <h2 className="mt-3 font-display text-3xl">{contact.agency}</h2>
            <ul className="mt-4 space-y-1.5 text-[15px] text-ink/80">
              {contact.address && <li>{contact.address}</li>}
              {contact.phone && <li>Telepon: {formatPhone(contact.phone)}</li>}
              {contact.whatsapp && <li>WhatsApp: {formatPhone(contact.whatsapp)}</li>}
              {contact.email && <li>Email: {contact.email}</li>}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href="/events"><CalendarCheck2 className="size-4" /> Lihat event</ButtonLink>
              <ButtonLink href="/daftar" variant="outline"><Handshake className="size-4" /> Bergabung</ButtonLink>
            </div>
            <p className="mt-6 flex items-center gap-2 text-sm text-muted"><ShieldCheck className="size-4 text-emerald" /> Data pribadi dilindungi sesuai Kebijakan Privasi MEDAL.</p>
          </Reveal>
          <Reveal delay={0.1}>
            <div id="kredit" className="scroll-mt-24 rounded-3xl border border-line bg-surface p-6">
              <p className="eyebrow">Kredit foto</p>
              <p className="mt-2 text-sm text-muted">Foto ilustrasi berasal dari Wikimedia Commons dan digunakan sesuai lisensinya.</p>
              <ul className="mt-4 space-y-2 text-xs leading-relaxed text-ink/75">
                {PHOTO_CREDITS.map((c) => (
                  <li key={c.file}>
                    <a href={c.source} target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald hover:underline">{c.title}</a> — {c.artist} · {c.license}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
