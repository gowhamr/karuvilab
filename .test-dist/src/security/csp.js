// src/security/csp.ts
/**
 * Content Security Policy (CSP) Generator
 * Defines strict local-first security directives.
 *
 * Directives Explanation:
 * - default-src 'self': Only trust resources from our origin by default.
 * - script-src 'self': Only execute scripts hosted on our origin. Blocks eval() and inline scripts to prevent XSS.
 * - style-src 'self' 'unsafe-inline': Trust local stylesheets and inline styles (needed for Framer Motion, Tailwind styles).
 * - img-src 'self' data: blob:: Allow images from origin, base64 data URIs, and dynamic local Blobs (e.g. for conversions).
 * - worker-src 'self' blob:: Allow Web Workers hosted locally and running from blob URLs (used for background processor offloading).
 * - connect-src 'self': Restrict XHR/Fetch network connections to our origin only (enforcing local-first privacy).
 * - object-src 'none': Disable flash, java, and other plug-ins.
 * - frame-ancestors 'none': Prevent clickjacking by blocking iframe embedding of the site.
 */
export const CSP_DIRECTIVES = {
    "default-src": ["'self'"],
    "script-src": ["'self'"],
    "style-src": ["'self'", "'unsafe-inline'"],
    "img-src": ["'self'", "data:", "blob:"],
    "worker-src": ["'self'", "blob:"],
    "connect-src": ["'self'"],
    "object-src": ["'none'"],
    "frame-ancestors": ["'none'"],
};
/**
 * Returns CSP directives formatted as a single string.
 */
export function generateCSPString() {
    return Object.entries(CSP_DIRECTIVES)
        .map(([directive, sources]) => `${directive} ${sources.join(" ")};`)
        .join(" ");
}
/**
 * Returns CSP headers formatted for next.config.ts config.
 */
export function getNextSecurityHeaders() {
    return [
        {
            key: "Content-Security-Policy",
            value: generateCSPString(),
        },
        {
            key: "X-Frame-Options",
            value: "DENY",
        },
        {
            key: "X-Content-Type-Options",
            value: "nosniff",
        },
        {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
        },
        {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()", // Locked down unless explicitly allowed by tool scope
        },
    ];
}
