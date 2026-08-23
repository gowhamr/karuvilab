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
    static async parseToTipTap(md) {
        // For small documents (<100KB), run instant synchronous path (<5ms)
        if (md.length < 100 * 1024) {
            const { markdownToTipTap } = await import('./transformer/markdown-tiptap');
            return markdownToTipTap(md);
        }
        // For large documents (>=100KB), offload AST generation to Web Worker via WorkerOrchestrator (P-04 / PERF-01)
        try {
            const { workerManager } = await import('@/src/workers/manager');
            return await workerManager.parseMarkdownToTipTap(md);
        }
        catch (e) {
            logger.error('Worker TipTap parse error, falling back to sync', { error: e });
            const { markdownToTipTap } = await import('./transformer/markdown-tiptap');
            return markdownToTipTap(md);
        }
    }
    static getStats(md) {
        if (!md)
            return { lines: 0, words: 0, chars: 0, readMin: 1 };
        let lines = 1;
        let words = 0;
        let inWord = false;
        const len = md.length;
        for (let i = 0; i < len; i++) {
            const code = md.charCodeAt(i);
            if (code === 10) { // '\n'
                lines++;
            }
            if (code <= 32) { // whitespace
                if (inWord) {
                    words++;
                    inWord = false;
                }
            }
            else {
                inWord = true;
            }
        }
        if (inWord)
            words++;
        const readMin = Math.max(1, Math.ceil(words / 200));
        return { lines, words, chars: len, readMin };
    }
}
