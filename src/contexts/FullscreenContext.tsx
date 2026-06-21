'use client';
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode
} from 'react';

interface FullscreenContextValue {
  isFullscreen: boolean;
  activeToolId: string | null;
  currentToolId: string | null;
  registerTool: (toolId: string) => void;
  unregisterTool: (toolId: string) => void;
  enter: (toolId: string) => void;
  exit: () => void;
  toggle: (toolId: string) => void;
}

const FullscreenContext = createContext<FullscreenContextValue | null>(null);

export function FullscreenProvider({ children }: { children: ReactNode }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const [currentToolId, setCurrentToolId] = useState<string | null>(null);

  const registerTool = useCallback((toolId: string) => {
    setCurrentToolId(toolId);
  }, []);

  const unregisterTool = useCallback((toolId: string) => {
    setCurrentToolId(prev => prev === toolId ? null : prev);
  }, []);

  const enter = useCallback((toolId: string) => {
    setIsFullscreen(true);
    setActiveToolId(toolId);
    document.body.style.overflow = 'hidden';
    window.dispatchEvent(new CustomEvent('kv-fullscreen-enter', {
      detail: { toolId }
    }));
  }, []);

  const exit = useCallback(() => {
    setIsFullscreen(false);
    setActiveToolId(null);
    document.body.style.overflow = '';
    window.dispatchEvent(new CustomEvent('kv-fullscreen-exit'));
  }, []);

  const toggle = useCallback((toolId: string) => {
    isFullscreen ? exit() : enter(toolId);
  }, [isFullscreen, enter, exit]);

  // Global keyboard handler
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'F11') {
        const targetId = activeToolId || currentToolId;
        if (targetId) {
          e.preventDefault();
          toggle(targetId);
        }
      }
      if (e.key === 'Escape' && isFullscreen) {
        exit();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, activeToolId, currentToolId, toggle, exit]);

  // Cleanup
  useEffect(() => {
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <FullscreenContext.Provider value={{
      isFullscreen, activeToolId, currentToolId, registerTool, unregisterTool, enter, exit, toggle
    }}>
      {children}
    </FullscreenContext.Provider>
  );
}

export function useFullscreenContext(): FullscreenContextValue {
  const ctx = useContext(FullscreenContext);
  if (!ctx) throw new Error(
    'useFullscreenContext must be used within FullscreenProvider'
  );
  return ctx;
}
