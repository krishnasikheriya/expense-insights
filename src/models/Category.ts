// src/models/Category.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  // TODO: Add fields (e.g., name, color, and a reference to the User)
  name: string;
  color?: string;
  user: mongoose.Types.ObjectId; // Reference to the User
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    // TODO: Implement the schema fields.
    // Hint: How do you create a relational reference to the User model in Mongoose?
    name: {type: String, required: true, trim: true},
    color: {type: String, default: '#cccccc'},
    user: {type: Schema.Types.ObjectId, ref: "User", required: true}
  },
  { timestamps: true }
);

export default mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);
