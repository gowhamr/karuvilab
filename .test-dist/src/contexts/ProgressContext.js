"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useCallback, useMemo } from "react";
const initialState = {
    isProcessing: false,
    stage: null,
    progress: null,
    estimatedTimeRemaining: null,
    error: null,
    isSuccess: false,
    type: null,
    onCancel: undefined,
};
const ProgressContext = createContext(null);
export function ProgressProvider({ children }) {
    const [state, setState] = useState(initialState);
    const startProcessing = useCallback((type = "medium", onCancel) => {
        setState({ ...initialState, isProcessing: true, type, onCancel });
    }, []);
    const setStage = useCallback((stage) => {
        setState((prev) => ({ ...prev, stage }));
    }, []);
    const setProgress = useCallback((progress, estimatedTimeRemaining = null) => {
        setState((prev) => ({ ...prev, progress, estimatedTimeRemaining }));
    }, []);
    const finishProcessing = useCallback((success = true, error = null) => {
        setState((prev) => ({
            ...prev,
            isProcessing: false,
            isSuccess: success,
            error,
        }));
    }, []);
    const resetProgress = useCallback(() => {
        setState(initialState);
    }, []);
    const value = useMemo(() => ({
        state,
        startProcessing,
        setStage,
        setProgress,
        finishProcessing,
        resetProgress,
    }), [state, startProcessing, setStage, setProgress, finishProcessing, resetProgress]);
    return _jsx(ProgressContext.Provider, { value: value, children: children });
}
export function useProgress() {
    const context = useContext(ProgressContext);
    if (!context) {
        throw new Error("useProgress must be used within a ProgressProvider");
    }
    return context;
}
