#!/usr/bin/env node
/**
 * Provision an Admin Disperindag account securely.
 * Reads credentials from env (never hardcoded, never committed):
 *   ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME (optional)
 *   NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 * Usage: node --env-file=.env.local scripts/create-admin.mjs
 */
import { createClient } from "@supabase/supabase-js";

const { NEXT_PUBLIC_SUPABASE_URL: url, SUPABASE_SERVICE_ROLE_KEY: key, ADMIN_EMAIL: email, ADMIN_PASSWORD: password, ADMIN_NAME: name = "Admin Disperindag" } = process.env;

if (!url || !key) throw new Error("NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY wajib diatur.");
if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error("ADMIN_EMAIL wajib berupa email valid.");
if (!password || password.length < 12) throw new Error("ADMIN_PASSWORD wajib minimal 12 karakter.");

const sb = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

const { data: list, error: listErr } = await sb.auth.admin.listUsers({ page: 1, perPage: 1000 });
if (listErr) throw listErr;
let user = list.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());

if (!user) {
  const { data, error } = await sb.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { full_name: name } });
  if (error) throw error;
  user = data.user;
  console.log(`Akun dibuat: ${email}`);
} else {
  console.log(`Akun sudah ada: ${email} — mempromosikan ke admin.`);
}

// Service role bypasses the column guard; this is the only path to admin.
const { error: upErr } = await sb.from("profiles").update({ role: "admin", full_name: name, account_status: "active" }).eq("id", user.id);
if (upErr) throw upErr;
// The sign-up trigger created a default business profile; admins don't need one.
await sb.from("business_profiles").delete().eq("user_id", user.id);
console.log("Selesai. Role admin aktif untuk", email);
