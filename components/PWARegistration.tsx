'use client';

import { useEffect } from 'react';
import { Workbox } from 'workbox-window';

export function PWARegistration() {

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
      const swPath = (process.env.NEXT_PUBLIC_BASE_PATH || "") + "/sw.js";
      const wb = new Workbox(swPath);

      const onUpdate = () => {
        if (window.confirm('A new version of KaruviLab is available. Update now?')) {
          wb.addEventListener('controlling', () => {
            window.location.reload();
          });

          // Send message to waiting service worker to skip waiting
          wb.messageSkipWaiting();
        }
      };

      wb.addEventListener('waiting', onUpdate);

      // Also handle external controller changes (e.g. from other tabs)
      wb.addEventListener('controlling', (event) => {
        if (!event.isUpdate) return;
        window.location.reload();
      });

      wb.register().catch((err) => {
        console.error('Service Worker registration failed:', err);
      });
    }
  }, []);

  return null;
}
