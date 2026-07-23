import { useQuery } from "@tanstack/react-query";
import { getSchedule } from "../api/schedule";
import { useAuth } from "./useAuth";

const SCHEDULE_QUERY_KEY = "schedule";

export function useSchedule(date: string) {
  const { token } = useAuth();
  return useQuery({
    queryKey: [SCHEDULE_QUERY_KEY, date],
    queryFn: () => getSchedule(date, token),
    enabled: token !== null,
  });
}
