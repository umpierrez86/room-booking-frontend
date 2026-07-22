import { useQuery } from "@tanstack/react-query";
import { getSchedule } from "../api/schedule";

const SCHEDULE_QUERY_KEY = "schedule";

export function useSchedule(date: string) {
  return useQuery({
    queryKey: [SCHEDULE_QUERY_KEY, date],
    queryFn: () => getSchedule(date),
  });
}
