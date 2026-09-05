import { GROUPS, TOPICS } from '../data/grammar.js';
import { VOCAB, flatItems } from '../data/vocabulary.js';
import { renderHome } from './views/home.js';
import { renderGroup, renderSubgroup } from './views/group.js';
import { renderTopic } from './views/topic.js';
import { renderVocabulary } from './views/vocabulary.js';
import { renderWords } from './views/words.js';
import { renderReview } from './views/review.js';
import { renderSettings } from './views/settings.js';
import { store } from './storage.js';
import { esc } from './ui.js';
import { icon } from './icons.js';

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
      case 'review': await renderReview(app); break;
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
const topbar = document.querySelector('.topbar');
const searchWrap = document.querySelector('.search-wrap');
const searchInput = document.getElementById('search');
const searchResults = document.getElementById('search-results');
const searchToggle = document.getElementById('search-toggle');

searchToggle.innerHTML = icon('search');

/** The field is revealed by the magnifier and covers the bar while open. */
function openSearch() {
  searchWrap.hidden = false;
  topbar.classList.add('searching');
  searchToggle.setAttribute('aria-expanded', 'true');
  searchInput.focus();
}

function closeSearch() {
  hideSearch();
  searchInput.value = '';
  searchWrap.hidden = true;
  topbar.classList.remove('searching');
  searchToggle.setAttribute('aria-expanded', 'false');
}

const searchOpen = () => !searchWrap.hidden;

const STATIC_INDEX = (() => {
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

/** Saved words are searchable too, so the index is rebuilt as they change. */
let SEARCH_INDEX = STATIC_INDEX;

async function refreshWordIndex() {
  const words = await store.getWords();
  SEARCH_INDEX = [
    ...STATIC_INDEX,
    ...words.map((w) => ({
      id: `words/${encodeURIComponent(w.text)}`,
      title: w.text,
      path: 'Мои слова',
      haystack: [w.text, w.translation, w.example].filter(Boolean).join(' ').toLowerCase(),
    })),
  ];
}

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

searchToggle.addEventListener('click', () => (searchOpen() ? closeSearch() : openSearch()));
document.getElementById('search-close').addEventListener('click', closeSearch);

searchInput.addEventListener('input', (e) => runSearch(e.target.value));
searchInput.addEventListener('keydown', (e) => {
  const links = [...searchResults.querySelectorAll('a')];
  if (e.key === 'Escape') { closeSearch(); searchInput.blur(); return; }
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
  if (e.target.closest('a')) closeSearch();
});
document.addEventListener('click', (e) => {
  if (searchOpen() && !e.target.closest('.search-wrap') && !e.target.closest('#search-toggle')) {
    closeSearch();
  }
});
document.addEventListener('keydown', (e) => {
  const typing = ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName);
  if (e.key === '/' && !typing) { e.preventDefault(); openSearch(); }
  if (e.key === 'Escape' && !typing && location.hash && location.hash !== '#/') history.back();
});

window.addEventListener('hashchange', async () => {
  await route();
  refreshWordIndex();
});

route().then(refreshWordIndex);
