"use client";

import { useId, useRef, useState } from "react";
import Image from "next/image";
import { FileText, ImagePlus, Loader2, Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { FILE_RULES, type BucketName, type FileRuleKey } from "@/lib/constants";
import { publicMediaUrl } from "@/lib/storage";
import { cn } from "@/lib/cn";

/**
 * Uploads directly to Supabase Storage under {userId}/{folder}/...
 * Storage RLS enforces ownership; bucket config enforces MIME + size.
 * The resulting path is submitted with the parent form via a hidden input.
 */
export function UploadField({
  name,
  label,
  bucket,
  userId,
  folder,
  rule,
  defaultPath,
  hint,
  required,
  error,
  variant = "file",
}: {
  name: string;
  label: string;
  bucket: BucketName;
  userId: string;
  folder: string;
  rule: FileRuleKey;
  defaultPath?: string | null;
  hint?: string;
  required?: boolean;
  error?: string[];
  variant?: "file" | "image";
}) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [path, setPath] = useState<string | null>(defaultPath ?? null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const r = FILE_RULES[rule];
  const isPublic = bucket === "public-event-media" || bucket === "public-umkm-media";

  async function onFile(file: File) {
    if (!(r.mimes as readonly string[]).includes(file.type)) {
      toast.error(`Format file tidak didukung. Gunakan ${r.label}.`);
      return;
    }
    if (file.size > r.maxBytes) {
      toast.error(`Ukuran file melebihi batas (${r.label}).`);
      return;
    }
    setBusy(true);
    const ext = file.type === "application/pdf" ? "pdf" : file.type.split("/")[1].replace("jpeg", "jpg");
    const objectPath = `${userId}/${folder}/${crypto.randomUUID()}.${ext}`;
    const { error: upErr } = await createClient().storage.from(bucket).upload(objectPath, file, {
      contentType: file.type,
      upsert: false,
      cacheControl: "31536000",
    });
    setBusy(false);
    if (upErr) {
      toast.error("Gagal mengunggah file. Periksa koneksi lalu coba lagi.");
      return;
    }
    setPath(objectPath);
    if (variant === "image") setLocalPreview(URL.createObjectURL(file));
    toast.success("File berhasil diunggah. Jangan lupa simpan perubahan.");
  }

  const preview = localPreview ?? (isPublic && path ? publicMediaUrl(bucket as "public-event-media", path) : null);

  return (
    <div className="space-y-1.5">
      <p id={`${id}-label`} className="text-[13px] font-medium text-ink">
        {label}
        {required && <span className="ml-0.5 text-danger">*</span>}
      </p>
      <input type="hidden" name={name} value={path ?? ""} />
      <div
        className={cn(
          "relative flex flex-wrap items-center gap-3 rounded-xl border border-dashed bg-white p-3.5 transition-colors sm:flex-nowrap sm:gap-4",
          error?.length ? "border-danger/50" : "border-line hover:border-primary-border",
        )}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files?.[0];
          if (f) void onFile(f);
        }}
      >
        <div className="relative grid size-16 shrink-0 place-items-center overflow-hidden rounded-lg bg-surface-muted text-muted">
          {busy ? (
            <Loader2 className="size-6 animate-spin" aria-hidden />
          ) : variant === "image" && preview ? (
            <Image src={preview} alt="Pratinjau" fill sizes="64px" className="object-cover" unoptimized={!!localPreview} />
          ) : path ? (
            <FileText className="size-6" aria-hidden />
          ) : variant === "image" ? (
            <ImagePlus className="size-6" aria-hidden />
          ) : (
            <UploadCloud className="size-6" aria-hidden />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-ink">{path ? path.split("/").pop() : "Belum ada file"}</p>
          <p className="text-xs text-muted">{hint ?? r.label}</p>
        </div>
        <div className="flex gap-2">
          {path && !required && (
            <button
              type="button"
              onClick={() => {
                setPath(null);
                setLocalPreview(null);
              }}
              className="grid size-9 place-items-center rounded-lg text-muted hover:bg-red-50 hover:text-danger"
              aria-label={`Hapus ${label}`}
            >
              <Trash2 className="size-4" />
            </button>
          )}
          <button
            type="button"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className="h-9 rounded-[9px] border border-line bg-white px-3 text-sm font-medium transition-colors hover:border-primary-border hover:text-primary"
            aria-describedby={`${id}-label`}
          >
            {path ? "Ganti" : "Pilih file"}
          </button>
        </div>
        <input
          ref={inputRef}
          type="file"
          className="sr-only"
          tabIndex={-1}
          accept={r.mimes.join(",")}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void onFile(f);
            e.target.value = "";
          }}
        />
      </div>
      {error?.length ? <p className="text-[13px] font-medium text-danger">{error[0]}</p> : null}
    </div>
  );
}

/** Multi-image uploader (public buckets). Emits JSON array of paths. */
export function GalleryField({
  name,
  label,
  bucket,
  userId,
  folder,
  defaultPaths = [],
  max = 8,
}: {
  name: string;
  label: string;
  bucket: "public-event-media" | "public-umkm-media";
  userId: string;
  folder: string;
  defaultPaths?: string[];
  max?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [paths, setPaths] = useState<string[]>(defaultPaths);
  const [busy, setBusy] = useState(false);
  const r = FILE_RULES.image;

  async function onFiles(files: FileList) {
    const list = Array.from(files).slice(0, max - paths.length);
    setBusy(true);
    const added: string[] = [];
    for (const file of list) {
      if (!(r.mimes as readonly string[]).includes(file.type) || file.size > r.maxBytes) {
        toast.error(`${file.name}: format/ukuran tidak sesuai (${r.label}).`);
        continue;
      }
      const ext = file.type.split("/")[1].replace("jpeg", "jpg");
      const objectPath = `${userId}/${folder}/${crypto.randomUUID()}.${ext}`;
      const { error } = await createClient().storage.from(bucket).upload(objectPath, file, { contentType: file.type, cacheControl: "31536000" });
      if (error) toast.error(`Gagal mengunggah ${file.name}.`);
      else added.push(objectPath);
    }
    setBusy(false);
    if (added.length) {
      setPaths((p) => [...p, ...added]);
      toast.success(`${added.length} foto diunggah. Jangan lupa simpan perubahan.`);
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-ink">{label}</p>
      <input type="hidden" name={name} value={JSON.stringify(paths)} />
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {paths.map((p) => (
          <div key={p} className="group relative aspect-square overflow-hidden rounded-xl border border-line">
            <Image src={publicMediaUrl(bucket, p)!} alt="Foto galeri" fill sizes="150px" className="object-cover" />
            <button type="button" onClick={() => setPaths((x) => x.filter((y) => y !== p))} className="absolute right-1.5 top-1.5 grid size-8 place-items-center rounded-full bg-ink/40 text-ivory opacity-90 hover:bg-danger" aria-label="Hapus foto">
              <Trash2 className="size-3.5" />
            </button>
          </div>
        ))}
        {paths.length < max && (
          <button type="button" disabled={busy} onClick={() => inputRef.current?.click()} className="grid aspect-square place-items-center rounded-xl border-2 border-dashed border-line text-muted hover:border-emerald hover:text-emerald">
            {busy ? <Loader2 className="size-6 animate-spin" /> : <span className="flex flex-col items-center gap-1 text-xs font-semibold"><ImagePlus className="size-6" />Tambah</span>}
          </button>
        )}
      </div>
      <p className="text-xs text-muted">Maksimal {max} foto · {r.label}</p>
      <input ref={inputRef} type="file" multiple accept={r.mimes.join(",")} className="sr-only" tabIndex={-1} onChange={(e) => { if (e.target.files) void onFiles(e.target.files); e.target.value = ""; }} />
    </div>
  );
}
