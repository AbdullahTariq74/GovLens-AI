# GIT_WORKFLOW.md — how to commit and push in this repo

## Why this file exists
The founder wants visible, incremental progress on GitHub — not one giant commit at the end of a session. This file defines exactly how and when to commit and push, and how to credit Claude as co-author on every commit.

## Rule 1 — Commit early, commit often
Commit after every **logical unit of work**, not after every file. A logical unit is something like:
- "scaffolded the apps/web Next.js project"
- "added Prisma schema for users and opportunities tables"
- "built the SAM.gov API client with pagination"
- "added the nightly ingestion cron job"

Do not batch multiple unrelated units into one commit, and do not wait until an entire milestone is done to make your first commit. If a work session touches 4 logical units, that should be 4 commits.

## Rule 2 — Push after every commit
Run `git push` right after every `git commit` unless the founder has explicitly said to hold off (e.g., mid-debugging on a broken branch). The remote `main` should reflect real progress throughout the session, not just at the end.

```bash
git add <files>
git commit -m "..."
git push origin main
```

## Rule 3 — Every commit must credit Claude as co-author
Use this exact trailer format in every commit message (blank line, then the trailer, at the very end of the message):

```
<short summary line, imperative mood, under 72 chars>

<optional longer description if needed>

Co-authored-by: Claude <noreply@anthropic.com>
```

Example:
```bash
git commit -m "$(cat <<'EOF'
Add SAM.gov API client with NAICS-code filtering

Implements pagination and rate-limit backoff per specs/01-milestone-1-scope.md.

Co-authored-by: Claude <noreply@anthropic.com>
EOF
)"
```

This trailer is what makes GitHub display Claude as a co-author on the commit alongside the founder's own name — it will not appear automatically unless it's included in every commit message, so don't skip it even on small commits.

## Rule 4 — Commit message format
- First line: imperative mood, under 72 characters (e.g., "Add Prisma schema for opportunities table", not "Added" or "Adding").
- Reference the milestone/spec it belongs to when relevant (e.g., "per specs/01-milestone-1-scope.md").
- Always end with the `Co-authored-by` trailer from Rule 3.

## Rule 5 — Branching (keep it simple for now)
Work directly on `main` with small, frequent commits for this early solo-founder phase — the overhead of feature branches and PRs isn't worth it yet at this size and speed. Revisit this once there's more than one contributor or the codebase is large enough that broken intermediate states on `main` become risky.

## Rule 6 — Never commit secrets
`.env`, `.env.local`, and any file containing real API keys must never be committed. Only `.env.example` (with placeholder values) belongs in the repo. Double-check `.gitignore` covers this before the first commit.
