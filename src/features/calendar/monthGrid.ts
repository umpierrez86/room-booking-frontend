const DAYS_IN_WEEK = 7;
const WEEKS_TO_DISPLAY = 6;
const CELL_COUNT = WEEKS_TO_DISPLAY * DAYS_IN_WEEK;

export interface MonthCell {
  key: string;
  day: number | null;
  iso: string | null;
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/** Weekday of the 1st of the month, Monday-first (0 = Monday … 6 = Sunday). */
function firstWeekdayMondayFirst(year: number, month: number): number {
  const SUNDAY_FIRST_INDEX_OF_SUNDAY = 0;
  const DAYS_TO_SHIFT_SUNDAY_TO_END = 6;
  const sundayFirst = new Date(year, month, 1).getDay();
  return sundayFirst === SUNDAY_FIRST_INDEX_OF_SUNDAY
    ? DAYS_TO_SHIFT_SUNDAY_TO_END
    : sundayFirst - 1;
}

/**
 * Builds a fixed 6-week (42-cell), Monday-first grid for the given month
 * (0-indexed). Cells outside the month are blank placeholders so the grid
 * layout never reflows between months.
 */
export function buildMonthGrid(year: number, month: number): MonthCell[] {
  const leadingBlanks = firstWeekdayMondayFirst(year, month);
  const totalDays = daysInMonth(year, month);

  return Array.from({ length: CELL_COUNT }, (_, i) => {
    const day = i - leadingBlanks + 1;
    if (day < 1 || day > totalDays) {
      return { key: `blank-${i}`, day: null, iso: null };
    }
    const iso = `${year}-${pad2(month + 1)}-${pad2(day)}`;
    return { key: iso, day, iso };
  });
}
