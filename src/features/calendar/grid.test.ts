import { rowForTime } from "./grid";

test("maps time to grid row (30-min slots, open at 08:00)", () => {
  expect(rowForTime("08:00", 8)).toBe(2); // primera fila de slot
  expect(rowForTime("10:00", 8)).toBe(6); // 2 + 4
  expect(rowForTime("11:30", 8)).toBe(9);
});
