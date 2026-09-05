import { GROUPS } from '../../data/grammar.js';
import { callGemini, NoKeyError } from '../gemini.js';
import * as P from '../prompts.js';
import { store } from '../storage.js';
import { crumbs, errorBox, esc, loading, mdLite } from '../ui.js';
import { icon } from '../icons.js';

const CRUMB_ROOT = { title: 'Грамматика', href: '#/' };
const CRUMB_WORDS = { title: 'Мои слова', href: '#/words' };

/** Groups and subgroups a word can be practised against (those with a mix). */
const DRILLS = (() => {
  const out = [];
  for (const g of GROUPS) {
    if (g.subgroups) {
      for (const s of g.subgroups) if (s.mix) out.push({ id: s.id, title: s.title, topics: s.topics });
    } else if (g.mix) {
      out.push({ id: g.id, title: g.title, topics: g.topics });
    }
  }
  return out;
})();

export async function renderWords(root, term) {
  if (term) return renderWord(root, decodeURIComponent(term));

  const words = await store.getWords();
  root.innerHTML = `
    ${crumbs([CRUMB_ROOT, { title: 'Мои слова' }])}
    <h1 class="page-title">${icon('words', 'title-icon')}Мои слова</h1>
    <p class="page-sub">Введи слово по-английски — перевод подставится сам.</p>
    <div class="row" style="margin-bottom:24px">
      <input id="w-text" class="input" style="flex:1;min-width:200px" placeholder="deploy, come up with, …" autocomplete="off" spellcheck="false">
      <button id="w-add" class="btn primary">Добавить</button>
    </div>
    <div id="w-status"></div>
    <div id="w-list"></div>`;

  const input = root.querySelector('#w-text');
  const status = root.querySelector('#w-status');
  const list = root.querySelector('#w-list');

  function draw(items) {
    list.innerHTML = items.length
      ? `<div class="list">${items.map((w) => `
          <a class="row" href="#/words/${encodeURIComponent(w.text)}">
            <span class="row-text">
              <span class="row-title">${esc(w.text)}</span>
              <span class="row-sub">${esc(w.translation || 'без перевода')}</span>
            </span>
            <button class="btn small w-del" data-del="${esc(w.text)}" title="Удалить">✕</button>
            <span class="row-chevron" aria-hidden="true">›</span>
          </a>`).join('')}</div>`
      : '<p class="empty">Пока пусто. Добавь первое слово выше.</p>';
  }

  async function add() {
    const text = input.value.trim();
    if (!text) return;
    if (await store.findWord(text)) {
      status.innerHTML = `<p class="hint">«${esc(text)}» уже сохранено.</p>`;
      return;
    }
    const btn = root.querySelector('#w-add');
    btn.disabled = true;
    status.innerHTML = loading('Перевожу…');
    try {
      const entry = await callGemini(P.translatePrompt(text), P.translateSchema, { temperature: 0.2 });
      draw(await store.saveWord({ text, ...entry }));
      status.innerHTML = '';
      input.value = '';
    } catch (err) {
      // Save the word even without a key or after a failure; translate later.
      draw(await store.saveWord({ text }));
      input.value = '';
      status.innerHTML = err instanceof NoKeyError
        ? errorBox('Слово сохранено. Для перевода добавь API-ключ в настройках.', true)
        : errorBox(`Слово сохранено, но перевести не вышло: ${err.message}`);
    }
    btn.disabled = false;
    input.focus();
  }

  root.querySelector('#w-add').addEventListener('click', add);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') add(); });
  list.addEventListener('click', async (e) => {
    const del = e.target.closest('[data-del]');
    if (!del) return;
    e.preventDefault();
    draw(await store.removeWord(del.dataset.del));
  });

  draw(words);
  input.focus();
}

/* ─────────────────── Single word page ─────────────────── */
async function renderWord(root, text) {
  const word = await store.findWord(text);
  if (!word) {
    root.innerHTML = '<p class="empty">Слово не найдено. <a href="#/words">К списку</a></p>';
    return;
  }
  // To the prompts a word looks the same as a vocabulary expression.
  const item = { term: word.text, ru: word.translation || '', example: word.example || '' };

  root.innerHTML = `
    ${crumbs([CRUMB_ROOT, CRUMB_WORDS, { title: word.text }])}
    <h1 class="page-title">${esc(word.text)}</h1>

    <section class="rule-card">
      <div class="rc-head">
        <h1 class="rc-title">${esc(word.pos || 'перевод')}</h1>
        <div class="word-translation">${esc(word.translation || '—')}</div>
        ${word.forms ? `<div class="word-forms">${esc(word.forms)}</div>` : ''}
      </div>
      ${word.example ? `
        <div class="rc-body">
          <div class="rule-en">${esc(word.example)}</div>
          ${word.exampleRu ? `<div class="rule-ru">${esc(word.exampleRu)}</div>` : ''}
        </div>` : ''}
    </section>

    ${word.translation ? '' : '<div class="row" style="margin-bottom:20px"><button class="btn" id="w-translate">Перевести</button></div>'}

    <div class="section-title">Слово в конструкциях</div>
    <div class="modes modes-wide" id="w-drills">
      ${DRILLS.map((d) => `<button class="btn" data-drill="${d.id}">${esc(d.title)}</button>`).join('')}
    </div>
    <div class="row" style="margin-top:10px">
      <button class="btn" data-act="examples">Примеры</button>
      <button class="btn" data-act="use">Use It</button>
    </div>
    <div class="result" id="w-result"></div>`;

  const result = root.querySelector('#w-result');

  async function run(fn, text) {
    result.innerHTML = `<div class="result-card" style="margin-top:16px">${loading(text)}</div>`;
    try {
      await fn();
    } catch (err) {
      result.innerHTML = `<div class="result-card" style="margin-top:16px">${errorBox(
        err instanceof NoKeyError ? 'Добавь API-ключ в настройках.' : err.message,
        err instanceof NoKeyError,
      )}${err instanceof NoKeyError ? '' : '<div style="margin-top:12px"><button class="btn" id="w-retry">Повторить</button></div>'}</div>`;
      result.querySelector('#w-retry')?.addEventListener('click', () => run(fn, text));
    }
  }

  const card = (inner) => { result.innerHTML = `<div class="result-card" style="margin-top:16px">${inner}</div>`; };

  root.querySelector('#w-translate')?.addEventListener('click', async () => {
    await run(async () => {
      const entry = await callGemini(P.translatePrompt(word.text), P.translateSchema, { temperature: 0.2 });
      await store.saveWord({ text: word.text, ...entry });
      renderWord(root, word.text);
    }, 'Перевожу…');
  });

  root.querySelectorAll('[data-drill]').forEach((btn) => {
    btn.addEventListener('click', () => {
      root.querySelectorAll('[data-drill]').forEach((b) => b.classList.toggle('active', b === btn));
      const drill = DRILLS.find((d) => d.id === btn.dataset.drill);
      run(async () => {
        const out = await callGemini(P.mixPrompt(drill.topics, drill.title, word.text), P.mixSchema, { temperature: 0.7 });
        card(`
          <p style="margin:0 0 16px">${esc(out.summary)}</p>
          ${(out.items || []).map((it) => `
            <div class="gen-item">
              <div class="gen-label">${esc(it.label)}</div>
              <div class="gen-en">${mdLite(it.en)}</div>
              <div class="gen-ru">${esc(it.ru)}</div>
              <div class="gen-why">${esc(it.why)}</div>
            </div>`).join('')}`);
      }, 'Подбираю формы…');
    });
  });

  root.querySelector('[data-act="examples"]').addEventListener('click', () => {
    run(async () => {
      const out = await callGemini(P.vocabExamplesPrompt(item, 'Мои слова'), P.examplesSchema);
      card((out.items || []).map((it) => `
        <div class="gen-item">
          <div class="gen-en">${mdLite(it.en)}</div>
          <div class="gen-ru">${esc(it.ru)}</div>
          <div class="gen-why">${esc(it.why)}</div>
        </div>`).join(''));
    }, 'Придумываю примеры…');
  });

  root.querySelector('[data-act="use"]').addEventListener('click', function useIt() {
    run(async () => {
      const s = await callGemini(P.vocabUsePrompt(item, 'Мои слова'), P.situationSchema, { temperature: 0.95 });
      card(`
        <div class="gen-label">Situation</div>
        <p class="gen-en" style="margin:6px 0 14px">${esc(s.situation)}</p>
        <div class="gen-label">Your task</div>
        <p class="gen-en" style="margin:6px 0 4px">${esc(s.task)}</p>
        <p class="gen-why" style="margin-bottom:14px">${esc(s.hint)}</p>
        <textarea class="input" id="w-answer" placeholder="Твой ответ на английском…"></textarea>
        <div class="row" style="margin-top:12px">
          <button class="btn primary" id="w-check">Проверить ответ</button>
        </div>
        <div id="w-verdict"></div>`);

      const ta = result.querySelector('#w-answer');
      ta.focus();
      ta.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) result.querySelector('#w-check').click();
      });
      result.querySelector('#w-check').addEventListener('click', async () => {
        const answer = ta.value.trim();
        const box = result.querySelector('#w-verdict');
        if (!answer) { box.innerHTML = '<div class="verdict no" style="margin-top:14px">Сначала напиши ответ.</div>'; return; }
        const btn = result.querySelector('#w-check');
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner"></span> проверяю…';
        try {
          const r = await callGemini(P.vocabAnswerPrompt(item, s.situation, s.task, answer), P.answerSchema, { temperature: 0.3 });
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
    }, 'Придумываю ситуацию…');
  });
}
