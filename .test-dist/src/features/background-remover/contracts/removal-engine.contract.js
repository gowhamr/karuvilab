/**
 * KaruviLab (KV) Removal Engine Architecture Contract
 * Single stable interface that all background removal engines conform to.
 */
export class EngineExecutionError extends Error {
    engineId;
    originalError;
    constructor(engineId, message, originalError) {
        super(`Engine "${engineId}" failed: ${message}`);
        this.engineId = engineId;
        this.originalError = originalError;
        this.name = 'EngineExecutionError';
    }
}
