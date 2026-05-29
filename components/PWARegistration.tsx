'use client';

import { useEffect } from 'react';
import { Workbox } from 'workbox-window';
import { useToast } from './ui/Toast';

export function PWARegistration() {
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
      const swPath = `${basePath}/sw.js`;
      const wb = new Workbox(swPath);

      const onUpdate = () => {
        toast('New version available! Click to update.', 'info');
        // Add a click listener to the body or a specific mechanism to trigger the update
        // For simplicity with the existing Toast, we'll just log or use a window confirm
        if (window.confirm('A new version of KaruviLab is available. Update now?')) {
          window.location.reload();
        }
      };

      wb.addEventListener('waiting', onUpdate);

      wb.register().catch((err) => {
        console.error('Service Worker registration failed:', err);
      });
    }
  }, [toast]);

  return null;
}
