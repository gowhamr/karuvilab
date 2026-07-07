import { useState, useEffect, useCallback } from 'react';

interface FullscreenOptions {
  onEnter?: () => void;
  onExit?: () => void;
  exitOnEscape?: boolean;   // default true
  exitOnF11?: boolean;      // default true
}

interface UseFullscreenReturn {
  isFullscreen: boolean;
  enter: () => void;
  exit: () => void;
  toggle: () => void;
  isSupported: boolean;     // false on iOS Safari
}

export function useFullscreen(
  options: FullscreenOptions = {}
): UseFullscreenReturn {
  const {
    onEnter,
    onExit,
    exitOnEscape = true,
    exitOnF11 = true,
  } = options;

  const [isFullscreen, setIsFullscreen] = useState(false);

  // Detect native fullscreen API support
  const isSupported = typeof document !== 'undefined' &&
    !!(document.fullscreenEnabled ||
       (document as any).webkitFullscreenEnabled);

  const enter = useCallback(() => {
    setIsFullscreen(true);
    // Lock scroll on body
    document.body.style.overflow = 'hidden';
    // Dispatch custom event for layout to respond
    window.dispatchEvent(new CustomEvent('kv-fullscreen-enter'));
    onEnter?.();
  }, [onEnter]);

  const exit = useCallback(() => {
    setIsFullscreen(false);
    document.body.style.overflow = '';
    window.dispatchEvent(new CustomEvent('kv-fullscreen-exit'));
    onExit?.();
  }, [onExit]);

  const toggle = useCallback(() => {
    if (isFullscreen) { exit(); } else { enter(); }
  }, [isFullscreen, enter, exit]);

  // Keyboard listeners
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // F11 toggle
      if (exitOnF11 && e.key === 'F11') {
        e.preventDefault(); // Prevent browser native F11 which can cause conflicts
        toggle();
        return;
      }
      // Escape to exit only
      if (exitOnEscape && e.key === 'Escape' && isFullscreen) {
        exit();
        return;
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, toggle, exit, exitOnEscape, exitOnF11]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isFullscreen) {
        document.body.style.overflow = '';
        window.dispatchEvent(new CustomEvent('kv-fullscreen-exit'));
      }
    };
  }, [isFullscreen]);

  // Handle browser back button / navigation exit
  useEffect(() => {
    if (!isFullscreen) return;
    function handlePopState() { exit(); }
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isFullscreen, exit]);

  return { isFullscreen, enter, exit, toggle, isSupported };
}
