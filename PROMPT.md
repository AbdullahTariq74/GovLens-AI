Paste this as your first message to Claude Code, inside the govlens-ai repo, after CLAUDE.md, GIT_WORKFLOW.md, .env.example, and the specs/ folder are committed and pushed (see SETUP.md step 2):

---

Read CLAUDE.md, GIT_WORKFLOW.md, and every file in specs/ before doing anything else.

Confirm back to me in plain language:
1. What this product is and who it's for
2. The current milestone scope, and specifically which features you must NOT build yet
3. The three hard business constraints (billing provider, no interest-based features, no scraping)
4. The git workflow rules — how often you'll commit, what the commit message format looks like, and how you'll credit yourself as co-author

Then scaffold the repository structure exactly as described in CLAUDE.md (apps/web, apps/worker, packages/db, packages/claude-client, packages/sam-gov-client, packages/paddle-client — the last two as empty placeholders since we're not building them yet) with a working npm/pnpm workspace setup. Commit and push this scaffold as its own commit before moving on.

After that, work through specs/01-milestone-1-scope.md one task at a time, in order. For each task:
1. Use /office-hours to write a short spec for that specific task
2. Use /plan-eng-review to lock the approach
3. Implement it
4. Use /review before committing
5. Commit and push that task on its own, following GIT_WORKFLOW.md exactly, including the Co-authored-by trailer
6. Tell me what you built in plain language, then stop and wait for me before starting the next task

Do not start Milestone 2 (Claude summarization), Milestone 3 (matching/UI/capability statements), or Milestone 4 (Paddle billing, email digest) under any circumstances until I explicitly ask, even if it seems like a natural next step.

If anything in specs/ is ambiguous or you need a decision only I can make, stop and ask rather than guessing.

---
