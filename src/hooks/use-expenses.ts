import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DateRange } from "react-day-picker";

export function useExpenses(dateRange: DateRange | undefined) {
  return useQuery({
    // IMPORTANT: The query key MUST include the dateRange so TanStack Query refetches when the dates change!
    queryKey: ["expenses", dateRange],
    queryFn: async () => {
      // Build the fetch URL with searchParams
      let url = "/api/expenses";
      if (dateRange?.from && dateRange?.to) {
        url += `?startDate=${dateRange.from.toISOString()}&endDate=${dateRange.to.toISOString()}`;
      }
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch expenses");
      return res.json();
    },
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    // TODO: Implement mutationFn for POST /api/expenses
    mutationFn: async (expenseData: {
      amount: number;
      description: string;
      date: Date;
      category: string;
    }) => {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expenseData),
      });

      if (!res.ok) throw new Error("Failed to create expense");
      return res.json();
    },
    onSuccess: () => {
      // TODO: Invalidate "expenses" query
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
}

// TODO: Create a useDeleteExpense hook
export function useDeleteExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/expenses/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete expense");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
}
