import { TOPICS, TOPIC_INDEX, findGroup, findSubgroup } from '../../data/grammar.js';
import { crumbs, topicCard } from '../ui.js';
import { mountPractice } from './practice.js';
import { mountLearn, learnableWords } from './learn.js';

export async function renderTopic(root, topicId) {
  const t = TOPICS[topicId];
  if (!t) { root.innerHTML = '<p class="empty">Тема не найдена. <a href="#/">На главную</a></p>'; return; }

  const loc = TOPIC_INDEX[topicId] || {};
  const g = loc.groupId ? findGroup(loc.groupId) : null;
  const s = loc.subId ? findSubgroup(loc.groupId, loc.subId) : null;

  const trail = [{ title: 'Главная', href: '#/' }];
  if (g) trail.push({ title: g.title, href: `#/g/${g.id}` });
  if (s) trail.push({ title: s.title, href: `#/s/${g.id}/${s.id}` });
  trail.push({ title: t.title });

  root.innerHTML = `
    ${crumbs(trail)}
    <div class="study-bar"><button class="btn small" id="hide-ru">Скрыть перевод</button></div>
    <div id="learn-slot"></div>

    ${topicCard(t, { id: topicId, heading: 'h1' })}

    <div id="practice-slot"></div>`;

  const hide = root.querySelector('#hide-ru');
  hide.addEventListener('click', () => {
    const on = root.classList.toggle('hide-ru');
    hide.textContent = on ? 'Показать перевод' : 'Скрыть перевод';
    hide.classList.toggle('primary', on);
  });

  mountLearn(root.querySelector('#learn-slot'), { topicId, topic: t });

  mountPractice(root.querySelector('#practice-slot'), { kind: 'topic', topicId });
}
