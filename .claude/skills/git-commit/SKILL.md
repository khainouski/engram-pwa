---
name: git-commit
description: Safely prepare and create a Git commit in this repository. Use when the user asks to commit changes, commit my changes, create a commit, "закоммить изменения", or "сделай коммит". Always inspects the working tree, proposes a Conventional Commits message, and waits for explicit approval before staging or committing. Pushes only after a separate explicit yes, and only a clean fast-forward.
---

# git-commit

Prepare and create a Git commit safely. The confirmation step is a **hard requirement** —
never stage files and never create a commit before the user explicitly approves the proposal.

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

After the commit, check how the branch stands against its remote and ask the user whether to
push. The push itself always needs a separate explicit `yes`.

1. `git fetch` the branch's remote, then
   `git rev-list --left-right --count @{upstream}...HEAD` to get `behind  ahead`.
2. Report the state in one line, for example: `main: ahead 2, behind 0 (origin/main)`.
3. A push is safe to offer only when **all** of these hold:
   - the branch is `main` (or whatever branch the user is already working on — never switch);
   - it has an upstream;
   - `ahead` is a small number (one or a couple of commits), and `behind` is `0`, so the push
     is a plain fast-forward with nothing to merge and no conflicts.
   Then ask:

   ```
   Push <n> commit(s) to <remote>/<branch>?
   ```

   On an explicit `yes`, run `git push` (no flags) and report its output.
4. When `behind` is not `0`, the history has diverged: do **not** push and do **not** rebase,
   merge or pull on your own. Say the remote moved ahead by `behind` commits and that the
   branch needs a `git pull --rebase` first — and let the user decide.
5. When `ahead` is larger than a couple of commits, or there is no upstream, do not offer the
   push: report the state and let the user push by hand.
6. If the user declines, say nothing more about it and stop.

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
- **Never** push a diverged branch (`behind` ≠ 0), and never pull, rebase or merge to make a
  push possible.
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
