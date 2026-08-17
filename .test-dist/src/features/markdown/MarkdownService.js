import { sanitizeHtml } from '@/src/lib/security';
import { logger } from '@/src/lib/logger';
/**
 * MarkdownService handles parsing and exporting of Markdown content.
 */
export class MarkdownService {
    static escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    static async parse(md) {
        try {
            const { workerManager } = await import('@/src/workers/manager');
            const rawHtml = await workerManager.parseMarkdown(md);
            return sanitizeHtml(rawHtml);
        }
        catch (e) {
            logger.error('Markdown parse error', { error: e });
            const safeMsg = this.escapeHtml(e.message || 'Unknown error');
            return `<p class="text-error">Parse error: ${safeMsg}</p>`;
        }
    }
    static getStats(md) {
        const lines = md ? md.split('\n').length : 0;
        const words = md.trim() ? md.trim().split(/\s+/).filter(Boolean).length : 0;
        const chars = md.length;
        const readMin = Math.max(1, Math.ceil(words / 200));
        return { lines, words, chars, readMin };
    }
}
