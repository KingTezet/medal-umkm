import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "MEDAL — Media, Event, Dagang & Lapak UMKM Sumedang",
    template: "%s · MEDAL Sumedang",
  },
  description:
    "MEDAL menghubungkan pelaku UMKM Kabupaten Sumedang dengan penyelenggara event: temukan event, daftar stand, verifikasi Disperindag, hingga nomor lapak final.",
  applicationName: "MEDAL",
  keywords: ["UMKM Sumedang", "event Sumedang", "bazar", "stand UMKM", "Disperindag Sumedang", "MEDAL"],
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "MEDAL Sumedang",
    images: [{ url: "/images/pasar-malam-2.jpg", width: 1600, height: 1200, alt: "Suasana pasar malam UMKM" }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${geist.variable} ${geistMono.variable}`}>
      <body className="min-h-dvh">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-white">
          Lewati ke konten
        </a>
        {children}
        <Toaster position="top-center" richColors closeButton toastOptions={{ style: { fontFamily: "var(--font-geist)" } }} />
      </body>
    </html>
  );
}
