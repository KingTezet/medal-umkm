"use client";

import { startTransition, useActionState, useEffect, useId, type ComponentProps, type FormEvent, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/cn";
import { Button, type ButtonVariant } from "@/components/ui/button";
import { initialActionState, type ActionState } from "@/lib/action-result";

const control =
  "w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-[15px] text-ink placeholder:text-muted/70 transition focus:border-emerald focus:outline-none focus:ring-4 focus:ring-emerald/10 disabled:bg-sage/50 aria-[invalid=true]:border-danger";

export function Field({
  label,
  name,
  hint,
  errors,
  required,
  children,
  className,
}: {
  label: string;
  name: string;
  hint?: ReactNode;
  errors?: string[];
  required?: boolean;
  children: (props: { id: string; "aria-invalid": boolean; "aria-describedby"?: string }) => ReactNode;
  className?: string;
}) {
  const id = useId() + name;
  const describedBy = errors?.length ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={id} className="block text-sm font-semibold text-ink">
        {label}
        {required && <span className="ml-0.5 text-terracotta">*</span>}
      </label>
      {children({ id, "aria-invalid": !!errors?.length, "aria-describedby": describedBy })}
      {errors?.length ? (
        <p id={`${id}-error`} className="text-[13px] font-medium text-danger">
          {errors[0]}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-[13px] text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(control, "h-11", className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(control, "min-h-28 leading-relaxed", className)} {...props} />;
}

export function Select({ className, children, ...props }: ComponentProps<"select">) {
  return (
    <select className={cn(control, "h-11 appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%235d6a63%22 stroke-width=%222.5%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:14px] bg-[right_14px_center] bg-no-repeat pr-10", className)} {...props}>
      {children}
    </select>
  );
}

export function Checkbox({ label, className, ...props }: ComponentProps<"input"> & { label: ReactNode }) {
  return (
    <label className={cn("flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ink", className)}>
      <input type="checkbox" className="mt-0.5 size-5 shrink-0 rounded-md accent-emerald" {...props} />
      <span>{label}</span>
    </label>
  );
}

export function SubmitButton({
  children,
  pendingText = "Memproses…",
  variant = "primary",
  className,
  size,
  pending: pendingProp,
  ...props
}: ComponentProps<"button"> & { pendingText?: string; variant?: ButtonVariant; size?: "sm" | "md" | "lg"; pending?: boolean }) {
  const status = useFormStatus();
  const pending = pendingProp ?? status.pending;
  return (
    <Button type="submit" variant={variant} size={size} disabled={pending || props.disabled} aria-busy={pending} className={className} {...props}>
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" aria-hidden />
          {pendingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
}

export function FormMessage({ state }: { state: ActionState }) {
  if (!state.message || state.ok) return null;
  return (
    <div role="alert" className="rounded-xl border border-danger/25 bg-danger/5 px-4 py-3 text-sm font-medium text-danger">
      {state.message}
    </div>
  );
}

/** Fire a toast whenever an action resolves. */
export function useActionToast(state: ActionState) {
  useEffect(() => {
    if (!state.ts || !state.message) return;
    if (state.ok) toast.success(state.message);
    else toast.error(state.message);
  }, [state.ts, state.ok, state.message]);
}

/**
 * Like useActionState, but submits via onSubmit so the browser keeps the
 * user's input when validation fails (React resets forms bound to `action`).
 */
export function useFormAction(action: (prev: ActionState, fd: FormData) => Promise<ActionState>) {
  const [state, dispatch, pending] = useActionState(action, initialActionState);
  useActionToast(state);
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => dispatch(fd));
  };
  return { state, pending, fe: state.fieldErrors ?? {}, onSubmit };
}
