import type { MetadataRoute } from "next";
import { createPublicClient } from "@/lib/supabase/server";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const statics = ["", "/events", "/umkm", "/tentang", "/daftar", "/login", "/kebijakan-privasi", "/syarat-ketentuan"].map((p) => ({ url: `${base}${p}`, changeFrequency: "weekly" as const }));
  try {
    const sb = createPublicClient();
    const [{ data: events }, { data: umkm }] = await Promise.all([
      sb.from("public_events").select("slug, published_at").limit(500),
      sb.from("public_business_profiles").select("slug, verified_at").limit(1000),
    ]);
    return [
      ...statics,
      ...(events ?? []).map((e) => ({ url: `${base}/events/${e.slug}`, lastModified: e.published_at ?? undefined })),
      ...(umkm ?? []).map((u) => ({ url: `${base}/umkm/${u.slug}`, lastModified: u.verified_at ?? undefined })),
    ];
  } catch {
    return statics;
  }
}
