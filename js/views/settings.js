import { store, MODELS } from '../storage.js';
import { testKey } from '../gemini.js';
import { crumbs, esc, toast } from '../ui.js';
import { icon } from '../icons.js';
import { canOfferInstall, startInstall, INSTALLABLE_EVENT } from '../install.js';
import { FILE_NAME, fromMarkdown, toMarkdown } from '../markdown.js';

const KEY_URL = 'https://aistudio.google.com/apikey';

const KEY_STEPS = [
  `Открой <a href="${KEY_URL}" target="_blank" rel="noreferrer">Google AI Studio</a> и войди в Google-аккаунт.`,
  'Нажми «Create API key» и выбери проект (или создай новый — название любое).',
  'Скопируй ключ: он начинается с <code>AIza</code>.',
  'Вставь его в поле выше и нажми «Сохранить», затем «Проверить ключ».',
];

/** Open by default while there is no key: without one the app cannot do anything. */
const keyHelp = (hasKey) => `
  <details class="help"${hasKey ? '' : ' open'}>
    <summary>Где взять ключ</summary>
    <ol class="help-steps">${KEY_STEPS.map((t) => `<li>${t}</li>`).join('')}</ol>
    <p class="muted">Ключ бесплатный: у Gemini есть уровень без оплаты, лимитов хватает для личных занятий.</p>
  </details>`;

const option = ({ id, label }, selected) =>
  `<option value="${esc(id)}"${selected ? ' selected' : ''}>${esc(label ? `${id} — ${label}` : id)}</option>`;

export async function renderSettings(root) {
  const key = await store.getApiKey();
  const model = await store.getModel();
  const words = await store.getWords();

  const installBlock = canOfferInstall() ? `
    <div class="result-card stack" style="margin-top:16px">
      <div>
        <div style="font-weight:550">Установить приложение</div>
        <p class="muted" style="font-size:13.5px;margin:6px 0 0">
          Иконка на экране «Домой», запуск без адресной строки, работа офлайн.
        </p>
      </div>
      <div class="actions"><button id="install" class="btn primary">Установить</button></div>
    </div>` : '';

  root.innerHTML = `
    ${crumbs([{ title: 'Грамматика', href: '#/' }, { title: 'Settings' }])}
    <h1 class="page-title">${icon('settings', 'title-icon')}Settings</h1>
    <p class="page-sub">Ключ и слова хранятся только в этом браузере и никуда не отправляются, кроме Google Gemini.</p>

    <div class="result-card stack">
      <div>
        <label for="key" style="display:block;margin-bottom:6px;font-weight:550">API-ключ</label>
        <input id="key" class="input" type="password" placeholder="AIza…" value="${esc(key)}"
               autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false">
        ${keyHelp(!!key)}
      </div>

      <div>
        <label for="model" style="display:block;margin-bottom:6px;font-weight:550">Модель</label>
        <select id="model" class="input">
          ${MODELS.map((m) => option(m, m.id === model)).join('')}
        </select>
      </div>

      <div class="actions">
        <button id="save" class="btn primary">Сохранить</button>
        <button id="test" class="btn">Проверить ключ</button>
        <span id="status" class="muted"></span>
      </div>
    </div>

    <div class="result-card stack" style="margin-top:16px">
      <div>
        <div style="font-weight:550">Мои слова</div>
        <p class="muted" style="font-size:13.5px;margin:6px 0 0">
          Сохранено слов: ${words.length}. Экспорт — Markdown-список, его можно
          править руками и вернуть обратно.
        </p>
      </div>
      <div class="actions">
        <button id="export" class="btn">Экспорт в файл</button>
        <button id="import" class="btn">Импорт из файла</button>
        <input id="import-file" type="file" accept="text/markdown,.md,.markdown,.txt" hidden>
      </div>
    </div>

    ${installBlock}`;

  const install = root.querySelector('#install');
  if (install) install.addEventListener('click', startInstall);
  else window.addEventListener(INSTALLABLE_EVENT, () => renderSettings(root), { once: true });

  const input = root.querySelector('#key');
  const select = root.querySelector('#model');
  const status = root.querySelector('#status');

  const save = async () => {
    await store.setApiKey(input.value);
    await store.setModel(select.value);
  };

  root.querySelector('#save').addEventListener('click', async () => {
    await save();
    status.textContent = '✓ Сохранено';
    status.style.color = 'var(--good)';
  });

  root.querySelector('#test').addEventListener('click', async () => {
    await save();
    status.innerHTML = '<span class="spinner"></span> проверяю…';
    status.style.color = '';
    try {
      await testKey();
      status.textContent = '✓ Ключ и модель работают';
      status.style.color = 'var(--good)';
    } catch (e) {
      status.textContent = '✗ ' + e.message;
      status.style.color = 'var(--bad)';
    }
  });

  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') root.querySelector('#save').click(); });

  root.querySelector('#export').addEventListener('click', async () => {
    const list = await store.getWords();
    if (!list.length) { toast('Пока нечего экспортировать.'); return; }

    const url = URL.createObjectURL(new Blob([toMarkdown(list)], { type: 'text/markdown' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = FILE_NAME;
    a.click();
    // Revoked on the next tick: the browser needs the URL while the save starts.
    setTimeout(() => URL.revokeObjectURL(url), 0);
  });

  const file = root.querySelector('#import-file');
  root.querySelector('#import').addEventListener('click', () => file.click());
  file.addEventListener('change', async () => {
    const f = file.files?.[0];
    if (!f) return;
    try {
      const incoming = fromMarkdown(await f.text());
      if (!incoming.length) { toast('В файле не нашлось слов.'); file.value = ''; return; }

      const known = new Set((await store.getWords()).map((w) => w.text.toLowerCase()));
      const added = incoming.filter((w) => !known.has(w.text.toLowerCase())).length;
      await store.importWords(incoming);
      toast(`Импортировано ${incoming.length}: новых ${added}, уже было ${incoming.length - added}`);
      renderSettings(root);
    } catch (e) {
      toast('Не удалось прочитать файл: ' + e.message);
    }
    file.value = '';
  });
}
