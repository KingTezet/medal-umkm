import type { FieldErrors } from "@/lib/validations";

export interface ActionState {
  ok: boolean;
  message?: string;
  fieldErrors?: FieldErrors;
  /** Increment so client effects (toasts) re-fire on identical messages. */
  ts?: number;
}

export const initialActionState: ActionState = { ok: false };

export function fail(message: string, fieldErrors?: FieldErrors): ActionState {
  return { ok: false, message, fieldErrors, ts: Date.now() };
}

export function success(message: string): ActionState {
  return { ok: true, message, ts: Date.now() };
}

const TECHNICAL = /(violates|duplicate key|permission denied|relation |column |syntax|invalid input|null value|JWT|function |constraint|PGRST)/i;

/** Map Supabase/Postgres errors to a safe Indonesian message. */
export function friendlyError(error: { message?: string; code?: string } | null | undefined, fallback = "Terjadi kesalahan. Coba lagi beberapa saat."): string {
  if (!error) return fallback;
  const msg = error.message ?? "";
  if (msg && !TECHNICAL.test(msg) && /[a-z]/.test(msg) && msg.length < 240) return msg;
  if (error.code === "23505") return "Data yang sama sudah terdaftar.";
  if (error.code === "42501") return "Anda tidak memiliki akses untuk tindakan ini.";
  if (error.code === "23514") return "Data tidak memenuhi ketentuan. Periksa kembali isian Anda.";
  return fallback;
}
