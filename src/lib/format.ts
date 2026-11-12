const TZ = "Asia/Jakarta";

export function formatDate(iso: string | null | undefined, opts: Intl.DateTimeFormatOptions = {}): string {
  if (!iso) return "-";
  return new Intl.DateTimeFormat("id-ID", { timeZone: TZ, day: "numeric", month: "long", year: "numeric", ...opts }).format(new Date(iso));
}

export function formatShortDate(iso: string | null | undefined): string {
  return formatDate(iso, { month: "short" });
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: TZ, day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  }).format(new Date(iso)) + " WIB";
}

export function formatDateRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const sameDay = formatDate(start) === formatDate(end);
  if (sameDay) return formatDate(start);
  const sameMonth = s.getUTCMonth() === e.getUTCMonth() && s.getUTCFullYear() === e.getUTCFullYear();
  if (sameMonth) return `${formatDate(start, { month: undefined, year: undefined, day: "numeric" })}–${formatDate(end)}`;
  return `${formatShortDate(start)} – ${formatShortDate(end)}`;
}

export function dayParts(iso: string): { day: string; month: string } {
  const d = new Date(iso);
  return {
    day: new Intl.DateTimeFormat("id-ID", { timeZone: TZ, day: "2-digit" }).format(d),
    month: new Intl.DateTimeFormat("id-ID", { timeZone: TZ, month: "short" }).format(d).replace(".", ""),
  };
}

/** ISO → value for <input type="datetime-local"> in WIB. */
export function toJakartaInput(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(new Date(iso).getTime() + 7 * 60 * 60 * 1000);
  return d.toISOString().slice(0, 16);
}

/** <input type="datetime-local"> value (WIB) → ISO UTC string. */
export function fromJakartaInput(value: string): string {
  return new Date(`${value}:00+07:00`).toISOString();
}

export function formatPhone(phone: string | null | undefined): string {
  if (!phone) return "-";
  const p = phone.replace(/^\+?62/, "0");
  return p.replace(/(\d{4})(\d{4})(\d+)/, "$1-$2-$3");
}

export function waLink(phone: string | null | undefined, text?: string): string | null {
  if (!phone) return null;
  const digits = phone.replace(/[^0-9]/g, "").replace(/^0/, "62");
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

export function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.round(diff / 60000);
  if (m < 1) return "baru saja";
  if (m < 60) return `${m} menit lalu`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} jam lalu`;
  const d = Math.round(h / 24);
  if (d < 30) return `${d} hari lalu`;
  return formatShortDate(iso);
}

export function normalizePhone(v: string): string {
  let p = v.replace(/[^0-9+]/g, "");
  if (p.startsWith("+62")) p = "0" + p.slice(3);
  else if (p.startsWith("62")) p = "0" + p.slice(2);
  return p;
}
