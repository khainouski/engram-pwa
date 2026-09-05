import { store, MODELS } from '../storage.js';
import { testKey } from '../gemini.js';
import { crumbs, esc, toast } from '../ui.js';
import { icon } from '../icons.js';
import { canOfferInstall, startInstall, INSTALLABLE_EVENT } from '../install.js';

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
      <div class="row"><button id="install" class="btn primary">Установить</button></div>
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
        <p class="muted" style="font-size:13.5px;margin:8px 0 0">
          <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" style="text-decoration:underline">Получить ключ</a>
        </p>
      </div>

      <div>
        <label for="model" style="display:block;margin-bottom:6px;font-weight:550">Модель</label>
        <select id="model" class="input">
          ${MODELS.map((m) => option(m, m.id === model)).join('')}
        </select>
      </div>

      <div class="row">
        <button id="save" class="btn primary">Сохранить</button>
        <button id="test" class="btn">Проверить ключ</button>
        <span id="status" class="muted"></span>
      </div>
    </div>

    <div class="result-card stack" style="margin-top:16px">
      <div>
        <div style="font-weight:550">Мои слова</div>
        <p class="muted" style="font-size:13.5px;margin:6px 0 0">
          Сохранено слов: ${words.length}. Перенос на другое устройство — через файл.
        </p>
      </div>
      <div class="row">
        <button id="export" class="btn">Экспорт в файл</button>
        <button id="import" class="btn">Импорт из файла</button>
        <input id="import-file" type="file" accept="application/json,.json" hidden>
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
    const data = await store.exportAll();
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `engram-words-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  const file = root.querySelector('#import-file');
  root.querySelector('#import').addEventListener('click', () => file.click());
  file.addEventListener('change', async () => {
    const f = file.files?.[0];
    if (!f) return;
    try {
      const parsed = JSON.parse(await f.text());
      const list = Array.isArray(parsed) ? parsed : parsed.words;
      const merged = await store.importWords(list);
      toast(`Импортировано. Всего слов: ${merged.length}`);
      renderSettings(root);
    } catch (e) {
      toast('Не удалось прочитать файл: ' + e.message);
    }
    file.value = '';
  });
}
