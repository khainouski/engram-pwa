/**
 * Local storage. Was chrome.storage.local in the extension version.
 * The API stays async so views and gemini.js did not have to change.
 */

/** Models offered in Settings, newest first. Same set as LingoPop. */
export const MODELS = [
  { id: 'gemini-3.7-flash', label: 'мощная, дороже' },
  { id: 'gemini-3.6-flash', label: 'мощная, как в расширении' },
  { id: 'gemini-3.5-flash-lite', label: 'дешёвая, лимиты выше' },
];

/** Lite by default: cheap and with the highest free limits. */
const DEFAULT_MODEL = 'gemini-3.5-flash-lite';

/**
 * Spaced repetition, Leitner style: every correct answer moves the word to the
 * next interval, a wrong one drops it back to the start. Days, not hours —
 * the whole point is that the gaps grow.
 */
export const INTERVALS_DAYS = [1, 3, 7, 16, 35];

const DAY = 24 * 60 * 60 * 1000;

/** A word answered wrong comes back within the same sitting. */
const RETRY_MS = 10 * 60 * 1000;

const PREFIX = 'engram:';
const KEYS = { apiKey: 'apiKey', model: 'model', lastWord: 'lastWord', words: 'myWords' };

/** Safari private mode can throw on write; the app must keep running. */
function readRaw(key) {
  try { return localStorage.getItem(PREFIX + key); } catch { return null; }
}

function writeRaw(key, value) {
  try { localStorage.setItem(PREFIX + key, value); return true; } catch { return false; }
}

async function get(key, fallback) {
  const raw = readRaw(key);
  if (raw === null) return fallback;
  try { return JSON.parse(raw); } catch { return fallback; }
}

async function set(key, value) {
  writeRaw(key, JSON.stringify(value));
}

export const store = {
  getApiKey: () => get(KEYS.apiKey, ''),
  setApiKey: (v) => set(KEYS.apiKey, String(v || '').trim()),

  /** A stored id dropped from MODELS falls back to the default, not a 404. */
  async getModel() {
    const id = await get(KEYS.model, '');
    return MODELS.some((m) => m.id === id) ? id : DEFAULT_MODEL;
  },
  setModel: (v) => set(KEYS.model, String(v || '').trim()),

  getWords: () => get(KEYS.words, []),

  async findWord(text) {
    const key = String(text || '').trim().toLowerCase();
    return (await get(KEYS.words, [])).find((w) => w.text.toLowerCase() === key) || null;
  },

  /** Adds a word or merges into the stored one, e.g. after translation. */
  async saveWord(word) {
    const words = await get(KEYS.words, []);
    const i = words.findIndex((w) => w.text.toLowerCase() === word.text.toLowerCase());
    if (i >= 0) words[i] = { ...words[i], ...word };
    else words.unshift({ addedAt: Date.now(), step: 0, due: Date.now(), ...word });
    await set(KEYS.words, words);
    return words;
  },

  /** Words to review now. Anything saved before scheduling existed counts as due. */
  async dueWords(at = Date.now()) {
    const words = await get(KEYS.words, []);
    return words
      .filter((w) => (w.due ?? 0) <= at)
      .sort((a, b) => (a.due ?? 0) - (b.due ?? 0));
  },

  /**
   * @param {string} text
   * @param {boolean} known answered correctly
   */
  async reviewWord(text, known) {
    const words = await get(KEYS.words, []);
    const w = words.find((x) => x.text === text);
    if (!w) return words;

    const step = known ? Math.min((w.step ?? 0) + 1, INTERVALS_DAYS.length) : 0;
    w.step = step;
    w.due = known
      ? Date.now() + INTERVALS_DAYS[Math.min(step, INTERVALS_DAYS.length) - 1] * DAY
      : Date.now() + RETRY_MS;
    w.reviewedAt = Date.now();

    await set(KEYS.words, words);
    return words;
  },

  async removeWord(text) {
    const words = (await get(KEYS.words, [])).filter((w) => w.text !== text);
    await set(KEYS.words, words);
    return words;
  },

  getLastWord: () => get(KEYS.lastWord, ''),
  setLastWord: (v) => set(KEYS.lastWord, String(v || '').trim()),

  /** Import is the only way to move words between devices; see js/markdown.js. */
  async importWords(words, { merge = true } = {}) {
    if (!Array.isArray(words)) throw new Error('Ожидался массив слов.');
    const clean = words
      .filter((w) => w && typeof w.text === 'string' && w.text.trim())
      .map((w) => ({ addedAt: Date.now(), ...w, text: w.text.trim() }));
    if (!merge) { await set(KEYS.words, clean); return clean; }

    const current = await get(KEYS.words, []);
    const byKey = new Map(current.map((w) => [w.text.toLowerCase(), w]));
    for (const w of clean) {
      const k = w.text.toLowerCase();
      byKey.set(k, byKey.has(k) ? { ...byKey.get(k), ...w } : w);
    }
    const merged = [...byKey.values()].sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0));
    await set(KEYS.words, merged);
    return merged;
  },
};
