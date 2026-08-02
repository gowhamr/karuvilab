/**
 * KaruviLab (KV) Generic OCR Engine - Text Layout & Reading Order Reconstructor
 */

import { OcrBoundingBox } from './postprocess';

export interface LayoutParagraph {
  id: string;
  lines: string[];
  bounds: { x: number; y: number; width: number; height: number };
}

export function reconstructTextLayout(boxes: OcrBoundingBox[]): LayoutParagraph[] {
  // Sort boxes by Y coordinates (lines top-to-bottom), then X (left-to-right)
  const sorted = [...boxes].sort((a, b) => {
    if (Math.abs(a.y - b.y) > 10) {
      return a.y - b.y;
    }
    return a.x - b.x;
  });

  const paragraphs: LayoutParagraph[] = [];
  let currentParagraph: LayoutParagraph | null = null;

  for (const box of sorted) {
    if (!currentParagraph) {
      currentParagraph = {
        id: `p-${Date.now()}-${Math.random()}`,
        lines: [box.text],
        bounds: { x: box.x, y: box.y, width: box.width, height: box.height }
      };
    } else {
      currentParagraph.lines.push(box.text);
    }
  }

  if (currentParagraph) {
    paragraphs.push(currentParagraph);
  }

  return paragraphs;
}
