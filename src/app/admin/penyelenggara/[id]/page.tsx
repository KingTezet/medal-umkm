import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { ACCOUNT_STATUS, BUCKETS, EVENT_STATUS, ORGANIZATION_TYPES, VERIFICATION_STATUS } from "@/lib/constants";
import { formatDateTime, formatPhone } from "@/lib/format";
import { Breadcrumb, Card, DefinitionList, Notice, PageHeader, StatusBadge } from "@/components/ui/misc";
import { ActionDialog } from "@/components/action-form";
import { PrivateDocLink } from "@/components/dashboard/shared";
import { reviewProfileAction } from "@/app/actions/admin";

export const metadata = { title: "Detail Penyelenggara" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase } = await requireRole("admin");
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const { data: o } = await supabase.from("organizer_profiles").select("*, profiles(full_name, email, phone, account_status)").eq("id", id).maybeSingle();
  if (!o) notFound();
  const { data: events } = await supabase.from("events").select("id, title, status").eq("organizer_id", id).order("created_at", { ascending: false });
  const h = { kind: "organizer", profile_id: o.id };
  return (
    <>
      <Breadcrumb items={[{ label: "Penyelenggara", href: "/admin/penyelenggara" }, { label: o.organization_name }]} />
      <PageHeader
        eyebrow="Detail penyelenggara"
        title={o.organization_name}
        action={<>
          <StatusBadge map={VERIFICATION_STATUS} status={o.verification_status} />
          {o.verification_status !== "verified" && <ActionDialog action={reviewProfileAction} hidden={{ ...h, action: "verify" }} trigger="Verifikasi" title="Verifikasi penyelenggara?" description="Penyelenggara dapat mengajukan event untuk ditinjau." confirmLabel="Verifikasi" />}
          <ActionDialog action={reviewProfileAction} hidden={{ ...h, action: "revise" }} trigger="Minta revisi" triggerVariant="outline" title="Minta revisi" confirmLabel="Kirim" noteLabel="Hal yang perlu diperbaiki" noteRequired />
          {o.verification_status !== "rejected" && <ActionDialog action={reviewProfileAction} hidden={{ ...h, action: "reject" }} trigger="Tolak" triggerVariant="danger-outline" title="Tolak penyelenggara" confirmLabel="Tolak" confirmVariant="danger" noteLabel="Alasan" noteRequired />}
        </>}
      />
      {o.verification_note && <div className="mb-6"><Notice tone="info" title="Catatan terakhir">{o.verification_note}</Notice></div>}
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Card>
          <DefinitionList items={[
            { label: "Jenis", value: ORGANIZATION_TYPES[o.organization_type] },
            { label: "Deskripsi", value: o.description },
            { label: "Alamat", value: [o.address, o.district].filter(Boolean).join(", ") },
            { label: "Kontak", value: formatPhone(o.contact_phone) },
            { label: "Dokumen legal", value: <PrivateDocLink supabase={supabase} bucket={BUCKETS.verificationDocs} path={o.legal_document_path} label="Buka dokumen" /> },
            { label: "Diverifikasi", value: formatDateTime(o.verified_at) },
            { label: "Akun", value: `${o.profiles?.full_name ?? ""} · ${o.profiles?.email ?? ""}` },
            { label: "Status akun", value: o.profiles ? <StatusBadge map={ACCOUNT_STATUS} status={o.profiles.account_status} /> : "-" },
          ]} />
        </Card>
        <Card>
          <h2 className="mb-3 font-semibold text-lg">Event</h2>
          {events?.length ? <ul className="space-y-2 text-sm">{events.map((e) => <li key={e.id} className="flex items-center justify-between gap-2"><Link href={`/admin/events/${e.id}`} className="truncate hover:text-emerald">{e.title}</Link><StatusBadge map={EVENT_STATUS} status={e.status} /></li>)}</ul> : <p className="text-sm text-muted">Belum ada event.</p>}
        </Card>
      </div>
    </>
  );
}
