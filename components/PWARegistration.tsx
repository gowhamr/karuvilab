'use client';

import { useEffect } from 'react';
import { Workbox } from 'workbox-window';
import { useToast } from './ui/Toast';

export function PWARegistration() {
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const wb = new Workbox('/sw.js');

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
