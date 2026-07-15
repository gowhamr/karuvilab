"use client";

import React, { useEffect } from 'react';
import { useAriaAnnouncer } from './useAriaAnnouncer';
import { useSettingsStore } from '@/src/store/settings/store';

export function AriaLiveAnnouncer() {
  const { message, assertive } = useAriaAnnouncer();
  const readAloud = useSettingsStore(s => s.accessibility?.readAloud);

  useEffect(() => {
    if (readAloud && message && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.rate = 1.1; // Slightly faster for productivity
      window.speechSynthesis.speak(utterance);
    }
  }, [message, readAloud]);

  return (
    <div
      role="status"
      aria-live={assertive ? 'assertive' : 'polite'}
      aria-atomic="true"
      className="sr-only pointer-events-none"
    >
      {message}
    </div>
  );
}
