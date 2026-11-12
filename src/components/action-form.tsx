"use client";

import { useActionState, useEffect, useRef, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { initialActionState, type ActionState } from "@/lib/action-result";
import { FormMessage, SubmitButton, Textarea, useActionToast } from "@/components/ui/form";
import { Button, type ButtonVariant } from "@/components/ui/button";

type Action = (prev: ActionState, formData: FormData) => Promise<ActionState>;

/**
 * Small form for a single workflow action (with optional note).
 * Wrapped in a native <dialog> for confirmation.
 */
export function ActionDialog({
  action,
  hidden,
  trigger,
  triggerVariant = "primary",
  title,
  description,
  confirmLabel,
  confirmVariant = "primary",
  noteLabel,
  noteRequired,
  extra,
}: {
  action: Action;
  hidden: Record<string, string>;
  trigger: ReactNode;
  triggerVariant?: ButtonVariant;
  title: string;
  description?: string;
  confirmLabel: string;
  confirmVariant?: ButtonVariant;
  noteLabel?: string;
  noteRequired?: boolean;
  extra?: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const [state, formAction] = useActionState(action, initialActionState);
  const formRef = useRef<HTMLFormElement>(null);
  useActionToast(state);

  useEffect(() => {
    if (state.ok && state.ts) {
      ref.current?.close();
      formRef.current?.reset();
      router.refresh();
    }
  }, [state.ok, state.ts, router]);

  return (
    <>
      <Button variant={triggerVariant} size="sm" onClick={() => ref.current?.showModal()}>
        {trigger}
      </Button>
      <dialog
        ref={ref}
        className="m-auto w-[min(92vw,30rem)] rounded-3xl border border-line bg-surface p-0 text-ink shadow-2xl backdrop:bg-night/50 backdrop:backdrop-blur-sm"
        aria-labelledby={`dlg-${title}`}
      >
        <form ref={formRef} action={formAction} className="space-y-4 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id={`dlg-${title}`} className="font-display text-2xl">
                {title}
              </h2>
              {description && <p className="mt-1 text-sm text-muted">{description}</p>}
            </div>
            <button type="button" onClick={() => ref.current?.close()} className="grid size-9 shrink-0 place-items-center rounded-full hover:bg-sage" aria-label="Tutup">
              <X className="size-4" />
            </button>
          </div>
          {Object.entries(hidden).map(([k, v]) => (
            <input key={k} type="hidden" name={k} value={v} />
          ))}
          {extra}
          {noteLabel && (
            <div className="space-y-1.5">
              <label htmlFor={`note-${title}`} className="text-sm font-semibold">
                {noteLabel}
                {noteRequired && <span className="text-terracotta"> *</span>}
              </label>
              <Textarea id={`note-${title}`} name="note" required={noteRequired} minLength={noteRequired ? 5 : undefined} maxLength={1000} placeholder="Tulis catatan yang jelas dan dapat ditindaklanjuti…" />
            </div>
          )}
          <FormMessage state={state} />
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="ghost" onClick={() => ref.current?.close()}>
              Batal
            </Button>
            <SubmitButton variant={confirmVariant}>{confirmLabel}</SubmitButton>
          </div>
        </form>
      </dialog>
    </>
  );
}

/** Inline one-click action (no dialog). */
export function InlineAction({ action, hidden, children, variant = "outline", pendingText }: { action: Action; hidden: Record<string, string>; children: ReactNode; variant?: ButtonVariant; pendingText?: string }) {
  const router = useRouter();
  const [state, formAction] = useActionState(action, initialActionState);
  useActionToast(state);
  useEffect(() => {
    if (state.ok && state.ts) router.refresh();
  }, [state.ok, state.ts, router]);
  return (
    <form action={formAction}>
      {Object.entries(hidden).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      <SubmitButton variant={variant} size="sm" pendingText={pendingText}>
        {children}
      </SubmitButton>
    </form>
  );
}
