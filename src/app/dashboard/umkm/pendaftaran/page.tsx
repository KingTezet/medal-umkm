import type { Metadata } from "next";
import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { APPLICATION_STATUS } from "@/lib/constants";
import { formatDateRange, formatShortDate } from "@/lib/format";
import { EmptyState, PageHeader, StatusBadge } from "@/components/ui/misc";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = { title: "Pendaftaran Saya" };

export default async function MyApplicationsPage() {
  const { supabase, user } = await requireRole("umkm");
  const { data } = await supabase
    .from("stand_applications")
    .select("id, application_code, status, stand_number, submitted_at, events(title, starts_at, ends_at, venue_name)")
    .eq("submitted_by", user.id)
    .order("submitted_at", { ascending: false });
  const list = data ?? [];
  return (
    <>
      <PageHeader eyebrow="Pendaftaran saya" title="Status pendaftaran stand" description="Pantau setiap pendaftaran dari berkas diterima hingga nomor stand final." />
      {list.length ? (
        <ul className="grid gap-4">
          {list.map((a) => (
            <li key={a.id}>
              <Link href={`/dashboard/umkm/pendaftaran/${a.id}`} className="flex flex-col gap-4 rounded-xl border border-line bg-surface p-5 transition hover:border-emerald/40 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="font-mono text-xs text-muted">{a.application_code}</p>
                  <p className="mt-1 font-semibold text-xl">{a.events?.title}</p>
                  <p className="mt-1 text-sm text-muted">{a.events ? `${formatDateRange(a.events.starts_at, a.events.ends_at)} · ${a.events.venue_name}` : ""}</p>
                  <p className="mt-1 text-xs text-muted">Dikirim {formatShortDate(a.submitted_at)}</p>
                </div>
                <div className="flex items-center gap-3">
                  {a.stand_number && <span className="rounded-xl bg-forest px-3 py-2 font-semibold text-lg text-white">Stand {a.stand_number}</span>}
                  <StatusBadge map={APPLICATION_STATUS} status={a.status} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title="Belum ada pendaftaran" description="Mulai dengan memilih event yang sedang membuka pendaftaran." action={<ButtonLink href="/dashboard/umkm/events">Cari event</ButtonLink>} />
      )}
    </>
  );
}
