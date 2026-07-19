"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AUTH_ERROR_MESSAGES } from "@/lib/supabase/auth-errors";

const GENERIC_SUBMIT_ERROR = "Something went wrong sending your sign-in link. Please try again.";

function LoginError() {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");

  if (!errorParam || !AUTH_ERROR_MESSAGES[errorParam]) {
    return null;
  }

  return <p role="alert">{AUTH_ERROR_MESSAGES[errorParam]}</p>;
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "error">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("signInWithOtp failed:", error.message);
      setStatus("error");
      return;
    }

    setStatus("sent");
  }

  if (status === "sent") {
    return <p>Check your email for a sign-in link.</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <button type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending..." : "Send sign-in link"}
      </button>
      {status === "error" && <p role="alert">{GENERIC_SUBMIT_ERROR}</p>}
    </form>
  );
}

export default function LoginPage() {
  return (
    <main>
      <h1>Sign in to GovLens AI</h1>
      <Suspense fallback={null}>
        <LoginError />
      </Suspense>
      <LoginForm />
    </main>
  );
}
