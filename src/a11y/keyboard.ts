import { useEffect } from 'react';

type KeyHandler = (event: KeyboardEvent) => void;

/**
 * Hook to register global keyboard shortcuts safely.
 */
export const useKeyboardShortcut = (
  key: string,
  handler: KeyHandler,
  options: { ctrl?: boolean; alt?: boolean; shift?: boolean; meta?: boolean } = {}
) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key.toLowerCase() === key.toLowerCase() &&
        !!options.ctrl === event.ctrlKey &&
        !!options.alt === event.altKey &&
        !!options.shift === event.shiftKey &&
        !!options.meta === event.metaKey
      ) {
        handler(event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [key, handler, options]);
};
