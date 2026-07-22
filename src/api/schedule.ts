import { apiFetch } from "./client";
import type { DaySchedule } from "../types/models";

export async function getSchedule(date: string): Promise<DaySchedule> {
  const r = await apiFetch(`/schedule?date=${date}`);
  return r.json();
}
