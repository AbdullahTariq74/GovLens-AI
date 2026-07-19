# SETUP.md — GovLens AI dev environment

Repo: https://github.com/AbdullahTariq74/GovLens-AI (public, currently empty)

## 0. Prerequisites
- Claude Code installed
- Git, Node.js, Bun v1.0+ (GStack requires Bun)
- GitHub CLI (`gh`) or a configured git credential helper, so pushes don't require manually typing a token every time
- Accounts to create/verify now, in parallel with development: Supabase, SAM.gov API key (https://sam.gov/data-services), Paddle sandbox (Milestone 4, not urgent yet), Resend (Milestone 4, not urgent yet), Payoneer

## 1. Clone the repo locally
```bash
git clone https://github.com/AbdullahTariq74/GovLens-AI.git govlens-ai
cd govlens-ai
```

## 2. Add the starter files
Copy in: `CLAUDE.md`, `GIT_WORKFLOW.md`, `.env.example`, and the full `specs/` folder provided.

```bash
git add CLAUDE.md GIT_WORKFLOW.md .env.example specs/
git commit -m "$(cat <<'EOF'
Add project context, git workflow, and specs

Co-authored-by: Claude <noreply@anthropic.com>
EOF
)"
git push origin main
```
This first commit and push confirms your GitHub auth is working before Claude Code touches anything.

## 3. Install GStack
```bash
git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack && cd ~/.claude/skills/gstack && ./setup
cd ~/govlens-ai
```
GStack is a third-party, community-maintained skill pack (not an Anthropic product) — it adds structured planning/review commands on top of Claude Code. Review its output yourself, especially anything touching git, billing, or security.

## 4. Open Claude Code in the repo
```bash
claude
```
Claude Code reads `CLAUDE.md` automatically on start.

## 5. Send the kickoff prompt
Paste the exact text from `PROMPT.md`. It makes Claude Code confirm it's read and understood the constraints — including the Milestone 1 scope boundary and the git workflow rules — before writing any code.

## 6. What you should see happen, in order
1. Claude Code confirms the product, constraints, and current milestone scope back to you in plain language.
2. It scaffolds the repo structure (empty/placeholder files first).
3. For each task in `specs/01-milestone-1-scope.md`, it should run `/office-hours` (spec) → `/plan-eng-review` (lock approach) → implement → `/review` → commit + push, one task at a time — not all six tasks in one giant commit.
4. You should see multiple small commits appear on GitHub throughout the session, each showing you and Claude as co-authors, not just one commit at the end.

If a session ends with only one commit covering everything, that's a sign the git workflow rules weren't followed — point Claude Code back to `GIT_WORKFLOW.md` and ask it to split future work into smaller commits.

## 7. Where GStack fits into each task, concretely
```
# Before implementing a Milestone 1 task:
/office-hours "SAM.gov API client: typed wrapper supporting NAICS-code
  filtering, pagination, and rate-limit retry, per specs/01-milestone-1-scope.md"

# → produces a short spec with edge cases (empty results, malformed
#   API responses, rate-limit handling)

/plan-eng-review     # locks the implementation approach before coding

# ... Claude Code implements against the locked spec ...

/review              # adversarial review pass — catches bugs, scope creep,
                      # and checks against CLAUDE.md constraints

# then: commit + push per GIT_WORKFLOW.md
```
Repeat this loop once per task in `specs/01-milestone-1-scope.md`. Don't skip `/office-hours` even for tasks that feel simple — it's the cheapest place to catch a wrong assumption, before code is written.

## 8. While this runs
You don't need to babysit every step — Claude Code can work through a task largely unattended once you've kicked it off. Use this time for outreach (LinkedIn/email sequences) in parallel; check back in on commits periodically rather than watching continuously.
