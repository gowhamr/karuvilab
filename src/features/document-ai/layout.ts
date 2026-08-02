/**
 * KaruviLab (KV) AI Document Intelligence - Layout Analysis Engine
 */

export interface DocumentBlock {
  type: 'heading' | 'paragraph' | 'table' | 'image';
  text: string;
  bbox: [number, number, number, number];
  confidence: number;
}

export function parseDocumentLayout(rawText: string): DocumentBlock[] {
  const lines = rawText.split('\n').filter(l => l.trim().length > 0);
  return lines.map((line, idx) => ({
    type: line.length < 35 && !line.endsWith('.') ? 'heading' : 'paragraph',
    text: line.trim(),
    bbox: [20, 20 + idx * 30, 500, 24],
    confidence: 0.95
  }));
}
