import { apiFetch } from "./client";
import type { BookingOut } from "../types/models";

export async function getMyBookings(): Promise<BookingOut[]> {
  return (await apiFetch("/bookings/me")).json();
}

export async function deleteBooking(id: string): Promise<void> {
  await apiFetch(`/bookings/${id}`, { method: "DELETE" });
}
