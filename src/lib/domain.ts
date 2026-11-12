/**
 * Pure business rules shared by UI and tests. The database RPCs enforce
 * the same rules authoritatively; these helpers only drive UX.
 */
import type { ApplicationStatus, EventStatus, UserRole } from "@/lib/constants";

export type RegistrationState = "upcoming" | "open" | "closed" | "full" | "unavailable";

export interface EventWindow {
  status: EventStatus;
  registration_opens_at: string;
  registration_closes_at: string;
  stand_capacity: number;
  confirmed_count?: number | null;
}

export function availableStands(capacity: number, confirmed: number | null | undefined): number {
  return Math.max(0, capacity - (confirmed ?? 0));
}

export function registrationState(event: EventWindow, now: Date = new Date()): RegistrationState {
  if (event.status !== "published") return "unavailable";
  const opens = new Date(event.registration_opens_at).getTime();
  const closes = new Date(event.registration_closes_at).getTime();
  const t = now.getTime();
  if (t < opens) return "upcoming";
  if (t > closes) return "closed";
  if (availableStands(event.stand_capacity, event.confirmed_count) <= 0) return "full";
  return "open";
}

export const REGISTRATION_LABEL: Record<RegistrationState, string> = {
  upcoming: "Segera Dibuka",
  open: "Pendaftaran Dibuka",
  closed: "Pendaftaran Ditutup",
  full: "Kuota Penuh",
  unavailable: "Tidak Tersedia",
};

// ---------------------------------------------------------------------------
// Application state machine
// ---------------------------------------------------------------------------
type Actor = UserRole;

const APPLICATION_TRANSITIONS: Record<Actor, Partial<Record<ApplicationStatus, ApplicationStatus[]>>> = {
  umkm: {
    submitted: ["withdrawn"],
    under_verification: ["withdrawn"],
    revision_required: ["under_verification", "withdrawn"],
    verified: ["withdrawn"],
    waitlisted: ["withdrawn"],
    selected_by_organizer: ["withdrawn"],
    withdrawn: ["submitted"],
  },
  admin: {
    submitted: ["verified", "revision_required", "rejected"],
    under_verification: ["verified", "revision_required", "rejected"],
    selected_by_organizer: ["confirmed", "rejected"],
    waitlisted: ["confirmed", "rejected"],
  },
  organizer: {
    verified: ["selected_by_organizer", "waitlisted", "rejected"],
    waitlisted: ["selected_by_organizer", "rejected"],
    selected_by_organizer: ["waitlisted", "rejected"],
  },
};

export function canTransitionApplication(actor: Actor, from: ApplicationStatus, to: ApplicationStatus): boolean {
  return APPLICATION_TRANSITIONS[actor][from]?.includes(to) ?? false;
}

export function organizerCanDecide(status: ApplicationStatus): boolean {
  return status === "verified" || status === "waitlisted" || status === "selected_by_organizer";
}

const EVENT_TRANSITIONS: Record<"organizer" | "admin", Partial<Record<EventStatus, EventStatus[]>>> = {
  organizer: {
    draft: ["pending_review"],
    revision_required: ["pending_review"],
  },
  admin: {
    pending_review: ["published", "revision_required", "rejected"],
    published: ["cancelled", "completed"],
  },
};

export function canTransitionEvent(actor: "organizer" | "admin", from: EventStatus, to: EventStatus): boolean {
  return EVENT_TRANSITIONS[actor][from]?.includes(to) ?? false;
}

export function organizerCanEditEvent(status: EventStatus): boolean {
  return status === "draft" || status === "revision_required";
}

// ---------------------------------------------------------------------------
// Confirmation guard (mirrors admin_finalize_application)
// ---------------------------------------------------------------------------
export function validateConfirmation(input: {
  capacity: number;
  confirmedCount: number;
  standNumber: string;
  usedStandNumbers: string[];
}): { ok: true; standNumber: string } | { ok: false; error: string } {
  const stand = input.standNumber.trim().toUpperCase();
  if (!stand) return { ok: false, error: "Nomor stand wajib diisi." };
  if (!/^[A-Z0-9][A-Z0-9-]{0,15}$/.test(stand)) return { ok: false, error: "Format nomor stand tidak valid (contoh: A-01)." };
  if (input.confirmedCount >= input.capacity) return { ok: false, error: "Kapasitas stand sudah penuh." };
  if (input.usedStandNumbers.some((s) => s.toUpperCase() === stand)) {
    return { ok: false, error: `Nomor stand ${stand} sudah digunakan pada event ini.` };
  }
  return { ok: true, standNumber: stand };
}

// ---------------------------------------------------------------------------
// Timeline for UMKM (PRD §8.2)
// ---------------------------------------------------------------------------
export type StepState = "done" | "current" | "upcoming" | "failed";
export interface TimelineStep {
  key: string;
  label: string;
  state: StepState;
}

export function applicationTimeline(status: ApplicationStatus, rejectedStage?: "verification" | "selection" | "final"): TimelineStep[] {
  const labels = ["Berkas diterima", "Verifikasi Disperindag", "Seleksi penyelenggara", "Hasil akhir & nomor stand"];
  const keys = ["received", "verification", "selection", "final"];
  let current = 0;
  let failedAt: number | null = null;

  switch (status) {
    case "submitted":
      current = 1;
      break;
    case "under_verification":
    case "revision_required":
      current = 1;
      break;
    case "verified":
    case "waitlisted":
      current = 2;
      break;
    case "selected_by_organizer":
      current = 3;
      break;
    case "confirmed":
      current = 4;
      break;
    case "rejected":
      failedAt = rejectedStage === "verification" ? 1 : rejectedStage === "final" ? 3 : 2;
      current = failedAt;
      break;
    case "withdrawn":
      failedAt = 0;
      current = 0;
      break;
  }

  return labels.map((label, i) => {
    let state: StepState;
    if (failedAt !== null && i === failedAt) state = "failed";
    else if (i < current) state = "done";
    else if (i === current) state = "current";
    else state = "upcoming";
    return { key: keys[i], label, state };
  });
}

export function dashboardPathFor(role: UserRole): string {
  switch (role) {
    case "admin":
      return "/admin";
    case "organizer":
      return "/dashboard/penyelenggara";
    default:
      return "/dashboard/umkm";
  }
}

/** Only allow same-origin relative redirects (prevents open redirect). */
export function safeNextPath(next: string | null | undefined): string | null {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.includes("\\")) return null;
  return next;
}

export function csvEscape(value: unknown): string {
  const s = value === null || value === undefined ? "" : String(value);
  // Neutralize spreadsheet formula injection.
  const safe = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
  return /[",\n\r;]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
}

export function toCsv(rows: unknown[][]): string {
  return "﻿" + rows.map((r) => r.map(csvEscape).join(",")).join("\r\n");
}
