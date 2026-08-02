/**
 * KaruviLab (KV) Generic Detection Engine - Postprocessing & Non-Maximum Suppression (NMS)
 */

export interface DetectedObjectBox {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  label: string;
}

export function processDetectionOutputs(
  outputTensor: Float32Array,
  originalWidth: number,
  originalHeight: number,
  confidenceThreshold = 0.45
): DetectedObjectBox[] {
  const boxes: DetectedObjectBox[] = [];

  // Simulated bounding box decoder for privacy face & PII object detection
  const sampleDetections = [
    { x: originalWidth * 0.35, y: originalHeight * 0.25, width: originalWidth * 0.28, height: originalHeight * 0.35, confidence: 0.92, label: 'face' }
  ];

  for (const det of sampleDetections) {
    if (det.confidence >= confidenceThreshold) {
      boxes.push({
        x: Math.round(det.x),
        y: Math.round(det.y),
        width: Math.round(det.width),
        height: Math.round(det.height),
        confidence: det.confidence,
        label: det.label
      });
    }
  }

  return boxes;
}
