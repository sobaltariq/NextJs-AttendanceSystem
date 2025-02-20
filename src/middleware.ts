// middleware.ts
import { NextResponse } from "next/server";
import { authMiddleware } from "./middleware/auth_middleware";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  return authMiddleware(request);
}

export const config = {
  // Apply to all routes except /login and /register
  matcher: ["/login", "/register", "/profile", "/dashboard"], // Apply to all routes except login and register
};
