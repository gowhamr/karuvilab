"use client";

import { useRecoveryStore } from '@/src/store/useRecoveryStore';
import { useShallow } from 'zustand/react/shallow';
import { AlertCircle, X, RefreshCw, AlertTriangle } from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';

export function RecoveryBanner() {
  const { isVisible, type, message, action, dismissBanner } = useRecoveryStore(
    useShallow((s) => ({
      isVisible: s.isVisible,
      type: s.type,
      message: s.message,
      action: s.action,
      dismissBanner: s.dismissBanner,
    }))
  );

  if (!isVisible) return null;

  const isError = type === 'idb_error' || type === 'worker_crash' || type === 'queue_error';
  const Icon = isError ? AlertCircle : AlertTriangle;

  const colorClasses = isError
    ? { border: "border-l-error", text: "text-error", btn: "bg-error text-white hover:bg-error/80" }
    : { border: "border-l-warning", text: "text-warning", btn: "bg-warning text-white hover:bg-warning/80" };

  return (
    <AnimatePresence>
      <m.div
        role="alert"
        aria-live="assertive"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-20 left-1/2 -translate-x-1/2 z-modal w-11/12 max-w-lg"
      >
        <div className={`p-4 rounded-2xl shadow-xl border border-border ${colorClasses.border} border-l-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-surface ${colorClasses.text}`}>
          <div className="flex items-start gap-3">
            <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div className="space-y-1">
              <h3 className="font-bold text-sm tracking-tight">System Notice</h3>
              <p className="text-xs font-medium opacity-80 leading-relaxed">{message}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            {action && (
              <button
                onClick={() => {
                  action.onClick();
                  dismissBanner();
                }}
                aria-label={action.label}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${colorClasses.btn}`}
              >
                {action.label}
              </button>
            )}
            <button
              onClick={dismissBanner}
              className="p-1.5 rounded-lg opacity-60 hover:opacity-100 transition-opacity hover:bg-black/5 dark:hover:bg-white/5"
              aria-label="Dismiss alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </m.div>
    </AnimatePresence>
  );
}
