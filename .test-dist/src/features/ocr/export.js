/**
 * KaruviLab (KV) Generic OCR Engine - Export Utilities
 */
export function exportOcrResult(result, format) {
    switch (format) {
        case 'txt':
            return result.fullText;
        case 'md':
            return `# OCR Extracted Text\n\n${result.fullText}\n\n---\n*Extracted via KaruviLab Local AI OCR Engine*`;
        case 'json':
            return JSON.stringify(result, null, 2);
        case 'csv':
            const header = 'Text,Confidence,X,Y,Width,Height\n';
            const rows = result.boxes
                .map(b => `"${b.text.replace(/"/g, '""')}",${b.confidence},${b.x},${b.y},${b.width},${b.height}`)
                .join('\n');
            return header + rows;
        default:
            return result.fullText;
    }
}
