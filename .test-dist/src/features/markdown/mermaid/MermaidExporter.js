import { logger } from '@/src/lib/logger';
export class MermaidExporter {
    static DEFAULT_MAX_DIMENSION = 4096;
    static DEFAULT_TIMEOUT_MS = 6000;
    /**
     * Validates whether an SVG element has valid structural dimensions for export.
     */
    static validateExportSvg(svg) {
        if (!svg)
            return false;
        const viewBox = svg.getAttribute('viewBox');
        const width = svg.getAttribute('width');
        const height = svg.getAttribute('height');
        const bbox = svg.getBoundingClientRect ? svg.getBoundingClientRect() : null;
        return !!(viewBox || (width && height) || (bbox && (bbox.width > 0 || bbox.height > 0)));
    }
    /**
     * Resolves remote <image> tags within an SVG to inline data URLs to prevent canvas tainting.
     */
    static async inlineSvgImages(svgClone) {
        const images = Array.from(svgClone.querySelectorAll('image'));
        if (images.length === 0)
            return;
        await Promise.all(images.map(async (img) => {
            const href = img.getAttribute('href') || img.getAttribute('xlink:href');
            if (!href || href.startsWith('data:') || href.startsWith('blob:'))
                return;
            try {
                const resp = await fetch(href, { mode: 'cors' });
                if (!resp.ok)
                    return;
                const blob = await resp.blob();
                const reader = new FileReader();
                const dataUrl = await new Promise((resolve, reject) => {
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });
                img.setAttribute('href', dataUrl);
                img.removeAttribute('xlink:href');
            }
            catch (e) {
                logger.warn('Failed to inline external SVG image for export', { error: e });
            }
        }));
    }
    /**
     * Inlines critical font definitions and standard typography into the SVG
     * to ensure pixel-perfect font rendering on canvas without layout shifts.
     */
    static injectExportStyles(svgClone) {
        let styleEl = svgClone.querySelector('style');
        if (!styleEl) {
            styleEl = document.createElementNS('http://www.w3.org/2000/svg', 'style');
            if (svgClone.firstChild) {
                svgClone.insertBefore(styleEl, svgClone.firstChild);
            }
            else {
                svgClone.appendChild(styleEl);
            }
        }
        const defaultTypography = `
      text, tspan, .nodeLabel, .label, .labelText {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
      }
      foreignObject div, foreignObject p, foreignObject span {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
      }
    `;
        if (styleEl) {
            if (styleEl) {
                styleEl.textContent = (styleEl.textContent || '') + '\n' + defaultTypography;
            }
        }
    }
    /**
     * Converts a canonical rendered Mermaid SVGSVGElement to an encoded Data URL.
     * Hardened against foreignObject namespace issues, font missing rules, and missing viewBoxes.
     */
    static async svgToDataUrl(svg) {
        try {
            const clone = svg.cloneNode(true);
            // 1. Ensure required SVG namespaces
            clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            clone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
            clone.setAttribute('xmlns:xhtml', 'http://www.w3.org/1999/xhtml');
            // 2. Explicitly resolve dimensions
            const bbox = svg.getBoundingClientRect ? svg.getBoundingClientRect() : null;
            let width = parseFloat(clone.getAttribute('width') || '0');
            let height = parseFloat(clone.getAttribute('height') || '0');
            if ((!width || !height) && bbox && bbox.width > 0 && bbox.height > 0) {
                width = bbox.width;
                height = bbox.height;
            }
            if ((!width || !height) && clone.getAttribute('viewBox')) {
                const parts = clone.getAttribute('viewBox').split(/\s+/).map(Number);
                if (parts.length === 4 && parts[2] && parts[3]) {
                    width = parts[2];
                    height = parts[3];
                }
            }
            if (width > 0 && !clone.getAttribute('width'))
                clone.setAttribute('width', width.toString());
            if (height > 0 && !clone.getAttribute('height'))
                clone.setAttribute('height', height.toString());
            if (!clone.getAttribute('viewBox') && width > 0 && height > 0) {
                clone.setAttribute('viewBox', `0 0 ${width} ${height}`);
            }
            // 3. Fix foreignObject namespaces for strict XML parsers
            const foreignObjects = Array.from(clone.querySelectorAll('foreignObject, foreignobject'));
            for (const fo of foreignObjects) {
                fo.setAttribute('requiredExtensions', 'http://www.w3.org/1999/xhtml');
                const firstChild = fo.firstElementChild;
                if (firstChild && !firstChild.getAttribute('xmlns')) {
                    firstChild.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
                }
            }
            // 4. Resolve external images
            await this.inlineSvgImages(clone);
            // 5. Inject stable typography styles
            this.injectExportStyles(clone);
            // 6. Serialize and encode
            const serializer = new XMLSerializer();
            let svgStr = serializer.serializeToString(clone);
            // Double check foreignObject tags
            svgStr = svgStr.replace(/<foreignObject(?![^>]*xmlns=)/g, '<foreignObject xmlns="http://www.w3.org/1999/xhtml"');
            // Base64 encode UTF-8 string safely
            return `data:image/svg+xml;base64,${window.btoa(unescape(encodeURIComponent(svgStr)))}`;
        }
        catch (e) {
            logger.error('Failed to convert SVG to Data URL', { error: e });
            return '';
        }
    }
    /**
     * Converts an SVG element into a high-DPI rasterized PNG Data URL.
     * Includes dimension limiting to enforce memory ceilings and avoid browser crashes.
     */
    static async svgToRaster(svg, options = {}) {
        const scale = options.scale ?? 2;
        const maxDimension = options.maxDimension ?? this.DEFAULT_MAX_DIMENSION;
        const backgroundColor = options.backgroundColor ?? '#ffffff';
        const timeoutMs = options.timeoutMs ?? this.DEFAULT_TIMEOUT_MS;
        const dataUrl = await this.svgToDataUrl(svg);
        if (!dataUrl) {
            throw new Error('Invalid SVG data URL for rasterization');
        }
        return new Promise((resolve, reject) => {
            let timeoutHandle = null;
            const cleanup = () => {
                if (timeoutHandle)
                    clearTimeout(timeoutHandle);
            };
            timeoutHandle = setTimeout(() => {
                cleanup();
                reject(new Error(`Mermaid SVG rasterization timed out after ${timeoutMs}ms`));
            }, timeoutMs);
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                cleanup();
                try {
                    const canvas = document.createElement('canvas');
                    const bbox = svg.getBoundingClientRect ? svg.getBoundingClientRect() : null;
                    const baseWidth = bbox?.width || img.naturalWidth || parseFloat(svg.getAttribute('width') || '800') || 800;
                    const baseHeight = bbox?.height || img.naturalHeight || parseFloat(svg.getAttribute('height') || '600') || 600;
                    // Compute bounded dimensions respecting scale and memory ceilings
                    const targetWidth = Math.min(Math.round(baseWidth * scale), maxDimension);
                    const targetHeight = Math.min(Math.round(baseHeight * scale), maxDimension);
                    canvas.width = targetWidth;
                    canvas.height = targetHeight;
                    const ctx = canvas.getContext('2d');
                    if (!ctx)
                        throw new Error('Failed to obtain canvas 2D rendering context');
                    // Solid background fill for PDF/PNG export
                    if (backgroundColor !== 'transparent') {
                        ctx.fillStyle = backgroundColor;
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                    }
                    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
                    resolve(canvas.toDataURL('image/png', 1.0));
                }
                catch (e) {
                    reject(e);
                }
            };
            img.onerror = (e) => {
                cleanup();
                logger.error('SVG Rasterization image load failed', { error: e });
                reject(new Error('SVG rasterization image load failed'));
            };
            img.src = dataUrl;
        });
    }
    /**
     * Centralized adapter for PDF preparation:
     * Scans container for all Mermaid diagrams, waits for web fonts, rasterizes all SVGs
     * with per-diagram error isolation, and swaps them for high-DPI <img> tags.
     */
    static async prepareForPdf(container, scale = 2) {
        if (!container)
            return { processed: 0, errors: 0 };
        // 1. Wait for document fonts to settle
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
        // 2. Discover all rendered Mermaid SVG elements
        const svgElements = Array.from(container.querySelectorAll('.mermaid-container svg, .mermaid-mount-container svg, svg.mermaid-svg, div[data-lang="mermaid"] svg'));
        if (svgElements.length === 0) {
            return { processed: 0, errors: 0 };
        }
        let processedCount = 0;
        let errorCount = 0;
        // 3. Process all diagrams concurrently with per-diagram error isolation
        await Promise.allSettled(svgElements.map(async (svgNode, idx) => {
            if (!this.validateExportSvg(svgNode))
                return;
            try {
                const rasterDataUrl = await this.svgToRaster(svgNode, { scale, backgroundColor: '#ffffff' });
                const img = document.createElement('img');
                img.src = rasterDataUrl;
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
                img.style.display = 'block';
                img.style.margin = '16px auto';
                img.className = 'mermaid-pdf-raster';
                img.alt = `Mermaid Diagram ${idx + 1}`;
                if (svgNode.parentNode) {
                    svgNode.parentNode.replaceChild(img, svgNode);
                    processedCount++;
                }
            }
            catch (e) {
                errorCount++;
                logger.warn(`Failed to rasterize Mermaid diagram #${idx + 1} for PDF`, { error: e });
                // Error isolation: Render graceful error banner instead of failing entire export
                const fallbackCard = document.createElement('div');
                fallbackCard.className = 'mermaid-export-error';
                fallbackCard.style.padding = '12px';
                fallbackCard.style.margin = '16px 0';
                fallbackCard.style.border = '1px dashed #ef4444';
                fallbackCard.style.borderRadius = '8px';
                fallbackCard.style.backgroundColor = '#fef2f2';
                fallbackCard.style.color = '#991b1b';
                fallbackCard.style.fontSize = '12px';
                fallbackCard.style.fontFamily = 'monospace';
                fallbackCard.textContent = `[Diagram #${idx + 1}: Render fallback - complex vector structure retained]`;
                if (svgNode.parentNode) {
                    svgNode.parentNode.replaceChild(fallbackCard, svgNode);
                }
            }
        }));
        return { processed: processedCount, errors: errorCount };
    }
}
