import { store, INTERVALS_DAYS } from '../storage.js';
import { crumbs, esc } from '../ui.js';
import { icon } from '../icons.js';

const CRUMB_ROOT = { title: 'Грамматика', href: '#/' };
const CRUMB_WORDS = { title: 'Мои слова', href: '#/words' };

const youglish = (text) =>
  `https://youglish.com/pronounce/${encodeURIComponent(text)}/english/us`;

/** "через 3 дня" is more useful here than a date. */
function nextIn(step) {
  const days = INTERVALS_DAYS[Math.min(step, INTERVALS_DAYS.length) - 1];
  if (!days) return '';
  const plural = days === 1 ? 'день' : days < 5 ? 'дня' : 'дней';
  return `следующий показ через ${days} ${plural}`;
}

export async function renderReview(root) {
  /** Today's queue, taken once: answers must not reshuffle it mid-session. */
  let queue = await store.dueWords();
  let done = 0;

  if (!queue.length) {
    const all = await store.getWords();
    root.innerHTML = `
      ${crumbs([CRUMB_ROOT, CRUMB_WORDS, { title: 'Повторение' }])}
      <h1 class="page-title">${icon('repeat', 'title-icon')}Повторение</h1>
      <p class="empty">${all.length
        ? 'На сегодня всё повторено. Возвращайся завтра.'
        : 'Сначала добавь слова — <a href="#/words">Мои слова</a>.'}</p>`;
    return;
  }

  root.innerHTML = `
    ${crumbs([CRUMB_ROOT, CRUMB_WORDS, { title: 'Повторение' }])}
    <h1 class="page-title">${icon('repeat', 'title-icon')}Повторение</h1>
    <p class="page-sub" id="rv-progress"></p>
    <div id="rv-card"></div>`;

  const progress = root.querySelector('#rv-progress');
  const card = root.querySelector('#rv-card');

  function drawCard(word) {
    // Counted live: a wrong answer puts the card back and makes the run longer.
    progress.textContent = `${done + 1} из ${done + queue.length}`;
    card.innerHTML = `
      <div class="rv-card">
        <div class="rv-word">${esc(word.text)}</div>
        <div class="rv-back" hidden>
          <div class="rv-translation">${esc(word.translation || 'без перевода')}</div>
          ${word.forms ? `<div class="word-forms">${esc(word.forms)}</div>` : ''}
          ${word.example ? `
            <div class="rv-example">
              <div class="rule-en">${esc(word.example)}</div>
              ${word.exampleRu ? `<div class="rule-ru">${esc(word.exampleRu)}</div>` : ''}
            </div>` : ''}
          <a class="pronounce" href="${youglish(word.text)}" target="_blank" rel="noreferrer">
            ${icon('sound')}Произношение
          </a>
        </div>
      </div>
      <div class="rv-actions">
        <button class="btn primary" id="rv-show">Показать перевод</button>
        <button class="btn" id="rv-again" hidden>Не знаю</button>
        <button class="btn primary" id="rv-known" hidden>Знаю</button>
      </div>
      <p class="hint" id="rv-hint"></p>`;

    const back = card.querySelector('.rv-back');
    const show = card.querySelector('#rv-show');
    const again = card.querySelector('#rv-again');
    const known = card.querySelector('#rv-known');
    const hint = card.querySelector('#rv-hint');

    const reveal = () => {
      back.hidden = false;
      show.hidden = true;
      again.hidden = false;
      known.hidden = false;
      hint.textContent = `Знаю — ${nextIn((word.step ?? 0) + 1)}. Не знаю — вернётся сегодня же.`;
    };

    show.addEventListener('click', reveal);
    again.addEventListener('click', () => answer(word, false));
    known.addEventListener('click', () => answer(word, true));
  }

  async function answer(word, known) {
    await store.reviewWord(word.text, known);
    // A word answered wrong is asked again at the end of the same session.
    if (!known) queue.push(word);
    done += 1;
    next();
  }

  function next() {
    queue = queue.slice(1);
    if (!queue.length) {
      progress.textContent = '';
      card.innerHTML = `
        <div class="rv-card rv-done">
          <div class="rv-word">Готово</div>
          <p class="muted">Повторено карточек: ${done}. Следующие подойдут по расписанию.</p>
          <div class="actions" style="justify-content:center">
            <a class="btn" href="#/words">К моим словам</a>
          </div>
        </div>`;
      return;
    }
    drawCard(queue[0]);
  }

  drawCard(queue[0]);
}
