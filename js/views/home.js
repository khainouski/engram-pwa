import { GROUPS, TOPICS } from '../../data/grammar.js';
import { store } from '../storage.js';
import { rowList } from '../ui.js';
import { icon } from '../icons.js';
import { learnableWords } from './learn.js';

// То, что разбирается на занятиях, — своим блоком и в своём порядке.
const LESSONS = ['useful-constructions', 'phrases'];

// Списки, которые учат карточками: это не грамматика, поэтому свой блок.
const VOCAB = ['verbs', 'speech-phrases'];

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
  const grammar = GROUPS.filter((g) => ![...LESSONS, ...VOCAB].includes(g.id)).map((g) => ({
    href: `#/g/${g.id}`,
    icon: icon(g.id) || g.icon,
    title: g.title,
    sub: g.subtitle || '',
    meta: String(g.subgroups
      ? g.subgroups.reduce((n, s) => n + s.topics.length, 0)
      : (g.topics || []).length),
  }));

  const lessons = LESSONS.map(byId).filter(Boolean).map(groupRow);

  // Справа у строки — сколько карточек внутри раздела, а не сколько страниц.
  const vocab = VOCAB.map(byId).filter(Boolean).map((g) => ({
    href: `#/g/${g.id}`,
    icon: icon(g.id) || g.icon,
    title: g.title,
    sub: g.subtitle || '',
    meta: String((g.topics || [])
      .filter((id) => TOPICS[id])
      .reduce((n, id) => n + learnableWords(TOPICS[id]).length, 0)),
  }));


  root.innerHTML = `
    <h1 class="page-title">Знания уровня B2</h1>
    <p class="page-sub">Личный конспект, слова и практика с AI.</p>
    <div class="list-label">Grammar</div>
    ${rowList(grammar)}
    <div class="list-label">Words</div>
    ${rowList(vocab)}
    <div class="list-label">Lessons with Ekaterina</div>
    ${rowList(lessons)}
    <div class="list-label">My Words</div>
    ${rowList([
      { href: '#/words', icon: icon('words'), title: 'My Words', sub: 'Свои слова с переводом и практикой', meta: wordCount },
      {
        href: '#/review',
        icon: icon('repeat'),
        title: 'Review',
        sub: dueCount ? 'Карточки по расписанию' : 'На сегодня всё повторено',
        meta: dueCount ? String(dueCount) : '',
      },
    ])}
    <p class="hint">${Object.keys(TOPICS).length} тем · поиск по <kbd>/</kbd></p>`;
}
