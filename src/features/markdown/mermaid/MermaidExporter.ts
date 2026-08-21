import { logger } from '@/src/lib/logger';

export class MermaidExporter {
  
  public static validateExportSvg(svg: SVGSVGElement): boolean {
    if (!svg || !svg.viewBox) return false;
    return true;
  }

  public static svgToDataUrl(svg: SVGSVGElement): string {
    try {
      const clone = svg.cloneNode(true) as SVGSVGElement;
      
      // Explicitly set width and height for canvas rendering
      const bbox = svg.getBoundingClientRect();
      if (!clone.getAttribute('width') && bbox.width) clone.setAttribute('width', bbox.width.toString());
      if (!clone.getAttribute('height') && bbox.height) clone.setAttribute('height', bbox.height.toString());

      const serializer = new XMLSerializer();
      let svgStr = serializer.serializeToString(clone);
      
      // Fix foreignObject namespaces for strict XML parsers
      svgStr = svgStr.replace(/<foreignObject/g, '<foreignObject xmlns="http://www.w3.org/1999/xhtml"');
      
      // Encode properly
      return `data:image/svg+xml;base64,${window.btoa(unescape(encodeURIComponent(svgStr)))}`;
    } catch (e) {
      logger.error('Failed to convert SVG to Data URL', { error: e });
      return '';
    }
  }

  public static async svgToRaster(svg: SVGSVGElement, scale: number = 2): Promise<string> {
    return new Promise((resolve, reject) => {
      const dataUrl = this.svgToDataUrl(svg);
      if (!dataUrl) {
        return reject(new Error('Invalid SVG data URL'));
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const bbox = svg.getBoundingClientRect();
          
          // Use natural dimensions or bounding box
          const width = bbox.width || img.naturalWidth || 800;
          const height = bbox.height || img.naturalHeight || 600;

          // Limit enormous dimensions (e.g. max 4000x4000 to prevent OOM)
          const MAX_DIMENSION = 4000;
          const safeWidth = Math.min(width * scale, MAX_DIMENSION);
          const safeHeight = Math.min(height * scale, MAX_DIMENSION);

          canvas.width = safeWidth;
          canvas.height = safeHeight;

          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('No 2D context');

          // Fill white background for transparent SVGs
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          resolve(canvas.toDataURL('image/png', 1.0));
        } catch (e) {
          reject(e);
        }
      };

      img.onerror = (e) => {
        logger.error('SVG Rasterization failed to load image', { error: e });
        reject(new Error('SVG to Raster failed'));
      };

      img.src = dataUrl;
    });
  }

  public static async prepareForPdf(container: HTMLElement, scale: number = 2): Promise<void> {
    const svgs = Array.from(container.querySelectorAll('.mermaid-mount-container svg'));
    
    // Wait for all fonts to be ready before rasterizing
    if (typeof document !== 'undefined' && 'fonts' in document) {
      await document.fonts.ready;
    }

    const promises = svgs.map(async (svgNode) => {
      if (!(svgNode instanceof SVGSVGElement)) return;
      if (!this.validateExportSvg(svgNode)) return;

      try {
        const rasterDataUrl = await this.svgToRaster(svgNode, scale);
        const img = document.createElement('img');
        img.src = rasterDataUrl;
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.className = 'mermaid-pdf-raster';
        img.alt = 'Mermaid Diagram';

        if (svgNode.parentNode) {
          svgNode.parentNode.replaceChild(img, svgNode);
        }
      } catch (e) {
        logger.warn('Failed to rasterize Mermaid diagram for PDF', { error: e });
        // Fallback: replace with error placeholder or leave as SVG (which html2canvas will likely drop)
      }
    });

    await Promise.all(promises);
  }
}
