import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getCurrentProfile } from "@/lib/auth";
import { dashboardPathFor } from "@/lib/domain";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const session = await getCurrentProfile();
  return (
    <>
      <SiteHeader session={session ? { name: session.profile.full_name, dashboard: dashboardPathFor(session.profile.role) } : null} />
      <main id="main" className="min-h-[60vh]">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
