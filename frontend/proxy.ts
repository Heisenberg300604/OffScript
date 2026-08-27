import { clerkMiddleware } from "@clerk/nextjs/server";

/**
 * Clerk authentication middleware. (Next.js 16 renamed `middleware.ts` to
 * `proxy.ts`; the code is identical.)
 *
 * `clerkMiddleware()` must run for `auth()` to work in server components and
 * actions. It also performs an optimistic redirect for signed-out visitors to
 * protected routes. Real per-row authorization lives in lib/dal.ts
 * `requireUser()` and the user-scoped queries — this is defence in depth.
 *
 * `createRouteMatcher` is intentionally not used: Clerk has deprecated it in
 * favour of resource-based checks, which the Data Access Layer already does.
 */
const PROTECTED_PREFIXES = ["/dashboard", "/recording", "/history", "/progress"];

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (isProtected) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Everything except Next internals and static files.
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // API routes and Clerk's auto-proxy path.
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
