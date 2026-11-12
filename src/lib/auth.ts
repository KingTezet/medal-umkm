import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { dashboardPathFor } from "@/lib/domain";
import type { UserRole } from "@/lib/constants";
import type { Database } from "@/types/database";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

/** Current authenticated user + DB profile (role is read from DB, never metadata). */
export const getCurrentProfile = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  if (!profile) return null;
  return { user, profile, supabase };
});

export async function requireAuth(next = "/") {
  const session = await getCurrentProfile();
  if (!session) redirect(`/login?next=${encodeURIComponent(next)}`);
  if (session.profile.account_status === "suspended") redirect("/login?error=suspended");
  return session;
}

/** Ensures the user has the role; otherwise sends them to their own dashboard. */
export async function requireRole(role: UserRole, next?: string) {
  const session = await requireAuth(next ?? dashboardPathFor(role));
  if (session.profile.role !== role) redirect(`${dashboardPathFor(session.profile.role)}?forbidden=1`);
  return session;
}

/** For server actions: returns null instead of redirecting. */
export async function getActionSession(role?: UserRole) {
  const session = await getCurrentProfile();
  if (!session || session.profile.account_status === "suspended") return null;
  if (role && session.profile.role !== role) return null;
  return session;
}

export function assertOwnership(ownerId: string | null | undefined, userId: string): boolean {
  return !!ownerId && ownerId === userId;
}
