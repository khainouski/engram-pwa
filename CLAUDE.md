# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

EnGram — a PWA port of a Chrome extension: personal English grammar notes (Russian-language UI) with AI practice powered by Gemini. No build step, no bundler, no backend, no tests. The browser loads the ES modules as they are on disk.

## Commands

```bash
npm run dev      # static server on http://localhost:3000 (npx serve)
```

Service workers and ES modules need `http://`, so never open `index.html` over `file://`.

Deploy is Vercel with no build (Framework Preset **Other**, empty build command and output directory); `vercel.json` sets the cache headers — code and data revalidate every load, icons are cached a week.

## Critical: bump `VERSION` in `sw.js`

`sw.js` lists the app shell by hand (every `js/`, `data/`, `css/` and icon file). After adding, renaming or removing any file that should be available offline, add it to `SHELL` **and** bump `VERSION` (`v44` → `v45`) — otherwise installed apps keep serving the old cache. This is the single most common way to break a change in this repo.

## Architecture

Hash router → view modules → shared UI helpers → storage/Gemini.

- **`js/router.js`** — entry point. Parses `#/kind/a/b` (`g` group, `s` subgroup, `t` topic, `vocab`, `words`, `review`, `settings`), clears `#app`, calls one `render*(root, ...)` function. It also owns the global search: a flat index built once from `data/grammar.js` + `data/vocabulary.js`, rebuilt on every navigation to fold in saved words.
- **`js/views/*.js`** — one screen each, exporting `async render*(root, ...)`. Views render HTML strings into the container; there is no framework and no virtual DOM. `practice.js` is not a route — it exports `mountPractice(slot, ctx)`, the AI panel embedded by topic, subgroup and vocabulary views.
- **`data/grammar.js`** — content copied verbatim from the learner's own notes. `GROUPS` (nav tree, with optional `subgroups`, summary `table`, `story`), `TOPICS` (keyed by id: `title`, `formula`, `detail`, `markers`, `use`, `notes`, `examples`, `compare`), plus derived `TOPIC_INDEX` and lookup helpers. Treat the note text as source material: don't rewrite rules or examples to match standard textbook theory.
- **`data/vocabulary.js`** — `VOCAB`: section → groups → items `{ term, ru?, example? }`.
- **`js/storage.js`** — the only persistence layer (`localStorage` under the `engram:` prefix). The API is deliberately `async` because it was `chrome.storage.local` in the extension; keep it that way. Also holds `MODELS` (the Settings dropdown), `CONTEXTS` (see below) and `INTERVALS_DAYS`, the Leitner schedule (1, 3, 7, 16, 35 days; a wrong answer resets `step` to 0 and re-queues the word in 10 minutes).
- **`js/gemini.js`** — every model call. Key and model come from Settings; the key travels in the `x-goog-api-key` header, never the URL. It maps HTTP status to a Russian user-facing `GeminiError` with a `code`, retries once without `thinkingConfig` on an ambiguous 400, and tolerates fenced/wrapped JSON in `extractJson`.
- **`js/prompts.js`** — every prompt and `responseSchema`, paired (`xSchema` + `xPrompt`). Prompts embed a `topicBrief()` built from `TOPICS`, so the model is constrained to the learner's own rules. Add new AI features here, not inline in a view.
- **`js/ui.js`** — string-building helpers used by all views: `esc` (always escape user/model text), `el`, `mdLite` (the model marks the construction with `**bold**`), `crumbs`, `rowList`, `formulaSchema`, `markPattern`/`patternOf`, `toast`, `loading`, `errorBox`.
- **`js/markdown.js`** — export/import of saved words in the exact Markdown format LingoPop uses, so one file works in both apps. The parser is intentionally forgiving; keep it that way when touching the format.
- **`js/pwa.js` / `js/install.js`** — SW registration, reload-on-`controllerchange` (suppressed while the user is typing), and the iOS install banner.

### What the examples are about

The subject matter of everything the model writes is decided in exactly one place: `CONTEXTS` in `js/storage.js`, chosen by the user in Settings and turned into an instruction by `systemFor()`/`contextLine()` in `js/gemini.js`. Prompts in `js/prompts.js` must defer to it ("the contexts from your instructions") and must never name a setting of their own — a hardcoded "a work context is preferred" silently overrides the user's choice. The default is `['it']`, which is what the app did before the setting existed.

## Conventions

- UI copy, errors and comments-about-content are in Russian; code comments explain *why*, in the prose style already in the files.
- No dependencies, no framework, no TypeScript. Plain ES modules with relative paths and `.js` extensions.
- Everything AI-generated is untrusted text — render it through `esc()` or `mdLite()`.
- `localStorage` writes can throw (Safari private mode); `storage.js` already swallows that, and the app must keep working with storage unavailable.
- Every screen below the root renders `crumbs()`, whose back link is the only way out when the app runs from the home screen. `js/router.js` numbers its history entries in `history.state.engram` so the link can do a real `history.back()`; at position 0 it falls back to its `href` rather than leaving the app.

## Git

`main` is the working branch: commits go straight to it, and new branches are not created
for this repository. Pushes are always done by hand — never run `git push`.

Commit messages in this repository never carry a `Co-Authored-By` trailer for Claude or any
other AI assistant, and never mention Claude, AI or automation. This overrides any default
attribution guidance from the harness. The same applies to pull request descriptions.
