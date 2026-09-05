# EnGram

English grammar notes with AI practice, as an installable web app.
A PWA port of the EnGram Chrome extension: same content and views, no extension APIs.

Live: add it to the iPhone home screen from Safari — Share → Add to Home Screen.

## Stack

No build step: the browser loads ES modules as they are.

```
index.html              shell: header, search, #app container
manifest.webmanifest    PWA manifest
sw.js                   service worker: offline cache, Gemini never cached
css/app.css             all styling, dark theme and iPhone included
js/router.js            hash router and search
js/storage.js           localStorage (chrome.storage.local in the extension)
js/gemini.js            Gemini requests with the key and model from Settings
js/views/*              screens, including review.js (spaced repetition)
data/*                  grammar and vocabulary
```

## Run locally

Service workers and ES modules need http, not `file://`:

```bash
npm run dev      # http://localhost:3000
```

## Deploy

Vercel, no build: Framework Preset **Other**, empty Build Command and Output
Directory. `vercel.json` sets the headers.

## API key

The Gemini key is entered in Settings and stored in `localStorage`. There is no
backend and no key in the repository — requests go straight from the browser to
`generativelanguage.googleapis.com`. That also means anyone with access to the
device or DevTools can read it, so keep the key quota-limited and the app personal.

The model is picked in Settings from `MODELS` in `js/storage.js`.

## Notes

- Bump `VERSION` in `sw.js` after changing files, or installed apps keep serving
  the cached build.
- Saved words live in the browser. Settings exports them as Markdown in the
  same file format LingoPop uses, so one file works in both apps
  (`js/markdown.js`).
- Review schedule is Leitner: 1, 3, 7, 16 and 35 days, reset on a wrong answer
  (`INTERVALS_DAYS` in `js/storage.js`).
