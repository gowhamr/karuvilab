/**
 * KaruviLab (KV) Generic Detection Engine - Constants & Manifests
 */
export const YOLO_FACE_MANIFEST = {
    id: 'face-blur-yolo',
    name: 'YOLOv8 Face Detection',
    version: '8.0',
    file: '/models/yolov8-face.onnx',
    sha256: 'a1287939c05878d6b9d6a3666d6268800938f328a6f3a61f237890a88e89f12',
    sizeMB: 6.5,
    backend: ['webgpu', 'wasm'],
    input: { width: 640, height: 640, channels: 3, dataType: 'float32', shape: [1, 3, 640, 640] },
    output: { channels: 84, dataType: 'float32', shape: [1, 84, 8400] },
    category: 'detection',
    inputFormats: ['png', 'jpg', 'webp'],
    outputFormats: ['png', 'jpg'],
    preferredBackend: 'webgpu',
    supportsBatch: false,
    supportsOffline: true,
    estimatedMemoryMB: 75,
    estimatedInferenceMs: 450,
    description: 'Automatic privacy face blurring & object detection model.',
    license: 'AGPL-3.0'
};
