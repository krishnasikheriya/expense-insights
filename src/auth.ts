// src/auth.ts
import NextAuth from "next-auth"
// TODO: Import the MongoDBAdapter from @auth/mongodb-adapter
import { MongoDBAdapter } from "@auth/mongodb-adapter"
// TODO: Import your native MongoDB client promise from src/lib/db
import clientPromise from "@/lib/db"
// TODO: Import your preferred provider(s) (e.g., GitHub or Google)
import GitHub from "next-auth/providers/github"

export const { handlers, signIn, signOut, auth } = NextAuth({
  // TODO: Configure the MongoDB adapter using the clientPromise
  adapter: MongoDBAdapter(clientPromise),

  providers: [
    // Add your providers here
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],
  
  callbacks: {
    // TODO: Add any session callbacks if you want to include the user's ID in the session object
    async session({ session, user}) {
      if (session ?.user && user ?.id) {
        session.user.id = user.id
      }
      return session;
    }
  }
})
