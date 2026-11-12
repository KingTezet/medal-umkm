import { describe, expect, it } from "vitest";
import { applicationSchema, businessProfileSchema, eventSchema, isOwnedPath, phoneSchema, registerUmkmSchema, standNumberSchema } from "@/lib/validations";

const event = {
  title: "Bazar UMKM Sumedang", summary: "Ringkasan event yang cukup panjang.", description: "Deskripsi lengkap event yang cukup panjang untuk validasi.",
  category: "Bazar", venue_name: "Alun-alun", address: "Jl. Prabu Geusan Ulun", district: "Sumedang Utara",
  starts_at: "2026-12-10T09:00", ends_at: "2026-12-11T21:00", registration_opens_at: "2026-11-15T08:00", registration_closes_at: "2026-12-01T23:00",
  stand_capacity: "20", criteria: [], agree: "on",
};

describe("validasi event", () => {
  it("menerima data valid", () => expect(eventSchema.safeParse(event).success).toBe(true));
  it("end harus setelah start", () => expect(eventSchema.safeParse({ ...event, ends_at: "2026-12-09T09:00" }).success).toBe(false));
  it("penutupan pendaftaran setelah pembukaan", () => expect(eventSchema.safeParse({ ...event, registration_closes_at: "2026-11-10T08:00" }).success).toBe(false));
  it("kapasitas > 0", () => expect(eventSchema.safeParse({ ...event, stand_capacity: "0" }).success).toBe(false));
});

describe("validasi kontak & registrasi", () => {
  it("normalisasi nomor WhatsApp", () => {
    expect(phoneSchema.parse("+62 812-3456-7890")).toBe("081234567890");
    expect(phoneSchema.safeParse("12345").success).toBe(false);
  });
  it("registrasi UMKM: password lemah & kecamatan luar Sumedang ditolak", () => {
    const ok = { email: "a@b.co", password: "rahasia123", full_name: "Budi Santoso", phone: "081234567890", business_name: "Keripik", category: "Kuliner", district: "Tanjungsari", address: "Jl. Raya 1", agree: "on" };
    expect(registerUmkmSchema.safeParse(ok).success).toBe(true);
    expect(registerUmkmSchema.safeParse({ ...ok, password: "abcdefgh" }).success).toBe(false);
    expect(registerUmkmSchema.safeParse({ ...ok, district: "Bandung" }).success).toBe(false);
    // role field is not part of the schema -> ignored
    expect("role" in registerUmkmSchema.parse({ ...ok, role: "admin" })).toBe(false);
  });
  it("NIB harus 13 digit bila diisi", () => {
    const p = { business_name: "Usaha", slug: "usaha", category: "Kuliner", address: "Jl. Raya 1", district: "Paseh", whatsapp: "081234567890", products: [], is_public: true, show_whatsapp: false };
    expect(businessProfileSchema.safeParse({ ...p, nib: "123" }).success).toBe(false);
    expect(businessProfileSchema.safeParse({ ...p, nib: "1234567890123" }).success).toBe(true);
    expect(businessProfileSchema.safeParse({ ...p, slug: "Bad Slug!" }).success).toBe(false);
  });
});

describe("pendaftaran & stand", () => {
  it("wajib pernyataan kebenaran & persetujuan", () => {
    expect(applicationSchema.safeParse({ products_offered: "Tahu" }).success).toBe(false);
    expect(applicationSchema.safeParse({ products_offered: "Tahu goreng", truth: "on", agree: "on" }).success).toBe(true);
  });
  it("nomor stand", () => {
    expect(standNumberSchema.parse("b-07")).toBe("B-07");
    expect(standNumberSchema.safeParse("").success).toBe(false);
  });
  it("ownership path storage", () => {
    expect(isOwnedPath("u1/legal/x.pdf", "u1")).toBe(true);
    expect(isOwnedPath("u2/legal/x.pdf", "u1")).toBe(false);
    expect(isOwnedPath("u1/../u2/x.pdf", "u1")).toBe(false);
    expect(isOwnedPath(null, "u1")).toBe(true);
  });
});
