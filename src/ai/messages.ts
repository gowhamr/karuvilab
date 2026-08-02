/**
 * KaruviLab (KV) Local AI Engine - Protocol & Messaging Definitions
 * Standardized AI Request/Response RPC Messages
 */

import { ModelManifest, ModelBackend, ModelProgress, CapabilitiesResult, AiRuntimeStatus } from './types';

export type AiRequestType =
  | 'LOAD_MODEL'
  | 'RUN_INFERENCE'
  | 'CANCEL'
  | 'DISPOSE'
  | 'GET_CAPABILITIES'
  | 'GET_STATUS';

export type AiResponseType =
  | 'PROGRESS'
  | 'RESULT'
  | 'ERROR'
  | 'CANCELLED'
  | 'STATUS';

export interface LoadModelRequest {
  type: 'LOAD_MODEL';
  taskId: string;
  manifest: ModelManifest;
}

export interface InferenceRequest {
  type: 'RUN_INFERENCE';
  taskId: string;
  modelId: string;
  feeds: Record<string, unknown>;
  preferredBackend?: ModelBackend;
}

export interface CancelRequest {
  type: 'CANCEL';
  taskId: string;
}

export interface DisposeRequest {
  type: 'DISPOSE';
  modelId?: string;
}

export interface CapabilityRequest {
  type: 'GET_CAPABILITIES';
  taskId: string;
}

export interface StatusRequest {
  type: 'GET_STATUS';
  taskId: string;
}

export type AiWorkerRequest =
  | LoadModelRequest
  | InferenceRequest
  | CancelRequest
  | DisposeRequest
  | CapabilityRequest
  | StatusRequest;

export interface ProgressResponse {
  type: 'PROGRESS';
  taskId: string;
  progress: ModelProgress;
}

export interface ResultResponse {
  type: 'RESULT';
  taskId: string;
  output: Record<string, unknown>;
}

export interface ErrorResponse {
  type: 'ERROR';
  taskId: string;
  error: string;
  code: string;
}

export interface CancelledResponse {
  type: 'CANCELLED';
  taskId: string;
}

export interface StatusResponse {
  type: 'STATUS';
  taskId: string;
  status: AiRuntimeStatus;
}

export type AiWorkerResponse =
  | ProgressResponse
  | ResultResponse
  | ErrorResponse
  | CancelledResponse
  | StatusResponse;
