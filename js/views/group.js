import { findGroup, findSubgroup, TOPICS } from '../../data/grammar.js';
import { callGemini, NoKeyError } from '../gemini.js';
import * as P from '../prompts.js';
import { crumbs, errorBox, esc, loading, rowList, summaryTable } from '../ui.js';
import { mountPractice } from './practice.js';
import { icon } from '../icons.js';

const storyHtml = (paragraphs) => paragraphs.map((t) => `<p>${esc(t)}</p>`).join('');

/**
 * The written story is the default; the button asks the model for another one
 * on the same forms. Nothing is stored — reopening the page shows the original.
 */
function mountStory(root, { title, topicIds, sample }) {
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
      box.innerHTML = storyHtml(data.paragraphs || []);
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

function topicRows(ids) {
  return rowList(ids.filter((id) => TOPICS[id]).map((id) => ({
    href: `#/t/${id}`,
    title: TOPICS[id].title,
    sub: TOPICS[id].formula,
  })));
}

export async function renderGroup(root, groupId) {
  const g = findGroup(groupId);
  if (!g) { root.innerHTML = '<p class="empty">Группа не найдена. <a href="#/">На главную</a></p>'; return; }

  const body = g.subgroups
    ? rowList(g.subgroups.map((s) => ({
        href: `#/s/${g.id}/${s.id}`,
        title: s.title,
        sub: s.topics.map((id) => (TOPICS[id] ? TOPICS[id].title : id)).join(' · '),
        meta: String(s.topics.length),
      })))
    : topicRows(g.topics || []);

  root.innerHTML = `
    ${crumbs([{ title: 'Грамматика', href: '#/' }, { title: g.title }])}
    <h1 class="page-title">${icon(g.id, 'title-icon')}${esc(g.title)}</h1>
    <p class="page-sub">${esc(g.subtitle || '')}</p>
    ${g.intro ? `
      <div class="notes">
        <div><b>Used for:</b> ${esc(g.intro.use)}</div>
        ${g.intro.useRu ? `<div class="rule-ru">${esc(g.intro.useRu)}</div>` : ''}
        <div style="margin-top:10px"><b>Formula:</b> <code>${esc(g.intro.formula)}</code></div>
        ${g.intro.formulaRu ? `<div class="rule-ru">${esc(g.intro.formulaRu)}</div>` : ''}
      </div>` : ''}
    ${body}
    ${g.table ? `<div class="section-title">Summary Table</div>${summaryTable(g.table)}` : ''}
    <div id="practice-slot"></div>`;

  if (g.mix) {
    mountPractice(root.querySelector('#practice-slot'), {
      kind: 'mix', title: g.title, mixLabel: g.mix, topicIds: g.topics || [],
    });
  }
}

export async function renderSubgroup(root, groupId, subId) {
  const g = findGroup(groupId);
  const s = findSubgroup(groupId, subId);
  if (!g || !s) { root.innerHTML = '<p class="empty">Раздел не найден. <a href="#/">На главную</a></p>'; return; }

  root.innerHTML = `
    ${crumbs([{ title: 'Грамматика', href: '#/' }, { title: g.title, href: `#/g/${g.id}` }, { title: s.title }])}
    <h1 class="page-title">${esc(s.title)}</h1>
    <p class="page-sub">${s.topics.length} конструкции из конспекта</p>
    ${topicRows(s.topics)}
    ${s.table ? `<div class="section-title">Summary Table</div>${summaryTable(s.table)}` : ''}
    ${s.story ? `
      <div class="section-title story-title">
        ${esc(s.story.title)}
        <span class="story-actions">
          <button id="story-back" class="btn small" hidden>Исходная</button>
          <button id="story-new" class="btn small">Новый вариант</button>
        </span>
      </div>
      <div class="story" id="story-box">${storyHtml(s.story.text.split('\n'))}</div>` : ''}
    <div id="practice-slot"></div>`;

  if (s.story) {
    mountStory(root, { title: s.title, topicIds: s.topics, sample: s.story.text });
  }

  if (s.mix) {
    mountPractice(root.querySelector('#practice-slot'), {
      kind: 'mix', title: s.title, mixLabel: s.mix, topicIds: s.topics,
    });
  }
}
