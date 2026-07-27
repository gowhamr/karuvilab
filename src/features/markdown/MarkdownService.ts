import { sanitizeHtml } from '@/src/lib/security';
import { logger } from '@/src/lib/logger';

/**
 * MarkdownService handles parsing and exporting of Markdown content.
 */
export class MarkdownService {
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
      return sanitizeHtml(rawHtml as string);
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
