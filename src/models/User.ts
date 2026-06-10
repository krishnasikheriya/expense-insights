// src/models/User.ts
import mongoose, { Schema, Document } from "mongoose";

// TODO: Define the IUser interface extending mongoose.Document
export interface IUser extends Document {
  // name, email, image, etc.
  name?: string;
  email?: string;
  image?: string;
  emailVerified?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    // TODO: Implement the schema fields. 
    // Make sure they match what NextAuth expects if you're linking them!
    name : {type: String},
    email: {type: String, required: true, unique: true},
    image: {type: String},
    emailVerified: {type: Date, default: null},
  },
  { timestamps: true }
);

// TODO: Export the model. 
// Hint: Check if mongoose.models.User already exists before creating it 
// to prevent "OverwriteModelError" in Next.js development.
export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
