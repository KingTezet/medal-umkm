import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/auth";
import { APPLICATION_STATUS } from "@/lib/constants";
import { toCsv } from "@/lib/domain";

interface Snapshot { business_name?: string; category?: string; owner_name?: string; whatsapp?: string; district?: string }

/** CSV recap for an event. Scope: owning organizer or admin (enforced by RLS + check). */
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getCurrentProfile();
  if (!session || session.profile.account_status === "suspended") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.profile.role === "umkm") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { supabase } = session;
  const { data: event } = await supabase.from("events").select("id, title, slug").eq("id", id).maybeSingle();
  if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data: apps } = await supabase
    .from("stand_applications")
    .select("application_code, status, business_snapshot, products_offered, stand_number")
    .eq("event_id", id)
    .in("status", ["verified", "selected_by_organizer", "waitlisted", "confirmed", "rejected"])
    .order("stand_number", { ascending: true, nullsFirst: false });

  const rows: unknown[][] = [["No", "Kode", "Nama Usaha", "Kategori", "Penanggung Jawab", "WhatsApp", "Kecamatan", "Produk", "Status Seleksi", "Nomor Stand"]];
  (apps ?? []).forEach((a, i) => {
    const s = (a.business_snapshot ?? {}) as Snapshot;
    rows.push([i + 1, a.application_code, s.business_name, s.category, s.owner_name, s.whatsapp, s.district, a.products_offered, APPLICATION_STATUS[a.status].label, a.stand_number ?? ""]);
  });

  return new NextResponse(toCsv(rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="peserta-${event.slug}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
