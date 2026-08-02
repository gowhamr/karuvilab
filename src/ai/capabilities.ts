/**
 * KaruviLab (KV) Local AI Engine - Browser Capabilities Detector
 * Detects WebGPU, WASM SIMD, SharedArrayBuffer, Threads, and selects optimal backend
 */

import { CapabilitiesResult, ModelBackend } from './types';

let cachedCapabilities: CapabilitiesResult | null = null;

export async function detectCapabilities(): Promise<CapabilitiesResult> {
  if (cachedCapabilities) {
    return cachedCapabilities;
  }

  const isServer = typeof window === 'undefined';

  const webgpu = !isServer && 'gpu' in navigator && typeof (navigator as any).gpu?.requestAdapter === 'function';
  const sharedArrayBuffer = !isServer && typeof SharedArrayBuffer !== 'undefined';
  const threads = !isServer && sharedArrayBuffer && typeof Worker !== 'undefined';

  let wasmSimd = false;
  if (!isServer && typeof WebAssembly !== 'undefined') {
    try {
      // Test WASM SIMD support via a minimal SIMD v128 opcode compilation check
      wasmSimd = WebAssembly.validate(
        new Uint8Array([
          0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00,
          0x01, 0x05, 0x01, 0x60, 0x00, 0x01, 0x7b, 0x03,
          0x02, 0x01, 0x00, 0x0a, 0x0a, 0x01, 0x08, 0x00,
          0xfd, 0x0c, 0x00, 0x00, 0x00, 0x00, 0x0b
        ])
      );
    } catch {
      wasmSimd = false;
    }
  }

  let recommendedBackend: ModelBackend = 'wasm';
  if (webgpu) {
    recommendedBackend = 'webgpu';
  } else if (wasmSimd) {
    recommendedBackend = 'wasm';
  }

  cachedCapabilities = {
    webgpu,
    wasmSimd,
    threads,
    sharedArrayBuffer,
    recommendedBackend
  };

  return cachedCapabilities;
}
