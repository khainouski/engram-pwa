import { GROUPS, TOPICS } from '../data/grammar.js';
import { VOCAB, flatItems } from '../data/vocabulary.js';
import { renderHome } from './views/home.js';
import { renderGroup, renderSubgroup } from './views/group.js';
import { renderTopic } from './views/topic.js';
import { renderVocabulary } from './views/vocabulary.js';
import { renderWords } from './views/words.js';
import { renderSettings } from './views/settings.js';
import { esc } from './ui.js';

const app = document.getElementById('app');

function parse() {
  const hash = location.hash.replace(/^#/, '') || '/';
  const [, kind, a, b] = hash.split('/');
  return { kind: kind || '', a: a ? decodeURIComponent(a) : '', b: b ? decodeURIComponent(b) : '' };
}

async function route() {
  const { kind, a, b } = parse();
  app.innerHTML = '';
  try {
    switch (kind) {
      case '': await renderHome(app); break;
      case 'g': await renderGroup(app, a); break;
      case 's': await renderSubgroup(app, a, b); break;
      case 't': await renderTopic(app, a); break;
      case 'vocab': await renderVocabulary(app, a, b); break;
      case 'words': await renderWords(app, a); break;
      case 'settings': await renderSettings(app); break;
      default: app.innerHTML = '<p class="empty">Страница не найдена. <a href="#/">На главную</a></p>';
    }
  } catch (e) {
    console.error(e);
    app.innerHTML = `<p class="empty">Ошибка отрисовки: ${esc(e.message)}</p>`;
  }
  window.scrollTo(0, 0);
}

/* ── Search across topics, rules and examples ──────────────── */
const searchInput = document.getElementById('search');
const searchResults = document.getElementById('search-results');

const SEARCH_INDEX = (() => {
  const items = [];
  for (const g of GROUPS) {
    const subs = g.subgroups || [{ id: null, topics: g.topics || [] }];
    for (const s of subs) {
      for (const id of s.topics || []) {
        const t = TOPICS[id];
        if (!t) continue;
        const path = s.id ? `${g.title} › ${g.subgroups.find((x) => x.id === s.id).title}` : g.title;
        const haystack = [
          t.title, t.formula,
          ...(t.use || []).flatMap((u) => [u.en, u.ru]),
          ...(t.notes || []).flatMap((n) => [n.en, n.ru]),
          ...(t.examples || []).flatMap((x) => [x.en, x.ru]),
        ].filter(Boolean).join(' ').toLowerCase();
        items.push({ id, title: t.title, path, haystack });
      }
    }
  }
  for (const sec of VOCAB) {
    flatItems(sec).forEach((it, idx) => {
      items.push({
        id: `vocab/${sec.id}/${idx}`,
        title: it.term,
        path: `Vocabulary › ${sec.title}`,
        haystack: [it.term, it.ru, it.example].filter(Boolean).join(' ').toLowerCase(),
      });
    });
  }
  return items;
})();

let activeIdx = -1;

function runSearch(q) {
  const query = q.trim().toLowerCase();
  if (query.length < 2) { hideSearch(); return; }
  const hits = SEARCH_INDEX
    .map((it) => {
      let score = 0;
      if (it.title.toLowerCase().includes(query)) score += 10;
      if (it.haystack.includes(query)) score += 1;
      return { it, score };
    })
    .filter((r) => r.score > 0)
    .sort((x, y) => y.score - x.score)
    .slice(0, 12);

  activeIdx = -1;
  searchResults.hidden = false;
  searchResults.innerHTML = hits.length
    ? hits.map((r) => `<a href="#/${r.it.id.includes('/') ? r.it.id : `t/${r.it.id}`}"><div>${esc(r.it.title)}</div><div class="sr-path">${esc(r.it.path)}</div></a>`).join('')
    : '<div class="sr-empty">Ничего не найдено</div>';
}

function hideSearch() {
  searchResults.hidden = true;
  searchResults.innerHTML = '';
  activeIdx = -1;
}

searchInput.addEventListener('input', (e) => runSearch(e.target.value));
searchInput.addEventListener('keydown', (e) => {
  const links = [...searchResults.querySelectorAll('a')];
  if (e.key === 'Escape') { searchInput.value = ''; hideSearch(); searchInput.blur(); return; }
  if (!links.length) return;
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault();
    activeIdx = (activeIdx + (e.key === 'ArrowDown' ? 1 : links.length - 1)) % links.length;
    links.forEach((l, i) => l.classList.toggle('active', i === activeIdx));
    links[activeIdx].scrollIntoView({ block: 'nearest' });
  } else if (e.key === 'Enter') {
    e.preventDefault();
    (links[activeIdx] || links[0]).click();
  }
});
searchResults.addEventListener('click', (e) => {
  if (e.target.closest('a')) { searchInput.value = ''; hideSearch(); }
});
document.addEventListener('click', (e) => {
  if (!e.target.closest('.search-wrap')) hideSearch();
});
document.addEventListener('keydown', (e) => {
  const typing = ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName);
  if (e.key === '/' && !typing) { e.preventDefault(); searchInput.focus(); }
  if (e.key === 'Escape' && !typing && location.hash && location.hash !== '#/') history.back();
});

window.addEventListener('hashchange', route);
route();
