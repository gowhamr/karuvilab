import { useEffect } from 'react';
/**
 * Hook to register global keyboard shortcuts safely.
 */
export const useKeyboardShortcut = (key, handler, options = {}) => {
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key.toLowerCase() === key.toLowerCase() &&
                !!options.ctrl === event.ctrlKey &&
                !!options.alt === event.altKey &&
                !!options.shift === event.shiftKey &&
                !!options.meta === event.metaKey) {
                handler(event);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [key, handler, options]);
};
