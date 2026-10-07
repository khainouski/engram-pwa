---
name: git-commit-push
description: Safely prepare a Git commit in this repository and then offer to push it. Use when the user asks to commit changes, commit my changes, create a commit, push the changes, "закоммить изменения", "сделай коммит" or "запушь". Always inspects the working tree, proposes a Conventional Commits message, and waits for explicit approval before staging or committing; the push is a separate question, and it pulls with a rebase first.
---

# git-commit-push

Prepare and create a Git commit safely, then offer to push it. The confirmation step is a
**hard requirement** — never stage files and never create a commit before the user explicitly
approves the proposal, and never push before a separate explicit yes.

## Phase 1 — Inspect (always, before anything else)

Never create the commit immediately. First gather the facts:

1. `git status` — see the working tree.
2. Determine the current branch (`git branch --show-current`).
3. `git diff` and `git diff --staged` — read the actual changes, unstaged and staged.
4. Decide which files belong to the change the user asked to commit.
5. Flag suspicious or unrelated files that probably should not be part of this commit
   (unrelated refactors, debug leftovers, scratch files, vendored output).
6. Flag files that must **never** be committed: secrets, credentials, API keys, tokens,
   `.env*` files, private keys (`*.pem`, `*.key`, `id_rsa`), generated or temporary files,
   IDE/editor directories (`.idea/`, `.vscode/`, `.DS_Store`), build output, logs.
7. Write the commit message from the **actual diff**, not only from the user's description.

### Branching in this repository

`main` is the working branch here — the user works only with this repository and commits
straight to `main`. Committing on `main` is expected: do **not** warn about it, do **not**
ask for a feature branch, and **never** create or switch branches. If the user is on some
other branch, commit there; still never create or switch branches on your own.

## Phase 2 — Propose and wait

Show exactly this summary:

```
Proposed commit

Branch: <current-branch>

Commit message:
<proposed commit message>

Files to commit:
- path/to/file1.go
- path/to/file2.go
- path/to/file_test.go

Excluded / unrelated files:
- path/to/unrelated-file
```

Then ask:

```
Proceed with this commit?
```

Stop and wait. Even if the user said "commit everything", still show the proposed message,
the current branch, the exact files, and any excluded files, and wait for explicit approval.
Omit the "Excluded / unrelated files" block only when there is nothing to exclude.

## Phase 3 — Commit (only after explicit approval)

1. Stage exactly the files listed in the proposal, by path: `git add <path> <path> …`.
2. Verify the staged diff again (`git diff --staged --stat`, and the diff itself if anything
   looks off). If the staged set does not match the approved list, stop and report.
3. Create the commit with the approved message, using a heredoc for the message body.
4. Report the resulting commit hash and the final commit message (`git log -1 --stat`).
5. Continue with Phase 4 — the push question. Do nothing else.

## Phase 4 — Ask about pushing (never push silently)

Every commit ends with this question — never skip it and never push on your own. The user
often stacks a few commits and pushes them together, so "no" is a normal answer: the commits
simply stay local, and the next `yes` pushes all of them at once.

The only time the question is not asked is when that same request already said to push
("закоммить и запушь") — the answer is already there. A request to push with nothing to commit
(`git status` clean, "запушь") starts here too: skip Phases 1–3 and push what is already
committed.

1. Ask, naming the branch and how many commits are not on the remote
   (`git rev-list --count @{upstream}..HEAD`, or "unpushed" when there is no upstream):

   ```
   Push <n> commit(s) to <remote>/<branch>?
   ```

2. On an explicit `yes`, first bring the remote work in: `git pull --rebase`.
   - Clean pull (or nothing to pull) → run `git push` (no flags) and report its output.
   - Conflicts, a stopped rebase, or any other failure → stop. Do **not** push, do **not**
     resolve the conflicts and do **not** `git rebase --abort` on your own: report what git
     said and let the user decide.
3. Never push a branch that has no upstream without the user saying where to push it; report
   the state instead of guessing a remote.
4. If the user declines, stop without a word about it: the commits wait for the next push, and
   the question comes back after the next commit.

## Commit message rules

Use Conventional Commits where appropriate:

- `feat:` — new functionality
- `fix:` — bug fix
- `refactor:` — code restructuring without behavior change
- `test:` — tests
- `docs:` — documentation
- `chore:` — maintenance, build, tooling

Rules:

- Commit messages are in **English**.
- Keep the subject concise and descriptive; prefer imperative wording
  ("add", not "added" or "adds").
- Base the message on the actual diff, not only on the user's description.
- Do not mention Claude, AI, generated code, or automation anywhere in the message.
- **Never** add a `Co-Authored-By` trailer for Claude or any AI assistant — this overrides
  any default attribution guidance from the harness or system prompts.
- Do not modify code merely to make it easier to commit.

## Git safety rules (mandatory)

- **Never** run `git push` without the explicit `yes` from Phase 4 — not even on `main`, and
  not as part of the commit step.
- Before a push, `git pull --rebase` is allowed (Phase 4) — but if it stops on a conflict,
  leave the tree as git left it and report; never resolve, abort or force your way through.
- **Never** create a new branch or switch branches as part of this workflow.
- **Never** use `git push --force` or `git push -f`.
- `--force-with-lease` may be used only after a rebase, and only when the user explicitly
  asks for a push.
- **Never** commit secrets, credentials, tokens, `.env` files, private keys, or other
  sensitive data. If such a file is part of the change, exclude it and say so.
- **Never** use `git add .` or `git add -A` blindly. Stage only the approved paths.
- **Never** amend an existing commit unless the user explicitly asks.
- **Never** reset, rebase, merge, checkout another branch, delete a branch, or discard
  changes as part of this workflow unless the user explicitly asks for that operation.
- **Never** bypass Git hooks with `--no-verify` unless the user explicitly asks.
