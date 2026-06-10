import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";
import { error } from "console";

export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> }, // Note: params is a Promise in Next.js 15
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Await the params before using them (Next.js 15 requirement)
    const params = await props.params;

    await dbConnect();

    // TODO: Delete the category with the given ID.
    // Security check: ensure the category actually belongs to `session.user.id`!
    // Hint: Use `Category.findOneAndDelete({ _id: params.id, user: session.user.id })`

    // Delate the category securely
    const deletedCategory = await Category.findOneAndDelete({
      _id: params.id,
      user: session.user.id,
    });

    if (!deletedCategory) {
      return NextResponse.json(
        { error: "Not found or unauthorized" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Category deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
