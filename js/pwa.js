/**
 * Service worker registration and a quiet update notice.
 * Kept out of router.js: the app must also run without a service worker.
 */

import { toast } from './ui.js';
import { mountInstallBanner } from './install.js';

window.addEventListener('load', mountInstallBanner);

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('./sw.js');

      reg.addEventListener('updatefound', () => {
        const sw = reg.installing;
        if (!sw) return;
        sw.addEventListener('statechange', () => {
          // A controller means an older worker was already serving the page,
          // so this is an update rather than the first install.
          if (sw.state === 'installed' && navigator.serviceWorker.controller) {
            toast('Обновление готово — перезапусти приложение');
          }
        });
      });
    } catch (e) {
      console.warn('SW registration failed', e);
    }
  });
}
