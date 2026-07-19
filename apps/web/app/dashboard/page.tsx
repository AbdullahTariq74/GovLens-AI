import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  // Defense-in-depth: proxy.ts (middleware) is the primary gate for this route,
  // but re-checking here means a matcher miss, an edge-runtime error, or a future
  // middleware-bypass bug can't render this page to an unauthenticated request.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main>
      <h1>You&apos;re logged in</h1>
      <p>
        This is a placeholder — matched opportunities land here starting in Milestone 3.
      </p>
      <form action="/auth/signout" method="post">
        <button type="submit">Sign out</button>
      </form>
    </main>
  );
}
