/**
 * Service worker. The app is unbuilt static files, so the shell is listed by
 * hand: bump VERSION after changing files and the old cache is dropped.
 *
 * Navigation → network, falling back to the cached shell when offline.
 * Own files  → cache, refreshed in the background.
 * Gemini API → not touched at all.
 */

const VERSION = 'v34';
const CACHE = `engram-${VERSION}`;

/** App shell. Cached separately, see install. */
const SHELL_DOC = './';

const SHELL = [
  './manifest.webmanifest',
  './css/app.css',
  './js/router.js',
  './js/ui.js',
  './js/storage.js',
  './js/markdown.js',
  './js/gemini.js',
  './js/prompts.js',
  './js/pwa.js',
  './js/icons.js',
  './js/install.js',
  './js/views/home.js',
  './js/views/group.js',
  './js/views/topic.js',
  './js/views/vocabulary.js',
  './js/views/words.js',
  './js/views/review.js',
  './js/views/practice.js',
  './js/views/settings.js',
  './data/grammar.js',
  './data/vocabulary.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png',
];

async function precache() {
  const cache = await caches.open(CACHE);
  await cache.addAll(SHELL);

  // Hosting redirects index.html to "/", and a redirected response cannot be
  // used to answer a navigation. So cache the canonical URL ourselves.
  const res = await fetch(new Request(SHELL_DOC, { cache: 'reload' }));
  if (res.ok && !res.redirected) await cache.put(SHELL_DOC, res);
}

self.addEventListener('install', (event) => {
  event.waitUntil(precache().then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(names.filter((n) => n !== CACHE).map((n) => caches.delete(n))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'skip-waiting') self.skipWaiting();
});

async function cacheFirst(request) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(request, { ignoreSearch: true });
  if (hit) {
    // Refresh in the background so the next launch gets the newer file.
    fetch(request).then((res) => {
      if (res.ok && !res.redirected) cache.put(request, res.clone());
    }).catch(() => {});
    return hit;
  }
  const res = await fetch(request);
  if (res.ok && res.type === 'basic' && !res.redirected) cache.put(request, res.clone());
  return res;
}

async function navigate(request) {
  try {
    return await fetch(request);
  } catch {
    const cache = await caches.open(CACHE);
    return (await cache.match(SHELL_DOC)) || Response.error();
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // Gemini and other origins bypass the cache.

  if (request.mode === 'navigate') {
    event.respondWith(navigate(request));
    return;
  }
  event.respondWith(cacheFirst(request));
});
