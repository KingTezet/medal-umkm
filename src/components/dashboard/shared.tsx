import Link from "next/link";
import { Bell, CheckCircle2, Circle, FileText, Lock, XCircle } from "lucide-react";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { applicationTimeline, type TimelineStep } from "@/lib/domain";
import { APPLICATION_STATUS, type ApplicationStatus, type BucketName } from "@/lib/constants";
import { formatDateTime, relativeTime } from "@/lib/format";
import { cn } from "@/lib/cn";
import { EmptyState } from "@/components/ui/misc";
import { InlineAction } from "@/components/action-form";
import { markNotificationReadAction } from "@/app/actions/account";

type SB = SupabaseClient<Database>;

/** Short-lived signed URL for a private document (RLS checked by Storage). */
export async function PrivateDocLink({ supabase, bucket, path, label }: { supabase: SB; bucket: BucketName; path: string | null; label: string }) {
  if (!path) return <span className="text-sm text-muted">Belum diunggah</span>;
  const { data } = await supabase.storage.from(bucket).createSignedUrl(path, 300);
  if (!data?.signedUrl) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-muted">
        <Lock className="size-4" aria-hidden /> Tidak dapat diakses
      </span>
    );
  }
  return (
    <a href={data.signedUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm font-semibold text-emerald hover:border-emerald">
      <FileText className="size-4" aria-hidden /> {label}
      <span className="text-xs font-normal text-muted">(tautan 5 menit)</span>
    </a>
  );
}

export function Timeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <ol className="relative grid gap-0 sm:grid-cols-4">
      {steps.map((s, i) => (
        <li key={s.key} className="relative flex gap-3 pb-6 sm:flex-col sm:items-center sm:pb-0 sm:text-center">
          {i < steps.length - 1 && (
            <span
              className={cn(
                "absolute left-[15px] top-8 h-[calc(100%-2rem)] w-0.5 sm:left-[calc(50%+1.25rem)] sm:top-[15px] sm:h-0.5 sm:w-[calc(100%-2.5rem)]",
                s.state === "done" ? "bg-emerald" : "bg-line",
              )}
              aria-hidden
            />
          )}
          <span
            className={cn(
              "relative z-10 grid size-8 shrink-0 place-items-center rounded-full",
              s.state === "done" && "bg-emerald text-ivory",
              s.state === "current" && "bg-gold text-night ring-4 ring-gold/25",
              s.state === "upcoming" && "border-2 border-line bg-surface text-muted",
              s.state === "failed" && "bg-danger text-white",
            )}
          >
            {s.state === "done" ? <CheckCircle2 className="size-4" /> : s.state === "failed" ? <XCircle className="size-4" /> : <Circle className="size-3" />}
          </span>
          <div className="sm:mt-3">
            <p className={cn("text-sm font-semibold", s.state === "upcoming" ? "text-muted" : "text-ink")}>{s.label}</p>
            <p className="text-xs text-muted">
              {s.state === "done" ? "Selesai" : s.state === "current" ? "Sedang berlangsung" : s.state === "failed" ? "Berhenti di tahap ini" : "Menunggu"}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function ApplicationTimeline({ status, history }: { status: ApplicationStatus; history: { from_status: ApplicationStatus | null; to_status: ApplicationStatus }[] }) {
  let stage: "verification" | "selection" | "final" | undefined;
  if (status === "rejected") {
    const last = [...history].reverse().find((h) => h.to_status === "rejected");
    stage = last?.from_status === "submitted" || last?.from_status === "under_verification" ? "verification" : last?.from_status === "selected_by_organizer" ? "final" : "selection";
  }
  return <Timeline steps={applicationTimeline(status, stage)} />;
}

export function HistoryList({ items }: { items: { id: number; to_status: ApplicationStatus; note: string | null; created_at: string; actor_role: string | null }[] }) {
  if (!items.length) return <p className="text-sm text-muted">Belum ada riwayat.</p>;
  const actor: Record<string, string> = { umkm: "Pemohon", organizer: "Penyelenggara", admin: "Disperindag" };
  return (
    <ol className="space-y-4">
      {[...items].reverse().map((h) => (
        <li key={h.id} className="flex gap-3">
          <span className="mt-1.5 size-2.5 shrink-0 rounded-full bg-gold" aria-hidden />
          <div>
            <p className="text-sm font-semibold">
              {APPLICATION_STATUS[h.to_status].label}
              {h.actor_role && <span className="font-normal text-muted"> · {actor[h.actor_role] ?? h.actor_role}</span>}
            </p>
            {h.note && <p className="mt-0.5 text-sm text-ink/80">“{h.note}”</p>}
            <p className="text-xs text-muted">{formatDateTime(h.created_at)}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export async function NotificationsView({ supabase, userId }: { supabase: SB; userId: string }) {
  const { data } = await supabase.from("notifications").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(100);
  const items = data ?? [];
  const unread = items.filter((n) => !n.read_at).length;
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted">{unread} belum dibaca</p>
        {unread > 0 && (
          <InlineAction action={markNotificationReadAction} hidden={{ id: "all" }} variant="ghost">
            Tandai semua dibaca
          </InlineAction>
        )}
      </div>
      {items.length ? (
        <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
          {items.map((n) => (
            <li key={n.id} className={cn("flex gap-4 p-4 sm:p-5", !n.read_at && "bg-mint/25")}>
              <span className={cn("grid size-10 shrink-0 place-items-center rounded-full", n.read_at ? "bg-sage text-muted" : "bg-forest text-gold")}>
                <Bell className="size-4" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{n.title}</p>
                <p className="mt-0.5 text-sm text-ink/80">{n.message}</p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted">
                  <span>{relativeTime(n.created_at)}</span>
                  {n.href && (
                    <Link href={n.href} className="font-semibold text-emerald hover:underline">
                      Lihat detail
                    </Link>
                  )}
                </div>
              </div>
              {!n.read_at && (
                <InlineAction action={markNotificationReadAction} hidden={{ id: n.id }} variant="ghost">
                  Dibaca
                </InlineAction>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title="Belum ada notifikasi" description="Pemberitahuan perubahan status akan muncul di sini." icon={<Bell className="size-6" />} />
      )}
    </div>
  );
}
