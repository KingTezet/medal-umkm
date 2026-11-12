import type { Metadata } from "next";
import { requireRole } from "@/lib/auth";
import { listPublicEvents } from "@/lib/queries";
import { EventCard } from "@/components/cards";
import { EmptyState, PageHeader } from "@/components/ui/misc";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = { title: "Cari Event" };

export default async function UmkmEventsPage() {
  const { supabase, user } = await requireRole("umkm");
  const [{ events }, { data: mine }] = await Promise.all([
    listPublicEvents({ filter: "open", pageSize: 30 }),
    supabase.from("stand_applications").select("event_id, status").eq("submitted_by", user.id),
  ]);
  const applied = new Map((mine ?? []).filter((a) => a.status !== "withdrawn").map((a) => [a.event_id, a.status]));
  return (
    <>
      <PageHeader eyebrow="Cari event" title="Event yang membuka pendaftaran" description="Pilih event lalu kirim pendaftaran stand. Data profil usaha akan dipakai otomatis." action={<ButtonLink href="/events" variant="outline">Semua event publik</ButtonLink>} />
      {events.length ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {events.map((e) => (
            <div key={e.id} className="flex flex-col gap-3">
              <EventCard event={e} />
              {applied.has(e.id!) ? (
                <ButtonLink href="/dashboard/umkm/pendaftaran" variant="outline">Sudah terdaftar · lihat status</ButtonLink>
              ) : (
                <ButtonLink href={`/dashboard/umkm/events/${e.id}/daftar`}>Daftar stand</ButtonLink>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="Belum ada event yang membuka pendaftaran" description="Kami akan memberi tahu melalui beranda saat event baru terbit." />
      )}
    </>
  );
}
