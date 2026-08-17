/**
 * src/lib/deviceCapability.ts
 * hardware-aware capability detection for GPU-intensive effects
 */
export function supportsBlur() {
    if (typeof window === 'undefined')
        return false;
    // Check 1: CSS support
    const cssSupport = CSS.supports('backdrop-filter', 'blur(1px)') ||
        CSS.supports('-webkit-backdrop-filter', 'blur(1px)');
    if (!cssSupport)
        return false;
    // Check 2: Reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches)
        return false;
    // Check 3: Combined hardware check
    // hardwareConcurrency alone is unreliable (high-core low-memory exists)
    // deviceMemory alone is unreliable (low-core high-memory exists)
    // Combined check is more accurate
    const cores = navigator.hardwareConcurrency ?? 4;
    const memory = navigator.deviceMemory ?? 4; // fallback: assume capable
    // If low power device (less than 4 cores AND less than 4GB RAM), disable blur
    if (cores < 4 && memory <= 4)
        return false;
    return true;
}
