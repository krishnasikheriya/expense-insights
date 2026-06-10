// src/lib/mongodb.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  // TODO: Implement the connection logic here
  // Hint: Check if cached.conn exists, if so return it.
  // Otherwise, create a cached.promise using mongoose.connect()
  // and await it before returning cached.conn.

  // 1. Check if cached.conn exists, if so return it.
  if (cached.conn) {
    return cached.conn;
  }
  
  //2. Otherwise, create a cached.promise using mongoose.connect()
  if(!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongooseInstance) => {
      return mongooseInstance;
    })
  }
  
  //3. Await it before returning cached.conn
  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
  return cached.conn; 
}

export default dbConnect;
