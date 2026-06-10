// src/models/Expense.ts
import mongoose, { Schema, Document, mongo } from "mongoose";

export interface IExpense extends Document {
  // TODO: Add fields (amount, description, date, category reference, user reference)
  amount: number;
  description: string;
  date: Date;
  category: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema = new Schema<IExpense>(
  {
    // TODO: Implement the schema fields.
    // Ensure both User and Category are referenced correctly.

    amount: {type: Number, required: true, min: 0},
    description: {type: String, required: true, trim: true},
    date: {type: Date, required: true, default: Date.now},
    category: {type: Schema.Types.ObjectId, ref: "Category", required: true},
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Expense || mongoose.model<IExpense>("Expense", ExpenseSchema);
