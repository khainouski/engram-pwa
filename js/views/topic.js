import { TOPICS, TOPIC_INDEX, findGroup, findSubgroup } from '../../data/grammar.js';
import { crumbs, esc, formulaSchema, markPattern, patternOf } from '../ui.js';
import { mountPractice } from './practice.js';

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

  const pattern = patternOf(t.formula);

  // Topics like Basic Sentence Structures are a set of patterns, not one
  // construction: each pattern carries its own examples, so they render together.
  const asPatterns = Array.isArray(t.patterns);

  root.innerHTML = `
    ${crumbs(trail)}

    <section class="rule-card">
      <div class="rc-head">
        <h1 class="rc-title">${esc(t.title)}</h1>
        ${asPatterns ? `<p class="rc-intro">${esc(t.intro || '')}</p>` : formulaSchema(t.formula)}
      </div>
      ${asPatterns && !(t.notes || []).length ? '' : `
        <div class="rc-body">
          ${(t.use || []).map((u) => `
            <div class="rule">
              ${u.ru ? `<div class="rule-ru">${esc(u.ru)}</div>` : ''}
              <div class="rule-en">${esc(u.en)}</div>
              ${u.ex ? `<div class="rule-ex">${markPattern(u.ex, pattern)}</div>` : ''}
            </div>`).join('')}
          ${(t.notes || []).map((n) => `
            <div class="note">
              ${n.ru ? `<div class="rule-ru">${esc(n.ru)}</div>` : ''}
              <div class="rule-en">${esc(n.en)}</div>
            </div>`).join('')}
          ${t.detail ? `<p class="rc-detail">${esc(t.detail)}</p>` : ''}
          ${t.markers?.length ? `
            <div class="markers">
              <span class="markers-label">Маркеры</span>
              ${t.markers.map((w) => `<span class="marker">${esc(w)}</span>`).join('')}
            </div>` : ''}
        </div>`}
    </section>

    ${asPatterns ? `
      <div class="section-title">Схемы — каждая со своими примерами</div>
      <div class="patterns">
        ${t.patterns.map((p) => `
          <div class="pattern">
            <div class="pt-scheme"><code>${esc(p.scheme)}</code></div>
            <div class="pt-body">
              ${p.ru ? `<div class="pt-ru">${esc(p.ru)}</div>` : ''}
              ${p.name ? `<div class="pt-name">${esc(p.name)}</div>` : ''}
              <ul class="pt-examples">
                ${p.examples.map((x) => `
                  <li><span class="ex-en">${esc(x.en)}</span>${x.ru ? `<span class="ex-ru">${esc(x.ru)}</span>` : ''}</li>`).join('')}
              </ul>
            </div>
          </div>`).join('')}
      </div>` : `
      <div class="section-title">Examples — примеры из конспекта</div>
      <ul class="examples">
        ${(t.examples || []).map((x) => `
          <li>
            <span class="ex-en">${markPattern(x.en, pattern)}</span>
            ${x.ru ? `<span class="ex-ru">${esc(x.ru)}</span>` : ''}
          </li>`).join('')}
      </ul>`}

    <div id="practice-slot"></div>`;

  mountPractice(root.querySelector('#practice-slot'), { kind: 'topic', topicId });
}
