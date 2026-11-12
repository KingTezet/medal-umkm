"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { fail, success, type ActionState } from "@/lib/action-result";
import { emailSchema, loginSchema, passwordSchema, registerOrganizerSchema, registerUmkmSchema, zodFieldErrors } from "@/lib/validations";
import { dashboardPathFor, safeNextPath } from "@/lib/domain";
import { env } from "@/lib/env";

async function origin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  return host ? `${proto}://${host}` : env.appUrl;
}

export async function loginAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fail("Periksa kembali isian Anda.", zodFieldErrors(parsed.error));

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error || !data.user) {
    if (error?.code === "email_not_confirmed") return fail("Email belum dikonfirmasi. Periksa kotak masuk Anda.");
    return fail("Email atau password salah.");
  }
  const { data: profile } = await supabase.from("profiles").select("role, account_status").eq("id", data.user.id).single();
  if (!profile) return fail("Profil akun tidak ditemukan. Hubungi admin.");
  if (profile.account_status === "suspended") {
    await supabase.auth.signOut();
    return fail("Akun Anda sedang ditangguhkan. Hubungi Disperindag.");
  }
  const next = safeNextPath(String(formData.get("next") ?? ""));
  const home = dashboardPathFor(profile.role);
  // Don't send a user into another role's area.
  const target = next && !(next.startsWith("/admin") && profile.role !== "admin") ? next : home;
  redirect(target);
}

async function signUp(
  role: "umkm" | "organizer",
  email: string,
  password: string,
  metadata: Record<string, string | null | undefined>,
  next: string | null,
): Promise<ActionState> {
  const supabase = await createClient();
  const home = dashboardPathFor(role);
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // role here is only a hint; DB trigger whitelists umkm/organizer and never admin.
      data: { ...metadata, role },
      emailRedirectTo: `${await origin()}/auth/callback?next=${encodeURIComponent(next ?? home)}`,
    },
  });
  if (error) {
    if (error.code === "user_already_exists" || /already registered/i.test(error.message)) {
      return fail("Email sudah terdaftar. Silakan masuk.");
    }
    if (error.code === "over_email_send_rate_limit") return fail("Terlalu banyak percobaan. Coba lagi beberapa menit lagi.");
    if (error.code === "weak_password") return fail("Password terlalu lemah.");
    return fail("Pendaftaran gagal. Coba lagi beberapa saat.");
  }
  if (data.session) redirect(`${next ?? home}?welcome=1`);
  return success("Pendaftaran berhasil! Cek email Anda untuk konfirmasi akun, lalu masuk.");
}

export async function registerUmkmAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = registerUmkmSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fail("Periksa kembali isian Anda.", zodFieldErrors(parsed.error));
  const d = parsed.data;
  return signUp("umkm", d.email, d.password, {
    full_name: d.full_name,
    phone: d.phone,
    business_name: d.business_name,
    category: d.category,
    district: d.district,
    address: d.address,
    description: d.description,
  }, safeNextPath(String(formData.get("next") ?? "")));
}

export async function registerOrganizerAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = registerOrganizerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fail("Periksa kembali isian Anda.", zodFieldErrors(parsed.error));
  const d = parsed.data;
  return signUp("organizer", d.email, d.password, {
    full_name: d.full_name,
    phone: d.phone,
    organization_name: d.organization_name,
    organization_type: d.organization_type,
    district: d.district ?? null,
    address: d.address,
    description: d.description,
  }, null);
}

export async function forgotPasswordAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = emailSchema.safeParse(formData.get("email"));
  if (!parsed.success) return fail("Email tidak valid.", { email: ["Email tidak valid."] });
  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(parsed.data, {
    redirectTo: `${await origin()}/auth/callback?next=/reset-password`,
  });
  // Same response whether or not the email exists (prevents enumeration).
  return success("Jika email terdaftar, tautan reset password telah dikirim. Periksa kotak masuk Anda.");
}

export async function updatePasswordAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const password = passwordSchema.safeParse(formData.get("password"));
  if (!password.success) return fail("Password tidak valid.", { password: password.error.issues.map((i) => i.message) });
  if (formData.get("password") !== formData.get("confirm")) return fail("Konfirmasi password tidak sama.", { confirm: ["Konfirmasi password tidak sama."] });
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return fail("Sesi reset telah berakhir. Minta tautan baru.");
  const { error } = await supabase.auth.updateUser({ password: password.data });
  if (error) return fail(error.code === "same_password" ? "Password baru harus berbeda dari sebelumnya." : "Gagal memperbarui password.");
  return success("Password berhasil diperbarui.");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login?logout=1");
}
