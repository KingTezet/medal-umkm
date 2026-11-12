"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getActionSession } from "@/lib/auth";
import { fail, friendlyError, success, type ActionState } from "@/lib/action-result";
import { phoneSchema, zodFieldErrors } from "@/lib/validations";

const accountSchema = z.object({
  full_name: z.string().trim().min(3, "Nama minimal 3 karakter.").max(120),
  phone: phoneSchema,
});

export async function updateAccountAction(_: ActionState, fd: FormData): Promise<ActionState> {
  const session = await getActionSession();
  if (!session) return fail("Sesi berakhir. Silakan masuk kembali.");
  const parsed = accountSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return fail("Periksa kembali isian.", zodFieldErrors(parsed.error));
  // Only non-privileged columns; role/account_status are guarded by DB trigger too.
  const { error } = await session.supabase.from("profiles").update(parsed.data).eq("id", session.user.id);
  if (error) return fail(friendlyError(error));
  revalidatePath("/", "layout");
  return success("Data akun diperbarui.");
}

export async function markNotificationReadAction(_: ActionState, fd: FormData): Promise<ActionState> {
  const session = await getActionSession();
  if (!session) return fail("Sesi berakhir.");
  const id = fd.get("id");
  const q = session.supabase.from("notifications").update({ read_at: new Date().toISOString() }).eq("user_id", session.user.id).is("read_at", null);
  const { error } = id && id !== "all" ? await q.eq("id", String(id)) : await q;
  if (error) return fail(friendlyError(error));
  revalidatePath("/", "layout");
  return success(id === "all" ? "Semua notifikasi ditandai dibaca." : "Ditandai dibaca.");
}
