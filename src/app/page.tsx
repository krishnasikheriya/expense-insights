"use client";

import { useState } from "react";
import { DateRange } from "react-day-picker";
import { startOfMonth, endOfMonth, format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
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

  const { data, isLoading } = useDashboard(dateRange);
  
  // Safely extract the new data shape from our updated API
  const chartData = data?.chartData || [];
  const summary = data?.summary || { totalSpend: 0, count: 0, average: 0 };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <DatePickerWithRange date={dateRange} setDate={setDateRange} />
      </div>

      {/* Summary Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Spend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(summary.totalSpend || 0).toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.count || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Spend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(summary.average || 0).toFixed(2)}</div>
          </CardContent>
        </Card>
        
      </div>

      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Expenses by Category</CardTitle>
          <CardDescription>
            {dateRange?.from && dateRange.to
              ? `${format(dateRange.from, "LLL dd, y")} - ${format(dateRange.to, "LLL dd, y")}`
              : "Select a date range"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          {isLoading ? (
            <div className="h-[300px] flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : !chartData || chartData.length === 0 ? (
            <div className="h-[300px] flex flex-col items-center justify-center gap-4 text-muted-foreground">
              <p>No data for this period.</p>
              <Link href="/expenses">
                <Button>Add First Expense</Button>
              </Link>
            </div>
          ) : (
            <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-75">
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
                  {chartData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color || '#cccccc'}/>
                  ))}
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
