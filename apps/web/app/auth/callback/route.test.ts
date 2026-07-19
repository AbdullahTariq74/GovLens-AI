import { describe, expect, it, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const exchangeCodeForSessionMock = vi.fn();
const getUserMock = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: {
      exchangeCodeForSession: exchangeCodeForSessionMock,
      getUser: getUserMock,
    },
  })),
}));

import { GET } from "./route";

function makeRequest(search: string) {
  return new NextRequest(new URL(`http://localhost:3000/auth/callback${search}`));
}

describe("auth callback route", () => {
  beforeEach(() => {
    exchangeCodeForSessionMock.mockReset();
    getUserMock.mockReset();
  });

  it("redirects to /dashboard when the code exchange succeeds", async () => {
    exchangeCodeForSessionMock.mockResolvedValueOnce({ error: null });

    const response = await GET(makeRequest("?code=abc123"));

    expect(response.headers.get("location")).toBe("http://localhost:3000/dashboard");
  });

  it("redirects to /dashboard when exchange fails but a session already exists (prefetch case)", async () => {
    exchangeCodeForSessionMock.mockResolvedValueOnce({ error: new Error("code already used") });
    getUserMock.mockResolvedValueOnce({ data: { user: { id: "user-1" } } });

    const response = await GET(makeRequest("?code=abc123"));

    expect(response.headers.get("location")).toBe("http://localhost:3000/dashboard");
  });

  it("redirects to /login?error=auth_failed when exchange fails and no session exists", async () => {
    exchangeCodeForSessionMock.mockResolvedValueOnce({ error: new Error("invalid code") });
    getUserMock.mockResolvedValueOnce({ data: { user: null } });

    const response = await GET(makeRequest("?code=abc123"));

    expect(response.headers.get("location")).toBe(
      "http://localhost:3000/login?error=auth_failed",
    );
  });

  it("skips code exchange and falls through to the session check when no code param is present", async () => {
    getUserMock.mockResolvedValueOnce({ data: { user: null } });

    const response = await GET(makeRequest(""));

    expect(exchangeCodeForSessionMock).not.toHaveBeenCalled();
    expect(response.headers.get("location")).toBe(
      "http://localhost:3000/login?error=auth_failed",
    );
  });

  it("redirects to /login?error=auth_failed if exchangeCodeForSession throws", async () => {
    exchangeCodeForSessionMock.mockRejectedValueOnce(new Error("network error"));
    getUserMock.mockResolvedValueOnce({ data: { user: null } });

    const response = await GET(makeRequest("?code=abc123"));

    expect(response.headers.get("location")).toBe(
      "http://localhost:3000/login?error=auth_failed",
    );
  });
});
