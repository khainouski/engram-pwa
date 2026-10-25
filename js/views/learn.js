/**
 * Прогон списка слов карточками — прямо на странице, где этот список лежит.
 *
 * Отличие от «Моих слов»: там колода Лейтнера на месяцы, которую собираешь
 * сам. Здесь быстрый прогон готового списка: показали слово, вспомнил,
 * открыл, отметил. Отмеченное «знаю» запоминается для этой страницы, и
 * следующий подход начинается с невыученного.
 */
import { store } from '../storage.js';
import { esc, soundHref } from '../ui.js';

/** Порция за подход: триста карточек подряд не проходит никто. */
const BATCH = 20;

/** Слова страницы в одном виде, из какого бы блока они ни пришли. */
export function learnableWords(topic) {
  const out = [];
  for (const w of topic.words || []) {
    out.push({ en: w.en, ru: w.ru, ex: w.ex, exRu: w.exRu });
  }
  for (const v of topic.verbs || []) {
    const forms = [v.v1, v.v2, v.v3].join(' — ');
    const first = (v.ex || [])[0] || {};
    out.push({ en: forms, ru: v.ru, ex: first.en, exRu: first.ru, sound: v.v1 });
  }
  for (const c of topic.cards || []) {
    const first = (c.examples || [])[0] || {};
    // Одно и то же слово может стоять в двух группах (at во времени и в месте):
    // ключ прогресса — группа со словом, иначе «знаю» гасит сразу обе карточки.
    out.push({
      key: c.group ? `${c.group} · ${c.word}` : c.word,
      en: c.word,
      ru: `${c.ru} — ${(c.chips || []).join(' · ')}`,
      ex: first.en,
      exRu: first.ru,
    });
  }
  for (const p of topic.pairs || []) {
    out.push({
      en: `${p.ing.word} / ${p.ed.word}`,
      ru: `${p.ing.ru} / ${p.ed.ru}`,
      ex: p.ed.en,
      exRu: p.ed.enRu,
      sound: p.ing.word,
    });
  }
  return out;
}

const shuffle = (list) => {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/**
 * Кнопка «Учить» и сам режим карточек. Рисуется в слот на странице темы;
 * пока режим открыт, он занимает слот целиком, по «Готово» — сворачивается.
 */
export function mountLearn(slot, { topicId, topic }) {
  if (!slot) return;
  const all = learnableWords(topic);
  if (all.length < 4) return;

  let ruFirst = false;
  let queue = [];
  let learned = [];

  const button = () => {
    const left = all.length - learned.length;
    slot.innerHTML = `
      <div class="learn-bar">
        <button class="btn primary" id="learn-start">Учить</button>
        <span class="learn-progress">${learned.length
          ? `выучено ${learned.length} из ${all.length}`
          : `${all.length} слов на странице`}</span>
        ${learned.length ? '<button class="btn small" id="learn-reset">Сбросить</button>' : ''}
      </div>`;
    slot.querySelector('#learn-start').addEventListener('click', start);
    slot.querySelector('#learn-reset')?.addEventListener('click', async () => {
      await store.resetLearned(topicId);
      learned = [];
      button();
    });
  };

  async function start() {
    learned = await store.getLearned(topicId);
    const rest = all.filter((w) => !learned.includes(w.key || w.en));
    if (!rest.length) {
      await store.resetLearned(topicId);
      learned = [];
      queue = shuffle(all).slice(0, BATCH);
    } else {
      queue = shuffle(rest).slice(0, BATCH);
    }
    card(0, queue.length);
  }

  function card(done, total) {
    const item = queue[0];
    if (!item) return finish(total);

    const front = ruFirst ? item.ru : item.en;
    const back = ruFirst ? item.en : item.ru;
    const sound = item.sound || item.en;

    slot.innerHTML = `
      <div class="learn">
        <div class="learn-head">
          <span class="learn-count">${done + 1} / ${total}</span>
          <button class="btn small" id="learn-dir">${ruFirst ? 'RU → EN' : 'EN → RU'}</button>
          <button class="btn small" id="learn-stop">Готово</button>
        </div>
        <div class="learn-card" id="learn-card">
          <div class="learn-front">${esc(front)}</div>
          <div class="learn-back" hidden>
            <div class="learn-ru">${esc(back)}</div>
            ${item.ex ? `
              <div class="learn-ex">
                <span class="ex-en">${esc(item.ex)}</span>
                ${item.exRu ? `<span class="ex-ru">${esc(item.exRu)}</span>` : ''}
              </div>` : ''}
            <a class="learn-sound" href="${soundHref(sound)}" target="_blank" rel="noopener noreferrer">послушать</a>
          </div>
          <div class="learn-hint" id="learn-hint">нажми, чтобы проверить себя</div>
        </div>
        <div class="learn-actions" id="learn-actions" hidden>
          <button class="btn" id="learn-again">Ещё раз</button>
          <button class="btn primary" id="learn-known">Знаю</button>
        </div>
      </div>`;

    const reveal = () => {
      slot.querySelector('.learn-back').hidden = false;
      slot.querySelector('#learn-hint').hidden = true;
      slot.querySelector('#learn-actions').hidden = false;
    };
    slot.querySelector('#learn-card').addEventListener('click', reveal);

    slot.querySelector('#learn-dir').addEventListener('click', () => {
      ruFirst = !ruFirst;
      card(done, total);
    });
    slot.querySelector('#learn-stop').addEventListener('click', button);

    slot.querySelector('#learn-again').addEventListener('click', () => {
      // В конец очереди: карточка вернётся в этом же подходе.
      queue = [...queue.slice(1), item];
      card(done, total);
    });

    slot.querySelector('#learn-known').addEventListener('click', async () => {
      learned = await store.markLearned(topicId, item.key || item.en);
      queue = queue.slice(1);
      card(done + 1, total);
    });
  }

  function finish(total) {
    slot.innerHTML = `
      <div class="learn learn-done">
        <div class="learn-front">Подход пройден</div>
        <p class="learn-ru">${total} карточек. Выучено ${learned.length} из ${all.length}.</p>
        <div class="learn-actions">
          <button class="btn" id="learn-again-batch">Ещё подход</button>
          <button class="btn primary" id="learn-close">Готово</button>
        </div>
      </div>`;
    slot.querySelector('#learn-again-batch').addEventListener('click', start);
    slot.querySelector('#learn-close').addEventListener('click', button);
  }

  button();
}
