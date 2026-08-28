"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { createContext, useContext, useCallback } from "react";
import { toast as sonnerToast, Toaster } from "sonner";
const ToastContext = createContext(undefined);
export function useToast() {
    const context = useContext(ToastContext);
    if (!context)
        throw new Error("useToast must be used within a ToastProvider");
    return context;
}
export function ToastProvider({ children }) {
    const toast = useCallback((message, type = "success", action) => {
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
    return (_jsxs(ToastContext.Provider, { value: contextValue, children: [_jsx(Toaster, { closeButton: true, richColors: true, position: "bottom-right", theme: typeof document !== 'undefined' ? document.documentElement.getAttribute('data-theme') || 'dark' : 'dark', toastOptions: {
                    classNames: {
                        toast: "rounded-3xl font-inter",
                    },
                } }), children] }));
}
