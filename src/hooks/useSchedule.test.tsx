import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useSchedule } from "./useSchedule";
import * as api from "../api/schedule";

test("fetches schedule for date", async () => {
  vi.spyOn(api, "getSchedule").mockResolvedValue({ date: "2026-07-21", rooms: [] });
  const qc = new QueryClient();
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  );
  const { result } = renderHook(() => useSchedule("2026-07-21"), { wrapper });
  await waitFor(() => expect(result.current.data?.date).toBe("2026-07-21"));
});
