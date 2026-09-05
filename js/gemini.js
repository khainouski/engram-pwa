import { store } from './storage.js';

const API_ROOT = 'https://generativelanguage.googleapis.com/v1beta';
const REQUEST_TIMEOUT_MS = 45000;

export class NoKeyError extends Error {
  constructor() { super('Не задан API-ключ.'); this.name = 'NoKeyError'; }
}

class GeminiError extends Error {
  constructor(message, { code = 'unknown', detail = '' } = {}) {
    super(message);
    this.name = 'GeminiError';
    this.code = code;
    /** Raw API detail for diagnostics; never contains the key. */
    this.detail = detail;
  }
}

/** 2.x takes a token budget, 3.x a level, and only Lite accepts "minimal". */
export function thinkingConfigFor(model) {
  const id = model.toLowerCase();
  if (id.includes('2.5')) return { thinkingBudget: 0 };
  if (id.includes('lite')) return { thinkingLevel: 'minimal' };
  return { thinkingLevel: 'low' };
}

const SYSTEM = `You are a personal English grammar tutor for a Russian-speaking software developer (level B1+/B2).
You work strictly with the grammar topic and the rules given to you: they come from the learner's own notes.
Never replace the learner's rules with your own theory and never teach a different construction than the one requested.
Write example sentences in natural English; prefer a professional/IT context (deploy, release, PR, sprint, meeting, bug)
similar to the learner's notes, unless the learner's own word suggests another context.
All explanations, corrections and error analysis must be written in Russian, clear and short.
Return only JSON matching the requested schema. No markdown fences, no extra commentary.`;

function describeHttpError(status, payload, model) {
  const detail = payload?.error?.message || '';
  const lower = detail.toLowerCase();

  if (status === 400 && lower.includes('api key')) {
    return new GeminiError('Неверный API-ключ.', { code: 'bad-key', detail });
  }
  if (status === 400) {
    return new GeminiError(detail || 'Неверный запрос (400).', { code: 'bad-request', detail });
  }
  if (status === 401 || status === 403) {
    return new GeminiError('Доступ запрещён. Проверь ключ и его ограничения.', { code: 'auth', detail });
  }
  if (status === 404) {
    return new GeminiError(
      detail || `Модель ${model} недоступна. Выбери другую в настройках.`,
      { code: 'no-model', detail },
    );
  }
  if (status === 429) {
    return new GeminiError('Слишком много запросов (429). Подожди немного и повтори.', { code: 'rate-limit', detail });
  }
  if (status >= 500) {
    return new GeminiError(`AI временно недоступен (${status}). Попробуй ещё раз.`, { code: 'server', detail });
  }
  return new GeminiError(detail || `Ошибка запроса (${status}).`, { code: 'http', detail });
}

/** One authenticated REST call. `body === null` means GET. */
async function callApi(path, apiKey, body, model = '') {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response;
  try {
    response = await fetch(`${API_ROOT}/${path}`, {
      method: body ? 'POST' : 'GET',
      // Header, not URL: keeps the key out of logs, referrers and error text.
      headers: {
        'x-goog-api-key': apiKey,
        ...(body ? { 'content-type': 'application/json' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (cause) {
    throw new GeminiError(
      controller.signal.aborted
        ? 'AI не ответил за 45 секунд. Попробуй ещё раз.'
        : 'Нет соединения. Проверь интернет.',
      { code: controller.signal.aborted ? 'timeout' : 'network' },
    );
  } finally {
    clearTimeout(timeout);
  }

  const payload = await response.json().catch(() => null);
  if (!response.ok) throw describeHttpError(response.status, payload, model);
  if (!payload) throw new GeminiError('Некорректный ответ. Попробуй ещё раз.', { code: 'malformed' });
  return payload;
}

/** A 400 may just mean the model rejected thinkingConfig; retrying without it is worth a shot. */
function shouldRetryWithoutThinking(error) {
  if (!(error instanceof GeminiError) || error.code !== 'bad-request') return false;
  const detail = error.detail.toLowerCase();
  if (detail.includes('api key')) return false;
  return detail === '' || detail.includes('thinking') || detail.includes('unknown name');
}

function extractJson(payload) {
  const cand = payload.candidates?.[0];
  if (!cand) throw new GeminiError('Пустой ответ. Попробуй ещё раз.', { code: 'empty' });
  if (cand.finishReason && !['STOP', 'MAX_TOKENS'].includes(cand.finishReason)) {
    throw new GeminiError(`Ответ прерван (${cand.finishReason}). Попробуй ещё раз.`, { code: 'finish' });
  }

  const text = (cand.content?.parts || []).map((p) => p.text || '').join('').trim();
  if (!text) throw new GeminiError('Пустой ответ. Попробуй ещё раз.', { code: 'empty' });

  try {
    return JSON.parse(text);
  } catch {
    const m = text.match(/[[{][\s\S]*[\]}]/);
    if (m) { try { return JSON.parse(m[0]); } catch { /* fall through */ } }
    throw new GeminiError('Не удалось разобрать ответ. Попробуй ещё раз.', { code: 'malformed' });
  }
}

export async function callGemini(prompt, schema, { temperature = 0.8 } = {}) {
  const key = await store.getApiKey();
  if (!key) throw new NoKeyError();
  const model = await store.getModel();

  const body = {
    systemInstruction: { parts: [{ text: SYSTEM }] },
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature,
      responseMimeType: 'application/json',
      ...(schema ? { responseSchema: schema } : {}),
      thinkingConfig: thinkingConfigFor(model),
    },
  };
  const path = `models/${encodeURIComponent(model)}:generateContent`;

  let payload;
  try {
    payload = await callApi(path, key, body, model);
  } catch (error) {
    if (shouldRetryWithoutThinking(error)) {
      const { thinkingConfig: _omit, ...generationConfig } = body.generationConfig;
      payload = await callApi(path, key, { ...body, generationConfig }, model);
    } else {
      throw error;
    }
  }

  return extractJson(payload);
}

/** Cheapest real request: model metadata proves both the key and the model work. */
export async function testKey() {
  const key = await store.getApiKey();
  if (!key) throw new NoKeyError();
  const model = await store.getModel();
  await callApi(`models/${encodeURIComponent(model)}`, key, null, model);
  return true;
}

