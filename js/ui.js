export function el(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

export function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// Minimal markdown: the model marks the construction with **bold** and *italic*.
export function mdLite(s) {
  return esc(s)
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
    .replace(/(^|\W)\*([^*]+)\*(?=\W|$)/g, '$1<i>$2</i>');
}

/**
 * Back link to the parent screen, the way a phone app does it: one large
 * target naming where it leads. Shown at every width — launched from the home
 * screen there is no address bar, so this is the only way back. The trail is
 * still passed in full, so wide screens show the path next to it.
 *
 * The href is the parent, but router.js turns a click into history.back()
 * whenever the user actually came from somewhere inside the app, so the button
 * behaves like the browser's own arrow and never loses the previous screen.
 *
 * @param {{title: string, href?: string}[]} items root → current
 */
export function crumbs(items) {
  const parent = items[items.length - 2];
  if (!parent) return '';

  const path = items.slice(0, -1)
    .map((it) => `<a href="${it.href}">${esc(it.title)}</a>`)
    .join('<span class="sep">›</span>');

  return `
    <div class="crumbs">
      <a class="back" href="${parent.href}" data-back aria-label="Назад: ${esc(parent.title)}">
        <span class="back-chevron" aria-hidden="true">‹</span>${esc(parent.title)}
      </a>
      ${items.length > 2 ? `<span class="crumbs-path">${path}</span>` : ''}
    </div>`;
}

export function summaryTable(table) {
  const head = table.head.map((h) => `<th>${esc(h)}</th>`).join('');
  const rows = table.rows
    .map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`)
    .join('');
  return `<div class="table-scroll"><table class="summary"><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>`;
}

export function loading(text = 'Думаю…') {
  return `<div class="loading"><span class="spinner"></span>${esc(text)}</div>`;
}

export function errorBox(message, withSettings = false) {
  const link = withSettings ? '<a href="#/settings">Открыть настройки</a>' : '';
  return `<div class="banner"><span>${esc(message)}</span>${link}</div>`;
}

/**
 * Function words of a formula, used to recognise the construction.
 * "have/has + V3" yields have and has; "am/is/are + V-ing" yields am, is, are
 * plus the -ing marker. Highlighting them shows the pattern, not the text.
 */
const FORMULA_META = new Set([
  'v', 'v1', 'v2', 'v3', 'ving', 'verb', 'verbs', 'present', 'past', 'future', 'simple',
  'continuous', 'perfect', 'participle', 'subject', 'object', 'complement', 'indirect',
  'direct', 'aux', 'auxiliary', 'wh', 'question', 'word', 'words', 'clause', 'adj',
  'adjective', 'noun', 'base', 'form', 'sentence', 'person', 'the', 'a', 'to',
]);

export function patternOf(formula) {
  const raw = String(formula || '').toLowerCase().match(/[a-z][a-z']*/g) || [];
  const words = new Set();
  let ing = false;
  for (const w of raw) {
    if (w === 'ing' || w === 'ving') { ing = true; continue; }
    if (FORMULA_META.has(w) || w.length < 2) continue;
    words.add(w);
  }
  // "to + V": with nothing else to highlight, `to` is the whole construction.
  if (!words.size && !ing && /\bto\b/.test(String(formula).toLowerCase())) words.add('to');
  return { words: [...words], ing };
}

export function markPattern(text, pattern) {
  let html = esc(text);
  if (pattern.words.length) {
    const alt = pattern.words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    html = html.replace(new RegExp(`\\b(${alt})\\b`, 'gi'), '<mark class="pat">$1</mark>');
  }
  if (pattern.ing) html = html.replace(/\b([a-z]{3,}ing)\b/gi, '<mark class="pat">$1</mark>');
  return html;
}

/**
 * Link row of a grouped list, the iOS Settings pattern:
 * icon tile, title, subtitle, chevron. Works on both wide and narrow screens.
 *
 * @param {{href: string, icon?: string, title: string, sub?: string, meta?: string}[]} items
 */
export function rowList(items) {
  return `<div class="list">${items.map((it) => `
    <a class="row" href="${it.href}">
      ${it.icon ? `<span class="row-icon">${it.icon}</span>` : ''}
      <span class="row-text">
        <span class="row-title">${esc(it.title)}</span>
        ${it.sub ? `<span class="row-sub">${esc(it.sub)}</span>` : ''}
      </span>
      ${it.meta ? `<span class="row-meta">${esc(it.meta)}</span>` : ''}
      <span class="row-chevron" aria-hidden="true">›</span>
    </a>`).join('')}</div>`;
}

/**
 * Formula as a diagram: split on "→" and "·".
 * One part is printed large, it is the thing to remember.
 * Several (condition → result) become chips joined by arrows.
 */
export function formulaSchema(formula) {
  const chunks = String(formula).split(/(\u2192|\u00b7)/).map((x) => x.trim()).filter(Boolean);
  const parts = chunks.filter((c) => c !== '\u2192' && c !== '\u00b7');
  const html = chunks.map((c) => (c === '\u2192' || c === '\u00b7')
    ? `<span class="fx-sep">${c}</span>`
    : `<span class="fx-part">${esc(c)}</span>`).join('');
  return `<div class="fx ${parts.length > 1 ? 'fx-multi' : 'fx-single'}">${html}</div>`;
}

/** Short message over the UI; disappears on its own. */
export function toast(message, ms = 4000) {
  document.querySelector('.toast')?.remove();
  const node = el(`<div class="toast" role="status">${esc(message)}</div>`);
  document.body.appendChild(node);
  requestAnimationFrame(() => node.classList.add('show'));
  setTimeout(() => {
    node.classList.remove('show');
    setTimeout(() => node.remove(), 250);
  }, ms);
}

/**
 * Маркеры — слова, которые надо услышать, а не только прочитать: каждый ведёт
 * на YouGlish с живыми примерами из видео. В конспекте маркеры записаны как
 * подсказки («How long…?», «if… had»), поэтому многоточия и знаки препинания
 * из запроса убираются; если после чистки ничего не осталось, ссылки нет.
 */
/** Русское склонение после числа: 1 конструкция, 2 конструкции, 5 конструкций. */
export function plural(n, one, few, many) {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 14) return many;
  const mod10 = n % 10;
  if (mod10 === 1) return one;
  if (mod10 >= 2 && mod10 <= 4) return few;
  return many;
}

/*
 * Правила вроде "Present → can" — это схемы, а не предложения: три строки на
 * каждую превращают карточку в простыню, поэтому такие идут таблицей
 * «схема — смысл — пример». Правила-предложения остаются как были.
 */
const scheme = (u) => !/[.!?]$/.test(u.en) && (u.ex || u.en.includes('\u2192') || u.en.length <= 48);
const compactRules = (use) => Array.isArray(use) && use.length > 1
  && (use.every((u) => u.en && u.en.length <= 60 && u.ex)
    || use.every((u) => u.en && u.en.length <= 80 && scheme(u)));

/*
 * Пояснение из нескольких абзацев — это список мыслей, а не один текст:
 * строками его читать легче, чем сплошным абзацем.
 */
function detailHtml(text) {
  const lines = String(text).split('\n').map((x) => x.trim()).filter(Boolean);
  if (lines.length < 2) return `<p class="rc-detail">${esc(lines[0] || '')}</p>`;
  return `<ul class="rc-detail rc-detail-list">${lines.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>`;
}

/**
 * Карточка темы: имя, формула, правила, заметки, маркеры и примеры.
 * Одна и та же разметка на странице темы (heading: 'h1') и на развёрнутой
 * странице раздела (заголовок — ссылка на тему, brief прячет detail).
 */
export function topicCard(t, { id = '', heading = 'h2', link = false, brief = false, bare = false } = {}) {
  const pattern = patternOf(t.formula);
  // Короткая формула встаёт рядом с именем темы, длинная из нескольких частей —
  // строкой ниже: иначе она жмётся и читается хуже.
  const stacked = /[\u2192\u00b7]/.test(String(t.formula || ''));
  const asPatterns = Array.isArray(t.patterns);
  // Примеры, которые уже стоят строками в таблице правил, второй раз не нужны.
  // Сравниваем по сути: регистр, знаки и русский хвост примера не в счёт.
  const key = (x) => String(x).split('\u2014')[0].toLowerCase()
    .replace(/[^a-z0-9\u0430-\u044f\u0451 ]/gi, ' ').replace(/\s+/g, ' ').trim();
  const shown = new Set();
  for (const u of t.use || []) {
    shown.add(key(u.en));
    if (u.ex) shown.add(key(u.ex));
  }
  /*
   * На странице раздела у каждого правила уже есть свой пример, и общий
   * список ниже читается как повтор тех же конструкций. Там он не нужен —
   * на отдельной странице темы остаётся целиком.
   */
  // Если у каждого правила свой пример, общий список примеров под карточкой
  // пересказывает те же конструкции — на странице раздела он не нужен.
  const ruled = (t.use || []).length > 1 && (t.use || []).every((u) => u.ex);

  const examples = link || bare
    ? (ruled ? [] : (t.examples || []).filter((x) => !shown.has(key(x.en))))
    : (t.examples || []).filter((x) => !shown.has(key(x.en)));
  const name = link ? `<a href="#/t/${id}">${esc(t.title)}</a>` : esc(t.title);

  return `
    <section class="rule-card">
      ${bare && asPatterns ? '' : `
        <div class="rc-head ${stacked && !bare ? 'rc-head-stack' : 'rc-head-row'}">
          ${bare ? '' : `<${heading} class="rc-title rc-title-name">${name}</${heading}>`}
          ${asPatterns ? '' : formulaSchema(t.formula)}
        </div>`}
      <div class="rc-body">
        ${compactRules(t.use) ? `
          <div class="rule-grid">
            ${t.use.map((u) => `
              <div class="rule-row">
                <div class="rr-en">${esc(u.en)}${u.key ? '<span class="rr-key">оборот</span>' : ''}</div>
                <div class="rr-body">
                  ${u.ru ? `<div class="rr-ru">${esc(u.ru)}</div>` : ''}
                  ${u.ex ? `<div class="rr-ex">${markPattern(u.ex, pattern)}</div>` : ''}
                </div>
              </div>`).join('')}
          </div>` : (t.use || []).map((u) => `
          <div class="rule">
            ${u.ru ? `<div class="rule-ru">${esc(u.ru)}</div>` : ''}
            <div class="rule-en">${esc(u.en)}</div>
            ${u.ex ? `<div class="rule-ex">${markPattern(u.ex, pattern)}</div>` : ''}
          </div>`).join('')}
        ${(t.notes || []).length ? `
          <div class="rule-grid note-grid">
            <div class="markers-label">Нюансы и ошибки</div>
            ${t.notes.map((n) => `
              <div class="rule-row">
                <div class="rr-en">${esc(n.en)}</div>
                <div class="rr-body">${n.ru ? `<div class="rr-ru">${esc(n.ru)}</div>` : ''}</div>
              </div>`).join('')}
          </div>` : ''}
        ${t.intro && asPatterns ? `<p class="rc-intro">${esc(t.intro)}</p>` : ''}
        ${t.detail && !brief ? detailHtml(t.detail) : ''}
        ${t.markers?.length ? `
          <div class="markers">
            <span class="markers-label">Маркеры</span>
            ${t.markers.map((w) => markerChip(w)).join('')}
          </div>` : ''}
      </div>
      ${asPatterns || !examples.length ? '' : `
        <ul class="examples">
          ${examples.map((x) => `
            <li>
              <span class="ex-en">${markPattern(x.en, pattern)}</span>
              ${x.ru ? `<span class="ex-ru">${esc(x.ru)}</span>` : ''}
            </li>`).join('')}
        </ul>`}
    </section>`;
}

export function markerChip(word) {
  const q = String(word).replace(/[….?!,;:]/g, ' ').replace(/\s+/g, ' ').trim();
  if (!q) return `<span class="marker">${esc(word)}</span>`;
  const href = `https://youglish.com/pronounce/${encodeURIComponent(q)}/english/us`;
  return `<a class="marker" href="${esc(href)}" target="_blank" rel="noopener noreferrer"
    title="Послушать на YouGlish">${esc(word)}</a>`;
}
