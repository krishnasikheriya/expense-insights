"use client";

import { useState } from "react";
import { DateRange } from "react-day-picker";
import { startOfMonth, endOfMonth } from "date-fns";
import { DatePickerWithRange } from "@/components/date-range-picker";
import { useDashboard } from "@/hooks/use-dashboard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell, Legend } from "recharts";

// Configuration for shadcn/ui charts
const chartConfig = {
  totalAmount: {
    label: "Total Amount",
  },
} satisfies ChartConfig;

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });

  const { data: chartData, isLoading } = useDashboard(dateRange);

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <DatePickerWithRange date={dateRange} setDate={setDateRange} />
      </div>

      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Expenses by Category</CardTitle>
          <CardDescription>
            {dateRange?.from && dateRange.to
              ? `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
              : "Select a date range"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          {isLoading ? (
            <div className="h-[300px] flex items-center justify-center">Loading chart...</div>
          ) : !chartData || chartData.length === 0 ? (
            <div className="h-[300px] flex items-center justify-center">No data for this period.</div>
          ) : (
            <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={chartData}
                  dataKey="totalAmount"
                  nameKey="categoryName"
                  innerRadius={60}
                  outerRadius={100}
                >
                  {/* TODO: Iterate over chartData and map to <Cell key={...} fill={item.color || '#000'} /> */}
                </Pie>
                <Legend />
              </PieChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
