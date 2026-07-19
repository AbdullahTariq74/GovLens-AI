import { describe, expect, it, vi, beforeEach } from "vitest";
import { NextRequest, NextResponse } from "next/server";

const getUserMock = vi.fn();

vi.mock("@/lib/supabase/middleware-client", () => ({
  createMiddlewareClient: vi.fn(() => ({
    supabase: { auth: { getUser: getUserMock } },
    response: NextResponse.next(),
  })),
}));

import { proxy } from "./proxy";

function makeRequest(pathname: string) {
  return new NextRequest(new URL(pathname, "http://localhost:3000"));
}

describe("proxy", () => {
  beforeEach(() => {
    getUserMock.mockReset();
  });

  it("passes through a protected path when a valid session exists", async () => {
    getUserMock.mockResolvedValueOnce({ data: { user: { id: "user-1" } } });

    const response = await proxy(makeRequest("/dashboard"));

    expect(response.headers.get("location")).toBeNull();
  });

  it("redirects to /login when no session exists on a protected path", async () => {
    getUserMock.mockResolvedValueOnce({ data: { user: null } });

    const response = await proxy(makeRequest("/dashboard"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("/login");
  });

  it("passes through a non-protected path even without a session", async () => {
    getUserMock.mockResolvedValueOnce({ data: { user: null } });

    const response = await proxy(makeRequest("/"));

    expect(response.headers.get("location")).toBeNull();
  });

  it("fails closed (redirects) on a protected path when getUser() throws", async () => {
    getUserMock.mockRejectedValueOnce(new Error("Supabase unreachable"));

    const response = await proxy(makeRequest("/dashboard"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("/login");
  });
});
