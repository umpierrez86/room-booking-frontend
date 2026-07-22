import { toLocalDateString } from "./date";

test("formats a date using local components, not UTC", () => {
  // 21:30 local time — if formatted via toISOString() in a negative UTC
  // offset zone (e.g. UTC-3) this would incorrectly roll over to the next day.
  const date = new Date(2026, 0, 15, 21, 30);
  expect(toLocalDateString(date)).toBe("2026-01-15");
});

test("pads single-digit months and days", () => {
  const date = new Date(2026, 2, 5);
  expect(toLocalDateString(date)).toBe("2026-03-05");
});
