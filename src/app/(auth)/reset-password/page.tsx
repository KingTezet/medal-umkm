import type { Metadata } from "next";
import { AuthShell } from "@/components/auth-shell";
import { ResetPasswordForm } from "@/components/forms/auth-forms";
import { requireAuth } from "@/lib/auth";

export const metadata: Metadata = { title: "Buat Password Baru", robots: { index: false } };

export default async function ResetPasswordPage() {
  await requireAuth("/reset-password");
  return (
    <AuthShell title="Buat password baru" description="Gunakan kombinasi huruf dan angka, minimal 8 karakter.">
      <ResetPasswordForm />
    </AuthShell>
  );
}
