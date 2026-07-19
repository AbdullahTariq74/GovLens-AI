import { type NextRequest, NextResponse } from "next/server";
import { createMiddlewareClient } from "@/lib/supabase/middleware-client";

// Next.js requires `config.matcher` below to be a static literal it can parse at
// build time — it cannot reference a variable. That means this array and the
// matcher literal are two sources of truth that must be kept in sync by hand
// when adding a new protected route; there's no way to derive one from the other.
const PROTECTED_PATHS = ["/dashboard"];

export async function proxy(request: NextRequest) {
  const { supabase, response } = createMiddlewareClient(request);

  const isProtectedPath = PROTECTED_PATHS.some((path) =>
    request.nextUrl.pathname.startsWith(path),
  );

  let user = null;
  try {
    // Must call getUser() (not just check for a cookie) to refresh the session token
    // on every request — this is @supabase/ssr's documented pattern for session
    // persistence, not optional. Skipping it causes silent, unexpected logouts.
    const result = await supabase.auth.getUser();
    user = result.data.user;
  } catch (err) {
    console.error("Supabase getUser() failed in proxy:", err);
    // Fail closed: if we can't verify the session, treat protected paths as
    // unauthenticated rather than letting a transient Supabase outage bypass auth.
  }

  if (isProtectedPath && !user) {
    const redirectUrl = new URL("/login", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
