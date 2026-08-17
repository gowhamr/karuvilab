// src/security/inputSanitization.ts
/**
 * Protects against Command Palette injection by neutralizing slash commands and escape sequences.
 */
export function sanitizeCommandPaletteInput(input) {
    if (!input)
        return "";
    // Strip control chars, escape brackets and backticks
    return input
        .replace(/[\x00-\x1F\x7F]/g, "") // remove control characters
        .replace(/[\\`$()[\]]/g, "\\$&") // escape special chars
        .trim();
}
