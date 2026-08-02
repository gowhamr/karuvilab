/**
 * KaruviLab (KV) Generic OCR Engine - Postprocessing & CTC Decoder
 */

export interface OcrBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  text: string;
}

export interface OcrResult {
  fullText: string;
  confidence: number;
  boxes: OcrBoundingBox[];
  processingTimeMs: number;
}

export function decodeCtcOutput(
  outputTensor: Float32Array,
  dictionary: string[],
  scoreThreshold = 0.5
): OcrResult {
  const startTime = performance.now();
  const boxes: OcrBoundingBox[] = [];

  // Simulated CTC beam search decoding for detected text blocks
  const sampleTexts = ["KaruviLab Offline Local AI Engine", "Privacy First - 100% In-Browser OCR"];
  
  sampleTexts.forEach((text, idx) => {
    boxes.push({
      x: 20,
      y: 30 + idx * 40,
      width: 300,
      height: 30,
      confidence: 0.96,
      text
    });
  });

  const fullText = boxes.map(b => b.text).join('\n');
  const avgConfidence = boxes.reduce((acc, b) => acc + b.confidence, 0) / (boxes.length || 1);

  return {
    fullText,
    confidence: Math.round(avgConfidence * 100) / 100,
    boxes,
    processingTimeMs: Math.round(performance.now() - startTime)
  };
}
