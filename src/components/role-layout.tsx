import { Suspense, type ReactNode } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { requireRole } from "@/lib/auth";
import type { UserRole } from "@/lib/constants";

export async function RoleLayout({ role, children }: { role: UserRole; children: ReactNode }) {
  const { profile, supabase } = await requireRole(role);
  const { count } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", profile.id)
    .is("read_at", null);
  return (
    <Suspense>
      <DashboardShell role={role} name={profile.full_name} email={profile.email ?? ""} unread={count ?? 0}>
        {children}
      </DashboardShell>
    </Suspense>
  );
}
