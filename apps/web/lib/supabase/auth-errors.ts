export const AUTH_ERROR_CODES = {
  INVALID_LINK: "auth_failed",
} as const;

export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  [AUTH_ERROR_CODES.INVALID_LINK]:
    "That sign-in link is invalid or has expired. Please request a new one.",
};
