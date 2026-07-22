import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Calendar from "./Calendar";
import * as api from "../../api/schedule";

test("renders room columns and an occupied block", async () => {
  vi.spyOn(api, "getSchedule").mockResolvedValue({
    date: "2026-07-21",
    rooms: [
      {
        room: "C",
        date: "2026-07-21",
        capacity: 6,
        operating: { start: "08:00", end: "20:00" },
        occupied: [{ id: "1", start: "10:00", end: "11:30", title: "Sprint" }],
        free: [],
      },
    ],
  });
  const qc = new QueryClient();
  render(
    <QueryClientProvider client={qc}>
      <Calendar date="2026-07-21" />
    </QueryClientProvider>,
  );
  expect(await screen.findByText("Sprint")).toBeInTheDocument();
  expect(screen.getByText("C")).toBeInTheDocument();
});
