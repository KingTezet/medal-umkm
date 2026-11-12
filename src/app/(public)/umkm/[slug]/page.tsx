import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { AtSign, BadgeCheck, MapPin, MessageCircle, Package, Store } from "lucide-react";
import { getPublicUmkm } from "@/lib/queries";
import { asProducts, asStringArray, publicMediaUrl, umkmImage } from "@/lib/storage";
import { BUCKETS } from "@/lib/constants";
import { formatPhone, waLink } from "@/lib/format";
import { Breadcrumb } from "@/components/ui/misc";
import { Reveal } from "@/components/motion";
import { buttonClass } from "@/components/ui/button";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const u = await getPublicUmkm(slug);
  if (!u) return { title: "UMKM tidak ditemukan" };
  return { title: u.business_name ?? "UMKM", description: u.description?.slice(0, 160) ?? `${u.business_name} — UMKM ${u.category} di ${u.district}, Sumedang.` };
}

export default async function UmkmDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const u = await getPublicUmkm(slug);
  if (!u) notFound();
  const products = asProducts(u.products);
  const gallery = asStringArray(u.gallery_paths).map((p) => publicMediaUrl(BUCKETS.umkmMedia, p)!);
  const wa = waLink(u.whatsapp, `Halo ${u.business_name}, saya melihat profil Anda di MEDAL Sumedang.`);
  const hasImage = !!(u.cover_path || u.logo_path);

  return (
    <article className="container-page py-6 sm:py-8">
      <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Direktori UMKM", href: "/umkm" }, { label: u.business_name ?? "" }]} />
      <div className="grid gap-8 lg:grid-cols-[1fr_20rem] lg:gap-12">
        <div className="min-w-0">
          <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-surface-muted">
            {hasImage ? <Image src={umkmImage(u.cover_path ?? u.logo_path, u.slug ?? "")} alt={`Foto usaha ${u.business_name}`} fill priority sizes="(min-width:1024px) 60vw, 100vw" className="object-cover" /> : <div className="grid size-full place-items-center text-muted"><Store className="size-10" aria-hidden /></div>}
          </div>
          <p className="mt-6 text-[13px] text-muted">{u.category}</p>
          <h1 className="mt-1 text-[28px] font-semibold leading-tight sm:text-[36px]">{u.business_name}</h1>
          <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
            <span className="flex items-center gap-1.5"><MapPin className="size-4" aria-hidden />{[u.village, u.district, "Sumedang"].filter(Boolean).join(", ")}</span>
            <span className="flex items-center gap-1.5 text-primary"><BadgeCheck className="size-4" aria-hidden />Terverifikasi Disperindag</span>
          </p>

          <Reveal className="mt-8">
            <h2 className="text-[20px] font-semibold">Tentang usaha</h2>
            <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-ink/85">{u.description || "Pemilik usaha belum menambahkan deskripsi."}</p>
          </Reveal>
          {products.length > 0 && (
            <Reveal className="mt-8">
              <h2 className="text-[20px] font-semibold">Produk &amp; layanan</h2>
              <ul className="mt-3 divide-y divide-line rounded-xl border border-line">
                {products.map((p) => (
                  <li key={p.name} className="flex gap-3 px-4 py-3">
                    <Package className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                    <div><p className="text-sm font-medium">{p.name}</p>{p.description && <p className="text-[13px] text-muted">{p.description}</p>}</div>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
          {gallery.length > 0 && (
            <Reveal className="mt-8">
              <h2 className="text-[20px] font-semibold">Galeri</h2>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {gallery.map((g, i) => (
                  <div key={g} className="relative aspect-square overflow-hidden rounded-xl bg-surface-muted">
                    <Image src={g} alt={`Foto produk ${u.business_name} ${i + 1}`} fill sizes="(min-width:640px) 33vw, 50vw" className="object-cover" />
                  </div>
                ))}
              </div>
            </Reveal>
          )}
        </div>
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-line p-5">
            <p className="text-sm font-semibold">Hubungi usaha</p>
            {wa || u.instagram ? (
              <div className="mt-3 grid gap-2">
                {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className={buttonClass("primary", "md", "w-full")}><MessageCircle className="size-4" aria-hidden /> WhatsApp {formatPhone(u.whatsapp)}</a>}
                {u.instagram && <a href={`https://instagram.com/${u.instagram}`} target="_blank" rel="noopener noreferrer" className={buttonClass("secondary", "md", "w-full")}><AtSign className="size-4" aria-hidden /> {u.instagram}</a>}
              </div>
            ) : (
              <p className="mt-2 text-sm text-muted">Pemilik usaha belum mempublikasikan kontak.</p>
            )}
            <p className="mt-4 text-xs leading-relaxed text-muted">MEDAL bukan marketplace. Transaksi dilakukan langsung dengan pelaku usaha.</p>
          </div>
        </aside>
      </div>
    </article>
  );
}
