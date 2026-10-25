import { findGroup, findSubgroup, TOPICS } from '../../data/grammar.js';
import { callGemini, NoKeyError } from '../gemini.js';
import * as P from '../prompts.js';
import {
  crumbs, errorBox, esc, loading, markPattern, patternOf, plural, rowList, summaryTable,
  topicCard,
} from '../ui.js';
import { mountPractice } from './practice.js';
import { mountLearn, learnableWords } from './learn.js';
import { icon } from '../icons.js';

/*
 * В истории подсвечиваем сами конструкции: на развёрнутой странице это замена
 * русским подсказкам в скобках — видно, какая форма где стоит.
 */
const storyHtml = (paragraphs, pattern) => paragraphs
  .map((t) => `<p>${pattern ? markPattern(t, pattern) : esc(t)}</p>`).join('');

/** Один набор слов на все формы раздела: am/is/are, have/has, been и -ing. */
function mergedPattern(ids) {
  const words = new Set();
  let ing = false;
  for (const id of ids) {
    if (!TOPICS[id]) continue;
    const p = patternOf(TOPICS[id].formula);
    for (const w of p.words) words.add(w);
    ing = ing || p.ing;
  }
  return { words: [...words], ing };
}

/**
 * The written story is the default; the button asks the model for another one
 * on the same forms. Nothing is stored — reopening the page shows the original.
 */
function mountStory(root, { title, topicIds, sample, pattern }) {
  const box = root.querySelector('#story-box');
  const button = root.querySelector('#story-new');
  const back = root.querySelector('#story-back');
  const original = box.innerHTML;

  back.addEventListener('click', () => {
    box.innerHTML = original;
    back.hidden = true;
  });

  button.addEventListener('click', async () => {
    button.disabled = true;
    box.innerHTML = `<p>${loading('Пишу новую историю…')}</p>`;
    try {
      const data = await callGemini(
        P.storyPrompt({ title, topicIds, sample }),
        P.storySchema,
        { temperature: 1 },
      );
      box.innerHTML = storyHtml(data.paragraphs || [], pattern);
      back.hidden = false;
    } catch (err) {
      box.innerHTML = original;
      box.insertAdjacentHTML('beforeend', err instanceof NoKeyError
        ? errorBox('Для новой истории нужен API-ключ.', true)
        : errorBox(err.message));
    }
    button.disabled = false;
  });
}

function storySection(story, pattern) {
  if (!story) return '';
  return `
    <div class="section-title story-title">
      ${esc(story.title)}
      <span class="story-actions">
        <button id="story-back" class="btn small" hidden>Исходная</button>
        <button id="story-new" class="btn small">Новый вариант</button>
      </span>
    </div>
    <div class="story" id="story-box">${storyHtml(story.text.split('\n'), pattern)}</div>`;
}

/*
 * Раздел с expand: темы не ссылками, а целиком на одной странице — та же
 * карточка, что на странице темы, заголовок ведёт на неё же. expand: 'brief'
 * прячет ещё и detail: там, где он пересказывает правило, на общей странице
 * это читается как повтор.
 */
function topicCards(ids, brief) {
  const list = ids.filter((id) => TOPICS[id]);
  // Раздел из одной темы: её имя — это и есть заголовок страницы, второй раз не нужен.
  const bare = list.length === 1;
  return list.map((id) => {
    const card = topicCard(TOPICS[id], { id, link: !bare, brief, bare });
    // Список слов можно прогнать карточками прямо здесь, не заходя в тему.
    const learn = learnableWords(TOPICS[id]).length >= 4
      ? `<div class="learn-slot" data-learn="${id}"></div>`
      : '';
    return card + learn;
  }).join('');
}

/** Режим карточек у каждой темы со словами на развёрнутой странице. */
function mountLearnSlots(root) {
  for (const slot of root.querySelectorAll('.learn-slot[data-learn]')) {
    const id = slot.dataset.learn;
    mountLearn(slot, { topicId: id, topic: TOPICS[id] });
  }
}

function topicRows(ids) {
  return rowList(ids.filter((id) => TOPICS[id]).map((id) => ({
    href: `#/t/${id}`,
    title: TOPICS[id].title,
    sub: TOPICS[id].formula,
  })));
}

/*
 * На развёрнутой странице панель практики одна на всех: кнопки сверху
 * переключают тему, панель пересобирается под выбранную.
 */
/*
 * Имя на кнопке: без перевода в скобках и без хвоста после «/» или «and» —
 * «Politeness and Hypothetical Situations» в кнопку всё равно не влезает.
 */
const shortTitle = (t) => String(t)
  .replace(/\s*\(.*\)\s*$/, '')
  .split(/\s+\/\s+|\s+and\s+/)[0]
  .trim();

/*
 * Если все имена кончаются одним и тем же словом («… Passive»), на кнопках
 * оно только занимает место — общий хвост снимаем, пока имена не станут
 * различимы сами по себе.
 */
function tabLabels(ids) {
  const labels = ids.map((id) => shortTitle(TOPICS[id].title));
  for (;;) {
    const tails = labels.map((l) => l.split(' ').pop());
    const common = tails[0];
    if (labels.length < 2 || !tails.every((t) => t === common)) break;
    if (labels.some((l) => l.split(' ').length < 3)) break;
    for (let i = 0; i < labels.length; i += 1) {
      labels[i] = labels[i].split(' ').slice(0, -1).join(' ');
    }
  }
  return labels;
}

function topicPracticeBlock(ids, hasMix) {
  const list = ids.filter((id) => TOPICS[id]);
  if (!list.length) return '';
  const labels = tabLabels(list);
  return `
    <div class="section-title">Практика с AI</div>
    ${hasMix ? '<p class="page-sub tp-hint">Без выбора — все конструкции сразу.</p>' : ''}
    <div class="tp-switch" id="tp-switch">
      ${list.map((id, i) => `
        <button class="btn small" data-topic="${id}">${esc(labels[i])}</button>`).join('')}
    </div>
    <div class="tp-now" id="tp-now"></div>
    <div id="tp-slot"></div>`;
}

/*
 * Ничего не выбрано — практика идёт по всем конструкциям сразу; это состояние
 * по умолчанию. Повторное нажатие активной темы снимает выбор и возвращает его.
 */
function mountTopicPractice(root, ids, mixCtx) {
  const slot = root.querySelector('#tp-slot');
  const bar = root.querySelector('#tp-switch');
  if (!slot || !bar) return;

  const first = ids.find((id) => TOPICS[id]);
  let current = null;

  // Подпись отделяет кнопки выбора темы от самой панели и говорит, что выбрано.
  const now = root.querySelector('#tp-now');

  const show = (key) => {
    current = key;
    for (const b of bar.querySelectorAll('button')) b.classList.toggle('primary', b.dataset.topic === key);
    if (now) now.textContent = key && TOPICS[key]
      ? `Тренируем: ${TOPICS[key].title}`
      : 'Тренируем: все конструкции раздела';
    mountPractice(slot, key ? { kind: 'topic', topicId: key } : mixCtx);
  };

  bar.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-topic]');
    if (!b) return;
    const next = b.dataset.topic === current ? null : b.dataset.topic;
    show(mixCtx ? next : next || current);
  });

  show(mixCtx ? null : first);
}

export async function renderGroup(root, groupId) {
  const g = findGroup(groupId);
  if (!g) { root.innerHTML = '<p class="empty">Группа не найдена. <a href="#/">На главную</a></p>'; return; }

  const expand = !g.subgroups && g.expand;
  const pattern = expand ? mergedPattern(g.topics || []) : null;

  const body = g.subgroups
    ? rowList(g.subgroups.map((s) => ({
        href: `#/s/${g.id}/${s.id}`,
        title: s.title,
        sub: s.topics.map((id) => (TOPICS[id] ? TOPICS[id].title : id)).join(' · '),
        meta: String(s.topics.length),
      })))
    : (expand ? topicCards(g.topics || [], g.expand === 'brief') : topicRows(g.topics || []));

  root.innerHTML = `
    ${crumbs([{ title: 'Грамматика', href: '#/' }, { title: g.title }])}
    <h1 class="page-title">${icon(g.id, 'title-icon')}${esc(g.title)}</h1>
    ${g.subtitle ? `<p class="page-sub">${esc(g.subtitle)}</p>` : ''}
    ${body}
    ${g.table && !expand ? `<div class="section-title">Summary Table</div>${summaryTable(g.table)}` : ''}
    ${g.subgroups ? '' : storySection(g.story, pattern)}
    ${expand ? topicPracticeBlock(g.topics || [], !!g.mix) : ''}
    <div id="practice-slot"></div>`;

  const gMix = g.mix
    ? { kind: 'mix', title: g.title, mixLabel: g.mix, topicIds: g.topics || [] }
    : null;

  mountLearnSlots(root);

  if (expand) mountTopicPractice(root, g.topics || [], gMix);

  // A group without subgroups is its own subgroup page: same table, story and mix.
  if (g.story && !g.subgroups) {
    mountStory(root, { title: g.title, topicIds: g.topics || [], sample: g.story.text, pattern });
  }

  // На развёрнутой странице mix живёт вкладкой «Все», отдельная секция не нужна.
  if (gMix && !expand) mountPractice(root.querySelector('#practice-slot'), gMix);
}

export async function renderSubgroup(root, groupId, subId) {
  const g = findGroup(groupId);
  const s = findSubgroup(groupId, subId);
  if (!g || !s) { root.innerHTML = '<p class="empty">Раздел не найден. <a href="#/">На главную</a></p>'; return; }

  const pattern = s.expand ? mergedPattern(s.topics) : null;

  root.innerHTML = `
    ${crumbs([{ title: 'Грамматика', href: '#/' }, { title: g.title, href: `#/g/${g.id}` }, { title: s.title }])}
    <h1 class="page-title">${esc(s.title)}</h1>
    <p class="page-sub">${s.topics.length} ${plural(s.topics.length, 'конструкция', 'конструкции', 'конструкций')} из конспекта</p>
    ${s.expand ? topicCards(s.topics, s.expand === 'brief') : topicRows(s.topics)}
    ${s.table && !s.expand ? `<div class="section-title">Summary Table</div>${summaryTable(s.table)}` : ''}
    ${storySection(s.story, pattern)}
    ${s.expand ? topicPracticeBlock(s.topics, !!s.mix) : ''}
    <div id="practice-slot"></div>`;

  const sMix = s.mix
    ? { kind: 'mix', title: s.title, mixLabel: s.mix, topicIds: s.topics }
    : null;

  mountLearnSlots(root);

  if (s.expand) mountTopicPractice(root, s.topics, sMix);

  if (s.story) {
    mountStory(root, { title: s.title, topicIds: s.topics, sample: s.story.text, pattern });
  }

  if (sMix && !s.expand) mountPractice(root.querySelector('#practice-slot'), sMix);
}
