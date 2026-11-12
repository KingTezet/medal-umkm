import Link from "next/link";
import { ArrowRight, Building2, CalendarClock, ClipboardCheck, Stamp, Store } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { APPLICATION_STATUS, type ApplicationStatus } from "@/lib/constants";
import { formatShortDate } from "@/lib/format";
import { Card, PageHeader, StatCard } from "@/components/ui/misc";

function Queue({ title, href, items, icon: Icon, empty }: { title: string; href: string; items: { id: string; label: string; sub: string; link: string }[]; icon: typeof Store; empty: string }) {
  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-semibold text-xl"><Icon className="size-5 text-primary" />{title}</h2>
        <Link href={href} className="text-sm font-semibold text-emerald hover:underline">Semua</Link>
      </div>
      {items.length ? (
        <ul className="divide-y divide-line">
          {items.map((i) => (
            <li key={i.id}><Link href={i.link} className="flex items-center justify-between gap-3 py-2.5 hover:text-emerald"><span className="min-w-0"><span className="block truncate text-sm font-semibold">{i.label}</span><span className="block truncate text-xs text-muted">{i.sub}</span></span><ArrowRight className="size-4 shrink-0" /></Link></li>
          ))}
        </ul>
      ) : <p className="py-4 text-sm text-muted">{empty}</p>}
    </Card>
  );
}

type Snap = { business_name?: string };

export default async function AdminHome() {
  const { supabase } = await requireRole("admin");
  const [{ data: stats }, { data: pendingEvents }, { data: toVerify }, { data: toConfirm }] = await Promise.all([
    supabase.rpc("admin_dashboard_stats"),
    supabase.from("events").select("id, title, created_at, organizer_profiles(organization_name)").eq("status", "pending_review").order("updated_at").limit(5),
    supabase.from("stand_applications").select("id, application_code, business_snapshot, submitted_at, events(title)").in("status", ["submitted", "under_verification"]).order("submitted_at").limit(5),
    supabase.from("stand_applications").select("id, application_code, business_snapshot, events(title)").eq("status", "selected_by_organizer").order("organizer_decided_at").limit(5),
  ]);
  const s = (stats ?? {}) as Record<string, number> & { applications_by_status?: Record<string, number> };
  const byStatus = s.applications_by_status ?? {};
  const total = Object.values(byStatus).reduce((a, b) => a + b, 0);


  return (
    <>
      <PageHeader eyebrow="Admin Disperindag" title="Dashboard operasional" description="Seluruh angka berasal langsung dari database MEDAL." />
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
        <StatCard accent label="Event menunggu review" value={s.events_pending ?? 0} icon={<CalendarClock className="size-5" />} />
        <StatCard label="Berkas perlu verifikasi" value={s.applications_to_verify ?? 0} icon={<ClipboardCheck className="size-5" />} />
        <StatCard label="Menunggu pengesahan" value={s.applications_to_confirm ?? 0} icon={<Stamp className="size-5" />} />
        <StatCard label="Event terbit" value={s.events_published ?? 0} hint={`${s.events_completed ?? 0} selesai`} />
        <StatCard label="UMKM terdaftar" value={s.umkm_total ?? 0} hint={`${s.umkm_verified ?? 0} terverifikasi · ${s.umkm_pending ?? 0} menunggu`} icon={<Store className="size-5" />} />
        <StatCard label="Penyelenggara" value={s.organizers_total ?? 0} hint={`${s.organizers_pending ?? 0} menunggu verifikasi`} icon={<Building2 className="size-5" />} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Queue title="Pengajuan event" href="/admin/events?status=pending_review" icon={CalendarClock} empty="Tidak ada event yang menunggu." items={(pendingEvents ?? []).map((e) => ({ id: e.id, label: e.title, sub: `${e.organizer_profiles?.organization_name ?? ""} · ${formatShortDate(e.created_at)}`, link: `/admin/events/${e.id}` }))} />
        <Queue title="Verifikasi berkas" href="/admin/pendaftaran?status=queue" icon={ClipboardCheck} empty="Antrean verifikasi kosong." items={(toVerify ?? []).map((a) => ({ id: a.id, label: (a.business_snapshot as Snap)?.business_name ?? a.application_code, sub: `${a.events?.title ?? ""} · ${formatShortDate(a.submitted_at)}`, link: `/admin/pendaftaran/${a.id}` }))} />
        <Queue title="Pengesahan & nomor stand" href="/admin/pendaftaran?status=selected_by_organizer" icon={Stamp} empty="Tidak ada hasil seleksi yang menunggu." items={(toConfirm ?? []).map((a) => ({ id: a.id, label: (a.business_snapshot as Snap)?.business_name ?? a.application_code, sub: a.events?.title ?? "", link: `/admin/pendaftaran/${a.id}` }))} />
      </div>

      <Card className="mt-8">
        <h2 className="font-semibold text-xl">Pendaftaran stand per status</h2>
        <p className="text-xs text-muted">Seluruh periode · total {total}</p>
        <div className="mt-5 space-y-3">
          {(Object.keys(APPLICATION_STATUS) as ApplicationStatus[]).map((k) => {
            const v = byStatus[k] ?? 0;
            const pct = total ? Math.round((v / total) * 100) : 0;
            return (
              <div key={k} className="grid grid-cols-[10rem_1fr_3rem] items-center gap-3 text-sm">
                <span className="text-muted">{APPLICATION_STATUS[k].label}</span>
                <div className="h-2 overflow-hidden rounded-full bg-surface-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} /></div>
                <span className="text-right font-semibold tabular-nums">{v}</span>
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );
}
