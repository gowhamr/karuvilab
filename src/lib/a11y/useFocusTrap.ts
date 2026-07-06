import { useEffect, RefObject } from 'react';

export function useFocusTrap(ref: RefObject<HTMLElement | null>, active: boolean = true) {
  useEffect(() => {
    if (!active || !ref.current) return;

    const el = ref.current;
    
    // Select all focusable elements
    const getFocusableElements = () => {
      return Array.from(el.querySelectorAll(
        'a[href], button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )) as HTMLElement[];
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      const focusableEls = getFocusableElements();
      if (focusableEls.length === 0) return;

      const firstEl = focusableEls[0]!;
      const lastEl = focusableEls[focusableEls.length - 1]!;

      if (e.shiftKey) { // Shift + Tab
        if (document.activeElement === firstEl) {
          lastEl.focus();
          e.preventDefault();
        }
      } else { // Tab
        if (document.activeElement === lastEl) {
          firstEl.focus();
          e.preventDefault();
        }
      }
    };

    el.addEventListener('keydown', handleKeyDown);

    // Initial focus
    const focusable = getFocusableElements();
    if (focusable.length > 0 && !el.contains(document.activeElement)) {
      focusable[0]!.focus();
    }

    return () => {
      el.removeEventListener('keydown', handleKeyDown);
    };
  }, [active, ref]);
}
