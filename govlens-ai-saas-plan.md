# GovLens AI — SaaS Plan (Concept → First Sale in 4–6 Weeks)

*Prepared for: solo automation engineer, Pakistan-based, budget-conscious, building with Claude Code + GStack*

---

## 1. Product Idea (One-Pager)

### Problem statement
The US federal government awards roughly **$500 billion in contracts every year**, and by law about **23% ($115B) is required to go to small businesses**. But the discovery system (SAM.gov) posts **over 24,000 new solicitations every month**, and small business owners consistently say it's "too hard" — no filtering by real fit, no plain-English summaries, and no help turning a match into a submittable response. The paid tools that do this well (GovWin IQ, Deltek, GovDash, Bloomberg Government) are built and priced for firms with dedicated capture/proposal staff — often **$8,000–$20,000+/year** — pricing out solo consultants, veteran-owned shops, and micro-businesses under 20 employees.

### Target market
- **Beachhead (USA first):** US-based small businesses (1–50 employees) in IT services, professional services, construction, and light manufacturing who are SAM.gov-registered or eligible (especially 8(a), HUBZone, WOSB, SDVOSB set-aside holders) but have no dedicated business-development staff.
- **Expansion:** Canada (CanadaBuys), UK (Find a Tender), Australia (AusTender), EU (TED) — same core mechanic (public procurement feeds + AI matching), same playbook.

### Value proposition
"Stop scrolling SAM.gov. Get only the contracts you're actually eligible to win, explained in plain English, with a bid-ready capability statement drafted for you — for the price of one billable hour a month."

### Key differentiators
- Priced for **micro-businesses**, not enterprise capture teams (10–50x cheaper than incumbents).
- AI does the two most time-consuming steps: reading dense solicitation PDFs and drafting the first response — incumbents mostly stop at "here's a list of results."
- Built and iterated fast using an AI-native dev workflow (Claude Code + GStack), so feature velocity can undercut slower-moving legacy players.

### Feasibility notes
- SAM.gov's Contract Opportunities data is available via a **free, public API** — no scraping, no ToS risk, no data licensing cost.
- The core technical work (API polling, structured extraction, matching, templated generation) is squarely automation-engineer territory — no novel ML needed, just solid orchestration + Claude for language tasks.
- No inventory, no physical logistics, no regulated financial product — clean SaaS.

### Revenue model
Flat-fee monthly subscription, billed via **Paddle** (a Merchant of Record — see Technical Plan for why this replaces Stripe). **No interest, no financing, no revolving credit** — consistent with the "no riba" constraint. Late/failed payment triggers account pause, not compounding interest or penalty fees.

### Pricing tiers (USD)
| Tier | Price/mo | NAICS codes tracked | AI summaries | AI capability-statement drafts |
|---|---|---|---|---|
| Starter | $49 | 3 | 20/mo | 1/mo |
| Growth | $149 | 10 | Unlimited | 5/mo |
| Pro | $349 | Unlimited | Unlimited | Unlimited + weekly forecast digest |

### Market signals (why demand is high, competition is thin at this price point)
1. <cite index="13-1">The federal government spends approximately $500 billion in contracts every year and current law requires that 23 percent of these dollars be awarded to small businesses</cite> — a large, legally mandated buyer pool for small firms.
2. <cite index="20-1">SAM.gov posts more than 24,000 new contract opportunities or notices each month</cite>, yet <cite index="16-1">most small business government contractors get frustrated with SAM.gov and think the tool is "too hard"</cite> — high volume, low usability, and existing paid alternatives are priced for large primes, not micro-businesses. That gap is the wedge.

### Core MVP features (low cost, fast time-to-market)
1. Onboarding: NAICS codes, set-aside status, keywords, company profile.
2. Nightly SAM.gov API sync filtered to each user's profile.
3. Claude-powered plain-English summary per opportunity (scope, deadline, POC, eligibility, estimated value).
4. Simple dashboard + Kanban tracker (Watching / Pursuing / Submitted / No-bid).
5. AI-drafted capability statement generator (editable, exportable as PDF).
6. Daily/weekly email digest.
7. Paddle subscription billing (Merchant of Record — no US entity required).

### Non-functional requirements
- **Security:** encrypt data at rest, secrets in a vault (not env files in repo), scoped API keys, no storage of sensitive contract documents beyond what's needed for summarization.
- **Compliance:** SAM.gov data is public — no PII/privacy regime triggered by the opportunity data itself. Marketing claims must avoid implying guaranteed contract wins (truthful-advertising discipline, and consistent with an honest/non-deceptive marketing standard).
- **Performance:** batch/nightly processing is sufficient — no real-time SLA needed for MVP, which keeps infra cheap.

---

## 2. Technical Plan

### Stack
- **Frontend/app:** Next.js (React) — one deployable, fast to ship with Claude Code.
- **DB/Auth:** Supabase (Postgres + auth + storage, generous free tier).
- **Data source:** SAM.gov Contract Opportunities API (free, public).
- **AI:** Claude Sonnet 5 via API for summarization + drafting (Claude Code used to *build* the product; the Claude API is *inside* the product for these tasks).
- **Billing:** **Paddle** (flat subscription, no interest-based products). Not Stripe.
- **Email:** Resend or SendGrid (free tier covers early volume).
- **Hosting:** Vercel (frontend) + a small always-on worker (Railway or Fly.io) for the nightly cron job.

> **Why Paddle, not Stripe:** Stripe doesn't support Pakistan-based sellers directly, and a workaround (US LLC + Stripe Atlas) is off the table for now since you're not forming an LLC yet. Paddle is a **Merchant of Record (MoR)** — it legally becomes the seller on every transaction, handles the recurring billing/subscription logic itself (so you don't need Stripe at all), and pays *you* out afterward. As of this plan, <cite index="39-1">Paddle works with software businesses anywhere in the world with the exception of a specific list of sanctioned/unsupported countries</cite> — Pakistan is not on that list. For payout, you can typically choose a **Payoneer** account or a bank transfer, whichever settles more easily for you locally — set that up in parallel with development so it's ready by the time you have your first paying customer. Trade-off: Paddle's take rate (commonly quoted around 5% + $0.50/transaction) is higher than Stripe's raw ~2.9%, but that premium buys you the ability to legally bill US (and global) customers *today*, with no LLC and no US bank account. If you form a US LLC later, you can move to direct Stripe (lower fees) without changing the product — just swap the billing provider behind the same subscription-gating logic.

### How Claude Code + GStack fit in
- **Claude Code** is the primary build agent — used to scaffold the repo, write the ingestion/summarization pipeline, build the dashboard, and write tests.
- **GStack** (Garry Tan's open-source Claude Code skill pack) adds process discipline a solo founder normally lacks: it turns Claude into role-based reviewers (PM/"CEO", eng, QA, security) instead of one undifferentiated coding session.
  - `/office-hours` — pressure-tests each feature idea before code is written (catches scope creep early, which matters most when you're paying per API token and per hour).
  - A spec-writing skill — turns a one-line feature request into a structured spec with edge cases before implementation.
  - A review/ship skill pairing — runs a lightweight adversarial code review and a security/OWASP-style pass before each deploy, which substitutes for the code review a solo founder doesn't otherwise get.
  - Note: GStack is a third-party, community-maintained project (not an Anthropic product) — treat it as a productivity layer, verify its output like any AI-generated code, and don't take its "virtual team" framing as a substitute for your own review of anything security- or billing-related.

### Architecture (component + data flow description)
1. **Ingestion worker** (nightly cron) → calls SAM.gov API per active NAICS/keyword set → writes raw opportunities to Postgres (`opportunities` table), deduped by notice ID.
2. **Summarization pipeline** → for each *new* opportunity (shared across all users, not per-user, to control Claude API cost) → calls Claude API → writes structured JSON (deadline, scope, eligibility, plain-English summary) to `opportunity_summaries`.
3. **Matching engine** → joins each user's saved filters against new summarized opportunities → writes matches to `user_matches`.
4. **Web app** → dashboard reads `user_matches`; capability-statement generator calls Claude API on-demand using the user's profile + selected opportunity.
5. **Digest service** → nightly/weekly job reads unread matches per user → sends via Resend.
6. **Paddle webhook** → updates subscription/plan state → gates feature access (NAICS code count, draft count).

### MVP delivery plan (4–6 weeks)
| Milestone | Timeframe | Deliverable |
|---|---|---|
| 1. Spec + foundation | Week 1 | Repo scaffolded (Claude Code + GStack spec pass), Supabase schema, auth, SAM.gov API integration tested |
| 2. Ingestion + AI summarization | Week 2 | Nightly sync working end-to-end, Claude summarization pipeline producing structured output |
| 3. Matching + core UI | Week 3 | Dashboard listing matched opportunities, Kanban tracker, capability-statement generator (v1) |
| 4. Billing + onboarding | Week 4 | Paddle integration (checkout + webhooks), Payoneer/bank payout configured, plan gating, onboarding wizard, email digest live |
| 5. Landing page + private beta | Week 4–5 | Landing page + waitlist, 5–10 pilot users onboarded manually, GStack security/QA pass |
| 6. Public launch + first paid conversions | Week 5–6 | Pilot feedback incorporated, public launch, first paying customers |

### Deployment and hosting (cost-conscious)
- Vercel free/hobby tier (frontend) → ~$0 pre-revenue, $20/mo once you outgrow the free tier.
- Supabase free tier → $0 initially, $25/mo once you need production-grade limits.
- Railway/Fly.io for the cron worker → ~$5–10/mo.
- Claude API → pay-per-use, kept low by summarizing each opportunity once and reusing it across all matching users.
- Paddle → no fixed cost, per-transaction fee only (commonly ~5% + $0.50), no interest-bearing products involved, no US entity required to start.
- **Estimated pre-revenue infra cost: under $50/month.**

---

## 3. Go-to-Market Plan

### Validation steps
1. **Landing page + waitlist** (build in day 1–2 with Claude Code) — clear headline, pricing, and a "get my first free opportunity digest" lead magnet.
2. **Manual concierge pilot before the software is fully built** — do the product's job *by hand* for a handful of real customers, before writing a single line of the automated pipeline:
   - Find 5 real small business owners who are SAM.gov-registered (or eligible) and want federal contracts — via LinkedIn, PTAC referrals, or govcon communities.
   - For each one, manually search SAM.gov for opportunities matching their NAICS codes, and manually ask Claude (in a normal chat, no app needed) to summarize the top matches in plain English. Send them this as a weekly email or spreadsheet.
   - Charge them **$99/month** for this — a real invoice, real money changing hands, even though there's no software yet. You are the "backend."
   - **Why this matters:** if 5 people won't pay $99/mo for the *manual* version of this service, they almost certainly won't pay for the automated version either — and you'll have found that out in days, not after 4–6 weeks of building. If they *do* pay, you now have paying customers on day one, real feedback on what they actually care about (which opportunities, what format, what's confusing), and testimonials before launch. Once the real product (Milestone 4) is ready, you migrate these same people onto it — they become your first "official" customers, not new ones you have to find from scratch. This is what "do things that don't scale" means: solve the problem with your own hands first, automate only once you know the automation is worth building.
3. **Paid pilot conversion:** convert concierge customers onto the real product once MVP milestone 4 ships.
4. **CAC/LTV targets:** aim for CAC under $150 by leaning on free/organic community channels (below). At $149/mo average and a 12+ month target retention, LTV lands around $1,800+, giving a healthy 10:1+ LTV:CAC if organic-led growth holds.

### Sales and marketing approach for a solo founder
- **Community-embedded distribution:** SBA **Procurement Technical Assistance Centers (PTACs)** are government-funded advisors who work directly with small businesses trying to enter federal contracting — they're a natural referral partner and cost nothing to approach.
- **Content marketing:** short, practical posts ("how to read a SAM.gov solicitation in 5 minutes," "NAICS vs PSC codes explained") on LinkedIn and in govcon-focused communities (r/govcon, GovCon Chamber-type groups) — this audience already searches for exactly this help.
- **Lead magnet:** free one-time opportunity report for a prospect's specific NAICS code, generated by your own pipeline — shows the product working before anyone pays.
- **Direct outreach:** targeted LinkedIn messages to owners of small businesses that hold SBA certifications (8(a), WOSB, SDVOSB, HUBZone) — a findable, motivated segment.

### Pricing, onboarding, and support
- Self-serve signup with a short free trial or one free digest before requiring a card, to reduce signup friction.
- Onboarding wizard: NAICS codes → set-aside status → keywords → immediate first digest generated live, so the user sees value in the first session.
- Support: Claude-powered FAQ/chat widget for tier-1 questions, personal email support with a <24h target response time, and a monthly office-hours call for Pro-tier customers.

---

## 4. Risks and Mitigations

| Risk | Type | Mitigation |
|---|---|---|
| SAM.gov API changes or rate limits | Technical | Follow official API docs, add caching and backoff, never fall back to scraping (respects ToS, avoids access risk) |
| Claude API cost scaling with users | Technical | Summarize each opportunity once and share across all matching users instead of per-user calls |
| Overpromising ("we'll win you contracts") | Regulatory/reputational | Position explicitly as a research/alerting/drafting tool, never a win-guarantee — keeps marketing honest and avoids deceptive-advertising exposure |
| Incumbents (GovWin, Deltek, GovDash) move down-market | Market | Stay tightly focused on the micro-business price point and ship faster than legacy players using the AI-native workflow as a durable speed advantage |
| US payment/banking access from Pakistan | Operational | Use **Paddle** as Merchant of Record instead of Stripe — no US LLC needed to start. Set up Payoneer (or confirm bank payout) in parallel with Week 1 development so it's verified and ready before Milestone 4 (billing) ships. Revisit a US LLC later only if/when direct Stripe's lower fees justify the setup cost at higher volume |
| Payoneer/payout account verification delays | Operational | Start Payoneer verification now, in parallel with dev — don't wait until Week 4. Paddle also supports direct bank transfer payout as a fallback if Payoneer isn't ready in time |
| Riba exposure in banking/financing | Financial/compliance | Keep operating funds in a non-interest-bearing checking account, avoid revolving credit lines, use debit rather than credit for business expenses |

---

## 5. Starter Delivery Artifacts

### Minimal viable repository structure
```
govlens-ai/
├── CLAUDE.md                  # project context for Claude Code
├── gstack/                    # GStack config + generated specs
│   └── specs/
├── apps/
│   ├── web/                   # Next.js dashboard + onboarding + billing UI
│   └── worker/                # nightly SAM.gov ingestion + summarization job
├── packages/
│   ├── db/                    # Prisma schema + migrations (Supabase Postgres)
│   ├── claude-client/         # thin wrapper around Claude API calls
│   ├── sam-gov-client/        # SAM.gov API client
│   └── paddle-client/         # Paddle checkout + webhook handling (billing)
└── infra/
    └── deploy configs (Vercel, Railway/Fly.io)
```

### Example: SAM.gov ingestion + Claude summarization pattern
```javascript
// apps/worker/ingest.js — nightly cron job (pseudocode)
import { fetchNewOpportunities } from "@govlens/sam-gov-client";
import { summarizeOpportunity } from "@govlens/claude-client";
import { db } from "@govlens/db";

async function runNightlySync() {
  const activeCodes = await db.getDistinctTrackedNaicsCodes();
  for (const code of activeCodes) {
    const opportunities = await fetchNewOpportunities({ naicsCode: code });
    for (const opp of opportunities) {
      const exists = await db.opportunities.findByNoticeId(opp.noticeId);
      if (exists) continue;

      await db.opportunities.create(opp);

      // one summarization call per opportunity, shared across all matching users
      const summary = await summarizeOpportunity(opp);
      await db.opportunitySummaries.create({
        opportunityId: opp.id,
        deadline: summary.deadline,
        scope: summary.scope,
        eligibility: summary.eligibility,
        plainEnglishSummary: summary.plainEnglish,
      });
    }
  }
  await db.matchOpportunitiesToUsers();
}
```

```javascript
// packages/claude-client/summarize.js
export async function summarizeOpportunity(opportunity) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-5",
      max_tokens: 800,
      messages: [{
        role: "user",
        content: `Summarize this federal solicitation for a small business owner.
Return ONLY JSON with keys: deadline, scope, eligibility, plainEnglish (2-3 sentences).

Title: ${opportunity.title}
Description: ${opportunity.description}
NAICS: ${opportunity.naicsCode}
Set-aside: ${opportunity.setAside}`,
      }],
    }),
  });
  const data = await response.json();
  const text = data.content.find(b => b.type === "text")?.text ?? "{}";
  return JSON.parse(text.replace(/```json|```/g, "").trim());
}
```

### GStack integration pattern (using Claude Code)
```
# In Claude Code, before building each feature:
/office-hours "capability statement generator: takes user profile + 
  selected opportunity, drafts a 1-page capability statement matching 
  the solicitation's stated requirements"

# → produces a structured spec with edge cases (missing profile fields,
#   opportunities with no clear NAICS match, PDF export formatting)

/plan-eng-review    # locks architecture for the feature before coding
# ... Claude Code implements against the locked spec ...
/review             # adversarial review pass, catches scope creep / bugs
/ship               # quality gate + deploy
```

### Sample user stories for the MVP
- As a small IT services business owner, I want to enter my NAICS codes so I only see solicitations relevant to my business.
- As a user, I want a plain-English summary of a long solicitation so I can make a bid/no-bid decision in under 2 minutes.
- As a user, I want an AI-drafted capability statement I can edit and export as a PDF.
- As a user, I want a Kanban board to track which opportunities I'm watching, pursuing, or have submitted.
- As a Pro-tier user, I want a weekly forecast digest of upcoming (not-yet-posted) opportunities so I can prepare early.
- As a new user, I want to see one real matched opportunity during onboarding, before I'm asked to pay, so I trust the product works.

---

*Next step: if you want, I can generate the actual `CLAUDE.md`, Prisma schema, and Week-1 task breakdown as ready-to-run files for your repo.*
