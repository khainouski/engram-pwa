import { GROUPS, TOPICS } from '../../data/grammar.js';
import { VOCAB } from '../../data/vocabulary.js';
import { store } from '../storage.js';
import { rowList } from '../ui.js';
import { icon } from '../icons.js';

// То, что разбирается на занятиях, — своим блоком и в своём порядке.
const LESSONS = ['useful-constructions', 'phrases', 'useful-grammar'];

// Разделы, которые ещё не переработаны: они собраны внизу, под своим заголовком.
const REWORK = ['verb-patterns', 'sentence-structure'];

const byId = (id) => GROUPS.find((g) => g.id === id);

const groupRow = (g) => ({
  href: `#/g/${g.id}`,
  icon: icon(g.id) || g.icon,
  title: g.title,
  sub: g.subtitle || '',
  meta: String(g.subgroups
    ? g.subgroups.reduce((n, s) => n + s.topics.length, 0)
    : (g.topics || []).length),
});

export async function renderHome(root) {
  const wordCount = String((await store.getWords()).length);
  const dueCount = (await store.dueWords()).length;
  const grammar = GROUPS.filter((g) => !REWORK.includes(g.id) && !LESSONS.includes(g.id)).map((g) => ({
    href: `#/g/${g.id}`,
    icon: icon(g.id) || g.icon,
    title: g.title,
    sub: g.subtitle || '',
    meta: String(g.subgroups
      ? g.subgroups.reduce((n, s) => n + s.topics.length, 0)
      : (g.topics || []).length),
  }));

  const lessons = LESSONS.map(byId).filter(Boolean).map(groupRow);

  const rework = [
    ...GROUPS.filter((g) => REWORK.includes(g.id)).map(groupRow),
    {
      href: '#/vocab',
      icon: icon('vocabulary'),
      title: 'Vocabulary & Expressions',
      sub: 'HAVE & GET, глаголы, выражения, фразовые глаголы',
      meta: String(VOCAB.length),
    },
  ];

  root.innerHTML = `
    <h1 class="page-title">Грамматика</h1>
    <p class="page-sub">Личный конспект и практика с AI.</p>
    <div class="list-label">Разделы</div>
    ${rowList(grammar)}
    <div class="list-label">Lessons with Ekaterina</div>
    ${rowList(lessons)}
    <div class="list-label">Мои слова</div>
    ${rowList([
      { href: '#/words', icon: icon('words'), title: 'Мои слова', sub: 'Свои слова с переводом и практикой', meta: wordCount },
      {
        href: '#/review',
        icon: icon('repeat'),
        title: 'Повторение',
        sub: dueCount ? 'Карточки по расписанию' : 'На сегодня всё повторено',
        meta: dueCount ? String(dueCount) : '',
      },
    ])}
    <div class="list-label">Needs rework</div>
    ${rowList(rework)}
    <p class="hint">${Object.keys(TOPICS).length} тем · поиск по <kbd>/</kbd></p>`;
}
