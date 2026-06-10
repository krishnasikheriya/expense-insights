import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import Expense from "@/models/Expense";

export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> },
) {
  // TODO: Implement the DELETE method for an expense exactly like you did for categories.
  // Don't forget `await props.params`!

  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await props.params;
    await dbConnect();

    const deletedExpense = await Expense.findOneAndDelete({
      _id: params.id,
      user: session.user.id,
    });

    if (!deletedExpense) {
      return NextResponse.json(
        { error: "Not found or unauthorized" },
        { status: 401 },
      );
    }

    return NextResponse.json({ message: "Expense deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
