import { RoleLayout } from "@/components/role-layout";

export default function OrganizerLayout({ children }: { children: React.ReactNode }) {
  return <RoleLayout role="organizer">{children}</RoleLayout>;
}
