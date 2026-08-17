"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import React, { createContext, useContext, useState, useEffect } from "react";
const FocusModeControlsContext = createContext({
    controls: {},
    setControls: () => { },
});
export function FocusModeControlsProvider({ children }) {
    const [controls, setControlsState] = useState({});
    const setControls = React.useCallback((newControls) => {
        setControlsState(prev => {
            const hasChanges = Object.keys(newControls).some(key => newControls[key] !== prev[key]);
            if (!hasChanges)
                return prev;
            return { ...prev, ...newControls };
        });
    }, []);
    const contextValue = React.useMemo(() => ({ controls, setControls }), [controls, setControls]);
    return (_jsx(FocusModeControlsContext.Provider, { value: contextValue, children: children }));
}
export const useFocusModeControls = () => useContext(FocusModeControlsContext);
// Helper hook for tools to register their controls
export function useFocusModeIntegration(controls) {
    const { setControls } = useFocusModeControls();
    const controlsRef = React.useRef(controls);
    // Keep the ref updated on every render
    useEffect(() => {
        controlsRef.current = controls;
    });
    const { wordCount, charCount, lineCount, language } = controls;
    useEffect(() => {
        setControls({
            wordCount,
            charCount,
            lineCount,
            language,
            onFontSizeChange: (size) => controlsRef.current.onFontSizeChange?.(size),
            onWrapToggle: () => controlsRef.current.onWrapToggle?.()
        });
    }, [wordCount, charCount, lineCount, language, setControls]);
}
