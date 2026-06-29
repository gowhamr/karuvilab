'use client';
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode
} from 'react';

export type DisplayMode = 'normal' | 'focus' | 'dashboard';

interface FullscreenContextValue {
  displayMode: DisplayMode;
  isFullscreen: boolean; // Alias for displayMode !== 'normal' for backwards compatibility
  activeToolId: string | null;
  currentToolId: string | null;
  registerTool: (toolId: string) => void;
  unregisterTool: (toolId: string) => void;
  enterFocus: (toolId: string) => void;
  enterDashboard: (toolId: string) => void;
  enter: (toolId: string) => void; // Alias for enterFocus
  exit: () => void;
  toggleFocus: (toolId: string) => void;
  toggleDashboard: (toolId: string) => void;
  toggle: (toolId: string) => void; // Alias for toggleFocus
}

const FullscreenContext = createContext<FullscreenContextValue | null>(null);

export function FullscreenProvider({ children }: { children: ReactNode }) {
  const [displayMode, setDisplayMode] = useState<DisplayMode>('normal');
  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const [currentToolId, setCurrentToolId] = useState<string | null>(null);

  const isFullscreen = displayMode !== 'normal';

  const registerTool = useCallback((toolId: string) => {
    setCurrentToolId(toolId);
  }, []);

  const unregisterTool = useCallback((toolId: string) => {
    setCurrentToolId(prev => prev === toolId ? null : prev);
  }, []);

  const exit = useCallback(() => {
    setDisplayMode('normal');
    setActiveToolId(null);
    document.body.style.overflow = '';
    
    // Exit native fullscreen if active
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    
    window.dispatchEvent(new CustomEvent('kv-fullscreen-exit'));
  }, []);

  const enterFocus = useCallback((toolId: string) => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    setDisplayMode('focus');
    setActiveToolId(toolId);
    document.body.style.overflow = 'hidden';
    window.dispatchEvent(new CustomEvent('kv-fullscreen-enter', {
      detail: { toolId, mode: 'focus' }
    }));
  }, []);

  const enterDashboard = useCallback((toolId: string) => {
    setDisplayMode('dashboard');
    setActiveToolId(toolId);
    document.body.style.overflow = 'hidden';
    
    // Try to enter native fullscreen
    if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`);
      });
    }
    
    window.dispatchEvent(new CustomEvent('kv-fullscreen-enter', {
      detail: { toolId, mode: 'dashboard' }
    }));
  }, []);

  const toggleFocus = useCallback((toolId: string) => {
    displayMode === 'focus' ? exit() : enterFocus(toolId);
  }, [displayMode, enterFocus, exit]);

  const toggleDashboard = useCallback((toolId: string) => {
    displayMode === 'dashboard' ? exit() : enterDashboard(toolId);
  }, [displayMode, enterDashboard, exit]);

  // Global keyboard handler
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const targetId = activeToolId || currentToolId;
      
      // Ignore if typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName) || (e.target as HTMLElement)?.isContentEditable) {
        // Only allow Esc to exit
        if (e.key === 'Escape' && isFullscreen) {
          exit();
        }
        return;
      }

      if (e.key === 'F11') {
        if (targetId) {
          e.preventDefault();
          toggleDashboard(targetId);
        }
      }
      
      if (e.key === 'f' || e.key === 'F') {
        // Toggle Focus mode with 'F' key
        if (targetId && !e.ctrlKey && !e.metaKey && !e.altKey) {
          e.preventDefault();
          toggleFocus(targetId);
        }
      }
      
      if (e.key === 'Escape' && isFullscreen) {
        exit();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, displayMode, activeToolId, currentToolId, toggleFocus, toggleDashboard, exit]);

  // Sync state if native fullscreen is exited via browser UI (e.g. Esc)
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && displayMode === 'dashboard') {
        exit();
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [displayMode, exit]);

  // Cleanup
  useEffect(() => {
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <FullscreenContext.Provider value={{
      displayMode,
      isFullscreen, 
      activeToolId, 
      currentToolId, 
      registerTool, 
      unregisterTool, 
      enterFocus,
      enterDashboard,
      enter: enterFocus, // Legacy mapping
      exit, 
      toggleFocus,
      toggleDashboard,
      toggle: toggleFocus // Legacy mapping
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
