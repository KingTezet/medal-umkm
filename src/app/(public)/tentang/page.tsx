import type { Metadata } from "next";
import Image from "next/image";
import { Building2, Megaphone, Store } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { ButtonLink } from "@/components/ui/button";
import { SectionTitle } from "@/components/ui/misc";
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
  { l: "AL", word: "& Lapak", body: "Pendaftaran stand yang transparan hingga nomor lapak final." },
];

const ROLES = [
  { icon: Store, title: "Pelaku UMKM", body: "Membuat profil usaha, mendaftar stand, melengkapi dokumen, dan memantau status." },
  { icon: Megaphone, title: "Penyelenggara event", body: "Mengajukan event, menyeleksi peserta yang lolos verifikasi, dan mengekspor rekap." },
  { icon: Building2, title: "Disperindag Sumedang", body: "Memverifikasi akun dan berkas, memublikasikan event, serta mengesahkan nomor stand." },
];

const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");

export default async function AboutPage() {
  const { contact } = await getPublicSettings();
  return (
    <>
      <PageHero eyebrow="Tentang" title="Satu pintu untuk UMKM Sumedang tampil di event" description="MEDAL mempertemukan pelaku UMKM dengan penyelenggara event, dikelola bersama Dinas Perindustrian dan Perdagangan Kabupaten Sumedang." />

      <section className="section">
        <div className="container-page grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <SectionTitle eyebrow="Latar belakang" title="Mengapa MEDAL dibangun" />
            <p className="mt-4 text-[15px] leading-relaxed text-ink/85">
              Informasi event dan kesempatan berjualan sering tersebar di banyak kanal. Pelaku UMKM sulit mengetahui event yang membuka pendaftaran, sisa kuota, dan status berkasnya. MEDAL menyatukan semuanya: profil usaha diisi sekali, setiap pendaftaran tercatat, dan setiap keputusan transparan.
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-surface-muted">
              <Image src="/images/batik.jpg" alt="Perajin membatik tulis" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section border-y border-line bg-surface-muted">
        <div className="container-page">
          <Reveal><SectionTitle eyebrow="Arti nama" title="MEDAL — Media, Event, Dagang & Lapak" /></Reveal>
          <Stagger className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {LETTERS.map((x) => (
              <StaggerItem key={x.word}>
                <div className="h-full rounded-xl border border-line bg-white p-5">
                  <p className="text-[28px] font-semibold leading-none text-primary">{x.l}</p>
                  <h3 className="mt-3 text-[16px] font-semibold">{x.word}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{x.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <Reveal><SectionTitle eyebrow="Peran" title="Tiga pihak, satu alur" /></Reveal>
          <Stagger className="mt-8 grid gap-3 md:grid-cols-3">
            {ROLES.map((r) => (
              <StaggerItem key={r.title}>
                <div className="h-full rounded-xl border border-line p-5">
                  <span className="grid size-10 place-items-center rounded-lg bg-primary-soft text-primary"><r.icon className="size-5" aria-hidden /></span>
                  <h3 className="mt-4 text-[16px] font-semibold">{r.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{r.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section id="tim" className="section scroll-mt-20 border-t border-line bg-surface-muted">
        <div className="container-page">
          <Reveal><SectionTitle eyebrow="Tim pengembang" title="Tujuh orang di balik MEDAL" description="Proyek kelompok untuk mendukung digitalisasi UMKM Kabupaten Sumedang." /></Reveal>
          <Stagger className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((m, i) => (
              <StaggerItem key={m.npm + i}>
                <div className="flex h-full items-start gap-3.5 rounded-xl border border-line bg-white p-4">
                  <div className="relative grid size-12 shrink-0 place-items-center overflow-hidden rounded-full bg-primary-soft text-sm font-semibold text-primary">
                    {m.photo ? <Image src={m.photo} alt={`Foto ${m.name}`} fill sizes="48px" className="object-cover" /> : initials(m.name)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[15px] font-semibold leading-snug">{m.name}</h3>
                    <p className="text-[13px] text-primary">{m.role}</p>
                    <p className="mt-1 font-mono text-xs text-muted">{m.npm}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="section">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <Reveal>
            <SectionTitle eyebrow="Kontak resmi" title={contact.agency} />
            <ul className="mt-4 space-y-1 text-[15px] text-ink/85">
              {contact.address && <li>{contact.address}</li>}
              {contact.phone && <li>Telepon: {formatPhone(contact.phone)}</li>}
              {contact.whatsapp && <li>WhatsApp: {formatPhone(contact.whatsapp)}</li>}
              {contact.email && <li>Email: {contact.email}</li>}
            </ul>
            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
              <ButtonLink href="/events">Lihat event</ButtonLink>
              <ButtonLink href="/daftar" variant="secondary">Bergabung</ButtonLink>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <div id="kredit" className="scroll-mt-24 rounded-xl border border-line p-5">
              <p className="text-sm font-semibold">Kredit foto</p>
              <p className="mt-1 text-[13px] text-muted">Foto ilustrasi dari Wikimedia Commons, digunakan sesuai lisensinya.</p>
              <ul className="mt-3 space-y-1.5 text-xs leading-relaxed text-muted">
                {PHOTO_CREDITS.map((c) => (
                  <li key={c.file}><a href={c.source} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">{c.title}</a> — {c.artist} · {c.license}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
