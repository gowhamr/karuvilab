import DOMPurifyModule from 'dompurify';
import { marked } from 'marked';

function getPurifyInstance() {
  const instance = (DOMPurifyModule as any).default || DOMPurifyModule;
  if (typeof instance === 'function') {
    if (typeof window !== 'undefined') {
      return instance(window);
    }
    try {
      const { JSDOM } = require('jsdom');
      return instance(new JSDOM('').window);
    } catch {
      return instance;
    }
  }
  return instance;
}

const DOMPurify = getPurifyInstance();

/**
 * Sanitizes HTML to prevent XSS attacks.
 * Uses DOMPurify with strict defaults.
 */
if (DOMPurify && typeof DOMPurify.addHook === 'function') {
  DOMPurify.addHook('afterSanitizeAttributes', function(node: any) {
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
}

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
      'blockquote', 'p', 'a', 'ul', 'ol', 'li', 'b', 'i', 'strong', 'em', 
      'strike', 'code', 'pre', 'hr', 'br', 'div', 'span', 'img', 'del'
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'target', 'rel'],
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
 * Synchronous version for use in useMemo if needed.
 */
export function parseAndSanitizeMarkdownSync(md: string): string {
  const rawHtml = marked.parse(md, { async: false }) as string;
  return sanitizeHtml(rawHtml);
}
