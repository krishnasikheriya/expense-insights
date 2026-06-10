// src/middleware.ts
import NextAuth from "next-auth"
import { authConfig } from "./auth.config"

const { auth } = NextAuth(authConfig)

// TODO: Implement the middleware logic
// Hint: You can use `export default auth((req) => { ... })`
// Check `req.auth` to see if the user is authenticated. 
// If they are not and they are trying to access a protected route, 
// redirect them to the `/login` page using `Response.redirect`.

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnLoginPage = req.nextUrl.pathname.startsWith('/login');

  // If the user is NOT logged in and trying to access a protected route, redirect them to the login page.
  if(!isLoggedIn && !isOnLoginPage) {
    return Response.redirect(new URL('/login', req.nextUrl));
  }

  // Optional but recommded: If they ARE logged in and try to hit /login, redirect them to the home/dashboard page.
  if(isLoggedIn && isOnLoginPage) {
    return Response.redirect(new URL('/', req.nextUrl));
  }
})

export const config = {
  // TODO: Implement the matcher array. 
  // Make sure to match all dashboard routes that should be protected.
  // Example: matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
  matcher : ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
}
