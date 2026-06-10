// src/lib/db.ts
import { MongoClient, ServerApiVersion } from "mongodb"

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    // TODO: Initialize the MongoClient and assign it to globalWithMongo._mongoClientPromise
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect();
  }
  // TODO: Assign the global promise to clientPromise
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // TODO: Initialize the MongoClient and connect it directly in production
  client = new MongoClient(uri, options)
  clientPromise = client.connect()}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise!
