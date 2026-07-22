import { toLocalDateString, parseLocalDate } from "./date";

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

test("parseLocalDate builds a Date at local midnight from YYYY-MM-DD", () => {
  const date = parseLocalDate("2026-07-21");
  expect(date.getFullYear()).toBe(2026);
  expect(date.getMonth()).toBe(6);
  expect(date.getDate()).toBe(21);
  expect(date.getHours()).toBe(0);
});

test("parseLocalDate and toLocalDateString round-trip", () => {
  expect(toLocalDateString(parseLocalDate("2026-01-05"))).toBe("2026-01-05");
});
