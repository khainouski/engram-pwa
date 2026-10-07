---
name: add-grammar-page
description: Add a new grammar page (topic) to data/grammar.js from the learner's own pasted notes. Use when the user says "добавь новую страницу", "добавь страницу", "новая тема", "add a new page" or pastes a block of grammar notes (an English rule with Russian translations) to be turned into a page. Always asks which section it goes into, then follows the shape of the topics already in that section.
---

# add-grammar-page

Turn a block of the learner's notes into one new topic page in `data/grammar.js`, built like
the pages already in the chosen section. The notes are the source of truth: copy their rules,
examples and translations, never replace them with standard textbook theory.

## Phase 1 — Read the notes

1. Read the pasted text in full before touching any file.
2. Decide the shape — but Phase 3 decides it finally: the section's existing pages win over
   this first guess, because a section reads as one set.
   - **one construction** — a single rule with its examples → `formula` + `detail`/`use` +
     `examples`;
   - **several named sub-rules, each with its own examples** (e.g. `little / a little` and
     `few / a few` in one note) → `intro` + `patterns`, like `time-prepositions`.
3. Note which pairs of English/Russian lines are the examples, which lines are the rule, and
   which are the warnings ("не ✘ …") — those become `notes`.

## Phase 2 — Ask which section (always, never guess)

Ask with a single question, three options, in this order:

- **Useful Constructions** — `useful-constructions`, phrases and constructions (`used to`,
  `make it`, `in vain` …).
- **Useful Grammar** — `useful-grammar`, grammar rules (`Prepositions of Time` …).
- **Useful phrases** — `phrases`, ready-made phrases taken whole.

Ask even when the answer looks obvious from the notes; the learner decides where their own
page belongs. Say in one line which one the notes look like, then wait for the choice.

**Useful phrases is never a new page.** That section is one shared collection — the
`useful-phrases` topic — and phrases are appended to it. Do not offer a new page there and do
not ask about it: on that choice, skip to Phase 4b.

## Phase 3 — Study the section before writing

Read the chosen group in `GROUPS` and **two or three** of its topics in `TOPICS` end to end.
Copy their shape: the same fields, the same order of fields, the same density of examples,
the same way Russian is used. If the section's pages carry `markers`, the new one does too.

## Phase 4 — Write the page

1. **Topic id** — short kebab-case, in the style of the ids already there
   (`little-a-little`, `few-a-few`, `used-to`). It must not collide with an existing id in
   `TOPICS`, and it is also the URL: `#/t/<id>`.
2. **`TOPICS` entry** — put it right after the group's current last topic, so the file reads in
   the same order as the section page. Fields, all optional except `title`:
   - `title` — the heading, in English, as the note names it.
   - `formula` — the construction in a compact schema (`little + uncountable`); it also drives
     the highlighting of examples via `patternOf`/`markPattern`.
   - `intro` — one line, used **instead of** `formula` by pattern-shaped pages.
   - `detail` — the rule in Russian, multi-line template string, in the note's own words.
   - `markers` — English trigger words from the note. They render as chips that link to
     YouGlish, so each must be a real word or phrase someone would pronounce.
   - `use` — `[{ en, ru, ex? }]`, what the construction is for.
   - `notes` — `[{ en, ru }]`, the traps: `en` is the short form (`few people, not ✘ a few`),
     `ru` explains it.
   - `examples` — `[{ en, ru?, q? }]`; `q: true` marks a question.
   - `patterns` — `[{ scheme, name, ru, examples: [{ en, ru }] }]` for the pattern shape.
   - `compare` — one or two ids of related topics.
3. **Register it** — append the id to the **end** of that group's `topics` array, and append
   the new construction to the end of the group's `subtitle` and `mix` in the same `·` / `/`
   style already used there.

   The `topics` array **is** the order of the rows on the section page, and in this repository
   that order is the order the pages were added: a new page is always last. Never reorder the
   array, never slot the new id next to a related topic, and never sort it alphabetically —
   related pages are linked through `compare`, not by position.
4. **Cross-links** — add the new id to `compare` of the one or two topics it is closest to,
   so the link works both ways.
5. **Bump `VERSION` in `sw.js`** (`v64` → `v65`). `data/grammar.js` is already in `SHELL`, so
   nothing is added there — but without the bump installed apps keep the old page list.

## Phase 4b — Append to Useful phrases instead (that section only)

Nothing new is created: the `useful-phrases` topic grows. Keep its field order and its style,
and append to the end of each list so the page reads in order of addition:

1. `markers` — the new English trigger words.
2. `use` — one `{ en, ru, ex }` per phrase group: `en` is the form (`be caused by …`), `ru` the
   meaning, `ex` one of the note's own sentences.
3. `notes` — only what the note itself shows (two wordings of the same thing, a `text` vs
   `message` distinction). Do not invent traps.
4. `examples` — every sentence from the note, in the note's order. When the note gives no
   Russian, translate each one faithfully; the page's examples all carry `ru`.
5. The group's `subtitle` and `mix` — append the new themes in Russian, in the existing style.
6. Bump `VERSION` in `sw.js`.

The group's `topics` array does not change, and neither does `compare`.

## Phase 5 — Verify and report

1. Check the file still parses and the page is wired up:

   ```bash
   node --input-type=module -e "import('./data/grammar.js').then(m=>{const id='<new-id>';console.log(m.TOPICS[id].title, m.TOPIC_INDEX[id])})"
   ```

2. Report the new id, its URL (`#/t/<id>`), the section it landed in, and the new `VERSION`.
   For an append (Phase 4b), report what grew instead: how many `use`, `notes` and `examples`
   entries the `useful-phrases` page now has, and the new `VERSION`.
3. Do **not** commit. Committing is the `git-commit-push` skill, and only when the user asks.

## Content rules (mandatory)

- The notes are copied, not rewritten: keep the learner's wording, their Russian translations
  and their examples. Do not "fix" a rule to match a textbook, and do not drop an example.
- Do not invent extra examples. If the note gives three, the page has three.
- UI-facing prose (`detail`, `ru`, `intro`) is Russian; `title`, `formula`, `markers` and
  `en` lines are English — the same split as the rest of the file.
- Use the file's typographic apostrophe (`’`) in English text, as the existing topics do.
- Never escape anything by hand: every field is rendered through `esc()`/`mdLite()`.
- Keep `✘` for the wrong form in `notes`, the way the existing pages mark it.
- Search indexes `title`, `formula`, `use`, `notes` and `examples` — not `patterns`. When a
  pattern-shaped page would otherwise be unfindable, give it `notes` as well.
- Touch only `data/grammar.js` and `sw.js`. A new page needs no view, route or icon.
