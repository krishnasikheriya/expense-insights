import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import Expense from "@/models/Expense";
import mongoose from "mongoose";

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

    // TODO: Build the $match stage for the MongoDB aggregation pipeline
    // It must filter by user (we cast to ObjectId here because Aggregation pipelines don't automatically cast string to ObjectId like .find() does!)
    const matchStage: any = {
      user: new mongoose.Types.ObjectId(session.user.id),
    };

    if (startDate && endDate) {
      // TODO: Add date filtering to matchStage
      matchStage.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // TODO: Perform the MongoDB Aggregation Pipeline
    const aggregatedData = await Expense.aggregate([
      { $match: matchStage },
      // TODO: Add a $group stage to sum the `amount` by `category`
      { $group: { _id: "$category", totalAmount: { $sum: "$amount" } } },
      
      // TODO: Use a $lookup stage to join the Category collection so we can get the category name and color
      // Hint: from: "categories", localField: "_id", foreignField: "_id", as: "categoryDetails"
      {
        $lookup: {
          from : "categories",
          localField: "_id",
          foreignField: "_id",
          as: "categoryDetails"
        }
      },
      // TODO: $unwind the categoryDetails array so it becomes an object instead of an array
      { $unwind: "$categoryDetails"},
      // TODO: Add a $project stage to format the final output
      // e.g., { _id: 0, categoryName: "$categoryDetails.name", color: "$categoryDetails.color", totalAmount: 1 }
      {
        $project: {
          _id: 0,
          categoryName: "$categoryDetails.name",
          color: "$categoryDetails.color",
          totalAmount: 1
        }
      }
    ]);

    const summaryMetrics = await Expense.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalSpend: { $sum: "$amount" },
          average: { $avg: "$amount" },
          count: { $sum: 1 }
        }
      }
    ]);

    // We now return an object containing BOTH the chart data and the summary metrics!
    return NextResponse.json({
      chartData: aggregatedData,
      summary: summaryMetrics[0] || { totalSpend: 0, count: 0, average: 0 }
    }); 
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
