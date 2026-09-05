import { VOCAB, findVocabSection, flatItems, vocabSize } from '../../data/vocabulary.js';
import { callGemini, NoKeyError } from '../gemini.js';
import * as P from '../prompts.js';
import { crumbs, errorBox, esc, loading, mdLite, rowList } from '../ui.js';
import { icon } from '../icons.js';

const CRUMB_ROOT = { title: 'Грамматика', href: '#/' };
const CRUMB_VOCAB = { title: 'Vocabulary & Expressions', href: '#/vocab' };

export async function renderVocabulary(root, sectionId, itemIdx) {
  if (!sectionId) return renderIndex(root);

  const section = findVocabSection(sectionId);
  if (!section) {
    root.innerHTML = '<p class="empty">Раздел не найден. <a href="#/vocab">К списку разделов</a></p>';
    return;
  }
  renderSection(root, section, itemIdx === '' ? null : Number(itemIdx));
}

/* ─────────────────── Subsection list ─────────────────── */
function renderIndex(root) {
  root.innerHTML = `
    ${crumbs([CRUMB_ROOT, { title: 'Vocabulary & Expressions' }])}
    <h1 class="page-title">${icon('vocabulary', 'title-icon')}Vocabulary &amp; Expressions</h1>
    <p class="page-sub">Перевод, пример и практика.</p>
    ${rowList(VOCAB.map((s) => ({
      href: `#/vocab/${s.id}`,
      icon: icon(s.id) || s.icon,
      title: s.title,
      sub: s.subtitle || '',
      meta: String(vocabSize(s)),
    })))}`;
}

/* ─────────────────── Section: expression groups ─────────────────── */
function renderSection(root, section, openIdx) {
  const items = flatItems(section);
  let n = -1;

  const groupsHtml = section.groups.map((g) => {
    const chips = g.items.map((it) => {
      n += 1;
      return `<button class="vocab-term" data-idx="${n}">${esc(it.term)}</button>`;
    }).join('');
    return `
      <div class="vocab-block">
        ${g.label ? `<div class="label">${esc(g.label)}</div>` : ''}
        <div class="vocab-terms">${chips}</div>
      </div>`;
  }).join('');

  root.innerHTML = `
    ${crumbs([CRUMB_ROOT, CRUMB_VOCAB, { title: section.title }])}
    <h1 class="page-title">${icon(section.id, 'title-icon')}${esc(section.title)}</h1>
    <p class="page-sub">${esc(section.subtitle || '')} · ${vocabSize(section)} выражений</p>
    <div class="result-card">
      ${groupsHtml}
      ${section.tip ? `<div class="tip">✅ ${esc(section.tip)}</div>` : ''}
    </div>
    <div id="v-detail"></div>`;

  const detail = root.querySelector('#v-detail');

  function select(idx) {
    root.querySelectorAll('.vocab-term').forEach((b) => b.classList.toggle('active', +b.dataset.idx === idx));
    renderDetail(detail, items[idx], section);
    detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Selecting does not change the hash: the router scrolls to top on every route
  // change. Direct links like #/vocab/have/3 still work; search opens them.
  root.querySelectorAll('.vocab-term').forEach((btn) => {
    btn.addEventListener('click', () => select(+btn.dataset.idx));
  });

  if (Number.isInteger(openIdx) && items[openIdx]) select(openIdx);
}

/* ─────────────────── Expression card ─────────────────── */
function renderDetail(host, item, section) {
  host.innerHTML = `
    <div class="section-title">${esc(item.term)}</div>
    <div class="result-card">
      <div class="word-head">
        <div>
          <div class="word-term">${esc(item.term)}</div>
          ${item.ru ? `<div class="word-ru">${esc(item.ru)}</div>` : '<div class="word-ru muted">В конспекте перевод не записан</div>'}
        </div>
      </div>
      ${item.example
        ? `<div class="word-example"><span class="gen-label">Пример из конспекта</span><div class="gen-en">👉 ${esc(item.example)}</div></div>`
        : '<p class="muted" style="margin:12px 0 0">В конспекте примера нет.</p>'}
      <div class="actions" style="margin-top:16px">
        <button class="btn primary" data-act="examples">Примеры</button>
        <button class="btn" data-act="use">Use It</button>
      </div>
      <div class="result" id="v-result"></div>
    </div>`;

  const result = host.querySelector('#v-result');

  async function run(fn, text) {
    result.innerHTML = `<div style="margin-top:16px">${loading(text)}</div>`;
    try {
      await fn();
    } catch (err) {
      if (err instanceof NoKeyError) {
        result.innerHTML = `<div style="margin-top:16px">${errorBox('Добавь API-ключ в настройках.', true)}</div>`;
      } else {
        result.innerHTML = `<div style="margin-top:16px">${errorBox(err.message)}
          <div style="margin-top:12px"><button class="btn" id="v-retry">Повторить</button></div></div>`;
        result.querySelector('#v-retry').addEventListener('click', () => run(fn, text));
      }
    }
  }

  async function showExamples() {
    await run(async () => {
      const out = await callGemini(P.vocabExamplesPrompt(item, section.title), P.examplesSchema);
      result.innerHTML = `<div style="margin-top:16px;border-top:1px solid var(--line);padding-top:8px">
        ${(out.items || []).map((it) => `
          <div class="gen-item">
            <div class="gen-en">${mdLite(it.en)}</div>
            <div class="gen-ru">${esc(it.ru)}</div>
            <div class="gen-why">${esc(it.why)}</div>
          </div>`).join('')}
      </div>`;
    }, 'Придумываю примеры…');
  }

  async function showUse() {
    await run(async () => {
      const s = await callGemini(P.vocabUsePrompt(item, section.title), P.situationSchema, { temperature: 0.95 });
      result.innerHTML = `
        <div style="margin-top:16px;border-top:1px solid var(--line);padding-top:16px">
          <div class="gen-label">Situation</div>
          <p class="gen-en" style="margin:6px 0 14px">${esc(s.situation)}</p>
          <div class="gen-label">Your task</div>
          <p class="gen-en" style="margin:6px 0 4px">${esc(s.task)}</p>
          <p class="gen-why" style="margin-bottom:14px">${esc(s.hint)}</p>
          <textarea class="input" id="v-answer" placeholder="Твой ответ на английском…"></textarea>
          <div class="actions" style="margin-top:12px">
            <button class="btn primary" id="v-check">Проверить ответ</button>
            <button class="btn" id="v-new">Другая ситуация</button>
          </div>
          <div id="v-verdict"></div>
        </div>`;

      const ta = result.querySelector('#v-answer');
      ta.focus();
      ta.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) result.querySelector('#v-check').click();
      });
      result.querySelector('#v-new').addEventListener('click', showUse);
      result.querySelector('#v-check').addEventListener('click', async () => {
        const answer = ta.value.trim();
        const box = result.querySelector('#v-verdict');
        if (!answer) { box.innerHTML = '<div class="verdict no" style="margin-top:14px">Сначала напиши ответ.</div>'; return; }
        const btn = result.querySelector('#v-check');
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
  }

  host.querySelector('[data-act="examples"]').addEventListener('click', showExamples);
  host.querySelector('[data-act="use"]').addEventListener('click', showUse);
}
