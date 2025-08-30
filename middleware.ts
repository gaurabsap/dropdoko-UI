import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define protected and admin routes
const protectedPaths = ["/profile", "/dashboard", "/orders"];
const adminPaths = ["/admin", "/admin/settings"];
const publicPaths = ["/", "/login", "/signup", "/products"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Read cookie from request
  const accessToken = req.cookies.get("access_token")?.value;
  const role = req.cookies.get("role")?.value; // optional, if you set role cookie

  // ✅ 1. Protect routes requiring login
  if (protectedPaths.some((path) => pathname.startsWith(path)) && !accessToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ✅ 2. Protect admin routes
  if (adminPaths.some((path) => pathname.startsWith(path)) && role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // ✅ 3. Redirect logged-in users away from login/signup
  if (accessToken && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

// Apply to all routes except static files
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
