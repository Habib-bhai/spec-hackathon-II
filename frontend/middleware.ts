import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/**
 * Next.js middleware for route protection.
 *
 * This middleware:
 * - Protects /dashboard/* routes (requires authentication)
 * - Redirects unauthenticated users to /auth/sign-in with returnUrl
 * - Redirects authenticated users from /auth/* to /dashboard
 *
 * Note: This is an "optimistic" check based on cookie presence.
 * Full validation happens server-side when session is accessed.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get session cookie (optimistic check)
  const sessionCookie = getSessionCookie(request);
  const isAuthenticated = !!sessionCookie;

  // Protected routes that require authentication
  const protectedRoutes = ["/dashboard", "/profile"];
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Auth routes (sign-in, sign-up) - redirect to dashboard if authenticated
  const authRoutes = ["/auth/sign-in", "/auth/sign-up"];
  const isAuthRoute = authRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Redirect unauthenticated users from protected routes to sign-in
  if (isProtectedRoute && !isAuthenticated) {
    const signInUrl = new URL("/auth/sign-in", request.url);
    signInUrl.searchParams.set("returnUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Redirect authenticated users from auth routes to dashboard
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/auth/:path*",
  ],
};
