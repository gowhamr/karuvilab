"use client";
import { useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface SessionRestoredBannerProps {
  isVisible: boolean;
  onClear: () => void;
  onDismiss: () => void;
}

export function SessionRestoredBanner({ isVisible, onClear, onDismiss }: SessionRestoredBannerProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onDismiss]);

  return (
    <AnimatePresence>
      {/* NOTE: z-toast used to show above other content */}
      {isVisible && (
        <m.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          role="status"
          aria-live="polite"
          className="fixed top-20 left-1/2 -translate-x-1/2 z-toast bg-surface border border-blue/30 text-text p-4 rounded-2xl shadow-2xl flex items-center gap-4"
        >
          <p className="text-sm font-bold">Previous session restored.</p>
          <button onClick={onClear} className="text-sm font-bold underline text-blue hover:underline transition-colors">Clear</button>
          <button 
            aria-label="Dismiss banner"
            onClick={onDismiss} 
            className="p-2 -m-1 rounded-full text-text-4 hover:text-text hover:bg-mat-hover transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </m.div>
      )}
    </AnimatePresence>
  );
}
