import { TOPICS, TOPIC_INDEX, findGroup, findSubgroup } from '../../data/grammar.js';
import { crumbs, esc, topicCard } from '../ui.js';
import { mountPractice } from './practice.js';

/*
 * Пары -ing / -ed: главное здесь — контраст «какая вещь» против «что я
 * чувствую», поэтому они стоят рядом в двух колонках, а группы собраны по
 * предлогу — он учится вместе со словом.
 */
function pairSections(pairs) {
  const groups = [];
  for (const p of pairs) {
    const last = groups[groups.length - 1];
    if (last && last.title === p.group) last.items.push(p);
    else groups.push({ title: p.group || '', items: [p] });
  }

  const line = (x, tag) => `
    <div class="pair-line">
      <span class="pair-tag">${tag}</span>
      <span class="ex-en">${esc(x.en)}</span>
      <span class="ex-ru">${esc(x.enRu)}</span>
    </div>`;

  return groups.map((g) => `
    <div class="section-title">${esc(g.title)}</div>
    <div class="pairs">
      ${g.items.map((p) => `
        <div class="pair-row">
          <div class="pair-head">
            <code>${esc(p.ing.word)}</code><code>${esc(p.ed.word)}</code>
            <span class="pair-ru">${esc(p.ing.ru)} / ${esc(p.ed.ru)}</span>
          </div>
          ${line(p.ing, 'вещь')}
          ${line(p.ed, 'я')}
          ${p.more?.length ? `
            <details class="pair-more">
              <summary>ещё ${p.more.length}</summary>
              ${p.more.map((x) => `
                <div class="pair-line">
                  <span class="ex-en">${esc(x.en)}</span>
                  <span class="ex-ru">${esc(x.ru)}</span>
                </div>`).join('')}
            </details>` : ''}
        </div>`).join('')}
    </div>`).join('');
}

/*
 * Схемы идут группами по смыслу («Точка во времени», «Срок», …): так
 * восемнадцать предлогов читаются как пять коротких списков, а не один
 * длинный. Группы нет — выводим всё одним блоком, как раньше.
 */
function patternSections(patterns) {
  const groups = [];
  for (const p of patterns) {
    const title = p.group || '';
    const last = groups[groups.length - 1];
    if (last && last.title === title) last.items.push(p);
    else groups.push({ title, items: [p] });
  }

  return groups.map((g) => `
    <div class="section-title">${esc(g.title || 'Схемы — каждая со своими примерами')}</div>
    <div class="patterns">
      ${g.items.map((p) => `
        <div class="pattern">
          <div class="pt-scheme"><code>${esc(p.scheme)}</code></div>
          <div class="pt-body">
            ${p.ru ? `<div class="pt-ru">${esc(p.ru)}</div>` : ''}
            ${p.ru ? '' : (p.name ? `<div class="pt-name">${esc(p.name)}</div>` : '')}
            <ul class="pt-examples">
              ${p.examples.map((x) => `
                <li><span class="ex-en">${esc(x.en)}</span>${x.ru ? `<span class="ex-ru">${esc(x.ru)}</span>` : ''}</li>`).join('')}
            </ul>
          </div>
        </div>`).join('')}
    </div>`).join('');
}

export async function renderTopic(root, topicId) {
  const t = TOPICS[topicId];
  if (!t) { root.innerHTML = '<p class="empty">Тема не найдена. <a href="#/">На главную</a></p>'; return; }

  const loc = TOPIC_INDEX[topicId] || {};
  const g = loc.groupId ? findGroup(loc.groupId) : null;
  const s = loc.subId ? findSubgroup(loc.groupId, loc.subId) : null;

  const trail = [{ title: 'Грамматика', href: '#/' }];
  if (g) trail.push({ title: g.title, href: `#/g/${g.id}` });
  if (s) trail.push({ title: s.title, href: `#/s/${g.id}/${s.id}` });
  trail.push({ title: t.title });

  // Схемы (Basic Structures, предлоги времени) живут своими блоками под карточкой.
  const asPatterns = Array.isArray(t.patterns);

  root.innerHTML = `
    ${crumbs(trail)}
    <div class="study-bar"><button class="btn small" id="hide-ru">Скрыть перевод</button></div>

    ${topicCard(t, { id: topicId, heading: 'h1' })}

    ${t.pairs ? pairSections(t.pairs) : ''}
    ${asPatterns ? patternSections(t.patterns) : ''}

    <div id="practice-slot"></div>`;

  const hide = root.querySelector('#hide-ru');
  hide.addEventListener('click', () => {
    const on = root.classList.toggle('hide-ru');
    hide.textContent = on ? 'Показать перевод' : 'Скрыть перевод';
    hide.classList.toggle('primary', on);
  });

  mountPractice(root.querySelector('#practice-slot'), { kind: 'topic', topicId });
}
