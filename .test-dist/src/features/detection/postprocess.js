/**
 * KaruviLab (KV) Generic Detection Engine - Postprocessing & Non-Maximum Suppression (NMS)
 */
function calculateIoU(boxA, boxB) {
    const xA = Math.max(boxA.x, boxB.x);
    const yA = Math.max(boxA.y, boxB.y);
    const xB = Math.min(boxA.x + boxA.width, boxB.x + boxB.width);
    const yB = Math.min(boxA.y + boxA.height, boxB.y + boxB.height);
    const interWidth = Math.max(0, xB - xA);
    const interHeight = Math.max(0, yB - yA);
    const interArea = interWidth * interHeight;
    const boxAArea = boxA.width * boxA.height;
    const boxBArea = boxB.width * boxB.height;
    const unionArea = boxAArea + boxBArea - interArea;
    return unionArea > 0 ? interArea / unionArea : 0;
}
export function applyNMS(candidates, iouThreshold = 0.45) {
    // Sort candidates descending by confidence
    const sorted = [...candidates].sort((a, b) => b.confidence - a.confidence);
    const selected = [];
    while (sorted.length > 0) {
        const current = sorted.shift();
        selected.push(current);
        for (let i = sorted.length - 1; i >= 0; i--) {
            if (calculateIoU(current, sorted[i]) > iouThreshold) {
                sorted.splice(i, 1);
            }
        }
    }
    return selected;
}
export function processDetectionOutputs(outputTensor, originalWidth, originalHeight, confidenceThreshold = 0.45, modelWidth = 640, modelHeight = 640) {
    if (!outputTensor || outputTensor.length === 0) {
        return [];
    }
    const numAnchors = 8400;
    const numAttributes = 84;
    // Validate tensor length for YOLOv8 [1, 84, 8400] format
    if (outputTensor.length < numAttributes * numAnchors) {
        // Graceful fallback for non-standard tensor length
        return [];
    }
    const scaleX = originalWidth / modelWidth;
    const scaleY = originalHeight / modelHeight;
    const candidates = [];
    const CLASS_LABELS = ['face', 'person', 'car', 'dog', 'cat'];
    for (let col = 0; col < numAnchors; col++) {
        // Row 0..3: cx, cy, w, h
        const cx = outputTensor[0 * numAnchors + col] ?? 0;
        const cy = outputTensor[1 * numAnchors + col] ?? 0;
        const w = outputTensor[2 * numAnchors + col] ?? 0;
        const h = outputTensor[3 * numAnchors + col] ?? 0;
        // Find max class confidence across rows 4..83
        let maxClassScore = -1;
        let maxClassId = 0;
        for (let row = 4; row < numAttributes; row++) {
            const score = outputTensor[row * numAnchors + col] ?? 0;
            if (score > maxClassScore) {
                maxClassScore = score;
                maxClassId = row - 4;
            }
        }
        if (maxClassScore >= confidenceThreshold) {
            const x = Math.max(0, Math.round((cx - w / 2) * scaleX));
            const y = Math.max(0, Math.round((cy - h / 2) * scaleY));
            const width = Math.round(w * scaleX);
            const height = Math.round(h * scaleY);
            const label = CLASS_LABELS[maxClassId] || 'face';
            candidates.push({
                x,
                y,
                width,
                height,
                confidence: maxClassScore,
                label
            });
        }
    }
    return applyNMS(candidates, 0.45);
}
