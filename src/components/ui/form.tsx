"use client";

import { startTransition, useActionState, useEffect, useId, type ComponentProps, type FormEvent, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { ChevronDown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/cn";
import { Button, type ButtonVariant } from "@/components/ui/button";
import { initialActionState, type ActionState } from "@/lib/action-result";

const control =
  "w-full rounded-[9px] border border-line bg-white px-3.5 py-2.5 text-[15px] text-ink placeholder:text-muted/70 transition-[border-color,box-shadow] duration-150 focus:border-primary focus:outline-none focus:ring-3 focus:ring-primary/10 disabled:bg-surface-muted aria-[invalid=true]:border-danger";

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
      <label htmlFor={id} className="block text-[13px] font-medium text-ink">
        {label}
        {required && <span className="ml-0.5 text-danger">*</span>}
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
    <div className="relative">
      <select className={cn(control, "h-11 appearance-none pr-10", className)} {...props}>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
    </div>
  );
}

export function Checkbox({ label, className, ...props }: ComponentProps<"input"> & { label: ReactNode }) {
  return (
    <label className={cn("flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ink", className)}>
      <input type="checkbox" className="mt-0.5 size-[18px] shrink-0 rounded accent-[#174b3a]" {...props} />
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
    <div role="alert" className="rounded-lg border border-danger/25 bg-danger/5 px-4 py-3 text-sm text-danger">
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
