export interface LoginResponse { access_token: string; token_type: string; }
export interface Interval { start: string; end: string; }
export interface OccupiedBlock { id: string; start: string; end: string; title: string; }
export interface RoomSchedule {
  room: string; date: string; capacity: number;
  operating: Interval; occupied: OccupiedBlock[]; free: Interval[];
}
export interface DaySchedule { date: string; rooms: RoomSchedule[]; }
export interface BookingOut { id: string; room: string; date: string; start: string; end: string; title: string; attendees: number; }
export type ChatEvent =
  | { type: "token"; text: string }
  | { type: "tool_start"; name: string }
  | { type: "tool_end" }
  | { type: "booking_changed" }
  | { type: "done" };
