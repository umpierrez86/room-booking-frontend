import { buildMonthGrid } from "./monthGrid";

test("builds a 42-cell grid (6 weeks x 7 days)", () => {
  const grid = buildMonthGrid(2026, 6); // July 2026
  expect(grid).toHaveLength(42);
});

test("places day 1 on its correct Monday-first weekday column", () => {
  // July 1, 2026 is a Wednesday -> Monday-first column index 2 (0=Mon,1=Tue,2=Wed)
  const grid = buildMonthGrid(2026, 6);
  const wednesdayColumn = 2;
  expect(grid[wednesdayColumn]).toEqual({ key: "2026-07-01", day: 1, iso: "2026-07-01" });
  expect(grid[wednesdayColumn - 1]).toEqual({ key: `blank-${wednesdayColumn - 1}`, day: null, iso: null });
});

test("last day of the month has the correct iso and no day beyond it", () => {
  const grid = buildMonthGrid(2026, 6); // July has 31 days
  const dayCells = grid.filter((cell) => cell.day !== null);
  expect(dayCells).toHaveLength(31);
  expect(dayCells.at(-1)).toEqual({ key: "2026-07-31", day: 31, iso: "2026-07-31" });
});

test("pads single-digit months and days in iso keys", () => {
  const grid = buildMonthGrid(2026, 0); // January 2026
  const jan5 = grid.find((cell) => cell.day === 5);
  expect(jan5?.iso).toBe("2026-01-05");
});
