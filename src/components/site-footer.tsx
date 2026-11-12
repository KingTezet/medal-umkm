import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Wordmark } from "@/components/brand";
import { getPublicSettings } from "@/lib/queries";
import { formatPhone, waLink } from "@/lib/format";

const LINKS = [
  { title: "Jelajahi", items: [["/events", "Event"], ["/umkm", "Direktori UMKM"], ["/tentang", "Tentang MEDAL"], ["/cek-status", "Cek status pendaftaran"]] },
  { title: "Bergabung", items: [["/daftar/umkm", "Daftar sebagai UMKM"], ["/daftar/penyelenggara", "Ajukan event"], ["/login", "Masuk"]] },
  { title: "Kebijakan", items: [["/kebijakan-privasi", "Kebijakan privasi"], ["/syarat-ketentuan", "Syarat & ketentuan"]] },
];

export async function SiteFooter() {
  const { contact } = await getPublicSettings();
  const wa = waLink(contact.whatsapp);
  return (
    <footer className="border-t border-line bg-white">
      <div className="container-page py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="max-w-xs">
            <Wordmark />
            <p className="mt-4 text-sm leading-relaxed text-muted">Satu pintu informasi event dan pendaftaran stand UMKM Kabupaten Sumedang, dikelola bersama Disperindag.</p>
            <ul className="mt-5 space-y-2 text-sm text-muted">
              <li className="flex gap-2"><MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden /><span>{contact.agency}{contact.address ? `, ${contact.address}` : ""}</span></li>
              {contact.phone && <li className="flex gap-2"><Phone className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />{formatPhone(contact.phone)}</li>}
              {wa && <li><a href={wa} target="_blank" rel="noopener noreferrer" className="flex gap-2 hover:text-primary"><Phone className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />WhatsApp {formatPhone(contact.whatsapp)}</a></li>}
              {contact.email && <li><a href={`mailto:${contact.email}`} className="flex gap-2 hover:text-primary"><Mail className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />{contact.email}</a></li>}
            </ul>
          </div>
          {LINKS.map((g) => (
            <div key={g.title}>
              <h2 className="text-sm font-semibold text-ink">{g.title}</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {g.items.map(([href, label]) => (
                  <li key={href}><Link href={href} className="text-muted transition-colors hover:text-primary">{label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} MEDAL — Media, Event, Dagang &amp; Lapak.</p>
          <p>Foto: Wikimedia Commons (CC BY/CC BY-SA) · <Link href="/tentang#kredit" className="underline hover:text-primary">kredit</Link></p>
        </div>
      </div>
    </footer>
  );
}
