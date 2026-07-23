import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Calendar from "./Calendar";
import * as api from "../../api/schedule";
import { AuthProvider } from "../../context/AuthContext";

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
  localStorage.setItem("rb_token", "test-token");
  render(
    <QueryClientProvider client={qc}>
      <AuthProvider><Calendar date="2026-07-21" /></AuthProvider>
    </QueryClientProvider>,
  );
  expect(await screen.findByText("Sprint")).toBeInTheDocument();
  expect(screen.getByText("C")).toBeInTheDocument();
  expect(screen.getAllByTestId("schedule-grid-cell")).toHaveLength(1);
  localStorage.clear();
});

test("renders an error state when the schedule fails to load", async () => {
  vi.spyOn(api, "getSchedule").mockRejectedValue(new Error("Network down"));
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  localStorage.setItem("rb_token", "test-token");
  render(
    <QueryClientProvider client={qc}>
      <AuthProvider><Calendar date="2026-07-21" /></AuthProvider>
    </QueryClientProvider>,
  );
  expect(await screen.findByRole("alert")).toBeInTheDocument();
  expect(screen.getByText(/network down/i)).toBeInTheDocument();
  localStorage.clear();
});
