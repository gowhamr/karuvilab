import DOMPurify from 'isomorphic-dompurify';
import { marked } from 'marked';

// isomorphic-dompurify provides a ready-to-use instance in both
// browser and Node/SSR environments — no manual factory needed.

let _hookInstalled = false;

function ensureHooks(): void {
  if (_hookInstalled) return;
  _hookInstalled = true;

  if (typeof DOMPurify.addHook === 'function') {
    try {
      DOMPurify.addHook('afterSanitizeAttributes', function (node: Element) {
        if (node.tagName && node.tagName.toLowerCase() === 'a') {
          const href = node.getAttribute('href');
          if (href && href.trim().toLowerCase().startsWith('javascript:')) {
            node.removeAttribute('href');
          } else {
            node.setAttribute('target', '_blank');
            node.setAttribute('rel', 'noopener noreferrer');
          }
        }
      });
    } catch {
      // Hook not supported on fallback instance
    }
  }
}

/**
 * Returns the isomorphic DOMPurify instance (works in both browser and SSR).
 */
export function getDOMPurify() {
  ensureHooks();
  return DOMPurify;
}

const DEFAULT_SANITIZE_CONFIG = {
  ALLOWED_TAGS: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
    'blockquote', 'p', 'a', 'ul', 'ol', 'li', 'b', 'i', 'strong', 'em', 
    'strike', 'code', 'pre', 'hr', 'br', 'div', 'span', 'img', 'del',
    'svg', 'path', 'rect', 'circle', 'line', 'polyline', 'polygon', 'g'
  ],
  ALLOWED_ATTR: [
    'href', 'src', 'alt', 'title', 'class', 'className', 'target', 'rel',
    'width', 'height', 'viewBox', 'fill', 'stroke', 'stroke-width',
    'stroke-linecap', 'stroke-linejoin', 'points', 'd', 'rx', 'ry', 'cx', 'cy', 'r'
  ],
  ADD_ATTR: ['target', 'rel'],
  FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'base'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onmouseenter', 'onmouseleave'],
};

/**
 * Sanitizes HTML to prevent XSS attacks.
 * Uses isomorphic-dompurify with strict defaults across browser and SSR/Node environments.
 */
export function sanitizeHtml(html: string, options?: Record<string, unknown>): string {
  if (!html) return '';
  ensureHooks();
  return DOMPurify.sanitize(html, options || DEFAULT_SANITIZE_CONFIG);
}

/**
 * Safely parses and sanitizes markdown.
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

