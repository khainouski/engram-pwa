import { GROUPS, TOPICS } from '../../data/grammar.js';
import { store } from '../storage.js';
import { rowList } from '../ui.js';
import { icon } from '../icons.js';

// То, что разбирается на занятиях, — своим блоком и в своём порядке.
const LESSONS = ['useful-constructions', 'phrases'];

// Глаголы — свой блок на главной: это не грамматика, а списки слов.
const VERBS = 'verbs';

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
  const grammar = GROUPS.filter((g) => ![...LESSONS, VERBS].includes(g.id)).map((g) => ({
    href: `#/g/${g.id}`,
    icon: icon(g.id) || g.icon,
    title: g.title,
    sub: g.subtitle || '',
    meta: String(g.subgroups
      ? g.subgroups.reduce((n, s) => n + s.topics.length, 0)
      : (g.topics || []).length),
  }));

  const lessons = LESSONS.map(byId).filter(Boolean).map(groupRow);

  // Страницы глаголов ведут прямо из главной: промежуточный список не нужен.
  const verbs = (byId(VERBS)?.topics || []).filter((id) => TOPICS[id]).map((id) => ({
    href: `#/t/${id}`,
    icon: icon(VERBS),
    title: TOPICS[id].title,
    sub: TOPICS[id].intro || '',
  }));


  root.innerHTML = `
    <h1 class="page-title">Знания уровня B2</h1>
    <p class="page-sub">Личный конспект, слова и практика с AI.</p>
    <div class="list-label">Grammar</div>
    ${rowList(grammar)}
    <div class="list-label">Words</div>
    ${rowList(verbs)}
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
