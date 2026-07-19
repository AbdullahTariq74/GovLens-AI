# TODOS

## Infrastructure

### E2E test automation for magic-link auth flow

**What:** Playwright-based E2E tests covering the full magic-link sign-up/login journey, including the email-prefetch edge case.

**Why:** Unit tests (added in Task 2) cover branching logic in isolation, but only a real browser can catch cookie/redirect/session issues across actual page loads — the kind of bug that only shows up when middleware, route handlers, and client-side navigation interact for real.

**Context:** Task 2 (Milestone 1, specs/01-milestone-1-scope.md) added Vitest unit tests for middleware logic, the callback route's branching, and the connectivity script, but deferred full E2E coverage — Task 2's own definition of done relies on manual live verification against a real Supabase project instead. Setting this up requires a decision on test email inbox strategy (magic links need a real inbox to click through), which is a meaningful setup cost on its own. Revisit once more of the app exists (post Milestone 1) to make that investment worth it.

**Effort:** M
**Priority:** P2
**Depends on:** None
