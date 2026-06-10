import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    
    // TODO: Fetch the categories that belong to the current user.
    // Hint: Use `Category.find({ user: session.user.id })`
    // const categories = ...
    
    return NextResponse.json([]); // Replace this array with the categories!
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    await dbConnect();

    // TODO: Create a new category using the Mongoose model.
    // Make sure to set the `user` field to `session.user.id`.
    // const newCategory = await Category.create({ ...body, user: session.user.id });

    return NextResponse.json({ message: "Not implemented yet" }, { status: 201 }); // Replace this
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
