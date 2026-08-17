// src/security/sanitization.ts
import { sanitizeHtml, parseAndSanitizeMarkdown, parseAndSanitizeMarkdownSync } from "@/src/lib/security";
export { sanitizeHtml, parseAndSanitizeMarkdown, parseAndSanitizeMarkdownSync };
/**
 * Prevents prototype pollution by stripping keys like __proto__, constructor, and prototype.
 */
export function cleanObjectPrototype(obj) {
    if (obj === null || typeof obj !== "object")
        return obj;
    if (Array.isArray(obj)) {
        return obj.map(cleanObjectPrototype);
    }
    const cleanObj = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            if (key === "__proto__" || key === "constructor" || key === "prototype") {
                continue; // Drop dangerous keys
            }
            cleanObj[key] = cleanObjectPrototype(obj[key]);
        }
    }
    return cleanObj;
}
/**
 * Parses JSON strings safely with a prototype pollution guard.
 */
export function safeJsonParse(jsonString, fallback = null) {
    try {
        const rawParsed = JSON.parse(jsonString);
        return cleanObjectPrototype(rawParsed);
    }
    catch (error) {
        console.error("JSON parsing safety error:", error);
        return fallback;
    }
}
