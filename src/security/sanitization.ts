// src/security/sanitization.ts
import DOMPurify from "dompurify";
import { marked } from "marked";

/**
 * Sanitizes HTML strings using DOMPurify with a strict local-first setup.
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "h1", "h2", "h3", "h4", "h5", "h6", 
      "blockquote", "p", "a", "ul", "ol", "li", "b", "i", "strong", "em", 
      "strike", "code", "pre", "hr", "br", "div", "span", "img", "del"
    ],
    ALLOWED_ATTR: ["href", "src", "alt", "title", "className", "class", "target", "rel"],
    ADD_ATTR: ["target", "rel"],
    FORBID_TAGS: ["script", "style", "iframe", "object", "embed", "base"],
    FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover"],
  }) as string;
}

/**
 * Parses markdown securely and returns sanitized HTML.
 */
export async function parseAndSanitizeMarkdown(md: string): Promise<string> {
  const rawHtml = await marked.parse(md);
  return sanitizeHtml(rawHtml);
}

/**
 * Synchronous version of markdown sanitization.
 */
export function parseAndSanitizeMarkdownSync(md: string): string {
  const rawHtml = marked.parse(md, { async: false }) as string;
  return sanitizeHtml(rawHtml);
}

/**
 * Prevents prototype pollution by stripping keys like __proto__, constructor, and prototype.
 */
export function cleanObjectPrototype(obj: any): any {
  if (obj === null || typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    return obj.map(cleanObjectPrototype);
  }

  const cleanObj: Record<string, any> = {};
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
export function safeJsonParse(jsonString: string, fallback: any = null): any {
  try {
    const rawParsed = JSON.parse(jsonString);
    return cleanObjectPrototype(rawParsed);
  } catch (error) {
    console.error("JSON parsing safety error:", error);
    return fallback;
  }
}
