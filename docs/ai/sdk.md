# KaruviLab AI SDK Developer Reference

## Overview
Every AI tool inside KaruviLab consumes models using the high-level `ai` SDK facade.
Tools never call ONNX Runtime directly or instantiate `InferenceSession` objects manually.

## Core SDK APIs

### 1. `ai.ensureModel(modelId, onProgress?, abortSignal?)`
Ensures that an AI model is cached locally, verified via SHA-256 checksum, and ready for inference.

```typescript
import { ai } from '@/src/ai/sdk';

await ai.ensureModel('background-removal-rmbg', (progress) => {
  console.log(`Loading: ${progress.percent}% - ${progress.stage}`);
});
```

### 2. `ai.run({ model, input, preferredBackend, onProgress, abortSignal })`
Executes neural network inference via `WorkerOrchestrator`.

```typescript
const result = await ai.run({
  model: 'super-resolution-esrgan',
  input: { tensorData, shape: [1, 3, 256, 256] }
});
```
