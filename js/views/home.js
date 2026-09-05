import { GROUPS, TOPICS } from '../../data/grammar.js';
import { VOCAB } from '../../data/vocabulary.js';
import { store } from '../storage.js';
import { rowList } from '../ui.js';
import { icon } from '../icons.js';

export async function renderHome(root) {
  const wordCount = String((await store.getWords()).length);
  const grammar = GROUPS.map((g) => ({
    href: `#/g/${g.id}`,
    icon: icon(g.id) || g.icon,
    title: g.title,
    sub: g.subtitle || '',
    meta: String(g.subgroups
      ? g.subgroups.reduce((n, s) => n + s.topics.length, 0)
      : (g.topics || []).length),
  }));

  const vocab = [{
    href: '#/vocab',
    icon: icon('vocabulary'),
    title: 'Vocabulary & Expressions',
    sub: 'HAVE & GET, глаголы, выражения, фразовые глаголы',
    meta: String(VOCAB.length),
  }];

  root.innerHTML = `
    <h1 class="page-title">Грамматика</h1>
    <p class="page-sub">Личный конспект и практика с AI.</p>
    <div class="list-label">Разделы</div>
    ${rowList(grammar)}
    <div class="list-label">Словарь</div>
    ${rowList(vocab)}
    <div class="list-label">Мои слова</div>
    ${rowList([{ href: '#/words', icon: icon('words'), title: 'Мои слова', sub: 'Свои слова с переводом и практикой', meta: wordCount }])}
    <p class="hint">${Object.keys(TOPICS).length} тем · поиск по <kbd>/</kbd></p>`;
}
