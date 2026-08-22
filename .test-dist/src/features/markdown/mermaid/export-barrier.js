/**
 * KaruviLab Mermaid Export Barrier
 *
 * Enforces the architectural rule:
 * "Render Mermaid once → sanitize once → cache the canonical SVG → adapt that SVG for each export format."
 *
 * This file serves as the centralized gatekeeper for all Mermaid export pipelines
 * to guarantee that multiple rendering paths are not accidentally created.
 */
import { MermaidExporter } from './MermaidExporter';
export const MermaidExportBarrier = {
    /**
     * Adapts canonical rendered Mermaid SVGs for safe PDF export.
     * This is the only permitted method for preparing diagrams for html2canvas/html2pdf.
     */
    async adaptForPdf(container, scale = 2) {
        await MermaidExporter.prepareForPdf(container, scale);
    }
};
