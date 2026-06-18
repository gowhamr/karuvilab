"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { m, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react";

type ToastType = "success" | "error" | "info" | "warn";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  action?: ToastAction;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType, action?: ToastAction) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = "success", action?: ToastAction) => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((prev) => [...prev, { id, message, type, ...(action ? { action } : {}) }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, action ? 8000 : 4000); // Give users more time if there's an action
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-success" />,
    error: <AlertCircle className="w-4 h-4 text-error" />,
    info: <Info className="w-4 h-4 text-brand-primary" />,
    warn: <AlertTriangle className="w-4 h-4 text-warn" />,
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast Container */}
      <div 
        className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-toast flex flex-col gap-3 pointer-events-none items-end"
        role="log"
        aria-live="polite"
        aria-atomic="true"
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <m.div
              key={t.id}
              layout
              drag="x"
              dragConstraints={{ left: 0, right: 200 }}
              dragElastic={{ left: 0.1, right: 0.6 }}
              onDragEnd={(_, info) => {
                if (info.offset.x > 80 || info.velocity.x > 400) {
                  removeToast(t.id);
                }
              }}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, x: 20, transition: { duration: 0.2 } }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className={`
                pointer-events-auto px-4 py-3 rounded-2xl shadow-mat-shine border flex items-center gap-3 min-w-72 max-w-96
                bg-mat-raised border-mat-border touch-none overflow-hidden
                ${t.type === "success" ? "border-success/20" : ""}
                ${t.type === "error" ? "border-error/20" : ""}
                ${t.type === "info" ? "border-brand-primary/20" : ""}
                ${t.type === "warn" ? "border-warn/20" : ""}
              `}
              role="alert"
            >
              <div className={`w-1 absolute left-0 top-3 bottom-3 rounded-full ${
                t.type === "success" ? "bg-success" :
                t.type === "error" ? "bg-error" :
                t.type === "info" ? "bg-brand-primary" :
                "bg-warn"
              }`} />
              <div className="flex-shrink-0 ml-1">{icons[t.type]}</div>
              <span className="text-sm font-bold text-text flex-1">{t.message}</span>
              
              {t.action && (
                <button
                  onClick={() => {
                    t.action!.onClick();
                    removeToast(t.id);
                  }}
                  className={`ml-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all
                    ${t.type === 'success' ? 'bg-success hover:opacity-90 text-white' : 
                      t.type === 'error' ? 'bg-error hover:opacity-90 text-white' : 
                      t.type === 'warn' ? 'bg-warn hover:opacity-90 text-white' : 
                      'bg-blue hover:bg-blue-dark text-white'}`}
                >
                  {t.action.label}
                </button>
              )}
              
              <button 
                onClick={() => removeToast(t.id)}
                className="p-1 rounded-lg hover:bg-mat-hover transition-colors text-text-4 pointer-events-auto"
                aria-label={`Dismiss: ${t.message.slice(0, 40)}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </m.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
