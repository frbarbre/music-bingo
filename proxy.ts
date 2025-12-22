import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "./lib";

export async function proxy(request: NextRequest) {
  const store = request.cookies.get("store")?.value;
  const isLoginPage = request.nextUrl.pathname.startsWith("/login");

  // If has session, verify it
  if (store) {
    try {
      await decrypt(store);
      // Valid session - if on login page, redirect to home
      if (isLoginPage) {
        return NextResponse.redirect(new URL("/", request.url));
      }
      return NextResponse.next();
    } catch {
      // Invalid session, redirect to login (unless already there)
      if (!isLoginPage) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
      return NextResponse.next();
    }
  }

  // No session and trying to access protected routes, redirect to login
  if (!isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (authentication endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (login page itself)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|login).*)",
  ],
};
