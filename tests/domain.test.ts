import { describe, expect, it } from "vitest";
import {
  applicationTimeline, availableStands, canTransitionApplication, canTransitionEvent, csvEscape, dashboardPathFor,
  organizerCanDecide, organizerCanEditEvent, registrationState, safeNextPath, toCsv, validateConfirmation,
} from "@/lib/domain";

const base = {
  status: "published" as const,
  registration_opens_at: "2026-11-01T00:00:00Z",
  registration_closes_at: "2026-11-30T00:00:00Z",
  stand_capacity: 10,
  confirmed_count: 0,
};

describe("kuota & status pendaftaran", () => {
  it("menghitung sisa stand dari confirmed, tidak negatif", () => {
    expect(availableStands(10, 3)).toBe(7);
    expect(availableStands(10, null)).toBe(10);
    expect(availableStands(2, 5)).toBe(0);
  });
  it("open/upcoming/closed/full sesuai waktu dan kuota", () => {
    expect(registrationState(base, new Date("2026-11-10T00:00:00Z"))).toBe("open");
    expect(registrationState(base, new Date("2026-10-10T00:00:00Z"))).toBe("upcoming");
    expect(registrationState(base, new Date("2026-12-10T00:00:00Z"))).toBe("closed");
    expect(registrationState({ ...base, confirmed_count: 10 }, new Date("2026-11-10T00:00:00Z"))).toBe("full");
  });
  it("event yang belum published tidak dapat menerima pendaftaran", () => {
    expect(registrationState({ ...base, status: "pending_review" }, new Date("2026-11-10T00:00:00Z"))).toBe("unavailable");
    expect(registrationState({ ...base, status: "draft" }, new Date("2026-11-10T00:00:00Z"))).toBe("unavailable");
  });
});

describe("state machine aplikasi", () => {
  it("penyelenggara hanya memutuskan aplikasi verified/waitlisted/selected", () => {
    expect(canTransitionApplication("organizer", "verified", "selected_by_organizer")).toBe(true);
    expect(canTransitionApplication("organizer", "submitted", "selected_by_organizer")).toBe(false);
    expect(canTransitionApplication("organizer", "under_verification", "rejected")).toBe(false);
    expect(organizerCanDecide("submitted")).toBe(false);
    expect(organizerCanDecide("verified")).toBe(true);
  });
  it("hanya admin yang mengonfirmasi", () => {
    expect(canTransitionApplication("admin", "selected_by_organizer", "confirmed")).toBe(true);
    expect(canTransitionApplication("organizer", "selected_by_organizer", "confirmed")).toBe(false);
    expect(canTransitionApplication("umkm", "selected_by_organizer", "confirmed")).toBe(false);
  });
  it("revisi kembali ke antrean verifikasi", () => {
    expect(canTransitionApplication("umkm", "revision_required", "under_verification")).toBe(true);
    expect(canTransitionApplication("umkm", "confirmed", "withdrawn")).toBe(false);
  });
});

describe("state machine event", () => {
  it("organizer tidak dapat mempublikasikan sendiri", () => {
    expect(canTransitionEvent("organizer", "draft", "pending_review")).toBe(true);
    expect(canTransitionEvent("organizer", "pending_review", "published")).toBe(false);
    expect(canTransitionEvent("admin", "pending_review", "published")).toBe(true);
  });
  it("hanya draft/revisi yang dapat diedit organizer", () => {
    expect(organizerCanEditEvent("draft")).toBe(true);
    expect(organizerCanEditEvent("revision_required")).toBe(true);
    expect(organizerCanEditEvent("published")).toBe(false);
  });
});

describe("konfirmasi nomor stand", () => {
  const ok = { capacity: 3, confirmedCount: 1, standNumber: "a-02", usedStandNumbers: ["A-01"] };
  it("menormalkan & menerima nomor unik", () => {
    expect(validateConfirmation(ok)).toEqual({ ok: true, standNumber: "A-02" });
  });
  it("menolak duplikat (case-insensitive)", () => {
    expect(validateConfirmation({ ...ok, standNumber: "a-01" }).ok).toBe(false);
  });
  it("menolak saat kapasitas penuh", () => {
    expect(validateConfirmation({ ...ok, confirmedCount: 3 }).ok).toBe(false);
  });
  it("menolak nomor kosong / format salah", () => {
    expect(validateConfirmation({ ...ok, standNumber: " " }).ok).toBe(false);
    expect(validateConfirmation({ ...ok, standNumber: "A 01!" }).ok).toBe(false);
  });
});

describe("timeline UMKM", () => {
  it("confirmed = semua tahap selesai", () => {
    expect(applicationTimeline("confirmed").every((s) => s.state === "done")).toBe(true);
  });
  it("rejected saat verifikasi menandai tahap 2 gagal", () => {
    const t = applicationTimeline("rejected", "verification");
    expect(t[1].state).toBe("failed");
    expect(t[0].state).toBe("done");
  });
});

describe("keamanan helper", () => {
  it("safeNextPath mencegah open redirect", () => {
    expect(safeNextPath("/dashboard/umkm")).toBe("/dashboard/umkm");
    expect(safeNextPath("//evil.com")).toBeNull();
    expect(safeNextPath("https://evil.com")).toBeNull();
    expect(safeNextPath("/\\evil.com")).toBeNull();
  });
  it("dashboard sesuai role", () => {
    expect(dashboardPathFor("admin")).toBe("/admin");
    expect(dashboardPathFor("organizer")).toBe("/dashboard/penyelenggara");
    expect(dashboardPathFor("umkm")).toBe("/dashboard/umkm");
  });
  it("CSV menetralkan formula injection & escape", () => {
    expect(csvEscape("=HYPERLINK(1)")).toBe("'=HYPERLINK(1)");
    expect(csvEscape('a,"b"')).toBe('"a,""b"""');
    expect(toCsv([["x", 1]]).startsWith("﻿")).toBe(true);
  });
});
