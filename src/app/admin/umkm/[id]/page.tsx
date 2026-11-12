import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { ACCOUNT_STATUS, APPLICATION_STATUS, BUCKETS, VERIFICATION_STATUS } from "@/lib/constants";
import { formatDateTime, formatPhone } from "@/lib/format";
import { asProducts, umkmImage } from "@/lib/storage";
import { Breadcrumb, Card, DefinitionList, Notice, PageHeader, StatusBadge } from "@/components/ui/misc";
import { ActionDialog } from "@/components/action-form";
import { PrivateDocLink } from "@/components/dashboard/shared";
import { reviewProfileAction } from "@/app/actions/admin";

export const metadata = { title: "Review UMKM" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase } = await requireRole("admin");
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const { data: b } = await supabase.from("business_profiles").select("*, profiles(full_name, email, phone, account_status)").eq("id", id).maybeSingle();
  if (!b) notFound();
  const { data: apps } = await supabase.from("stand_applications").select("id, application_code, status, events(title)").eq("business_profile_id", id).order("submitted_at", { ascending: false });
  const h = { kind: "business", profile_id: b.id };
  return (
    <>
      <Breadcrumb items={[{ label: "Data UMKM", href: "/admin/umkm" }, { label: b.business_name }]} />
      <PageHeader
        eyebrow="Review UMKM"
        title={b.business_name}
        action={<>
          <StatusBadge map={VERIFICATION_STATUS} status={b.verification_status} />
          {b.verification_status !== "verified" && <ActionDialog action={reviewProfileAction} hidden={{ ...h, action: "verify" }} trigger="Verifikasi" title="Verifikasi profil usaha?" description="Profil dapat tampil di direktori publik bila pemilik menyetujui." confirmLabel="Verifikasi" />}
          <ActionDialog action={reviewProfileAction} hidden={{ ...h, action: "revise" }} trigger="Minta revisi" triggerVariant="outline" title="Minta revisi profil" confirmLabel="Kirim" noteLabel="Hal yang perlu diperbaiki" noteRequired />
          {b.verification_status !== "rejected" && <ActionDialog action={reviewProfileAction} hidden={{ ...h, action: "reject" }} trigger="Tolak" triggerVariant="danger-outline" title="Tolak profil usaha" confirmLabel="Tolak" confirmVariant="danger" noteLabel="Alasan" noteRequired />}
        </>}
      />
      {b.verification_note && <div className="mb-6"><Notice tone="info" title="Catatan terakhir">{b.verification_note}</Notice></div>}
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Card>
          <div className="mb-5 flex items-center gap-4">
            <div className="relative size-20 overflow-hidden rounded-xl bg-sage"><Image src={umkmImage(b.logo_path ?? b.cover_path, b.slug)} alt="" fill sizes="80px" className="object-cover" /></div>
            <div><p className="font-semibold text-xl">{b.business_name}</p><p className="text-sm text-muted">/{b.slug}</p></div>
          </div>
          <DefinitionList items={[
            { label: "Kategori", value: b.category },
            { label: "Deskripsi", value: b.description },
            { label: "Alamat", value: [b.address, b.village, b.district, b.regency].filter(Boolean).join(", ") },
            { label: "WhatsApp", value: formatPhone(b.whatsapp) },
            { label: "Produk", value: asProducts(b.products).map((p) => p.name).join(", ") },
            { label: "Tampil publik", value: b.is_public ? "Ya" : "Tidak" },
            { label: "Tampilkan WA", value: b.show_whatsapp ? "Ya" : "Tidak" },
          ]} />
        </Card>
        <div className="space-y-6">
          <Card>
            <h2 className="font-semibold text-lg">Legalitas</h2>
            <DefinitionList items={[
              { label: "NIB", value: b.nib ?? "-" },
              { label: "NIB / SKU", value: <PrivateDocLink supabase={supabase} bucket={BUCKETS.verificationDocs} path={b.business_license_path} label="Buka dokumen" /> },
              { label: "Diverifikasi", value: formatDateTime(b.verified_at) },
            ]} />
          </Card>
          <Card>
            <h2 className="font-semibold text-lg">Akun pemilik</h2>
            <DefinitionList items={[
              { label: "Nama", value: b.profiles?.full_name },
              { label: "Email", value: b.profiles?.email },
              { label: "Status akun", value: b.profiles ? <StatusBadge map={ACCOUNT_STATUS} status={b.profiles.account_status} /> : "-" },
            ]} />
          </Card>
          <Card>
            <h2 className="mb-3 font-semibold text-lg">Pendaftaran</h2>
            {apps?.length ? <ul className="space-y-2 text-sm">{apps.map((x) => <li key={x.id} className="flex items-center justify-between gap-2"><Link href={`/admin/pendaftaran/${x.id}`} className="truncate hover:text-emerald">{x.events?.title}</Link><StatusBadge map={APPLICATION_STATUS} status={x.status} /></li>)}</ul> : <p className="text-sm text-muted">Belum ada.</p>}
          </Card>
        </div>
      </div>
    </>
  );
}
