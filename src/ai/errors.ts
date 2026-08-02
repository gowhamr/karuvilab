/**
 * KaruviLab (KV) Local AI Engine - Custom Errors
 */

export class AiError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'AiError';
  }
}

export class ModelNotFoundError extends AiError {
  constructor(modelId: string) {
    super(`Model with ID "${modelId}" was not found in the KaruviLab AI registry.`, 'MODEL_NOT_FOUND');
    this.name = 'ModelNotFoundError';
  }
}

export class ModelLoadError extends AiError {
  constructor(modelId: string, originalError?: unknown) {
    const detail = originalError instanceof Error ? originalError.message : String(originalError || 'Unknown error');
    super(`Failed to load AI model "${modelId}": ${detail}`, 'MODEL_LOAD_FAILED');
    this.name = 'ModelLoadError';
  }
}

export class InferenceFailedError extends AiError {
  constructor(modelId: string, originalError?: unknown) {
    const detail = originalError instanceof Error ? originalError.message : String(originalError || 'Unknown error');
    super(`Inference execution failed for model "${modelId}": ${detail}`, 'INFERENCE_FAILED');
    this.name = 'InferenceFailedError';
  }
}

export class CapabilityUnsupportedError extends AiError {
  constructor(capability: string) {
    super(`Required execution capability "${capability}" is not supported by your browser.`, 'CAPABILITY_UNSUPPORTED');
    this.name = 'CapabilityUnsupportedError';
  }
}
