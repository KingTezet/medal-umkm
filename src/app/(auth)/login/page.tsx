import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth-shell";
import { LoginForm } from "@/components/forms/auth-forms";
import { Notice } from "@/components/ui/misc";
import { getCurrentProfile } from "@/lib/auth";
import { dashboardPathFor, safeNextPath } from "@/lib/domain";

export const metadata: Metadata = { title: "Masuk" };

type SP = Promise<Record<string, string | undefined>>;

export default async function LoginPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const session = await getCurrentProfile();
  if (session && session.profile.account_status !== "suspended") redirect(dashboardPathFor(session.profile.role));
  const next = safeNextPath(sp.next) ?? undefined;
  return (
    <AuthShell title="Selamat datang kembali" description="Masuk untuk mengelola usaha, event, atau verifikasi Anda.">
      <div className="mb-6 space-y-3">
        {sp.error === "suspended" && <Notice tone="danger">Akun Anda sedang ditangguhkan. Hubungi Disperindag.</Notice>}
        {sp.error === "link" && <Notice tone="warning">Tautan tidak valid atau sudah kedaluwarsa. Silakan coba lagi.</Notice>}
        {sp.logout && <Notice tone="success">Anda telah keluar.</Notice>}
        {next && <Notice tone="info">Silakan masuk untuk melanjutkan.</Notice>}
      </div>
      <LoginForm next={next} />
    </AuthShell>
  );
}
