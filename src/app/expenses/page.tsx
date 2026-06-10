"use client";

import { useState } from "react";
import { DateRange } from "react-day-picker";
import { startOfMonth, endOfMonth, format } from "date-fns";
import { DatePickerWithRange } from "@/components/date-range-picker";
import {
  useCreateExpense,
  useDeleteExpense,
  useExpenses,
} from "@/hooks/use-expenses";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// TODO: Import useCategories to let users select a category in a form
import { useCategories } from "@/hooks/use-categories";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ExpensesPage() {
  // 1. Initialize date range state (defaults to current month)
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });

  // 2. Pass the dateRange into the hook.
  // Whenever the user changes dates, this hook will automatically re-fetch!
  const { data: expenses, isLoading } = useExpenses(dateRange);
  const { data: categories } = useCategories();

  //3.Initialize Mutations
  const createExpense = useCreateExpense();
  const deleteExpense = useDeleteExpense();

  //Form State
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return; //Prevent submission without a category

    createExpense.mutate(
      {
        description,
        amount: parseFloat(amount),
        category,
        date: new Date(date),
      },
      {
        onSuccess: () => {
          // clear inputs but leave the data and category for easy rapid entry
          setDescription("");
          setAmount("");
        },
      },
    );
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Expenses</h1>
        {/* The Date Picker drives the TanStack Query hook! */}
        <DatePickerWithRange date={dateRange} setDate={setDateRange} />
      </div>

      {/* TODO: Implement a form here using shadcn inputs, selects, and buttons to create an expense */}
      {/* Expense Creation Form */}
      <form
        onSubmit={handleCreate}
        className="grid grid-cols-1 md:grid-cols-5 gap-4 bg-slate-50 p-4 rounded-md border"
      >
        <Input
          placeholder="Description (e.g. Groceries)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <Input
          type="number"
          step="0.01"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <option value="" disabled>
            Select Category
          </option>
          {categories?.map((cat: any) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <Button type="submit" disabled={createExpense.isPending}>
          Add Expense
        </Button>
      </form>

      {/* Expenses Data Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-[100px] text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : expenses?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No expenses found.
                </TableCell>
              </TableRow>
            ) : (
              expenses?.map((expense: any) => (
                <TableRow key={expense._id}>
                  {/* TODO: Render expense data correctly */}
                  <TableCell>
                    {new Date(expense.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{expense.description}</TableCell>
                  {/* Note: since we populated the category, expense.category is an object! */}
                  <TableCell>{expense.category?.name}</TableCell>
                  <TableCell className="text-right">
                    ${expense.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => deleteExpense.mutate(expense._id)}
                      disabled={deleteExpense.isPending}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
