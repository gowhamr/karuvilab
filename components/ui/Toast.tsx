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

  return (
    <ToastContext.Provider value={{ toast }}>
      <Toaster 
        theme="dark" 
        closeButton 
        richColors 
        position="bottom-right"
        toastOptions={{
          style: {
            borderRadius: '24px',
            fontFamily: 'var(--font-inter), sans-serif',
          }
        }}
      />
      {children}
    </ToastContext.Provider>
  );
}
