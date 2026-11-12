import type { Metadata } from "next";
import { AuthShell } from "@/components/auth-shell";
import { ForgotPasswordForm } from "@/components/forms/auth-forms";

export const metadata: Metadata = { title: "Lupa Password" };

export default function ForgotPasswordPage() {
  return (
    <AuthShell title="Lupa password?" description="Masukkan email akun Anda. Kami akan mengirim tautan untuk membuat password baru.">
      <ForgotPasswordForm />
    </AuthShell>
  );
}
