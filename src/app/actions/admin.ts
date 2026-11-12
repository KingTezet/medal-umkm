"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getActionSession } from "@/lib/auth";
import { fail, friendlyError, success, type ActionState } from "@/lib/action-result";
import { announcementSchema, categorySchema, contactSettingsSchema, heroSchema, reviewNoteSchema, standNumberSchema, zodFieldErrors } from "@/lib/validations";
import type { Json } from "@/types/database";

async function admin() {
  return getActionSession("admin");
}

const DENIED = "Akses ditolak. Hanya Admin Disperindag.";

export async function reviewEventAction(_: ActionState, fd: FormData): Promise<ActionState> {
  const s = await admin();
  if (!s) return fail(DENIED);
  const id = z.uuid().safeParse(fd.get("event_id"));
  const action = z.enum(["publish", "revise", "reject", "cancel", "complete"]).safeParse(fd.get("action"));
  const note = reviewNoteSchema.safeParse(fd.get("note") ?? undefined);
  if (!id.success || !action.success || !note.success) return fail("Permintaan tidak valid.");
  const { error } = await s.supabase.rpc("admin_review_event", { p_event_id: id.data, p_action: action.data, p_note: note.data ?? undefined });
  if (error) return fail(friendlyError(error));
  revalidatePath("/", "layout");
  const msg = { publish: "Event dipublikasikan.", revise: "Permintaan revisi dikirim.", reject: "Event ditolak.", cancel: "Event dibatalkan.", complete: "Event ditandai selesai." }[action.data];
  return success(msg);
}

export async function verifyApplicationAction(_: ActionState, fd: FormData): Promise<ActionState> {
  const s = await admin();
  if (!s) return fail(DENIED);
  const id = z.uuid().safeParse(fd.get("application_id"));
  const action = z.enum(["verify", "revise", "reject"]).safeParse(fd.get("action"));
  const note = reviewNoteSchema.safeParse(fd.get("note") ?? undefined);
  if (!id.success || !action.success || !note.success) return fail("Permintaan tidak valid.");
  const { error } = await s.supabase.rpc("admin_verify_application", { p_application_id: id.data, p_action: action.data, p_note: note.data ?? undefined });
  if (error) return fail(friendlyError(error));
  revalidatePath("/", "layout");
  return success({ verify: "Berkas diverifikasi.", revise: "Permintaan revisi dikirim.", reject: "Pendaftaran ditolak." }[action.data]);
}

export async function finalizeApplicationAction(_: ActionState, fd: FormData): Promise<ActionState> {
  const s = await admin();
  if (!s) return fail(DENIED);
  const id = z.uuid().safeParse(fd.get("application_id"));
  const action = z.enum(["confirm", "reject"]).safeParse(fd.get("action"));
  const note = reviewNoteSchema.safeParse(fd.get("note") ?? undefined);
  if (!id.success || !action.success || !note.success) return fail("Permintaan tidak valid.");
  let stand: string | undefined;
  if (action.data === "confirm") {
    const sn = standNumberSchema.safeParse(fd.get("stand_number"));
    if (!sn.success) return fail(sn.error.issues[0].message, { stand_number: [sn.error.issues[0].message] });
    stand = sn.data;
  }
  const { error } = await s.supabase.rpc("admin_finalize_application", {
    p_application_id: id.data,
    p_action: action.data,
    p_stand_number: stand,
    p_note: note.data ?? undefined,
  });
  if (error) return fail(friendlyError(error));
  revalidatePath("/", "layout");
  return success(action.data === "confirm" ? `Dikonfirmasi dengan nomor stand ${stand}.` : "Pendaftaran tidak disahkan.");
}

export async function reviewProfileAction(_: ActionState, fd: FormData): Promise<ActionState> {
  const s = await admin();
  if (!s) return fail(DENIED);
  const kind = z.enum(["business", "organizer"]).safeParse(fd.get("kind"));
  const id = z.uuid().safeParse(fd.get("profile_id"));
  const action = z.enum(["verify", "revise", "reject"]).safeParse(fd.get("action"));
  const note = reviewNoteSchema.safeParse(fd.get("note") ?? undefined);
  if (!kind.success || !id.success || !action.success || !note.success) return fail("Permintaan tidak valid.");
  const { error } = await s.supabase.rpc("admin_review_profile", { p_kind: kind.data, p_profile_id: id.data, p_action: action.data, p_note: note.data ?? undefined });
  if (error) return fail(friendlyError(error));
  revalidatePath("/", "layout");
  return success({ verify: "Profil diverifikasi.", revise: "Permintaan revisi dikirim.", reject: "Profil ditolak." }[action.data]);
}

export async function setAccountStatusAction(_: ActionState, fd: FormData): Promise<ActionState> {
  const s = await admin();
  if (!s) return fail(DENIED);
  const id = z.uuid().safeParse(fd.get("user_id"));
  const status = z.enum(["active", "suspended"]).safeParse(fd.get("status"));
  const note = reviewNoteSchema.safeParse(fd.get("note") ?? undefined);
  if (!id.success || !status.success || !note.success) return fail("Permintaan tidak valid.");
  const { error } = await s.supabase.rpc("admin_set_account_status", { p_user_id: id.data, p_status: status.data, p_note: note.data ?? undefined });
  if (error) return fail(friendlyError(error));
  revalidatePath("/", "layout");
  return success(status.data === "suspended" ? "Akun ditangguhkan." : "Akun diaktifkan kembali.");
}

function slugify(v: string) {
  return v.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "kategori";
}

export async function createCategoryAction(_: ActionState, fd: FormData): Promise<ActionState> {
  const s = await admin();
  if (!s) return fail(DENIED);
  const parsed = categorySchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return fail("Periksa kembali isian.", zodFieldErrors(parsed.error));
  const { error } = await s.supabase.from("event_categories").insert({ ...parsed.data, slug: slugify(parsed.data.name) });
  if (error) return fail(error.code === "23505" ? "Kategori dengan nama tersebut sudah ada." : friendlyError(error));
  revalidatePath("/", "layout");
  return success("Kategori ditambahkan.");
}

export async function toggleCategoryAction(_: ActionState, fd: FormData): Promise<ActionState> {
  const s = await admin();
  if (!s) return fail(DENIED);
  const id = z.uuid().safeParse(fd.get("id"));
  if (!id.success) return fail("Permintaan tidak valid.");
  const active = fd.get("active") === "true";
  const { error } = await s.supabase.from("event_categories").update({ is_active: active }).eq("id", id.data);
  if (error) return fail(friendlyError(error));
  revalidatePath("/", "layout");
  return success(active ? "Kategori diaktifkan." : "Kategori dinonaktifkan.");
}

async function saveSetting(key: string, value: NonNullable<Json>, userId: string, supabase: NonNullable<Awaited<ReturnType<typeof admin>>>["supabase"]) {
  return supabase.from("platform_settings").upsert({ key, value, is_public: true, updated_by: userId });
}

export async function saveContactAction(_: ActionState, fd: FormData): Promise<ActionState> {
  const s = await admin();
  if (!s) return fail(DENIED);
  const parsed = contactSettingsSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return fail("Periksa kembali isian.", zodFieldErrors(parsed.error));
  const { error } = await saveSetting("contact", parsed.data, s.user.id, s.supabase);
  if (error) return fail(friendlyError(error));
  revalidatePath("/", "layout");
  return success("Kontak publik diperbarui.");
}

export async function saveContentAction(_: ActionState, fd: FormData): Promise<ActionState> {
  const s = await admin();
  if (!s) return fail(DENIED);
  const hero = heroSchema.safeParse({ headline: fd.get("headline"), subheadline: fd.get("subheadline") });
  const ann = announcementSchema.safeParse({ enabled: fd.get("announcement_enabled") === "on", text: fd.get("announcement_text") ?? "" });
  if (!hero.success || !ann.success) {
    return fail("Periksa kembali isian.", { ...(hero.success ? {} : zodFieldErrors(hero.error)), ...(ann.success ? {} : zodFieldErrors(ann.error)) });
  }
  const [a, b] = await Promise.all([saveSetting("hero", hero.data, s.user.id, s.supabase), saveSetting("announcement", ann.data, s.user.id, s.supabase)]);
  if (a.error || b.error) return fail(friendlyError(a.error ?? b.error));
  revalidatePath("/", "layout");
  return success("Konten beranda diperbarui.");
}
