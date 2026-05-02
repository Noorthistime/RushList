// ============================================================
// Middleware — Protect dashboard routes with JWT auth
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/constants";

// Simple JWT decode (no verification in edge runtime — full verification in API routes)
function decodeJWT(token: string): { userId: string; exp: number } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;

  // Public paths that don't need auth
  const isPublicPath =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname.startsWith("/api/auth/");

  if (isPublicPath) {
    // If user is already authenticated and visits login/signup, redirect to dashboard
    if (token && (pathname === "/login" || pathname === "/signup")) {
      const decoded = decodeJWT(token);
      if (decoded && decoded.exp * 1000 > Date.now()) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
    return NextResponse.next();
  }

  // Protected paths — require auth
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/api/lists") || pathname.startsWith("/api/tasks")) {
    if (!token) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { success: false, error: "Not authenticated" },
          { status: 401 }
        );
      }
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Basic expiry check
    const decoded = decodeJWT(token);
    if (!decoded || decoded.exp * 1000 < Date.now()) {
      const response = pathname.startsWith("/api/")
        ? NextResponse.json(
            { success: false, error: "Token expired" },
            { status: 401 }
          )
        : NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete(COOKIE_NAME);
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/signup",
    "/api/lists/:path*",
    "/api/tasks/:path*",
  ],
};
