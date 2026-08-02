# KaruviLab Local AI Engine – Architecture & Developer Guide

## Core Principles
1. **Rule AI-01**: Framework owns infrastructure (`src/ai/`), features own intelligence (`src/features/`).
2. **Offline-First & Zero Server Uploads**: Neural networks execute locally in Web Workers via ONNX Runtime Web.
3. **Hardware Acceleration**: Automatic WebGPU → WASM SIMD → WASM CPU fallback tier.
4. **Integrity Enforcement**: Every model manifest enforces SHA-256 Web Crypto checksum verification before execution.

## Platform Modules

```
src/ai/
├── types.ts           # Shared model manifests, capability, and diagnostics types
├── registry.ts        # Central AI model registry (RMBG, PaddleOCR, Real-ESRGAN, YOLOv8)
├── model-cache.ts     # IndexedDB persistent model binary storage (`kv-ai-models-v1`)
├── model-manager.ts   # SHA-256 verification, download manager, and storage quota
├── capabilities.ts    # Browser capability detection (WebGPU, WASM SIMD, SharedArrayBuffer)
├── runtime.ts         # ONNX Runtime Web initialization & session management
├── sdk.ts             # High-level developer SDK (`ai.ensureModel()`, `ai.run()`)
└── pipeline/          # Generic Tensor Pipeline (normalize, sigmoid, softmax, argmax, tiling)
```
