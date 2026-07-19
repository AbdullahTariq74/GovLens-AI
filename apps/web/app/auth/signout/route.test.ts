import { describe, expect, it, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const signOutMock = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({ auth: { signOut: signOutMock } })),
}));

import { POST } from "./route";

describe("auth signout route", () => {
  beforeEach(() => {
    signOutMock.mockReset();
  });

  it("calls signOut and redirects to /login with a 303 (not the 307 default)", async () => {
    signOutMock.mockResolvedValueOnce({ error: null });

    const response = await POST(
      new NextRequest("http://localhost:3000/auth/signout", { method: "POST" }),
    );

    expect(signOutMock).toHaveBeenCalledOnce();
    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe("http://localhost:3000/login");
  });

  it("still redirects to /login even if signOut returns an error", async () => {
    signOutMock.mockResolvedValueOnce({ error: { message: "session already invalid" } });

    const response = await POST(
      new NextRequest("http://localhost:3000/auth/signout", { method: "POST" }),
    );

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe("http://localhost:3000/login");
  });
});
