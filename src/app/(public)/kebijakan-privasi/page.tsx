import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = { title: "Kebijakan Privasi" };

export default function PrivacyPage() {
  return (
    <LegalPage title="Kebijakan Privasi" updated="12 November 2026">
      <section>
        <h2>Data yang kami kumpulkan</h2>
        <ul>
          <li>Data akun: nama penanggung jawab, email, nomor WhatsApp.</li>
          <li>Data usaha/organisasi: nama, kategori, alamat, kecamatan, deskripsi, produk, foto.</li>
          <li>Dokumen verifikasi: NIB, surat keterangan usaha, dokumen legal organisasi, proposal event, dan dokumen tambahan pendaftaran.</li>
          <li>Riwayat aktivitas penting (audit log) untuk akuntabilitas keputusan.</li>
        </ul>
      </section>
      <section>
        <h2>Penggunaan data</h2>
        <p>Data digunakan untuk verifikasi oleh Disperindag Kabupaten Sumedang, proses seleksi peserta oleh penyelenggara event, notifikasi status, dan pelaporan program. MEDAL tidak menjual data pribadi kepada pihak mana pun.</p>
      </section>
      <section>
        <h2>Apa yang tampil ke publik</h2>
        <p>Direktori publik hanya menampilkan profil usaha yang sudah diverifikasi <strong>dan</strong> disetujui pemiliknya untuk dipublikasikan: nama usaha, kategori, kecamatan, deskripsi, produk, dan foto. Nomor WhatsApp hanya tampil jika pemilik mengizinkan. NIB, alamat lengkap, email, dan dokumen legal tidak pernah ditampilkan ke publik.</p>
      </section>
      <section>
        <h2>Akses penyelenggara</h2>
        <p>Penyelenggara hanya dapat melihat ringkasan data usaha yang mendaftar ke event miliknya setelah berkas diverifikasi Disperindag. Penyelenggara tidak memiliki akses ke dokumen legal UMKM.</p>
      </section>
      <section>
        <h2>Keamanan</h2>
        <p>Dokumen disimpan pada penyimpanan privat dan hanya dapat diakses pemilik serta admin berwenang melalui tautan bertanda tangan yang berlaku singkat. Akses data dibatasi dengan Row Level Security pada basis data.</p>
      </section>
      <section>
        <h2>Hak Anda</h2>
        <p>Anda dapat memperbarui data profil kapan saja, menonaktifkan publikasi profil, dan meminta penghapusan akun dengan menghubungi Disperindag. Masa retensi dokumen mengikuti kebijakan Disperindag yang berlaku.</p>
      </section>
    </LegalPage>
  );
}
