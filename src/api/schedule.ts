import { apiFetch } from "./client";
import type { DaySchedule } from "../types/models";

export async function getSchedule(date: string, accessToken?: string | null): Promise<DaySchedule> {
  const r = await apiFetch(`/schedule?date=${date}`, {}, accessToken);
  return r.json();
}
