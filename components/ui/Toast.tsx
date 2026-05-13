"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

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
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`
              pointer-events-auto px-4 py-3 rounded-xl shadow-lg border flex items-center gap-3 min-w-[280px]
              animate-in slide-in-from-right-10 fade-in duration-300
              ${t.type === "success" ? "bg-surface border-green-500/20 text-green-600 dark:text-green-400" : ""}
              ${t.type === "error" ? "bg-surface border-red-500/20 text-red-600 dark:text-red-400" : ""}
              ${t.type === "info" ? "bg-surface border-blue/20 text-blue dark:text-blue-400" : ""}
              ${t.type === "warn" ? "bg-surface border-orange-500/20 text-orange-600 dark:text-orange-400" : ""}
            `}
          >
            <div className={`w-2 h-2 rounded-full ${
              t.type === "success" ? "bg-green-500" : 
              t.type === "error" ? "bg-red-500" : 
              t.type === "warn" ? "bg-orange-500" : "bg-blue"
            }`} />
            <span className="text-sm font-bold">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
