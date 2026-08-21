/**
 * KaruviLab Mermaid Render Manager
 * Centralized singleton managing rendering, caching, queues, security, and export readiness.
 */
import { sanitizeHtml } from '@/src/lib/security';
import { logger } from '@/src/lib/logger';
import { MermaidSecurity } from './MermaidSecurity';
import { MermaidPreflightAnalyzer } from './MermaidPreflight';
import { mermaidCache } from './MermaidCache';
import { mermaidQueue } from './MermaidQueue';
export class MermaidRenderManager {
    static instance;
    currentTheme = null;
    isInitialized = false;
    metrics = {
        totalRenders: 0,
        cacheHits: 0,
        cacheMisses: 0,
        renderErrors: 0,
        abortedRenders: 0,
        avgRenderTimeMs: 0,
        lastRenderTimeMs: 0,
    };
    constructor() { }
    static getInstance() {
        if (!MermaidRenderManager.instance) {
            MermaidRenderManager.instance = new MermaidRenderManager();
        }
        return MermaidRenderManager.instance;
    }
    /**
     * Determine active theme mode ('dark' | 'light')
     */
    getActiveTheme() {
        if (typeof document === 'undefined')
            return 'dark';
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark' ||
            document.documentElement.classList.contains('dark') ||
            (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches);
        return isDark ? 'dark' : 'light';
    }
    /**
     * Initialize Mermaid engine with deterministic seed and strict security config.
     */
    initializeEngine(theme) {
        if (typeof window === 'undefined')
            return;
        const mermaid = window.mermaid;
        if (!mermaid || typeof mermaid.initialize !== 'function')
            return;
        const targetTheme = theme || this.getActiveTheme();
        if (this.isInitialized && this.currentTheme === targetTheme) {
            return;
        }
        const isDark = targetTheme === 'dark';
        const secureConfig = MermaidSecurity.getSecureConfig(isDark);
        const themeVariables = isDark
            ? {
                darkMode: true,
                background: '#101626',
                primaryColor: '#1e293b',
                primaryTextColor: '#f8fafc',
                primaryBorderColor: '#3b82f6',
                lineColor: '#94a3b8',
                secondaryColor: '#171f33',
                tertiaryColor: '#101626',
                textColor: '#f8fafc',
                nodeTextColor: '#f8fafc',
                mainBkg: '#1e293b',
                nodeBorder: '#3b82f6',
                clusterBkg: '#070b14',
                clusterBorder: '#334155',
                titleColor: '#f8fafc',
                edgeLabelBackground: '#101626',
                actorTextColor: '#f8fafc',
                actorLineColor: '#94a3b8',
                signalColor: '#f8fafc',
                signalTextColor: '#f8fafc',
                labelTextColor: '#f8fafc',
                loopTextColor: '#f8fafc',
                noteBorderColor: '#60a5fa',
                noteBkgColor: '#1e293b',
                noteTextColor: '#f8fafc',
                fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                fontSize: '14px',
            }
            : {
                darkMode: false,
                background: '#ffffff',
                primaryColor: '#eff6ff',
                primaryTextColor: '#0f172a',
                primaryBorderColor: '#3b82f6',
                lineColor: '#475569',
                secondaryColor: '#f1f5f9',
                tertiaryColor: '#ffffff',
                textColor: '#0f172a',
                nodeTextColor: '#0f172a',
                mainBkg: '#eff6ff',
                nodeBorder: '#3b82f6',
                clusterBkg: '#f8fafc',
                clusterBorder: '#cbd5e1',
                titleColor: '#0f172a',
                edgeLabelBackground: '#ffffff',
                actorTextColor: '#0f172a',
                actorLineColor: '#475569',
                signalColor: '#0f172a',
                signalTextColor: '#0f172a',
                labelTextColor: '#0f172a',
                loopTextColor: '#0f172a',
                noteBorderColor: '#3b82f6',
                noteBkgColor: '#eff6ff',
                noteTextColor: '#0f172a',
                fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                fontSize: '14px',
            };
        try {
            mermaid.initialize({
                ...secureConfig,
                themeVariables,
            });
            this.currentTheme = targetTheme;
            this.isInitialized = true;
        }
        catch (e) {
            logger.warn('Mermaid engine initialization warning', { error: e });
        }
    }
    /**
     * Renders a diagram with full caching, preflight, queueing, cancellation, and error isolation.
     */
    async renderDiagram(block, options = {}) {
        const startTime = performance.now();
        const theme = options.theme || this.getActiveTheme();
        const hash = block.hash || MermaidPreflightAnalyzer.computeHash(block.source, theme);
        // 1. Preflight validation
        const preflight = MermaidPreflightAnalyzer.preflight(block.source);
        if (!preflight.valid) {
            const errorMsg = preflight.errors.join('; ');
            this.metrics.renderErrors++;
            const errorKind = preflight.complexity.complexity === 'blocked'
                ? 'COMPLEXITY_LIMIT'
                : 'SYNTAX_ERROR';
            return {
                id: block.id,
                hash,
                svg: '',
                error: errorMsg,
                errorKind,
                source: block.source,
                timestamp: Date.now(),
                generationId: options.generationId,
            };
        }
        // 2. Check L1 Cache
        if (!options.forceRerender) {
            const cached = mermaidCache.get(hash, theme);
            if (cached) {
                this.metrics.cacheHits++;
                return {
                    id: block.id,
                    hash: cached.hash,
                    svg: cached.svg,
                    width: cached.width,
                    height: cached.height,
                    source: block.source,
                    timestamp: cached.timestamp,
                    generationId: options.generationId,
                    renderTimeMs: 0,
                    cacheHit: true,
                };
            }
        }
        this.metrics.cacheMisses++;
        // 3. Enqueue render job through concurrency controller
        const priority = options.priority === 'immediate' ? 10 : 0;
        const { promise } = mermaidQueue.enqueue(block.id, async (signal) => {
            if (signal.aborted) {
                throw new DOMException('Render aborted before start', 'AbortError');
            }
            // Ensure fonts are loaded before layout measurement
            if (typeof document !== 'undefined' && 'fonts' in document) {
                try {
                    await document.fonts.ready;
                }
                catch {
                    // Ignore font loading errors
                }
            }
            this.initializeEngine(theme);
            const mermaid = window.mermaid;
            if (!mermaid || typeof mermaid.render !== 'function') {
                throw new Error('Mermaid library not loaded');
            }
            // Use deterministic seed for stable SVG IDs
            const renderSeedId = `mmd-${hash.substring(0, 10)}`;
            const { svg } = await mermaid.render(renderSeedId, block.source);
            if (signal.aborted) {
                throw new DOMException('Render aborted after layout', 'AbortError');
            }
            // Sanitize generated SVG (KL-09)
            const sanitizedSvg = sanitizeHtml(svg, {
                USE_PROFILES: { svg: true, svgFilters: true, html: true },
                ADD_TAGS: [
                    'foreignObject', 'foreignobject', 'style', 'text', 'tspan',
                    'defs', 'marker', 'use', 'clipPath', 'g', 'path', 'rect',
                    'circle', 'line', 'polyline', 'polygon', 'div', 'span', 'p',
                    'br', 'b', 'i', 'strong', 'em'
                ],
                ADD_ATTR: [
                    'xmlns', 'viewBox', 'width', 'height', 'fill', 'stroke', 'stroke-width',
                    'transform', 'id', 'class', 'style', 'marker-end', 'marker-start',
                    'd', 'x', 'y', 'dx', 'dy', 'text-anchor', 'dominant-baseline',
                    'font-size', 'font-family', 'font-weight', 'rx', 'ry', 'cx', 'cy', 'r',
                    'x1', 'y1', 'x2', 'y2', 'opacity', 'fill-opacity', 'stroke-opacity',
                    'preserveAspectRatio', 'color', 'aria-roledescription', 'aria-label'
                ],
                FORCE_BODY: false,
            });
            // Store in LRU Cache
            mermaidCache.set({
                id: block.id,
                hash,
                svg: sanitizedSvg,
                theme,
                timestamp: Date.now(),
                approxBytes: sanitizedSvg.length * 2 + hash.length * 2 + 256,
                mermaidVersion: '11.x',
            });
            return sanitizedSvg;
        }, priority, options.signal);
        try {
            const renderedSvg = await promise;
            const elapsed = performance.now() - startTime;
            this.metrics.totalRenders++;
            this.metrics.lastRenderTimeMs = elapsed;
            this.metrics.avgRenderTimeMs =
                (this.metrics.avgRenderTimeMs * (this.metrics.totalRenders - 1) + elapsed) /
                    this.metrics.totalRenders;
            return {
                id: block.id,
                hash,
                svg: renderedSvg,
                source: block.source,
                timestamp: Date.now(),
                generationId: options.generationId,
                renderTimeMs: elapsed,
                cacheHit: false,
            };
        }
        catch (err) {
            if (err?.name === 'AbortError') {
                this.metrics.abortedRenders++;
                throw err;
            }
            this.metrics.renderErrors++;
            logger.warn('Mermaid rendering error for diagram', { toolId: 'markdown', action: 'renderMermaid', error: err });
            const errorMsg = String(err?.message || 'Diagram syntax error');
            const isSyntax = /parse|syntax|expecting|lexer|token/i.test(errorMsg);
            return {
                id: block.id,
                hash,
                svg: '',
                error: errorMsg,
                errorKind: isSyntax ? 'SYNTAX_ERROR' : 'RENDER_ERROR',
                source: block.source,
                timestamp: Date.now(),
                generationId: options.generationId,
                cacheHit: false,
            };
        }
    }
    /**
     * Export readiness helper: waits until all active Mermaid tasks finish and fonts are ready.
     */
    async waitForMermaidReady(timeoutMs = 8000) {
        const start = Date.now();
        while (mermaidQueue.pendingCount > 0) {
            if (Date.now() - start > timeoutMs) {
                logger.warn('Timed out waiting for Mermaid diagrams to finish rendering');
                break;
            }
            await new Promise(res => setTimeout(res, 50));
        }
        if (typeof document !== 'undefined' && 'fonts' in document) {
            try {
                await document.fonts.ready;
            }
            catch {
                // Ignore font load errors
            }
        }
    }
    getMetrics() {
        return {
            ...this.metrics,
            approxCacheBytes: mermaidCache.getStats().currentBytes,
        };
    }
    clearCache() {
        mermaidCache.clear();
        mermaidQueue.cancelAll();
    }
}
export const mermaidManager = MermaidRenderManager.getInstance();
