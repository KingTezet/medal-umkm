import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/page-hero";
import { Heading, SectionBg } from "@/components/landing/sections";
import { PillLink, Rise, RiseGroup, RiseItem } from "@/components/landing/kit";
import { MegaphoneIcon, StoreIcon, VerifiedIcon } from "@/components/icons";
import { TEAM } from "@/data/team";
import { PHOTO_CREDITS } from "@/data/credits";
import { getPublicSettings } from "@/lib/queries";
import { formatPhone } from "@/lib/format";

export const metadata: Metadata = {
  title: "Tentang",
  description: "Tentang MEDAL (Media, Event, Dagang & Lapak): fungsi platform, peran Disperindag Kabupaten Sumedang, dan tim pengembang.",
};

const LETTERS = [
  { l: "M", word: "Media", body: "Etalase usaha dan produk lokal melalui direktori terverifikasi." },
  { l: "E", word: "Event", body: "Informasi bazar, festival, dan pameran yang disetujui Disperindag." },
  { l: "D", word: "Dagang", body: "Peluang pasar baru bagi UMKM di seluruh kecamatan." },
  { l: "AL", word: "& Lapak", body: "Pendaftaran stand transparan hingga nomor lapak final." },
];

const ROLES = [
  { icon: StoreIcon, tint: "bg-brand-100 text-brand-800", title: "Pelaku UMKM", body: "Membuat profil usaha, mendaftar stand, melengkapi dokumen, dan memantau status." },
  { icon: MegaphoneIcon, tint: "bg-sky-tint text-sky-ink", title: "Penyelenggara event", body: "Mengajukan event, menyeleksi peserta yang lolos verifikasi, dan mengekspor rekap." },
  { icon: VerifiedIcon, tint: "bg-[#fdeee9] text-coral", title: "Disperindag Sumedang", body: "Memverifikasi akun dan berkas, memublikasikan event, serta mengesahkan nomor stand." },
];

const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");

export default async function AboutPage() {
  const { contact } = await getPublicSettings();
  return (
    <>
      <PageHero eyebrow="Tentang" title={<>Satu pintu untuk UMKM Sumedang <span className="text-brand-700">tampil di event.</span></>} description="MEDAL mempertemukan pelaku UMKM dengan penyelenggara event, dikelola bersama Dinas Perindustrian dan Perdagangan Kabupaten Sumedang." />

      <section className="relative isolate py-20 sm:py-24">
        <SectionBg variant="dots-right" />
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <div>
            <Heading kicker="Latar belakang" title="Mengapa MEDAL dibangun" sub="Informasi event dan kesempatan berjualan sering tersebar di banyak kanal. MEDAL menyatukannya: profil usaha diisi sekali, setiap pendaftaran tercatat, dan setiap keputusan transparan." />
          </div>
          <Rise delay={0.1}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] shadow-[0_30px_60px_-35px_rgba(5,35,26,.5)]">
              <Image src="/images/p-keranjang-bambu.jpg" alt="Keranjang anyaman bambu karya perajin lokal" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
            </div>
          </Rise>
        </div>
      </section>

      <section className="relative isolate overflow-hidden py-20 sm:py-24">
        <SectionBg variant="dark" />
        <div className="container-page">
          <Heading dark kicker="Arti nama" title="MEDAL — dari semboyan “Insun Medal”" sub="Diambil dari semboyan Kabupaten Sumedang, “Insun Medal Insun Madangan”. Logo memadukan matahari terbit, siluet Tugu Lingga, dan kanopi lapak UMKM. MEDAL juga dapat dibaca sebagai Media, Event, Dagang & Lapak." />
          <RiseGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {LETTERS.map((x) => (
              <RiseItem key={x.word}>
                <div className="glass-dark h-full rounded-[24px] p-6">
                  <p className="display text-[44px] font-semibold leading-none text-brand-300">{x.l}</p>
                  <h3 className="display mt-4 text-[20px] font-semibold text-white">{x.word}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-white/70">{x.body}</p>
                </div>
              </RiseItem>
            ))}
          </RiseGroup>
        </div>
      </section>

      <section className="relative isolate py-20 sm:py-24">
        <SectionBg variant="blob-left" />
        <div className="container-page">
          <Heading kicker="Peran" title="Tiga pihak, satu alur." />
          <RiseGroup className="mt-12 grid gap-4 md:grid-cols-3">
            {ROLES.map((r) => (
              <RiseItem key={r.title}>
                <div className="h-full rounded-[24px] bg-white p-7 ring-1 ring-black/[0.06]">
                  <span className={`grid size-12 place-items-center rounded-2xl ${r.tint}`}><r.icon className="size-6" /></span>
                  <h3 className="display mt-6 text-[22px] font-semibold text-brand-950">{r.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-[#4c5c54]">{r.body}</p>
                </div>
              </RiseItem>
            ))}
          </RiseGroup>
        </div>
      </section>

      <section id="tim" className="relative isolate scroll-mt-24 overflow-hidden py-20 sm:py-24">
        <SectionBg variant="mint" />
        <div className="container-page">
          <Heading kicker="Tim pengembang" title="Tujuh orang di balik MEDAL." sub="Proyek kelompok untuk mendukung digitalisasi UMKM Kabupaten Sumedang." />
          <RiseGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((m, i) => (
              <RiseItem key={m.npm + i}>
                <div className="group h-full rounded-[24px] bg-white p-5 ring-1 ring-black/[0.06] transition-[box-shadow,transform] duration-500 hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgba(5,35,26,.4)]">
                  <div className="relative grid size-14 place-items-center overflow-hidden rounded-2xl bg-brand-900 text-[17px] font-semibold text-brand-300">
                    {m.photo ? <Image src={m.photo} alt={`Foto ${m.name}`} fill sizes="56px" className="object-cover" /> : initials(m.name)}
                  </div>
                  <h3 className="display mt-5 text-[18px] font-semibold leading-snug text-brand-950">{m.name}</h3>
                  <p className="text-[14px] font-medium text-brand-700">{m.role}</p>
                  <p className="mt-3 inline-flex rounded-full bg-brand-50 px-2.5 py-0.5 font-mono text-xs text-brand-900 ring-1 ring-brand-300/50">{m.npm}</p>
                  <p className="mt-3 text-[14px] leading-relaxed text-[#5b6b63]">{m.focus}</p>
                </div>
              </RiseItem>
            ))}
          </RiseGroup>
        </div>
      </section>

      <section className="relative isolate py-20 sm:py-24">
        <SectionBg variant="dots-right" />
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <div>
            <Heading kicker="Kontak resmi" title={contact.agency} />
            <Rise>
              <ul className="mt-5 space-y-1 text-[15px] text-[#4c5c54]">
                {contact.address && <li>{contact.address}</li>}
                {contact.phone && <li>Telepon: {formatPhone(contact.phone)}</li>}
                {contact.whatsapp && <li>WhatsApp: {formatPhone(contact.whatsapp)}</li>}
                {contact.email && <li>Email: {contact.email}</li>}
              </ul>
              <div className="mt-7 flex flex-wrap gap-3">
                <PillLink href="/events">Lihat event</PillLink>
                <PillLink href="/daftar" tone="light">Bergabung</PillLink>
              </div>
            </Rise>
          </div>
          <Rise delay={0.1}>
            <div id="kredit" className="scroll-mt-24 rounded-[24px] bg-white p-6 ring-1 ring-black/[0.06]">
              <p className="display text-[18px] font-semibold text-brand-950">Kredit foto</p>
              <p className="mt-1 text-[13px] text-muted">Foto dari Wikimedia Commons, digunakan sesuai lisensinya.</p>
              <ul className="mt-4 max-h-80 space-y-1.5 overflow-y-auto pr-2 text-xs leading-relaxed text-muted">
                {PHOTO_CREDITS.map((c) => (
                  <li key={c.file}><a href={c.source} target="_blank" rel="noopener noreferrer" className="font-medium text-brand-700 hover:underline">{c.title}</a> — {c.artist} · {c.license}</li>
                ))}
              </ul>
            </div>
          </Rise>
        </div>
      </section>
    </>
  );
}
