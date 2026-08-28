"use client";

import React, { createContext, useContext, useCallback, ReactNode } from "react";
import { toast as sonnerToast, Toaster } from "sonner";

export type ToastType = "success" | "error" | "info" | "warn";

export interface ToastAction {
  label: string;
  onClick: () => void;
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
  const toast = useCallback((message: string, type: ToastType = "success", action?: ToastAction) => {
    const options = action ? {
      action: {
        label: action.label,
        onClick: action.onClick
      }
    } : undefined;

    switch (type) {
      case "success":
        sonnerToast.success(message, options);
        break;
      case "error":
        sonnerToast.error(message, options);
        break;
      case "info":
        sonnerToast.info(message, options);
        break;
      case "warn":
        sonnerToast.warning(message, options);
        break;
      default:
        sonnerToast(message, options);
    }
  }, []);

  const contextValue = React.useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={contextValue}>
      <Toaster
        closeButton
        richColors
        position="bottom-right"
        theme={typeof document !== 'undefined' ? (document.documentElement.getAttribute('data-theme') as 'light' | 'dark') || 'dark' : 'dark'}
        toastOptions={{
          classNames: {
            toast: "rounded-3xl font-inter",
          },
        }}
      />
      {children}
    </ToastContext.Provider>
  );
}
