import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

const signInWithOtpMock = vi.fn();

vi.mock("@/lib/supabase/client", () => ({
  createClient: vi.fn(() => ({ auth: { signInWithOtp: signInWithOtpMock } })),
}));

vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(() => new URLSearchParams()),
}));

import LoginPage from "./page";

describe("LoginPage", () => {
  beforeEach(() => {
    signInWithOtpMock.mockReset();
  });

  it("shows the check-your-email message after a successful request", async () => {
    signInWithOtpMock.mockResolvedValueOnce({ error: null });
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "a@b.com" } });
    fireEvent.click(screen.getByRole("button", { name: /send sign-in link/i }));

    await waitFor(() => expect(screen.getByText(/check your email/i)).toBeInTheDocument());
  });

  it("passes emailRedirectTo pointing at /auth/callback", async () => {
    signInWithOtpMock.mockResolvedValueOnce({ error: null });
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "a@b.com" } });
    fireEvent.click(screen.getByRole("button", { name: /send sign-in link/i }));

    await waitFor(() => expect(signInWithOtpMock).toHaveBeenCalledOnce());
    expect(signInWithOtpMock).toHaveBeenCalledWith({
      email: "a@b.com",
      options: { emailRedirectTo: expect.stringContaining("/auth/callback") },
    });
  });

  it("shows a generic error and keeps the form when signInWithOtp fails", async () => {
    signInWithOtpMock.mockResolvedValueOnce({ error: { message: "Rate limit exceeded" } });
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "a@b.com" } });
    fireEvent.click(screen.getByRole("button", { name: /send sign-in link/i }));

    await waitFor(() => expect(screen.getByRole("alert")).toBeInTheDocument());
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it("disables the submit button while the request is in flight", async () => {
    let resolveRequest: (value: { error: null }) => void = () => {};
    signInWithOtpMock.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveRequest = resolve;
      }),
    );
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "a@b.com" } });
    fireEvent.click(screen.getByRole("button", { name: /send sign-in link/i }));

    expect(screen.getByRole("button")).toBeDisabled();
    resolveRequest({ error: null });
    await waitFor(() => expect(screen.getByText(/check your email/i)).toBeInTheDocument());
  });
});
