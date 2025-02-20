// middleware/authMiddleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function authMiddleware(request: NextRequest) {
  // Check if the user is logged in by checking the auth token (cookie or other logic)
  const isLoggedIn = request.cookies.get("authToken"); // Replace with your actual auth logic

  // If the user is logged in and they try to visit the login or register page, redirect to profile
  if (
    isLoggedIn &&
    (request.nextUrl.pathname === "/login" ||
      request.nextUrl.pathname === "/register")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If the user is not logged in and tries to access protected routes, redirect to login
  if (
    !isLoggedIn &&
    request.nextUrl.pathname !== "/login" &&
    request.nextUrl.pathname !== "/register"
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next(); // Continue to the requested route if not blocked
}
