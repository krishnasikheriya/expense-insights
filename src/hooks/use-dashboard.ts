import { useQuery } from "@tanstack/react-query";
import { DateRange } from "react-day-picker";

export function useDashboard(dateRange: DateRange | undefined) {
  return useQuery({
    // IMPORTANT: Include dateRange in the queryKey so it refetches when dates change
    queryKey: ["dashboard", dateRange],
    queryFn: async () => {
      // TODO: Build the URL with searchParams like you did in use-expenses.ts
      let url = "/api/dashboard";
      
      if (dateRange?.from && dateRange?.to) {
        url += `?startDate=${dateRange.from.toISOString()}&endDate=${dateRange.to.toISOString()}`
      }
      
      const res = await fetch(url);
      if(!res.ok) throw new Error("Failed to fetch dashboard data");
      return res.json();
    },
  });
}
