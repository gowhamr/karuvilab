"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

export interface FocusModeControls {
  wordCount?: number | undefined;
  charCount?: number | undefined;
  lineCount?: number | undefined;
  language?: string | undefined;
  onFontSizeChange?: ((size: number) => void) | undefined;
  onWrapToggle?: (() => void) | undefined;
}

interface FocusModeControlsContextType {
  controls: FocusModeControls;
  setControls: (controls: Partial<FocusModeControls>) => void;
}

const FocusModeControlsContext = createContext<FocusModeControlsContextType>({
  controls: {},
  setControls: () => {},
});

export function FocusModeControlsProvider({ children }: { children: ReactNode }) {
  const [controls, setControlsState] = useState<FocusModeControls>({});
  
  const setControls = React.useCallback((newControls: Partial<FocusModeControls>) => {
    setControlsState(prev => {
      const hasChanges = Object.keys(newControls).some(
        key => newControls[key as keyof FocusModeControls] !== prev[key as keyof FocusModeControls]
      );
      if (!hasChanges) return prev;
      return { ...prev, ...newControls };
    });
  }, []);

  const contextValue = React.useMemo(() => ({ controls, setControls }), [controls, setControls]);

  return (
    <FocusModeControlsContext.Provider value={contextValue}>
      {children}
    </FocusModeControlsContext.Provider>
  );
}

export const useFocusModeControls = () => useContext(FocusModeControlsContext);

// Helper hook for tools to register their controls
export function useFocusModeIntegration(controls: Partial<FocusModeControls>) {
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
