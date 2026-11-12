import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = { title: "Syarat & Ketentuan" };

export default function TermsPage() {
  return (
    <LegalPage title="Syarat & Ketentuan" updated="12 November 2026">
      <section>
        <h2>Tentang layanan</h2>
        <p>MEDAL adalah platform informasi event dan pendaftaran stand UMKM Kabupaten Sumedang. MEDAL bukan marketplace: tidak ada pembayaran, checkout, atau transaksi jual beli di platform ini.</p>
      </section>
      <section>
        <h2>Akun</h2>
        <ul>
          <li>Pengguna wajib memberikan data yang benar dan dapat dipertanggungjawabkan.</li>
          <li>Satu akun UMKM mengelola satu profil usaha utama.</li>
          <li>Akun yang melanggar ketentuan dapat ditangguhkan oleh Disperindag.</li>
        </ul>
      </section>
      <section>
        <h2>Pendaftaran stand</h2>
        <ul>
          <li>Peserta berdomisili usaha di Kabupaten Sumedang dan memiliki NIB atau surat keterangan usaha.</li>
          <li>Satu usaha hanya dapat mendaftar satu kali pada event yang sama.</li>
          <li>Alur: berkas diterima → verifikasi Disperindag → seleksi penyelenggara → pengesahan dan nomor stand oleh Disperindag.</li>
          <li>Nomor stand final hanya ditetapkan oleh Disperindag dan bersifat unik per event.</li>
          <li>Pendaftaran dapat dibatalkan pemohon sebelum dikonfirmasi.</li>
        </ul>
      </section>
      <section>
        <h2>Pengajuan event</h2>
        <ul>
          <li>Event hanya tampil di publik setelah disetujui Disperindag.</li>
          <li>Penyelenggara wajib melampirkan proposal/izin event dalam format PDF.</li>
          <li>Penyelenggara hanya dapat menyeleksi pendaftar yang telah diverifikasi Disperindag.</li>
        </ul>
      </section>
      <section>
        <h2>Perubahan ketentuan</h2>
        <p>Ketentuan ini dapat diperbarui sesuai kebijakan Disperindag. Perubahan penting akan diumumkan melalui platform.</p>
      </section>
    </LegalPage>
  );
}
