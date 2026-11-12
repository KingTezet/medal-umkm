import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { BadgeCheck, AtSign, MapPin, MessageCircle, Package } from "lucide-react";
import { getPublicUmkm } from "@/lib/queries";
import { asProducts, asStringArray, publicMediaUrl, umkmImage } from "@/lib/storage";
import { BUCKETS } from "@/lib/constants";
import { formatPhone, waLink } from "@/lib/format";
import { Breadcrumb } from "@/components/ui/misc";
import { ParallaxImage, Reveal, Stagger, StaggerItem } from "@/components/motion";
import { buttonClass } from "@/components/ui/button";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const u = await getPublicUmkm(slug);
  if (!u) return { title: "UMKM tidak ditemukan" };
  return {
    title: u.business_name ?? "UMKM",
    description: u.description?.slice(0, 160) ?? `${u.business_name} — UMKM ${u.category} di ${u.district}, Sumedang.`,
    openGraph: { images: [{ url: umkmImage(u.cover_path ?? u.logo_path, u.slug ?? "") }] },
  };
}

export default async function UmkmDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const u = await getPublicUmkm(slug);
  if (!u) notFound();
  const products = asProducts(u.products);
  const gallery = asStringArray(u.gallery_paths).map((p) => publicMediaUrl(BUCKETS.umkmMedia, p)!);
  const wa = waLink(u.whatsapp, `Halo ${u.business_name}, saya melihat profil Anda di MEDAL Sumedang.`);

  return (
    <article>
      <section className="relative isolate overflow-hidden bg-night text-ivory">
        <ParallaxImage src={umkmImage(u.cover_path ?? u.logo_path, u.slug ?? "")} alt="" priority className="!absolute inset-0 -z-20 opacity-60" strength={80} />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-night via-night/70 to-night/20" aria-hidden />
        <div className="container-page flex min-h-[56svh] flex-col justify-end pb-12 pt-32">
          <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Direktori UMKM", href: "/umkm" }, { label: u.business_name ?? "" }]} />
          <div className="flex items-end gap-5">
            <div className="relative size-20 shrink-0 overflow-hidden rounded-3xl border-2 border-gold/60 bg-ivory sm:size-28">
              <Image src={umkmImage(u.logo_path ?? u.cover_path, u.slug ?? "")} alt={`Logo ${u.business_name}`} fill sizes="112px" className="object-cover" />
            </div>
            <div>
              <p className="eyebrow !text-gold-soft">{u.category}</p>
              <h1 className="mt-1 font-display text-4xl leading-tight sm:text-6xl">{u.business_name}</h1>
              <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ivory/80">
                <span className="flex items-center gap-1.5"><MapPin className="size-4 text-gold" aria-hidden />{[u.village, u.district, "Sumedang"].filter(Boolean).join(", ")}</span>
                <span className="flex items-center gap-1.5"><BadgeCheck className="size-4 text-gold" aria-hidden />Terverifikasi Disperindag</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container-page grid gap-10 py-14 lg:grid-cols-[1fr_20rem]">
        <div className="min-w-0 space-y-12">
          <Reveal>
            <h2 className="font-display text-3xl">Tentang usaha</h2>
            <p className="mt-4 whitespace-pre-line text-[16px] leading-relaxed text-ink/85">{u.description || "Pemilik usaha belum menambahkan deskripsi."}</p>
          </Reveal>
          {products.length > 0 && (
            <div>
              <h2 className="font-display text-3xl">Produk &amp; layanan</h2>
              <Stagger className="mt-5 grid gap-3 sm:grid-cols-2">
                {products.map((p) => (
                  <StaggerItem key={p.name}>
                    <div className="flex h-full gap-4 rounded-2xl border border-line bg-surface p-4">
                      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-sage text-emerald"><Package className="size-5" aria-hidden /></span>
                      <div>
                        <p className="font-semibold">{p.name}</p>
                        {p.description && <p className="mt-1 text-sm text-muted">{p.description}</p>}
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          )}
          {gallery.length > 0 && (
            <div>
              <h2 className="font-display text-3xl">Galeri</h2>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {gallery.map((g, i) => (
                  <div key={g} className="relative aspect-square overflow-hidden rounded-2xl">
                    <Image src={g} alt={`Foto produk ${u.business_name} ${i + 1}`} fill sizes="(min-width:640px) 33vw, 50vw" className="object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-line bg-surface p-6">
            <p className="eyebrow">Hubungi usaha</p>
            {wa || u.instagram ? (
              <div className="mt-4 grid gap-3">
                {wa && (
                  <a href={wa} target="_blank" rel="noopener noreferrer" className={buttonClass("primary", "md", "w-full")}>
                    <MessageCircle className="size-4" aria-hidden /> WhatsApp {formatPhone(u.whatsapp)}
                  </a>
                )}
                {u.instagram && (
                  <a href={`https://instagram.com/${u.instagram}`} target="_blank" rel="noopener noreferrer" className={buttonClass("outline", "md", "w-full")}>
                    <AtSign className="size-4" aria-hidden /> @{u.instagram}
                  </a>
                )}
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted">Pemilik usaha belum mempublikasikan kontak.</p>
            )}
            <p className="mt-5 text-xs leading-relaxed text-muted">MEDAL bukan marketplace. Transaksi dilakukan langsung dengan pelaku usaha.</p>
          </div>
        </aside>
      </div>
    </article>
  );
}
