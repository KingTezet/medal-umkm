"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getActionSession } from "@/lib/auth";
import { fail, friendlyError, success, type ActionState } from "@/lib/action-result";
import { eventSchema, isOwnedPath, organizerProfileSchema, reviewNoteSchema, zodFieldErrors } from "@/lib/validations";
import { fromJakartaInput } from "@/lib/format";

export async function saveOrganizerProfileAction(_: ActionState, fd: FormData): Promise<ActionState> {
  const session = await getActionSession("organizer");
  if (!session) return fail("Sesi berakhir atau akses ditolak.");
  const parsed = organizerProfileSchema.safeParse({
    organization_name: fd.get("organization_name"),
    organization_type: fd.get("organization_type"),
    description: fd.get("description") ?? undefined,
    address: fd.get("address"),
    district: fd.get("district") || null,
    contact_phone: fd.get("contact_phone"),
  });
  if (!parsed.success) return fail("Periksa kembali isian.", zodFieldErrors(parsed.error));
  const legal = fd.get("legal_document_path") ? String(fd.get("legal_document_path")) : null;
  if (!isOwnedPath(legal, session.user.id)) return fail("Dokumen tidak valid.");
  const { error } = await session.supabase
    .from("organizer_profiles")
    .update({ ...parsed.data, legal_document_path: legal })
    .eq("user_id", session.user.id);
  if (error) return fail(friendlyError(error));
  revalidatePath("/dashboard/penyelenggara", "layout");
  return success("Profil organisasi tersimpan.");
}

function parseList(v: FormDataEntryValue | null): string[] {
  return String(v ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function saveEventAction(_: ActionState, fd: FormData): Promise<ActionState> {
  const session = await getActionSession("organizer");
  if (!session) return fail("Sesi berakhir atau akses ditolak.");
  const { supabase, user } = session;

  const parsed = eventSchema.safeParse({ ...Object.fromEntries(fd), criteria: parseList(fd.get("criteria")) });
  if (!parsed.success) return fail("Periksa kembali isian event.", zodFieldErrors(parsed.error));
  const d = parsed.data;

  const cover = fd.get("cover_path") ? String(fd.get("cover_path")) : null;
  const proposal = fd.get("proposal_path") ? String(fd.get("proposal_path")) : null;
  let gallery: string[] = [];
  try {
    gallery = (JSON.parse(String(fd.get("gallery_paths") ?? "[]")) as unknown[]).filter((x): x is string => typeof x === "string").slice(0, 8);
  } catch {}
  for (const p of [cover, proposal, ...gallery]) if (!isOwnedPath(p, user.id)) return fail("File tidak valid.");

  const { data: org } = await supabase.from("organizer_profiles").select("id").eq("user_id", user.id).single();
  if (!org) return fail("Lengkapi profil organisasi terlebih dahulu.");

  const { data: cats } = await supabase.from("event_categories").select("name").eq("kind", "event").eq("is_active", true);
  if (!cats?.some((c) => c.name === d.category)) return fail("Kategori tidak valid.", { category: ["Pilih kategori yang tersedia."] });

  const row = {
    title: d.title,
    summary: d.summary,
    description: d.description,
    category: d.category,
    venue_name: d.venue_name,
    address: d.address,
    district: d.district,
    starts_at: fromJakartaInput(d.starts_at),
    ends_at: fromJakartaInput(d.ends_at),
    registration_opens_at: fromJakartaInput(d.registration_opens_at),
    registration_closes_at: fromJakartaInput(d.registration_closes_at),
    stand_capacity: d.stand_capacity,
    criteria: d.criteria,
    contact_name: d.contact_name,
    contact_phone: d.contact_phone,
    cover_path: cover,
    gallery_paths: gallery,
    proposal_path: proposal,
  };

  const existingId = fd.get("id") ? z.uuid().safeParse(fd.get("id")) : null;
  let eventId: string;
  if (existingId?.success) {
    const { error } = await supabase.from("events").update(row).eq("id", existingId.data);
    if (error) return fail(friendlyError(error));
    eventId = existingId.data;
  } else {
    const { data: slug } = await supabase.rpc("unique_event_slug", { p_base: d.title });
    const { data, error } = await supabase
      .from("events")
      .insert({ ...row, organizer_id: org.id, slug: slug ?? `event-${Date.now()}` })
      .select("id")
      .single();
    if (error || !data) return fail(friendlyError(error));
    eventId = data.id;
  }

  if (fd.get("intent") === "submit") {
    const { error } = await supabase.rpc("submit_event", { p_event_id: eventId });
    if (error) {
      revalidatePath("/dashboard/penyelenggara/events");
      redirect(`/dashboard/penyelenggara/events/${eventId}?error=${encodeURIComponent(friendlyError(error))}`);
    }
  }
  revalidatePath("/dashboard/penyelenggara", "layout");
  redirect(`/dashboard/penyelenggara/events/${eventId}?saved=${fd.get("intent") === "submit" ? "submitted" : "draft"}`);
}

export async function submitEventAction(_: ActionState, fd: FormData): Promise<ActionState> {
  const session = await getActionSession("organizer");
  if (!session) return fail("Sesi berakhir atau akses ditolak.");
  const id = z.uuid().safeParse(fd.get("event_id"));
  if (!id.success) return fail("Event tidak valid.");
  const { error } = await session.supabase.rpc("submit_event", { p_event_id: id.data });
  if (error) return fail(friendlyError(error));
  return success("Event diajukan ke Disperindag untuk ditinjau.");
}

export async function deleteDraftEventAction(_: ActionState, fd: FormData): Promise<ActionState> {
  const session = await getActionSession("organizer");
  if (!session) return fail("Sesi berakhir atau akses ditolak.");
  const id = z.uuid().safeParse(fd.get("event_id"));
  if (!id.success) return fail("Event tidak valid.");
  const { error, count } = await session.supabase.from("events").delete({ count: "exact" }).eq("id", id.data).eq("status", "draft");
  if (error || !count) return fail(error ? friendlyError(error) : "Hanya draft yang dapat dihapus.");
  revalidatePath("/dashboard/penyelenggara/events");
  redirect("/dashboard/penyelenggara/events?deleted=1");
}

export async function decideApplicationAction(_: ActionState, fd: FormData): Promise<ActionState> {
  const session = await getActionSession("organizer");
  if (!session) return fail("Sesi berakhir atau akses ditolak.");
  const id = z.uuid().safeParse(fd.get("application_id"));
  const decision = z.enum(["select", "waitlist", "reject"]).safeParse(fd.get("decision"));
  const note = reviewNoteSchema.safeParse(fd.get("note") ?? undefined);
  if (!id.success || !decision.success || !note.success) return fail("Permintaan tidak valid.");
  const { error } = await session.supabase.rpc("organizer_decide_application", {
    p_application_id: id.data,
    p_decision: decision.data,
    p_note: note.data ?? undefined,
  });
  if (error) return fail(friendlyError(error));
  const label = { select: "dipilih", waitlist: "dimasukkan daftar tunggu", reject: "ditolak" }[decision.data];
  return success(`Peserta ${label}.`);
}
