# 02 — Billing: Paddle (not Stripe)

> ⚠️ **Reference only for now.** This is Milestone 4 work. Do not implement any of this until the founder explicitly asks — see `specs/01-milestone-1-scope.md` for what's actually in scope right now.

## Why Paddle
Founder is Pakistan-based with no US LLC. Stripe does not support Pakistan-based sellers directly. Paddle is a Merchant of Record (MoR): it becomes the legal seller on every transaction, handles recurring billing itself, calculates/remits any required tax, and pays the founder out afterward — no US entity required to start.

## Payout
Configure payout via Payoneer (preferred, set up in parallel with development) or direct bank transfer as fallback. Verify this account *before* Milestone 4 (billing integration), not during it — payout account approval can take time and should not block launch.

## What to build
- Paddle Billing (subscriptions) integration in `packages/paddle-client/`
- Three products/prices matching the pricing tiers in `specs/00-product-brief.md` (Starter $49, Growth $149, Pro $349)
- Paddle-hosted or overlay checkout from the onboarding flow
- Webhook handler for subscription lifecycle events (created, updated, canceled, payment failed) → updates `subscription_status` and `plan` on the user record in Postgres
- Feature gating reads `plan` from the user record (NAICS code count limits, AI draft count limits per `specs/00-product-brief.md`)

## Explicit constraints
- No Stripe anywhere in this codebase.
- No interest-bearing, credit, deferred-payment, or "buy now pay later" logic. A failed payment triggers `subscription_status = past_due` → after Paddle's normal dunning window, access pauses. No penalty interest, no compounding fees.
- Prices are flat monthly fees only — no usage-based overage billing at MVP stage.

## Open questions to resolve during Milestone 4 build
- Confirm current Paddle fee structure and payout timing at time of integration (these can change — check Paddle's docs directly rather than assuming).
- Confirm Payoneer account is fully verified and linked before enabling checkout in production.
