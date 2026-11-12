import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { dashboardPathFor } from "@/lib/domain";

export default async function CheckStatusPage() {
  const { profile } = await requireAuth("/cek-status");
  redirect(profile.role === "umkm" ? "/dashboard/umkm/pendaftaran" : dashboardPathFor(profile.role));
}
