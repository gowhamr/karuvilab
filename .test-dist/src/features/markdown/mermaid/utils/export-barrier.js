/**
 * KaruviLab Comprehensive Document Export Barrier
 * Coordinates readiness across Markdown parsing, Mermaid queues, Web Fonts, Images, and SVGs
 * before PDF/HTML/DOCX generation.
 *
 * Also enforces document revision consistency: if the user modifies Markdown while export
 * preparation is running, the barrier detects the stale revision and signals cancellation.
 */
import { mermaidManager } from '../MermaidRenderManager';
import { documentRevision } from '../../DocumentRevision';
export async function waitForDocumentReady(container, timeoutMs = 8000) {
    const start = performance.now();
    const capturedRevision = documentRevision.capture();
    // 1. Wait for Mermaid diagram rendering queue and worker tasks to settle
    await mermaidManager.waitForMermaidReady(timeoutMs);
    // Check revision after Mermaid queue drains
    if (!documentRevision.isCurrent(capturedRevision)) {
        return {
            ready: false,
            elapsedMs: performance.now() - start,
            imagesLoaded: 0,
            diagramsReady: true,
            revisionChanged: true,
            capturedRevision,
        };
    }
    // 2. Wait for document web fonts to complete layout measurement
    if (typeof document !== 'undefined' && 'fonts' in document) {
        try {
            await Promise.race([
                document.fonts.ready,
                new Promise((res) => setTimeout(res, 2000)),
            ]);
        }
        catch {
            // Font readiness fallback
        }
    }
    // 3. Wait for all preview images to finish loading (or report error without hanging)
    let imagesLoaded = 0;
    if (container) {
        const images = Array.from(container.querySelectorAll('img'));
        const pendingImages = images.filter((img) => !img.complete);
        if (pendingImages.length > 0) {
            await Promise.race([
                Promise.all(pendingImages.map((img) => new Promise((resolve) => {
                    img.addEventListener('load', () => resolve(), { once: true });
                    img.addEventListener('error', () => resolve(), { once: true });
                }))),
                new Promise((res) => setTimeout(res, 3000)),
            ]);
        }
        imagesLoaded = images.filter((img) => img.complete && img.naturalWidth > 0).length;
    }
    // Final revision check before signaling ready
    const revisionChanged = !documentRevision.isCurrent(capturedRevision);
    const elapsedMs = performance.now() - start;
    return {
        ready: !revisionChanged,
        elapsedMs,
        imagesLoaded,
        diagramsReady: true,
        revisionChanged,
        capturedRevision,
    };
}
