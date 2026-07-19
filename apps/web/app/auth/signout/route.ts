import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Sign-out failed:", error.message);
  }

  // Explicit 303 forces the browser to switch to GET on redirect — the default
  // 307 would preserve the POST method and re-POST to /login, which has no
  // POST handler and would 405 instead of showing the login page.
  return NextResponse.redirect(new URL("/login", request.url), 303);
}
