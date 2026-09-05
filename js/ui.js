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
 * target naming where it leads. The trail is still passed in full, so deeper
 * screens can also show the path above it on wide viewports.
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
      <a class="back" href="${parent.href}">
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
