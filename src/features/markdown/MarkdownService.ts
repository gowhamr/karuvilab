import { marked } from 'marked';
import { sanitizeHtml } from '@/src/lib/security';
import { logger } from '@/src/lib/logger';

const MERMAID_LANGS = new Set([
  'mermaid', 'flowchart', 'flowcharttd', 'flowchartlr',
  'sequencediagram', 'sequence', 'classdiagram', 'class', 'erdiagram', 'er',
  'gantt', 'pie', 'gitgraph', 'git', 'mindmap', 'timeline', 'xychart', 'sankey'
]);

/**
 * MarkdownService handles parsing and exporting of Markdown content.
 */
export class MarkdownService {
  private static renderer: any = null;

  private static getRenderer() {
    if (this.renderer) return this.renderer;

    const renderer = new marked.Renderer();
    
    // Custom code block renderer for Mermaid and Syntax Highlighting
    renderer.code = ({ text, lang }: { text: string; lang?: string }) => {
      const safeCode = String(text || '');
      const rawLang = String(lang || '').trim();
      const safeLang = rawLang.toLowerCase().replace(/\s+/g, '');

      if (MERMAID_LANGS.has(safeLang) || safeLang.startsWith('mermaid')) {
        return `<div class="mermaid-placeholder" data-src="${encodeURIComponent(safeCode)}" data-lang="${rawLang || 'mermaid'}"></div>`;
      }

      // For syntax highlighting, we'll return a pre/code block that highlight.js can process
      return `<pre data-lang="${safeLang}"><code class="hljs${safeLang ? ' language-' + safeLang : ''}">${this.escapeHtml(safeCode)}</code></pre>`;
    };

    this.renderer = renderer;
    return renderer;
  }

  private static escapeHtml(unsafe: string) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  public static async parse(md: string): Promise<string> {
    try {
      const { workerManager } = await import('@/src/workers/manager');
      const rawHtml = await workerManager.parseMarkdown(md);
      return sanitizeHtml(rawHtml);
    } catch (e) {
      logger.error('Markdown parse error', { error: e });
      const safeMsg = this.escapeHtml((e as Error).message || 'Unknown error');
      return `<p class="text-error">Parse error: ${safeMsg}</p>`;
    }
  }

  public static getStats(md: string) {
    const lines = md ? md.split('\n').length : 0;
    const words = md.trim() ? md.trim().split(/\s+/).filter(Boolean).length : 0;
    const chars = md.length;
    const readMin = Math.max(1, Math.ceil(words / 200));
    return { lines, words, chars, readMin };
  }
}
