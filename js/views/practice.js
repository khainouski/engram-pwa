import { TOPICS, TOPIC_INDEX, findGroup, findSubgroup, topicTitle } from '../../data/grammar.js';
import { callGemini, NoKeyError } from '../gemini.js';
import * as P from '../prompts.js';
import { store } from '../storage.js';
import { errorBox, esc, loading, mdLite } from '../ui.js';

/**
 * Practice panel.
 *  ctx = { kind: 'topic', topicId }                 — Examples / Exercises / Use It / Compare
 *  ctx = { kind: 'mix', title, mixLabel, topicIds } — one word across a whole group
 */
export function mountPractice(slot, ctx) {
  if (!slot) return;
  const isMix = ctx.kind === 'mix';
  const topic = isMix ? null : TOPICS[ctx.topicId];

  slot.innerHTML = `
    <div class="practice">
      <div class="section-title">${isMix ? 'Практика — все конструкции сразу' : 'Практика с AI'}</div>
      ${isMix ? '<p class="page-sub" style="margin-bottom:16px">Введи слово — увидишь его во всех конструкциях группы.</p>' : ''}
      ${isMix ? '' : `
        <div class="modes">
          <button class="btn" data-mode="examples">Examples</button>
          <button class="btn" data-mode="exercises">Exercises</button>
          <button class="btn" data-mode="use">Use It</button>
          <button class="btn" data-mode="compare">Compare</button>
        </div>`}
      <div class="word-bar">
        <div class="row">
          <input id="p-word" class="input" style="flex:1;min-width:200px"
                 placeholder="${isMix ? 'Твоё слово, напр. work' : 'Своё слово (необязательно), напр. deploy'}"
                 autocomplete="off">
          ${isMix ? '<button id="p-run-mix" class="btn primary">Показать</button>' : ''}
        </div>
        <div class="chips" id="p-chips"></div>
      </div>
      <div class="result" id="p-result"></div>
    </div>`;

  const wordInput = slot.querySelector('#p-word');
  const result = slot.querySelector('#p-result');

  // The last word is prefilled: usually the same word is practised across topics.
  store.getLastWord().then((last) => { if (last && !wordInput.value) wordInput.value = last; });
  // Suggestions from My Words as chips rather than a native datalist.
  const chips = slot.querySelector('#p-chips');
  store.getWords().then((words) => {
    chips.innerHTML = words.slice(0, 8)
      .map((w) => `<span class="chip" data-w="${esc(w.text)}">${esc(w.text)}</span>`).join('');
  });
  chips.addEventListener('click', (e) => {
    const c = e.target.closest('.chip');
    if (c) { wordInput.value = c.dataset.w; wordInput.focus(); }
  });

  const word = () => wordInput.value.trim();

  /** AI request with a shared spinner, error handling and a retry button. */
  async function run(fn, { text = 'Думаю…' } = {}) {
    result.innerHTML = `<div class="result-card">${loading(text)}</div>`;
    if (word()) store.setLastWord(word());
    try {
      await fn();
    } catch (err) {
      if (err instanceof NoKeyError) {
        result.innerHTML = `<div class="result-card">${errorBox('Добавь API-ключ в настройках.', true)}</div>`;
      } else {
        result.innerHTML = `<div class="result-card">${errorBox(err.message)}
          <div style="margin-top:12px"><button class="btn" id="p-retry">Повторить</button></div></div>`;
        result.querySelector('#p-retry').addEventListener('click', () => run(fn, { text }));
      }
    }
  }

  function card(inner) { result.innerHTML = `<div class="result-card">${inner}</div>`; }

  /* ─────────────────── EXAMPLES ─────────────────── */
  async function modeExamples() {
    const w = word();
    await run(async () => {
      const out = await callGemini(P.examplesPrompt(ctx.topicId, w), P.examplesSchema);
      card((out.items || []).map((it) => `
        <div class="gen-item">
          <div class="gen-en">${mdLite(it.en)}</div>
          <div class="gen-ru">${esc(it.ru)}</div>
          <div class="gen-why">${esc(it.why)}</div>
        </div>`).join('') || '<p class="muted">Пусто. Попробуй ещё раз.</p>');
    }, { text: 'Придумываю примеры…' });
  }

  /* ─────────────────── EXERCISES ─────────────────── */
  async function modeExercises() {
    const w = word();
    await run(async () => {
      const out = await callGemini(P.exercisesPrompt(ctx.topicId, w), P.exercisesSchema, { temperature: 0.9 });
      const items = out.items || [];
      if (!items.length) { card('<p class="muted">Пусто. Попробуй ещё раз.</p>'); return; }

      card(`
        ${items.map((it, i) => `
          <div class="ex-item" data-i="${i}">
            <div class="ex-type">${esc(it.type)}</div>
            <div class="ex-q">${esc(i + 1)}. ${esc(it.question)}</div>
            ${it.options?.length ? `<div class="ex-options">${it.options.map((o) => `<span class="chip" data-opt="${esc(o)}">${esc(o)}</span>`).join('')}</div>` : ''}
            <input class="input ex-answer" placeholder="Твой ответ">
            <div class="ex-verdict"></div>
          </div>`).join('')}
        <div class="row" style="margin-top:16px">
          <button class="btn primary" id="ex-check">Проверить</button>
          <button class="btn" id="ex-new">Новые задания</button>
        </div>`);

      result.querySelectorAll('.ex-item').forEach((item) => {
        item.addEventListener('click', (e) => {
          const opt = e.target.closest('[data-opt]');
          if (opt) item.querySelector('.ex-answer').value = opt.dataset.opt;
        });
      });
      result.querySelectorAll('.ex-answer').forEach((inp) => {
        inp.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            result.querySelector('#ex-check')?.click();
          }
        });
      });
      result.querySelector('#ex-new').addEventListener('click', modeExercises);
      result.querySelector('#ex-check').addEventListener('click', async () => {
        const inputs = [...result.querySelectorAll('.ex-answer')];
        const answers = inputs.map((i) => i.value.trim());
        const btn = result.querySelector('#ex-check');
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner"></span> проверяю…';
        try {
          const res = await callGemini(P.checkPrompt(ctx.topicId, items, answers), P.checkSchema, { temperature: 0.2 });
          (res.items || []).forEach((r, i) => {
            const box = result.querySelectorAll('.ex-verdict')[i];
            if (!box) return;
            box.innerHTML = `
              <div class="verdict ${r.correct ? 'ok' : 'no'}">
                ${r.correct ? '✓ Верно' : '✗ Неверно'}
                ${r.correct ? '' : ` — <span class="expected">${esc(r.expected)}</span>`}
                <span class="why">${esc(r.explanation)}</span>
              </div>`;
          });
          const right = (res.items || []).filter((r) => r.correct).length;
          btn.disabled = false;
          btn.textContent = `Проверить ещё раз (${right} из ${items.length})`;
        } catch (err) {
          btn.disabled = false;
          btn.textContent = 'Проверить';
          const holder = result.querySelector('.row');
          holder.insertAdjacentHTML('afterend', `<div style="margin-top:12px">${errorBox(err.message, err instanceof NoKeyError)}</div>`);
        }
      });
    }, { text: 'Составляю упражнения…' });
  }

  /* ─────────────────── USE IT ─────────────────── */
  async function modeUse() {
    const w = word();
    await run(async () => {
      const s = await callGemini(P.situationPrompt(ctx.topicId, w), P.situationSchema, { temperature: 0.95 });
      card(`
        <div class="gen-label">Situation</div>
        <p class="gen-en" style="margin:6px 0 14px">${esc(s.situation)}</p>
        <div class="gen-label">Your task</div>
        <p class="gen-en" style="margin:6px 0 4px">${esc(s.task)}</p>
        <p class="gen-why" style="margin-bottom:14px">${esc(s.hint)}</p>
        <textarea class="input" id="use-answer" placeholder="Твой ответ на английском…"></textarea>
        <div class="row" style="margin-top:12px">
          <button class="btn primary" id="use-check">Проверить ответ</button>
          <button class="btn" id="use-new">Другая ситуация</button>
        </div>
        <div id="use-verdict"></div>`);

      const ta = result.querySelector('#use-answer');
      ta.focus();
      ta.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) result.querySelector('#use-check').click();
      });
      result.querySelector('#use-new').addEventListener('click', modeUse);
      result.querySelector('#use-check').addEventListener('click', async () => {
        const answer = ta.value.trim();
        const box = result.querySelector('#use-verdict');
        if (!answer) { box.innerHTML = '<div class="verdict no">Сначала напиши ответ.</div>'; return; }
        const btn = result.querySelector('#use-check');
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner"></span> проверяю…';
        try {
          const r = await callGemini(P.answerPrompt(ctx.topicId, s.situation, s.task, answer), P.answerSchema, { temperature: 0.3 });
          const ok = r.verdict === 'correct';
          box.innerHTML = `
            <div class="verdict ${ok ? 'ok' : 'no'}" style="margin-top:14px">
              ${ok ? '✓ Верно и звучит естественно' : r.verdict === 'almost' ? '≈ Почти — можно естественнее' : '✗ Нужно исправить'}
              <span class="why"><b>Correct:</b> ${esc(r.corrected)}</span>
              <span class="why">${esc(r.notes)}</span>
              <span class="why"><b>Natural alternative:</b> ${esc(r.natural)}</span>
            </div>`;
        } catch (err) {
          box.innerHTML = `<div style="margin-top:12px">${errorBox(err.message, err instanceof NoKeyError)}</div>`;
        }
        btn.disabled = false;
        btn.textContent = 'Проверить ответ';
      });
    }, { text: 'Придумываю ситуацию…' });
  }

  /* ─────────────────── COMPARE ─────────────────── */
  /** Commonly confused pairs from the notes, plus neighbours in the same group. */
  function comparePartners() {
    const curated = (topic?.compare || []).filter((id) => id !== ctx.topicId);
    const loc = TOPIC_INDEX[ctx.topicId] || {};
    const group = loc.groupId ? findGroup(loc.groupId) : null;
    const sub = loc.subId ? findSubgroup(loc.groupId, loc.subId) : null;
    const near = sub ? sub.topics : [];
    const wide = group
      ? (group.subgroups ? group.subgroups.flatMap((x) => x.topics) : group.topics || [])
      : [];
    const rest = [...new Set([...near, ...wide])]
      .filter((id) => id !== ctx.topicId && !curated.includes(id));
    return { curated, rest };
  }

  function modeCompare() {
    const { curated, rest } = comparePartners();
    if (!curated.length && !rest.length) { card('<p class="muted">Нет парных конструкций для сравнения.</p>'); return; }
    const buttons = (ids, primary) => ids
      .map((id) => `<button class="btn small${primary ? ' primary' : ''}" data-cmp="${esc(id)}">${esc(topicTitle(id))}</button>`)
      .join('');
    card(`
      <p style="margin:0 0 12px">С чем сравнить <b>${esc(topic.title)}</b>?</p>
      ${curated.length ? `<div class="row">${buttons(curated, true)}</div>` : ''}
      ${rest.length ? `
        <div class="cmp-more">
          <div class="cmp-label">Ещё конструкции</div>
          <div class="row">${buttons(rest, false)}</div>
        </div>` : ''}`);
    result.querySelectorAll('[data-cmp]').forEach((b) => {
      b.addEventListener('click', () => runCompare(b.dataset.cmp));
    });
  }

  async function runCompare(otherId) {
    const w = word();
    await run(async () => {
      const out = await callGemini(P.comparePrompt(ctx.topicId, otherId, w), P.compareSchema, { temperature: 0.6 });
      card(`
        <div class="gen-label">${esc(topic.title)} vs ${esc(topicTitle(otherId))}</div>
        <p style="margin:8px 0 16px">${esc(out.summary)}</p>
        ${(out.pairs || []).map((p) => `
          <div class="gen-item">
            <div class="gen-en"><span class="gen-label">${esc(p.a_label)}</span><br>${mdLite(p.a_sentence)}</div>
            <div class="gen-en" style="margin-top:8px"><span class="gen-label">${esc(p.b_label)}</span><br>${mdLite(p.b_sentence)}</div>
            <div class="gen-why">${esc(p.difference)}</div>
          </div>`).join('')}
        <div class="row" style="margin-top:16px">
          <button class="btn" id="cmp-back">← Выбрать другую пару</button>
        </div>`);
      result.querySelector('#cmp-back').addEventListener('click', modeCompare);
    }, { text: 'Сравниваю…' });
  }

  /* ─────────────────── MIX ─────────────────── */
  async function modeMix() {
    const w = word();
    if (!w) {
      card('<p class="muted">Введи слово — например <b>work</b>.</p>');
      wordInput.focus();
      return;
    }
    await run(async () => {
      const out = await callGemini(P.mixPrompt(ctx.topicIds, ctx.title, w), P.mixSchema, { temperature: 0.7 });
      card(`
        <p style="margin:0 0 16px">${esc(out.summary)}</p>
        ${(out.items || []).map((it) => `
          <div class="gen-item">
            <div class="gen-label">${esc(it.label)}</div>
            <div class="gen-en">${mdLite(it.en)}</div>
            <div class="gen-ru">${esc(it.ru)}</div>
            <div class="gen-why">${esc(it.why)}</div>
          </div>`).join('')}`);
    }, { text: 'Подбираю формы…' });
  }

  // ── Mode wiring ──
  if (isMix) {
    slot.querySelector('#p-run-mix').addEventListener('click', modeMix);
    wordInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') modeMix(); });
  } else {
    const handlers = { examples: modeExamples, exercises: modeExercises, use: modeUse, compare: modeCompare };
    slot.querySelectorAll('[data-mode]').forEach((btn) => {
      btn.addEventListener('click', () => {
        slot.querySelectorAll('[data-mode]').forEach((b) => b.classList.toggle('active', b === btn));
        handlers[btn.dataset.mode]();
      });
    });
    wordInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const active = slot.querySelector('[data-mode].active') || slot.querySelector('[data-mode]');
        active.click();
      }
    });
  }
}
