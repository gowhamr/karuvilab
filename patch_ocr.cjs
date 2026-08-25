const fs = require('fs');

let reg = fs.readFileSync('src/ai/registry.ts', 'utf8');
reg = reg.replace(
  "file: '/models/paddle-ocr.onnx',\n    sha256: '',\n    sizeMB: 8.2,\n    backend: ['webgpu', 'wasm'],\n    input: { width: 640, height: 640, channels: 3, dataType: 'float32', shape: [1, 3, 640, 640] },\n    output: { channels: 1, dataType: 'float32', shape: [1, 1, 640, 640] },\n    category: 'ocr',\n    tags: ['ocr'],\n    inputFormats: ['png', 'jpg', 'webp', 'pdf'],\n    outputFormats: ['txt', 'md', 'json', 'csv'],\n    preferredBackend: 'wasm',\n    supportsBatch: true,\n    supportsOffline: true,\n    estimatedMemoryMB: 90,\n    estimatedInferenceMs: 650,\n    available: false,",
  "file: '/models/paddle-ocr.onnx',\n    sha256: '',\n    sizeMB: 11.0,\n    backend: ['webgpu', 'wasm'],\n    input: { width: 320, height: 48, channels: 3, dataType: 'float32', shape: [1, 3, 48, 320] },\n    output: { channels: 1, dataType: 'float32', shape: [1, 6624, 6624] },\n    category: 'ocr',\n    tags: ['ocr'],\n    inputFormats: ['png', 'jpg', 'webp', 'pdf'],\n    outputFormats: ['txt', 'md', 'json', 'csv'],\n    preferredBackend: 'wasm',\n    supportsBatch: true,\n    supportsOffline: true,\n    estimatedMemoryMB: 90,\n    estimatedInferenceMs: 650,\n    available: true,"
);
fs.writeFileSync('src/ai/registry.ts', reg);

let worker = fs.readFileSync('src/workers/ai.worker.ts', 'utf8');
worker = worker.replace(
  "const pre = await preprocessOcrImage(imageBitmap, 640, 640);",
  "const pre = await preprocessOcrImage(imageBitmap, 320, 48);"
);
worker = worker.replace(
  "const result = decodeCtcOutput(outputTensor, []);",
  "const dictResponse = await fetch('/lib/dictionary/ppocr_keys_v1.txt');\n      const dict = await dictResponse.text();\n      const dictArr = dict.split('\\n').map(l => l.trim()).filter(Boolean);\n      const result = decodeCtcOutput(outputTensor, dictArr);"
);
fs.writeFileSync('src/workers/ai.worker.ts', worker);

