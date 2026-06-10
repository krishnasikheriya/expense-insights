// src/app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/auth"

// TODO: Export the GET and POST handlers from `handlers`
export const { GET, POST } = handlers;