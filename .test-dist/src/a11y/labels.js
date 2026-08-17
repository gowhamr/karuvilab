/**
 * Centralized ARIA label generators to prevent drift.
 */
export const a11yLabels = {
    close: "Close dialog",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    removeFile: (filename) => `Remove ${filename}`,
    downloadFile: (filename) => `Download ${filename}`,
    copyToClipboard: "Copy to clipboard",
    copied: "Copied to clipboard",
};
