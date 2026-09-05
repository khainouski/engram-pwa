import { TOPICS } from '../data/grammar.js';

/** Compact topic summary; goes into the prompt as the source of truth. */
function topicBrief(id, { maxExamples = 4 } = {}) {
  const t = TOPICS[id];
  if (!t) return id;
  const rules = (t.use || []).map((u) => `- ${u.en}${u.ru ? ` (${u.ru})` : ''}`).join('\n');
  const notes = (t.notes || []).map((n) => `- NOTE: ${n.en}`).join('\n');
  const ex = (t.examples || []).slice(0, maxExamples).map((x) => `- ${x.en}`).join('\n');
  return [
    `TOPIC: ${t.title}`,
    `FORMULA: ${t.formula}`,
    rules && `RULES FROM THE LEARNER'S NOTES:\n${rules}`,
    notes,
    ex && `EXAMPLES FROM THE NOTES:\n${ex}`,
  ].filter(Boolean).join('\n');
}

const withWord = (word) =>
  word
    ? `\nThe learner wants to practise with their own word/phrase: "${word}". Every sentence you produce MUST use it (any grammatical form is fine).`
    : '';

/* ─────────────────────────── EXAMPLES ─────────────────────────── */
export const examplesSchema = {
  type: 'object',
  properties: {
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          en: { type: 'string' },
          ru: { type: 'string' },
          why: { type: 'string' },
        },
        required: ['en', 'ru', 'why'],
      },
    },
  },
  required: ['items'],
};

export function examplesPrompt(topicId, word) {
  return `${topicBrief(topicId)}

Task: generate 4 NEW example sentences for this exact grammar topic (do not repeat the examples from the notes).
Vary the sentence types: statements, a negative, and at least one question.
Wrap the target construction in **double asterisks** inside "en".
"ru" = natural Russian translation. "why" = one short sentence in Russian explaining why this tense/structure is used here.${withWord(word)}`;
}

/* ─────────────────────────── EXERCISES ─────────────────────────── */
export const exercisesSchema = {
  type: 'object',
  properties: {
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          type: { type: 'string', enum: ['gap', 'choice', 'correct', 'translate'] },
          question: { type: 'string' },
          options: { type: 'array', items: { type: 'string' } },
        },
        required: ['type', 'question'],
      },
    },
  },
  required: ['items'],
};

export function exercisesPrompt(topicId, word) {
  return `${topicBrief(topicId)}

Task: create 5 exercises that train ONLY this grammar topic. Use a mix of types:
- "gap": a sentence with a verb in brackets to put into the correct form, e.g. "I ___ (finish) the report."
- "choice": a sentence plus 2-3 variants in "options" (only one is correct).
- "correct": a sentence containing exactly one grammar mistake; the learner must fix it.
- "translate": a short Russian sentence to translate into English using this construction.
Include at least one "choice" and at least one "translate".
Do NOT include answers. "question" for a "translate" item is the Russian sentence.${withWord(word)}`;
}

export const checkSchema = {
  type: 'object',
  properties: {
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          correct: { type: 'boolean' },
          expected: { type: 'string' },
          explanation: { type: 'string' },
        },
        required: ['correct', 'expected', 'explanation'],
      },
    },
  },
  required: ['items'],
};

export function checkPrompt(topicId, items, answers) {
  const lines = items.map((it, i) =>
    `${i + 1}. [${it.type}] ${it.question}${it.options?.length ? ` (options: ${it.options.join(' / ')})` : ''}\n   Learner's answer: ${answers[i] ? `"${answers[i]}"` : '(no answer)'}`,
  ).join('\n');

  return `${topicBrief(topicId)}

The learner has answered these exercises:
${lines}

Task: check every answer, in the same order, one result per exercise.
"correct": true only if the answer is grammatically right for this topic (ignore letter case, punctuation and obvious typos; accept contractions and any valid synonym).
"expected": the full correct sentence in English.
"explanation": in Russian — if correct, one short confirming remark; if wrong, explain the mistake and the rule briefly.
An empty answer counts as incorrect.`;
}

/* ─────────────────────────── USE IT ─────────────────────────── */
export const situationSchema = {
  type: 'object',
  properties: {
    situation: { type: 'string' },
    task: { type: 'string' },
    hint: { type: 'string' },
  },
  required: ['situation', 'task', 'hint'],
};

export function situationPrompt(topicId, word) {
  return `${topicBrief(topicId)}

Task: give the learner ONE realistic work situation (2-3 sentences, English) where this exact construction is required —
a standup, a code review, a client call, a retro, a chat with a teammate.
"task": the question or request the learner must answer in English, using this grammar.
"hint": in Russian — a short reminder of which structure to use.
Do not provide the answer.${withWord(word)}`;
}

export const answerSchema = {
  type: 'object',
  properties: {
    verdict: { type: 'string', enum: ['correct', 'almost', 'wrong'] },
    corrected: { type: 'string' },
    notes: { type: 'string' },
    natural: { type: 'string' },
  },
  required: ['verdict', 'corrected', 'notes', 'natural'],
};

export function answerPrompt(topicId, situation, task, answer) {
  return `${topicBrief(topicId)}

Situation: ${situation}
Task given to the learner: ${task}
Learner's answer: "${answer}"

Task: evaluate the answer for BOTH grammatical correctness and naturalness.
"verdict": "correct" (no issues), "almost" (understandable but not fully natural or a small slip), "wrong" (the required construction is missing or misused).
"corrected": the learner's sentence rewritten correctly (if it is already correct, repeat it unchanged).
"notes": in Russian — what exactly is wrong or unnatural and why, referring to the rule. If everything is fine, say what was done well.
"natural": one alternative phrasing a native speaker would use at work, in English.`;
}

/* ─────────────────────────── COMPARE ─────────────────────────── */
export const compareSchema = {
  type: 'object',
  properties: {
    summary: { type: 'string' },
    pairs: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          a_label: { type: 'string' },
          a_sentence: { type: 'string' },
          b_label: { type: 'string' },
          b_sentence: { type: 'string' },
          difference: { type: 'string' },
        },
        required: ['a_label', 'a_sentence', 'b_label', 'b_sentence', 'difference'],
      },
    },
  },
  required: ['summary', 'pairs'],
};

export function comparePrompt(topicA, topicB, word) {
  return `Construction A:
${topicBrief(topicA, { maxExamples: 3 })}

Construction B:
${topicBrief(topicB, { maxExamples: 3 })}

Task: compare A and B for the learner.
"summary": in Russian — the core difference in 1-2 sentences.
"pairs": 4 pairs. In each pair use THE SAME situation and the same vocabulary, expressed once with A and once with B,
so the learner sees what changes. "a_label"/"b_label" = the construction names.
"difference": in Russian — what exactly changes in meaning between these two sentences.${withWord(word)}`;
}

/* ─────────────────────────── MIX ─────────────────────────── */
export const mixSchema = {
  type: 'object',
  properties: {
    summary: { type: 'string' },
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          label: { type: 'string' },
          en: { type: 'string' },
          ru: { type: 'string' },
          why: { type: 'string' },
        },
        required: ['label', 'en', 'ru', 'why'],
      },
    },
  },
  required: ['summary', 'items'],
};

export function mixPrompt(topicIds, groupTitle, word) {
  const briefs = topicIds.map((id) => topicBrief(id, { maxExamples: 2 })).join('\n\n');
  return `The learner is practising the group "${groupTitle}" — all of these constructions together:

${briefs}

Task: take the learner's word/phrase "${word}" and show it in EVERY construction listed above, in the same order, one item per construction.
"label": the construction name. "en": one sentence using "${word}" in that construction.
Keep the same subject and context across all sentences, so that only the construction changes.
"ru": Russian translation. "why": in Russian — what this exact form means here and how it differs from the neighbouring ones.
"summary": in Russian — 1-2 sentences on how to choose between these constructions.`;
}

/* ─────────────────── VOCABULARY (an expression, not a topic) ─────────────────── */
function vocabBrief(item, sectionTitle) {
  return [
    `EXPRESSION FROM THE LEARNER'S NOTES: ${item.term}`,
    item.ru && `MEANING IN RUSSIAN (as written in the notes): ${item.ru}`,
    item.example && `EXAMPLE FROM THE NOTES: ${item.example}`,
    sectionTitle && `SECTION: ${sectionTitle}`,
  ].filter(Boolean).join('\n');
}

export function vocabExamplesPrompt(item, sectionTitle) {
  return `${vocabBrief(item, sectionTitle)}

Task: generate 4 NEW example sentences with this exact expression (do not repeat the example from the notes).
Keep the expression's meaning exactly as the notes define it.
Vary the sentences: different tenses, one negative and at least one question; a work context is preferred.
Wrap the expression itself in **double asterisks** inside "en".
"ru" = natural Russian translation. "why" = one short remark in Russian about the shade of meaning or a collocation worth remembering.`;
}

export function vocabUsePrompt(item, sectionTitle) {
  return `${vocabBrief(item, sectionTitle)}

Task: give the learner ONE realistic work situation (2-3 sentences, English) where this exact expression is the natural thing to say.
"task": the question or request the learner must answer in English, using the expression.
"hint": in Russian — a short reminder of the expression and its meaning.
Do not provide the answer.`;
}

export function vocabAnswerPrompt(item, situation, task, answer) {
  return `${vocabBrief(item)}

Situation: ${situation}
Task given to the learner: ${task}
Learner's answer: "${answer}"

Task: evaluate the answer for BOTH grammatical correctness and natural use of the expression "${item.term}".
"verdict": "correct" (the expression is used correctly and naturally), "almost" (understandable but slightly off), "wrong" (the expression is missing or misused).
"corrected": the learner's sentence rewritten correctly (if it is already correct, repeat it unchanged).
"notes": in Russian — what is wrong or unnatural and why; if everything is fine, say what was done well.
"natural": one alternative phrasing a native speaker would use at work, in English.`;
}

/* ─────────────────── MY WORDS: translate on add ─────────────────── */
export const translateSchema = {
  type: 'object',
  properties: {
    translation: { type: 'string' },
    pos: { type: 'string' },
    cefr: { type: 'string' },
    forms: { type: 'string' },
    example: { type: 'string' },
    exampleRu: { type: 'string' },
  },
  required: ['translation', 'pos', 'cefr', 'forms', 'example', 'exampleRu'],
};

export function translatePrompt(text) {
  return `Word or phrase from the learner: "${text}"

Task: prepare a short dictionary entry for a Russian-speaking developer.
"translation": the Russian translation — 1-3 variants separated by commas, nothing else.
"pos": part of speech in Russian, one word (глагол, существительное, прилагательное, фраза, фразовый глагол…).
"cefr": the CEFR level of the word, one of A1, A2, B1, B2, C1, C2.
"forms": for a verb — its three forms and the -ing form, e.g. "deploy · deployed · deployed · deploying". For anything else — an empty string.
"example": one natural English sentence with this word, preferably a work context.
"exampleRu": the Russian translation of that sentence.`;
}

/* ─────────────────── MY WORDS: suggest new words ─────────────────── */
export const suggestSchema = {
  type: 'object',
  properties: {
    words: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          text: { type: 'string' },
          translation: { type: 'string' },
          pos: { type: 'string' },
          forms: { type: 'string' },
          example: { type: 'string' },
          exampleRu: { type: 'string' },
        },
        required: ['text', 'translation', 'pos', 'forms', 'example', 'exampleRu'],
      },
    },
  },
  required: ['words'],
};

/**
 * @param {{level: string, count: number, topic?: string, known?: string[]}} opts
 */
export function suggestPrompt({ level, count, topic = '', known = [] }) {
  const skip = known.length
    ? `\nThe learner already knows these, do not repeat them:\n${known.slice(0, 200).join(', ')}`
    : '';

  return `Task: pick ${count} English words or short expressions to learn.

CEFR level: ${level}. Words must be typical for this level — not easier, not harder.
Theme: ${topic || 'general vocabulary a developer meets at work and in daily life'}.${skip}

For every entry:
"text": the word or expression in English, lowercase, no article.
"translation": the Russian translation — 1-3 variants separated by commas.
"pos": part of speech in Russian, one word (глагол, существительное, прилагательное, фраза, фразовый глагол…).
"forms": for a verb — its three forms and the -ing form, e.g. "deploy · deployed · deployed · deploying". For anything else — an empty string.
"example": one natural English sentence using it.
"exampleRu": the Russian translation of that sentence.

Return exactly ${count} entries, all different.`;
}

/* ─────────────────── Story: another take on the same tenses ─────────────────── */
export const storySchema = {
  type: 'object',
  properties: {
    paragraphs: { type: 'array', items: { type: 'string' } },
  },
  required: ['paragraphs'],
};

/**
 * @param {{title: string, topicIds: string[], sample: string}} opts
 *   sample is the hand-written story, passed as the format to copy
 */
export function storyPrompt({ title, topicIds, sample }) {
  const forms = topicIds
    .map((id) => (TOPICS[id] ? `- ${TOPICS[id].title}: ${TOPICS[id].formula}` : null))
    .filter(Boolean)
    .join('\n');

  return `Write a short story that uses every form of "${title}" at least once.

FORMS THAT MUST ALL APPEAR:
${forms}

Rules:
- 3 paragraphs, 2-3 sentences each. A single connected story, not separate examples.
- About 30% shorter than the sample: keep every form, drop the padding.
- Context: a software team at work — releases, bugs, reviews, deadlines, clients.
- After every verb that demonstrates one of the forms, put its Russian translation
  in parentheses, exactly as in the sample below.
- When two forms share the same Russian translation, add a hint after a dash,
  e.g. "am meeting (встречаюсь — договорённость)".
- Plain text only, no markdown, no headings, no list of forms at the end.
- A different plot from the sample.

SAMPLE OF THE FORMAT:
${sample}

Return the three paragraphs as separate strings in "paragraphs".`;
}
