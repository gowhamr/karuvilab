import { marked } from 'marked';

// DOMPurify is lazy-loaded only on the client (where window + DOM exist).
// During SSR prerendering, a regex fallback sanitizes trusted in-repo content.
// This avoids webpack bundling DOMPurify/jsdom for the server chunk.

let _purifyInstance: { sanitize: (html: string, config?: Record<string, unknown>) => string; addHook?: (hook: string, cb: (node: Element) => void) => void } | null = null;
let _hookInstalled = false;

function getClientPurify() {
  if (typeof window === 'undefined') return null;
  if (_purifyInstance) return _purifyInstance;

  try {
    const mod = require('dompurify');
    const DOMPurify = mod.default || mod;
    _purifyInstance = typeof DOMPurify === 'function' ? DOMPurify(window) : DOMPurify;

    if (_purifyInstance && !_hookInstalled && typeof _purifyInstance.addHook === 'function') {
      _hookInstalled = true;
      _purifyInstance.addHook('afterSanitizeAttributes', function (node: Element) {
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
  } catch {
    _purifyInstance = null;
  }

  return _purifyInstance;
}

/**
 * Returns the DOMPurify instance (client-only). Returns null on the server.
 */
export function getDOMPurify() {
  return getClientPurify();
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
 * Regex-based sanitizer for SSR and fallback contexts.
 * Content reaching this path during SSR is trusted (in-repo markdown output
 * from marked.parse()). This strips dangerous patterns as defense-in-depth.
 */
function regexSanitize(html: string): string {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/on\w+\s*=\s*(["']).*?\1/gi, '')
    .replace(/on\w+\s*=\s*[^\s>]+/gi, '')
    .replace(/href\s*=\s*(["'])\s*javascript:.*?\1/gi, 'href="#"');
}

/**
 * Sanitizes HTML to prevent XSS attacks.
 * Uses DOMPurify on the client, regex fallback on the server (SSR).
 */
export function sanitizeHtml(html: string, options?: Record<string, unknown>): string {
  if (!html) return '';

  const purify = getClientPurify();
  if (purify && typeof purify.sanitize === 'function') {
    return purify.sanitize(html, options || DEFAULT_SANITIZE_CONFIG);
  }

  return regexSanitize(html);
}

/**
 * Pre-processes LaTeX math expressions ($...$ and $$...$$) into clean HTML math elements
 * before passing to marked.parse, preventing LaTeX leaks in UI text.
 */
export function parseMathNotation(text: string): string {
  if (!text) return text;

  const cleanLatex = (math: string): string => {
    return math
      .replace(/\\mathcal\{([A-Za-z]+)\}/g, '$1')
      .replace(/\\text\{([^}]+)\}/g, '$1')
      .replace(/\\mathrm\{([^}]+)\}/g, '$1')
      .replace(/\\mathbf\{([^}]+)\}/g, '$1')
      .replace(/\\le\b|\\leq\b/g, '≤')
      .replace(/\\ge\b|\\geq\b/g, '≥')
      .replace(/\\neq\b/g, '≠')
      .replace(/\\times\b/g, '×')
      .replace(/\\cdot\b/g, '·')
      .replace(/\\in\b/g, '∈')
      .replace(/\\infty\b/g, '∞')
      .replace(/\\approx\b/g, '≈')
      .replace(/\\alpha\b/g, 'α')
      .replace(/\\beta\b/g, 'β')
      .replace(/\\theta\b/g, 'θ')
      .replace(/\\pi\b/g, 'π')
      .replace(/\^2\b/g, '²')
      .replace(/\^3\b/g, '³')
      .replace(/\\log\b/g, 'log')
      .replace(/\\ln\b/g, 'ln')
      .replace(/\\/g, '');
  };

  // 1. Display math: $$ ... $$ or \[ ... \]
  let result = text.replace(/(?:\$\$|\\\[)([\s\S]+?)(?:\$\$|\\\])/g, (_, math) => {
    const cleaned = cleanLatex(math.trim());
    return `<div class="math-display">${cleaned}</div>`;
  });

  // 2. Inline math: $ ... $ or \( ... \)
  result = result.replace(/(?<!\$)\$([^\$\n]+?)\$(?!\$)|\\\(([\s\S]+?)\\\)/g, (match, m1, m2) => {
    const mathContent = (m1 || m2 || '').trim();
    if (/^\d+(?:\.\d+)?$/.test(mathContent)) {
      return match;
    }
    const cleaned = cleanLatex(mathContent);
    return `<span class="math-inline">${cleaned}</span>`;
  });

  return result;
}

/**
 * Safely parses and sanitizes markdown.
 */
export async function parseAndSanitizeMarkdown(md: string): Promise<string> {
  const mdWithMath = parseMathNotation(md);
  const rawHtml = await marked.parse(mdWithMath);
  return sanitizeHtml(rawHtml);
}

/**
 * Synchronous version of markdown sanitization.
 */
export function parseAndSanitizeMarkdownSync(md: string): string {
  const mdWithMath = parseMathNotation(md);
  const rawHtml = marked.parse(mdWithMath, { async: false }) as string;
  return sanitizeHtml(rawHtml);
}
