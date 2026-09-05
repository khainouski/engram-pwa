import { findGroup, findSubgroup, TOPICS } from '../../data/grammar.js';
import { crumbs, esc, rowList, summaryTable } from '../ui.js';
import { mountPractice } from './practice.js';
import { icon } from '../icons.js';

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
      <div class="section-title">${esc(s.story.title)}</div>
      <div class="story">${s.story.text.split('\n').map((p) => `<p>${esc(p)}</p>`).join('')}</div>` : ''}
    <div id="practice-slot"></div>`;

  if (s.mix) {
    mountPractice(root.querySelector('#practice-slot'), {
      kind: 'mix', title: s.title, mixLabel: s.mix, topicIds: s.topics,
    });
  }
}
