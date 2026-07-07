'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Link2, X } from 'lucide-react';

interface SharedResultBannerProps {
  hasParams: boolean;
  toolName: string;
}

const BANNER_VARIANTS = {
  hidden: { opacity: 0, y: -16 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
};

const SPRING = { type: 'spring' as const, stiffness: 300, damping: 30 };
const AUTO_DISMISS_MS = 5000;

export function SharedResultBanner({ hasParams, toolName }: SharedResultBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (hasParams && !isDismissed) {
      Promise.resolve().then(() => {
        setIsVisible(true);
      });
    }
  }, [hasParams, isDismissed]);

  // Auto-dismiss after 5 seconds
  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [isVisible]);

  const handleDismiss = useCallback(() => {
    setIsVisible(false);
    setIsDismissed(true);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <m.div
          role="status"
          aria-live="polite"
          variants={BANNER_VARIANTS}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={SPRING}
          className="flex items-center justify-between gap-4 px-5 py-3.5 mb-6 bg-blue/10 border border-blue/25 rounded-2xl shadow-sm"
        >
          <div className="flex items-center gap-3 min-w-0">
            <Link2 className="w-4 h-4 text-blue shrink-0" />
            <p className="text-sm font-bold text-blue truncate">
              Shared result loaded —{' '}
              <span className="font-black">{toolName}</span>{' '}
              pre-filled from shared link
            </p>
          </div>
          <button
            onClick={handleDismiss}
            aria-label="Dismiss shared result banner"
            className="shrink-0 p-1 rounded-lg text-blue/60 hover:text-blue hover:bg-blue/10 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue"
          >
            <X className="w-4 h-4" />
          </button>
        </m.div>
      )}
    </AnimatePresence>
  );
}
