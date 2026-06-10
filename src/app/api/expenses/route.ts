import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import Expense from "@/models/Expense";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    await dbConnect();

    // TODO: Build the query object
    // Always filter by `user: session.user.id`.
    // If startDate and endDate exist, add a `$gte` and `$lte` filter on the `date` field.
    const query: any = { user: session.user.id };

    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    // TODO: Fetch expenses using the `query`, sorting by date descending.
    // VERY IMPORTANT: Use `.populate("category")` so we get the category name instead of just the ID!
    const expenses = await Expense.find(query)
      .sort({ date: -1 })
      .populate("category");

    return NextResponse.json(expenses);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  // TODO: Implement this similarly to your Category POST route, but using the Expense model!
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    await dbConnect();

    const newExpense = await Expense.create({
      ...body,
      user: session.user.id,
    });

    return NextResponse.json(newExpense, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
