'use client';

import { useEffect } from 'react';
import { Workbox } from 'workbox-window';

export function PWARegistration() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const wb = new Workbox('/sw.js');

      wb.addEventListener('installed', (event) => {
        if (event.isUpdate) {
          console.log('New content is available! Please refresh.');
          // You could trigger a toast here
        } else {
          console.log('Content is cached for offline use.');
        }
      });

      wb.register().catch((err) => {
        console.error('Service Worker registration failed:', err);
      });
    }
  }, []);

  return null;
}
