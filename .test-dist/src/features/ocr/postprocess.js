/**
 * KaruviLab (KV) Generic OCR Engine - Postprocessing & CTC Decoder
 */
export function decodeCtcOutput(outputTensor, dictionary, scoreThreshold = 0.5) {
    const startTime = performance.now();
    const boxes = [];
    const numClasses = dictionary.length > 0 ? dictionary.length + 1 : 97;
    const seqLen = Math.floor(outputTensor.length / numClasses);
    let decodedText = '';
    let confidences = [];
    let lastCharIndex = -1;
    for (let seq = 0; seq < seqLen; seq++) {
        let maxScore = -1;
        let maxIdx = 0;
        for (let c = 0; c < numClasses; c++) {
            const score = outputTensor[seq * numClasses + c] || 0;
            if (score > maxScore) {
                maxScore = score;
                maxIdx = c;
            }
        }
        const isBlank = maxIdx === 0 || maxIdx === numClasses - 1;
        if (!isBlank && maxIdx !== lastCharIndex && maxScore >= scoreThreshold) {
            if (dictionary.length > 0) {
                const charIdx = maxIdx === 0 ? 0 : maxIdx - 1;
                decodedText += dictionary[charIdx] || '';
            }
            else {
                decodedText += String.fromCharCode(maxIdx + 32);
            }
            confidences.push(maxScore);
        }
        lastCharIndex = maxIdx;
    }
    const avgConfidence = confidences.length > 0
        ? confidences.reduce((a, b) => a + b, 0) / confidences.length
        : 0;
    // Single block bounding box for the entire detected text
    boxes.push({
        x: 0, y: 0, width: 300, height: 30,
        confidence: avgConfidence,
        text: decodedText
    });
    const fullText = decodedText;
    return {
        fullText,
        confidence: Math.round(avgConfidence * 100) / 100,
        boxes,
        processingTimeMs: Math.round(performance.now() - startTime)
    };
}
