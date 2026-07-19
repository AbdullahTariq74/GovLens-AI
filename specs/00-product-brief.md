# 00 — Product Brief: GovLens AI

## Problem
US federal government awards ~$500B in contracts/year, 23% legally required to go to small businesses. SAM.gov posts 24,000+ new solicitations/month but is hard to use for owners without dedicated business-development staff. Existing paid tools (GovWin, Deltek, GovDash) are priced for large firms ($8k–$20k+/year), leaving micro-businesses underserved.

## Target user
US small business owner (1–50 employees), SAM.gov-registered or eligible, no dedicated BD/proposal staff. Especially relevant to 8(a), HUBZone, WOSB, SDVOSB certification holders.

## Value proposition
Only the contracts they're eligible for, explained in plain English, with a bid-ready capability statement drafted for them — for a fraction of enterprise tool pricing.

## MVP scope (build this, nothing more, for v1)
1. Onboarding: NAICS codes, set-aside status, keywords, company profile
2. Nightly SAM.gov sync filtered to each user's saved filters
3. Claude-generated plain-English summary per opportunity (deadline, scope, eligibility, plain-English summary)
4. Dashboard listing matched opportunities
5. Kanban tracker: Watching / Pursuing / Submitted / No-bid
6. AI-drafted capability statement generator (editable, exportable as PDF)
7. Daily/weekly email digest
8. Paddle subscription billing (3 tiers — see pricing below), plan-based feature gating

## Explicitly out of scope for MVP
- Multi-user/team accounts (single user per account for now)
- Proposal writing beyond the capability statement (full RFP response is a later tier)
- Non-US procurement sources (Canada/UK/Australia expansion is post-MVP)
- Real-time/instant notifications (nightly batch is sufficient)
- Any payment financing, credit, or "pay later" feature

## Pricing tiers
| Tier | Price/mo | NAICS codes | AI summaries | AI capability-statement drafts |
|---|---|---|---|---|
| Starter | $49 | 3 | 20/mo | 1/mo |
| Growth | $149 | 10 | Unlimited | 5/mo |
| Pro | $349 | Unlimited | Unlimited | Unlimited + weekly forecast digest |

## Non-functional requirements
- Security: encrypted at rest, secrets in env/vault (never committed), scoped API keys
- Compliance: SAM.gov data is public — no special privacy regime for opportunity data itself; marketing must never imply guaranteed contract wins
- Performance: nightly batch processing is sufficient, no real-time SLA required for MVP

## Success criteria for MVP
- 5 concierge pilot customers converted to the live product, paying $49–$149/mo
- End-to-end pipeline (SAM.gov → Claude summary → dashboard → digest) running nightly without manual intervention
- Total infra spend under $50/month pre-revenue
