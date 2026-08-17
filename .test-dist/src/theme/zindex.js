/**
 * KaruviLab — Canonical Z-Index Token Scale
 *
 * ⚠️  THIS IS THE SINGLE SOURCE OF TRUTH FOR ALL Z-INDEX VALUES.
 *
 * Rules:
 * 1. Never use raw numeric Tailwind z-index classes (z-content, z-above, z-modal, etc.).
 *    Always use a named token from this file (z-content, z-modal, etc.).
 * 2. Do NOT define z-index values in globals.css @theme — those entries are
 *    dead-code stubs kept only for backward compatibility and MUST stay
 *    synchronised with this file if ever changed.
 * 3. When adding a new layer, insert it here first, then use the token name.
 *
 * Stack (ascending = higher in paint order):
 *
 *   behind       -10   Decorative pseudo-elements, background blobs
 *   base           0   Default document flow
 *   content       10   Local stacking helpers inside a component
 *   above         20   Slightly-elevated sibling (e.g. active chip indicator)
 *   sidebar       30   Desktop sidebar <aside>
 *   header        40   Sticky <header> bar
 *   nav           60   Fixed BottomNav (mobile)
 *   backdrop      90   Mobile sidebar scrim / generic dark-overlay
 *   dropdown     100   Dropdowns, tooltips, small popovers that float above page content
 *   modalBackdrop 400  Backdrop/scrim behind a full-screen modal
 *   modal        500   Full-screen modals, drawers, search overlay, mobile sidebar panel
 *   popover      600   Floating selects that must clear modals (e.g. currency picker)
 *   toast        800   Session-restored banners and similar transient notices
 *   max         1000   Toasts (always-on-top), cookie consent, skip-link
 */
export const zIndex = {
    behind: '-10',
    base: '0',
    content: '10',
    above: '20',
    sidebar: '30',
    header: '40',
    nav: '60',
    backdrop: '90',
    dropdown: '100',
    'modal-backdrop': '400',
    modal: '500',
    popover: '600',
    toast: '800',
    max: '1000',
};
