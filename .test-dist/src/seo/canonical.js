// src/seo/canonical.ts
const BASE_URL = "https://karuvilab.com";
/**
 * Normalizes a path to enforce a strict trailing slash and prefix with the base URL.
 * Ensures consistent canonical URLs across the platform.
 */
export function getCanonicalUrl(path) {
    if (!path)
        return `${BASE_URL}/`;
    // Remove leading and trailing slashes to start clean
    const cleanPath = path.replace(/^\/+|\/+$/g, "");
    // If cleanPath is empty, return the base URL with trailing slash
    if (!cleanPath)
        return `${BASE_URL}/`;
    // Return absolute canonical URL with trailing slash
    return `${BASE_URL}/${cleanPath}/`;
}
