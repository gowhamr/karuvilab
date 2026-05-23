"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { m, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react";

type ToastType = "success" | "error" | "info" | "warn";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000); // Slightly longer duration for better readability
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-green-500" />,
    error: <AlertCircle className="w-4 h-4 text-red-500" />,
    info: <Info className="w-4 h-4 text-blue" />,
    warn: <AlertTriangle className="w-4 h-4 text-orange-500" />,
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none items-end">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <m.div
              key={t.id}
              layout
              drag="x"
              dragConstraints={{ left: 0, right: 300 }}
              dragElastic={{ left: 0.1, right: 0.8 }}
              onDragEnd={(_, info) => {
                if (info.offset.x > 150 || info.velocity.x > 500) {
                  removeToast(t.id);
                }
              }}
              initial={{ opacity: 0, x: 50, scale: 0.9, filter: "blur(4px)" }}
              animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.9, x: 20, transition: { duration: 0.2 } }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className={`
                pointer-events-auto px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-3 min-w-[280px] max-w-[400px]
                bg-surface/90 backdrop-blur-md touch-none
                ${t.type === "success" ? "border-green-500/20" : ""}
                ${t.type === "error" ? "border-red-500/20" : ""}
                ${t.type === "info" ? "border-blue/20" : ""}
                ${t.type === "warn" ? "border-orange-500/20" : ""}
              `}
              role="alert"
            >
              <div className={`w-1 absolute left-0 top-3 bottom-3 rounded-full ${
                t.type === "success" ? "bg-green-500" :
                t.type === "error" ? "bg-red-500" :
                t.type === "info" ? "bg-blue" :
                "bg-orange-500"
              }`} />
              <div className="flex-shrink-0 ml-1">{icons[t.type]}</div>
              <span className="text-sm font-bold text-text flex-1">{t.message}</span>
              <button 
                onClick={() => removeToast(t.id)}
                className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-text-4 pointer-events-auto"
                aria-label="Close"
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
