/**
 * Formats a Date as `YYYY-MM-DD` using LOCAL time components.
 *
 * Do not use `date.toISOString().slice(0, 10)` for this — that formats in
 * UTC, which shifts the calendar day in negative UTC offsets (e.g. Uruguay,
 * UTC-3) during the evening local time.
 */
export function toLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Today's date, formatted as `YYYY-MM-DD` in local time. */
export function todayLocal(): string {
  return toLocalDateString(new Date());
}
