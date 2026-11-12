/**
 * Anggota kelompok pengembang MEDAL.
 * TODO(tim): ganti nama, NPM, dan peran di bawah dengan data asli anggota.
 * `photo` opsional — taruh file di /public/images/team/ lalu isi path-nya.
 */
export interface TeamMember {
  name: string;
  npm: string;
  role: string;
  focus: string;
  photo?: string;
}

export const TEAM: TeamMember[] = [
  { name: "Nama Anggota 1", npm: "NPM 0000000001", role: "Project Manager", focus: "Koordinasi tim, timeline, dan komunikasi dengan Disperindag." },
  { name: "Nama Anggota 2", npm: "NPM 0000000002", role: "UI/UX Designer", focus: "Riset pengguna, wireframe, dan design system MEDAL." },
  { name: "Nama Anggota 3", npm: "NPM 0000000003", role: "Frontend Developer", focus: "Halaman publik, animasi, dan pengalaman mobile." },
  { name: "Nama Anggota 4", npm: "NPM 0000000004", role: "Backend Developer", focus: "Server actions, alur verifikasi, dan notifikasi." },
  { name: "Nama Anggota 5", npm: "NPM 0000000005", role: "Database Engineer", focus: "Skema Supabase, Row Level Security, dan storage." },
  { name: "Nama Anggota 6", npm: "NPM 0000000006", role: "QA Engineer", focus: "Pengujian alur kritis, keamanan akses, dan regresi." },
  { name: "Nama Anggota 7", npm: "NPM 0000000007", role: "System Analyst & Dokumentasi", focus: "PRD, kebutuhan bisnis, dan dokumentasi teknis." },
];
