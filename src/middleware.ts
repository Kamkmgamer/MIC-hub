import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    void auth.protect();
  }

  // Get auth data
  const authData = await auth();
  
  // Check if user has a role in their metadata
  const hasRole = !!(
    authData.sessionClaims && 
    'metadata' in authData.sessionClaims && 
    authData.sessionClaims.metadata && 
    (authData.sessionClaims.metadata as { role?: string }).role
  );

  // Allow the role-setting mutation to pass through so the user can acquire a role
  if (
    authData.userId &&
    !hasRole &&
    req.nextUrl.pathname !== '/onboarding' &&
    !req.nextUrl.pathname.startsWith('/api') && !req.nextUrl.pathname.startsWith('/trpc')
  ) {
    const orgSelection = new URL('/onboarding', req.url);
    return NextResponse.redirect(orgSelection);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)(/)", "/", "/(api|trpc)(.*)"],
};

  


