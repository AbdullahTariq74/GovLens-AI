import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { AUTH_ERROR_CODES } from "@/lib/supabase/auth-errors";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  const supabase = await createClient();

  if (code) {
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(`${APP_URL}/dashboard`);
      }
      console.error("Magic-link code exchange failed:", error.message);
    } catch (err) {
      console.error("Magic-link code exchange threw:", err);
    }
  }

  // Exchange failed, threw, or no code present. Note: this only helps a user who
  // already has a valid session cookie from a prior visit — it does NOT rescue a
  // first-time sign-in where a corporate email scanner/prefetcher consumed the
  // one-time code before the real user clicked it (the scanner's session lands on
  // its own request, never the user's browser). That gap is a known, accepted
  // limitation, not something this check silently fixes.
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      return NextResponse.redirect(`${APP_URL}/dashboard`);
    }
  } catch (err) {
    console.error("Session check after failed exchange threw:", err);
  }

  return NextResponse.redirect(`${APP_URL}/login?error=${AUTH_ERROR_CODES.INVALID_LINK}`);
}
