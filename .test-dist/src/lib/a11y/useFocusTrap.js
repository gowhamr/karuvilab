import { useEffect } from 'react';
/**
 * WCAG 2.2 AA compliant Focus Trap Hook
 * Traps keyboard focus within the specified container and restores focus to the previously active element on close.
 */
export function useFocusTrap(ref, active = true) {
    useEffect(() => {
        if (!active || !ref.current)
            return;
        const el = ref.current;
        const previousActiveElement = document.activeElement;
        // Select all focusable elements per WCAG 2.2 specifications
        const getFocusableElements = () => {
            const selector = [
                'a[href]',
                'button:not([disabled])',
                'textarea:not([disabled])',
                'input:not([type="hidden"]):not([disabled])',
                'select:not([disabled])',
                '[tabindex]:not([tabindex="-1"])',
                '[contenteditable="true"]'
            ].join(', ');
            return Array.from(el.querySelectorAll(selector)).filter((node) => node.offsetWidth > 0 || node.offsetHeight > 0 || node === document.activeElement);
        };
        const handleKeyDown = (e) => {
            if (e.key !== 'Tab')
                return;
            const focusableEls = getFocusableElements();
            if (focusableEls.length === 0) {
                e.preventDefault();
                return;
            }
            const firstEl = focusableEls[0];
            const lastEl = focusableEls[focusableEls.length - 1];
            if (e.shiftKey) {
                // Shift + Tab: Wrap from first to last element
                if (document.activeElement === firstEl || !el.contains(document.activeElement)) {
                    lastEl?.focus();
                    e.preventDefault();
                }
            }
            else {
                // Tab: Wrap from last to first element
                if (document.activeElement === lastEl || !el.contains(document.activeElement)) {
                    firstEl?.focus();
                    e.preventDefault();
                }
            }
        };
        // Prevent focus escaping via click or external scripts
        const handleFocusIn = (e) => {
            if (el && !el.contains(e.target)) {
                const focusableEls = getFocusableElements();
                if (focusableEls.length > 0) {
                    focusableEls[0]?.focus();
                }
                else {
                    el.focus();
                }
            }
        };
        el.addEventListener('keydown', handleKeyDown);
        document.addEventListener('focusin', handleFocusIn);
        // Initial focus placement
        const focusable = getFocusableElements();
        if (focusable.length > 0 && !el.contains(document.activeElement)) {
            focusable[0]?.focus();
        }
        else if (!el.contains(document.activeElement)) {
            el.focus();
        }
        return () => {
            el.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('focusin', handleFocusIn);
            // Restore focus to pre-modal element
            if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
                previousActiveElement.focus();
            }
        };
    }, [active, ref]);
}
