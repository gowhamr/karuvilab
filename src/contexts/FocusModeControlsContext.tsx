"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

export interface FocusModeControls {
  wordCount?: number;
  charCount?: number;
  lineCount?: number;
  language?: string;
  onFontSizeChange?: (size: number) => void;
  onWrapToggle?: () => void;
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
  
  const setControls = (newControls: Partial<FocusModeControls>) => {
    setControlsState(prev => ({ ...prev, ...newControls }));
  };

  return (
    <FocusModeControlsContext.Provider value={{ controls, setControls }}>
      {children}
    </FocusModeControlsContext.Provider>
  );
}

export const useFocusModeControls = () => useContext(FocusModeControlsContext);

// Helper hook for tools to register their controls
export function useFocusModeIntegration(controls: Partial<FocusModeControls>) {
  const { setControls } = useFocusModeControls();
  
  // Use a ref to avoid infinite loops if controls object is recreated
  const controlsRef = React.useRef(controls);
  
  useEffect(() => {
    controlsRef.current = controls;
    setControls(controlsRef.current);
  }); // Run after every render to keep them updated
}
