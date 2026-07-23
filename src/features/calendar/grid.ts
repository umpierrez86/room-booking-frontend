const HEADER_ROW_COUNT = 1;
const SLOTS_PER_HOUR = 2;
const HALF_HOUR_MINUTES = 30;

/**
 * Maps a HH:MM time to its CSS grid row line, given the room's opening hour.
 * Row 1 is reserved for the header; each hour spans two 30-min slots.
 */
export function rowForTime(hhmm: string, openHour: number): number {
  const [hours, minutes] = hhmm.split(":").map(Number);
  const slotsFromOpen = (hours - openHour) * SLOTS_PER_HOUR + (minutes === HALF_HOUR_MINUTES ? 1 : 0);
  return HEADER_ROW_COUNT + 1 + slotsFromOpen;
}
