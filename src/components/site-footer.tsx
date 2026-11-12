import Link from "next/link";
import { AtSign, Mail, MapPin, Phone } from "lucide-react";
import { Wordmark } from "@/components/brand";
import { getPublicSettings } from "@/lib/queries";
import { formatPhone, waLink } from "@/lib/format";

export async function SiteFooter() {
  const { contact } = await getPublicSettings();
  const wa = waLink(contact.whatsapp);
  return (
    <footer className="relative overflow-hidden bg-night text-ivory">
      <div className="bg-emerald-mesh absolute inset-0 opacity-60" aria-hidden />
      <div className="bg-grain absolute inset-0" aria-hidden />
      <div className="container-page relative py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Wordmark light />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ivory/70">
              <span className="font-semibold text-gold-soft">Media, Event, Dagang &amp; Lapak.</span> Satu pintu resmi untuk menemukan event, mendaftar stand,
              dan memperluas pasar UMKM Kabupaten Sumedang.
            </p>
          </div>
          <div>
            <h2 className="eyebrow !text-gold">Jelajahi</h2>
            <ul className="mt-4 space-y-2.5 text-sm text-ivory/75">
              <li><Link className="hover:text-gold-soft" href="/events">Event &amp; Bazar</Link></li>
              <li><Link className="hover:text-gold-soft" href="/umkm">Direktori UMKM</Link></li>
              <li><Link className="hover:text-gold-soft" href="/tentang">Tentang Kami</Link></li>
              <li><Link className="hover:text-gold-soft" href="/cek-status">Cek Status Pendaftaran</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="eyebrow !text-gold">Bergabung</h2>
            <ul className="mt-4 space-y-2.5 text-sm text-ivory/75">
              <li><Link className="hover:text-gold-soft" href="/daftar/umkm">Daftar sebagai UMKM</Link></li>
              <li><Link className="hover:text-gold-soft" href="/daftar/penyelenggara">Ajukan Event</Link></li>
              <li><Link className="hover:text-gold-soft" href="/login">Masuk</Link></li>
              <li><Link className="hover:text-gold-soft" href="/kebijakan-privasi">Kebijakan Privasi</Link></li>
              <li><Link className="hover:text-gold-soft" href="/syarat-ketentuan">Syarat &amp; Ketentuan</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="eyebrow !text-gold">Kontak Resmi</h2>
            <ul className="mt-4 space-y-3 text-sm text-ivory/75">
              <li className="flex gap-2.5"><MapPin className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden /><span>{contact.agency}{contact.address ? <><br />{contact.address}</> : null}</span></li>
              {contact.phone && <li className="flex gap-2.5"><Phone className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />{formatPhone(contact.phone)}</li>}
              {wa && <li><a href={wa} target="_blank" rel="noopener noreferrer" className="flex gap-2.5 hover:text-gold-soft"><Phone className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />WhatsApp {formatPhone(contact.whatsapp)}</a></li>}
              {contact.email && <li><a href={`mailto:${contact.email}`} className="flex gap-2.5 hover:text-gold-soft"><Mail className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />{contact.email}</a></li>}
              {contact.instagram && <li className="flex gap-2.5"><AtSign className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />@{contact.instagram.replace(/^@/, "")}</li>}
            </ul>
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-ivory/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} MEDAL · Platform UMKM Kabupaten Sumedang. Dikelola bersama Disperindag.</p>
          <p>
            Foto: Wikimedia Commons (CC BY / CC BY-SA) — <Link href="/tentang#kredit" className="underline hover:text-gold-soft">kredit</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
