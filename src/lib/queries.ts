import "server-only";
import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

export type PublicEvent = Database["public"]["Views"]["public_events"]["Row"];
export type PublicBusiness = Database["public"]["Views"]["public_business_profiles"]["Row"];

export interface ContactSettings {
  agency: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  instagram: string;
}
export interface PublicSettings {
  contact: ContactSettings;
  announcement: { enabled: boolean; text: string };
  hero: { headline: string; subheadline: string };
}

const DEFAULT_SETTINGS: PublicSettings = {
  contact: {
    agency: "Dinas Perindustrian dan Perdagangan Kabupaten Sumedang",
    address: "",
    phone: "",
    whatsapp: "",
    email: "",
    instagram: "",
  },
  announcement: { enabled: false, text: "" },
  hero: {
    headline: "Temukan Event. Perluas Pasar. Tumbuhkan UMKM Sumedang.",
    subheadline:
      "MEDAL menghubungkan pelaku UMKM dengan penyelenggara event — dari pendaftaran stand, verifikasi Disperindag, hingga nomor lapak final.",
  },
};

export const getPublicSettings = cache(async (): Promise<PublicSettings> => {
  const { data } = await createPublicClient().from("platform_settings").select("key,value").eq("is_public", true);
  const out: PublicSettings = structuredClone(DEFAULT_SETTINGS);
  for (const row of data ?? []) {
    if (row.key === "contact" || row.key === "announcement" || row.key === "hero") {
      Object.assign(out[row.key], row.value as object);
    }
  }
  return out;
});

export const getPublicStats = cache(async () => {
  const { data } = await createPublicClient().rpc("get_public_stats");
  const d = (data ?? {}) as Record<string, number>;
  return {
    events: d.events_published ?? 0,
    umkm: d.umkm_public ?? 0,
    stands: d.stands_confirmed ?? 0,
    organizers: d.organizers_verified ?? 0,
  };
});

export const getCategories = cache(async (kind: "event" | "umkm") => {
  const { data } = await createPublicClient()
    .from("event_categories")
    .select("id,name,slug")
    .eq("kind", kind)
    .eq("is_active", true)
    .order("sort_order")
    .order("name");
  return data ?? [];
});

/** Escape characters with meaning inside PostgREST or() filters / ilike. */
export function sanitizeSearch(q: string): string {
  return q.replace(/[%_,()\\.*:"']/g, " ").replace(/\s+/g, " ").trim().slice(0, 60);
}

export type EventFilter = "all" | "open" | "upcoming" | "closed";

export async function listPublicEvents(opts: {
  q?: string;
  category?: string;
  district?: string;
  filter?: EventFilter;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
}) {
  const pageSize = opts.pageSize ?? 9;
  const page = Math.max(1, opts.page ?? 1);
  const nowIso = new Date().toISOString();
  let query = createPublicClient().from("public_events").select("*", { count: "exact" });

  const q = opts.q ? sanitizeSearch(opts.q) : "";
  if (q) query = query.or(`title.ilike.%${q}%,summary.ilike.%${q}%,venue_name.ilike.%${q}%,district.ilike.%${q}%,organization_name.ilike.%${q}%`);
  if (opts.category) query = query.eq("category", opts.category);
  if (opts.district) query = query.eq("district", opts.district);
  if (opts.from) query = query.gte("starts_at", new Date(`${opts.from}T00:00:00+07:00`).toISOString());
  if (opts.to) query = query.lte("starts_at", new Date(`${opts.to}T23:59:59+07:00`).toISOString());

  switch (opts.filter) {
    case "open":
      query = query.eq("status", "published").lte("registration_opens_at", nowIso).gte("registration_closes_at", nowIso);
      break;
    case "upcoming":
      query = query.eq("status", "published").gt("registration_opens_at", nowIso);
      break;
    case "closed":
      query = query.or(`status.eq.completed,registration_closes_at.lt.${nowIso}`);
      break;
  }

  const { data, count, error } = await query
    .order("registration_closes_at", { ascending: true })
    .range((page - 1) * pageSize, page * pageSize - 1);
  return { events: data ?? [], total: count ?? 0, page, pageSize, error };
}

export async function listFeaturedEvents(limit = 4) {
  const nowIso = new Date().toISOString();
  const { data } = await createPublicClient()
    .from("public_events")
    .select("*")
    .eq("status", "published")
    .gte("registration_closes_at", nowIso)
    .order("registration_opens_at", { ascending: true })
    .limit(limit);
  return data ?? [];
}

export const getPublicEvent = cache(async (slug: string) => {
  const { data } = await createPublicClient().from("public_events").select("*").eq("slug", slug).maybeSingle();
  return data;
});

export async function listPublicUmkm(opts: { q?: string; category?: string; district?: string; page?: number; pageSize?: number }) {
  const pageSize = opts.pageSize ?? 12;
  const page = Math.max(1, opts.page ?? 1);
  let query = createPublicClient().from("public_business_profiles").select("*", { count: "exact" });
  const q = opts.q ? sanitizeSearch(opts.q) : "";
  if (q) query = query.or(`business_name.ilike.%${q}%,description.ilike.%${q}%,category.ilike.%${q}%`);
  if (opts.category) query = query.eq("category", opts.category);
  if (opts.district) query = query.eq("district", opts.district);
  const { data, count, error } = await query.order("verified_at", { ascending: false }).range((page - 1) * pageSize, page * pageSize - 1);
  return { items: data ?? [], total: count ?? 0, page, pageSize, error };
}

export const getPublicUmkm = cache(async (slug: string) => {
  const { data } = await createPublicClient().from("public_business_profiles").select("*").eq("slug", slug).maybeSingle();
  return data;
});
