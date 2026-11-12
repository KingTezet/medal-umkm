"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getActionSession } from "@/lib/auth";
import { fail, friendlyError, success, type ActionState } from "@/lib/action-result";
import { applicationSchema, businessProfileSchema, isOwnedPath, zodFieldErrors } from "@/lib/validations";

function parseJsonArray(v: FormDataEntryValue | null): unknown[] {
  try {
    const parsed = JSON.parse(String(v ?? "[]"));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const pathOrNull = (v: FormDataEntryValue | null) => (v ? String(v) : null);

export async function saveBusinessProfileAction(_: ActionState, fd: FormData): Promise<ActionState> {
  const session = await getActionSession("umkm");
  if (!session) return fail("Sesi berakhir atau akses ditolak. Silakan masuk kembali.");
  const { supabase, user } = session;

  const parsed = businessProfileSchema.safeParse({
    business_name: fd.get("business_name"),
    slug: fd.get("slug"),
    category: fd.get("category"),
    description: fd.get("description") ?? undefined,
    address: fd.get("address"),
    village: fd.get("village") ?? undefined,
    district: fd.get("district"),
    whatsapp: fd.get("whatsapp"),
    instagram: fd.get("instagram") ?? undefined,
    nib: fd.get("nib") ?? undefined,
    products: parseJsonArray(fd.get("products")),
    is_public: fd.get("is_public") === "on",
    show_whatsapp: fd.get("show_whatsapp") === "on",
  });
  if (!parsed.success) return fail("Periksa kembali isian profil.", zodFieldErrors(parsed.error));

  const logo = pathOrNull(fd.get("logo_path"));
  const cover = pathOrNull(fd.get("cover_path"));
  const license = pathOrNull(fd.get("business_license_path"));
  const gallery = parseJsonArray(fd.get("gallery_paths")).filter((x): x is string => typeof x === "string").slice(0, 8);
  for (const p of [logo, cover, license, ...gallery]) {
    if (!isOwnedPath(p, user.id)) return fail("File tidak valid.");
  }
  if (!parsed.data.nib && !license) {
    return fail("Isi NIB atau unggah surat keterangan usaha.", { nib: ["Isi NIB 13 digit atau unggah surat keterangan usaha."] });
  }

  const { error } = await supabase
    .from("business_profiles")
    .update({ ...parsed.data, logo_path: logo, cover_path: cover, business_license_path: license, gallery_paths: gallery })
    .eq("user_id", user.id);
  if (error) {
    if (error.code === "23505") return fail("URL publik (slug) sudah dipakai usaha lain.", { slug: ["Slug sudah dipakai. Pilih yang lain."] });
    return fail(friendlyError(error));
  }
  revalidatePath("/dashboard/umkm", "layout");
  revalidatePath("/", "layout");
  return success("Profil usaha tersimpan.");
}

export async function submitApplicationAction(_: ActionState, fd: FormData): Promise<ActionState> {
  const session = await getActionSession("umkm");
  if (!session) return fail("Sesi berakhir atau akses ditolak. Silakan masuk kembali.");
  const eventId = z.uuid().safeParse(fd.get("event_id"));
  if (!eventId.success) return fail("Event tidak valid.");
  const parsed = applicationSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return fail("Periksa kembali isian pendaftaran.", zodFieldErrors(parsed.error));
  if (!isOwnedPath(parsed.data.additional_document_path, session.user.id)) return fail("Dokumen tidak valid.");

  const { data, error } = await session.supabase.rpc("submit_application", {
    p_event_id: eventId.data,
    p_products_offered: parsed.data.products_offered,
    p_note: parsed.data.application_note ?? undefined,
    p_document_path: parsed.data.additional_document_path ?? undefined,
  });
  if (error || !data) return fail(friendlyError(error));
  revalidatePath("/dashboard/umkm", "layout");
  redirect(`/dashboard/umkm/pendaftaran/${data}?submitted=1`);
}

export async function resubmitApplicationAction(_: ActionState, fd: FormData): Promise<ActionState> {
  const session = await getActionSession("umkm");
  if (!session) return fail("Sesi berakhir. Silakan masuk kembali.");
  const id = z.uuid().safeParse(fd.get("application_id"));
  if (!id.success) return fail("Pendaftaran tidak valid.");
  const parsed = applicationSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return fail("Periksa kembali isian.", zodFieldErrors(parsed.error));
  if (!isOwnedPath(parsed.data.additional_document_path, session.user.id)) return fail("Dokumen tidak valid.");
  const { error } = await session.supabase.rpc("resubmit_application", {
    p_application_id: id.data,
    p_products_offered: parsed.data.products_offered,
    p_note: parsed.data.application_note ?? undefined,
    p_document_path: parsed.data.additional_document_path ?? undefined,
  });
  if (error) return fail(friendlyError(error));
  revalidatePath(`/dashboard/umkm/pendaftaran/${id.data}`);
  revalidatePath("/", "layout");
  return success("Revisi terkirim dan kembali ke antrean verifikasi.");
}

export async function withdrawApplicationAction(_: ActionState, fd: FormData): Promise<ActionState> {
  const session = await getActionSession("umkm");
  if (!session) return fail("Sesi berakhir. Silakan masuk kembali.");
  const id = z.uuid().safeParse(fd.get("application_id"));
  if (!id.success) return fail("Pendaftaran tidak valid.");
  const { error } = await session.supabase.rpc("withdraw_application", { p_application_id: id.data });
  if (error) return fail(friendlyError(error));
  revalidatePath("/", "layout");
  return success("Pendaftaran dibatalkan.");
}

export async function submitPaymentProofAction(_: ActionState, fd: FormData): Promise<ActionState> {
  const session = await getActionSession("umkm");
  if (!session) return fail("Sesi berakhir. Silakan masuk kembali.");
  const id = z.uuid().safeParse(fd.get("application_id"));
  const path = String(fd.get("payment_proof_path") ?? "");
  if (!id.success) return fail("Pendaftaran tidak valid.");
  if (!path) return fail("Unggah bukti transfer terlebih dahulu.", { payment_proof_path: ["Unggah bukti transfer."] });
  if (!isOwnedPath(path, session.user.id)) return fail("File tidak valid.");
  const { error } = await session.supabase.rpc("submit_payment_proof", { p_application_id: id.data, p_proof_path: path });
  if (error) return fail(friendlyError(error));
  revalidatePath("/", "layout");
  return success("Bukti transfer terkirim. Menunggu verifikasi penyelenggara.");
}
