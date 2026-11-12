import { BUCKETS, FALLBACK_IMAGES } from "@/lib/constants";

const base = () => process.env.NEXT_PUBLIC_SUPABASE_URL;

export function publicMediaUrl(bucket: typeof BUCKETS.eventMedia | typeof BUCKETS.umkmMedia, path: string | null | undefined): string | null {
  if (!path) return null;
  return `${base()}/storage/v1/object/public/${bucket}/${path.split("/").map(encodeURIComponent).join("/")}`;
}

export function eventCover(path: string | null | undefined, seed = ""): string {
  return publicMediaUrl(BUCKETS.eventMedia, path) ?? fallbackImage(seed);
}

export function umkmImage(path: string | null | undefined, seed = ""): string {
  return publicMediaUrl(BUCKETS.umkmMedia, path) ?? fallbackImage(seed);
}

export function fallbackImage(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return FALLBACK_IMAGES[h % FALLBACK_IMAGES.length];
}

export function asStringArray(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
}

export interface ProductItem {
  name: string;
  description?: string;
}
export function asProducts(v: unknown): ProductItem[] {
  if (!Array.isArray(v)) return [];
  return v
    .filter((x): x is { name: unknown; description?: unknown } => !!x && typeof x === "object" && "name" in x)
    .map((x) => ({ name: String(x.name), description: x.description ? String(x.description) : "" }));
}
