"use client";
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-blue/80 backdrop-blur-lg text-white p-4 rounded-xl shadow-lg flex items-center gap-4"
        >
          <p className="text-sm font-bold">Previous session restored.</p>
          <button onClick={onClear} className="text-sm font-bold underline hover:text-blue-200">Clear</button>
          <button onClick={onDismiss} className="p-1 rounded-full hover:bg-white/20">
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
