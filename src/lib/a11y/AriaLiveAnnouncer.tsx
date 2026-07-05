"use client";

import React from 'react';
import { useAriaAnnouncer } from './useAriaAnnouncer';

export function AriaLiveAnnouncer() {
  const { message, assertive } = useAriaAnnouncer();

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
