import DOMPurify from 'isomorphic-dompurify';
import { marked } from 'marked';

/**
 * Sanitizes HTML to prevent XSS attacks.
 * Uses DOMPurify with strict defaults.
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
      'blockquote', 'p', 'a', 'ul', 'ol', 'li', 'b', 'i', 'strong', 'em', 
      'strike', 'code', 'pre', 'hr', 'br', 'div', 'span', 'img', 'del'
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'target', 'rel'],
    ADD_ATTR: ['target', 'rel'],
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'base'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
  });
}

/**
 * Safely parses and sanitizes markdown.
 */
export async function parseAndSanitizeMarkdown(md: string): Promise<string> {
  const rawHtml = await marked.parse(md);
  return sanitizeHtml(rawHtml);
}

/**
 * Synchronous version for use in useMemo if needed (but marked.parse can be async)
 * Marked.parse is actually sync if no async extensions are used.
 */
export function parseAndSanitizeMarkdownSync(md: string): string {
  const rawHtml = marked.parse(md, { async: false }) as string;
  return sanitizeHtml(rawHtml);
}
