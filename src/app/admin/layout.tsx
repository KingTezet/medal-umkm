import type { Metadata } from "next";
import { RoleLayout } from "@/components/role-layout";

export const metadata: Metadata = { title: { default: "Admin", template: "%s · Admin MEDAL" }, robots: { index: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <RoleLayout role="admin">{children}</RoleLayout>;
}
