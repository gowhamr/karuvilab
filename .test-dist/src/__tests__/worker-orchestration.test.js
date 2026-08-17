import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { workerOrchestrator } from "../engine/workers/WorkerOrchestrator";
import * as Comlink from "comlink";
vi.mock("comlink", async () => {
    const actual = await vi.importActual("comlink");
    return {
        ...actual,
        wrap: vi.fn(),
        proxy: vi.fn(fn => fn),
        releaseProxy: Symbol("releaseProxy"),
    };
});
describe("WorkerOrchestrator Governance", () => {
    let mockWorker;
    let mockApi;
    beforeEach(() => {
        // Save original globals
        vi.stubGlobal("window", {});
        vi.stubGlobal("navigator", {
            userAgent: "Mozilla",
            hardwareConcurrency: 4,
        });
        mockWorker = {
            terminate: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            postMessage: vi.fn(),
        };
        globalThis.__mockWorker = mockWorker;
        // Stub global Worker
        vi.stubGlobal("Worker", vi.fn(function () { return mockWorker; }));
        mockApi = {
            compressImage: vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3])),
        };
        globalThis.__mockComlinkApi = mockApi;
        Comlink.wrap = vi.fn().mockReturnValue(mockApi);
        // Reset orchestrator state
        workerOrchestrator.terminateAll();
        // Re-initialize orchestrator internal variables
        workerOrchestrator.initialized = false;
        workerOrchestrator.pool = [];
        workerOrchestrator.queue = [];
    });
    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });
    it("should validate payload size before dispatching", async () => {
        const hugePayload = new ArrayBuffer(60 * 1024 * 1024); // 60MB
        await expect(workerOrchestrator.dispatch("compressImage", [hugePayload], undefined, undefined, undefined, true, 2, 50)).rejects.toThrow("Payload size (60.00MB) exceeds limit of 50MB.");
    });
    it("should abort and return TIMEOUT error if task exceeds timeout", async () => {
        // Mock the api call to never resolve
        const api = mockApi || globalThis.__mockComlinkApi || { compressImage: vi.fn() };
        const w = mockWorker || globalThis.__mockWorker;
        api.compressImage.mockImplementation(() => new Promise(() => { }));
        const promise = workerOrchestrator.dispatch("compressImage", [new ArrayBuffer(10)], undefined, undefined, undefined, true, 2, 50, 10);
        await expect(promise).rejects.toThrow("TIMEOUT");
        if (w)
            expect(w.terminate).toHaveBeenCalled();
    });
    it("should retry task if worker crashes and task is idempotent", async () => {
        let callCount = 0;
        let rejectFirstCall;
        const api = mockApi || globalThis.__mockComlinkApi || { compressImage: vi.fn() };
        const w = mockWorker || globalThis.__mockWorker;
        api.compressImage.mockImplementation(() => {
            callCount++;
            if (callCount === 1) {
                // Simulate a crash during the call by triggering onerror
                setTimeout(() => {
                    if (w && w.onerror) {
                        w.onerror({ type: "error", message: "Simulated worker crash" });
                    }
                    if (rejectFirstCall) {
                        rejectFirstCall(new Error("Worker terminated"));
                    }
                }, 10);
                return new Promise((resolve, reject) => {
                    rejectFirstCall = reject;
                });
            }
            return Promise.resolve(new Uint8Array([4, 5, 6]));
        });
        const result = await workerOrchestrator.dispatch("compressImage", [new ArrayBuffer(10)], undefined, undefined, undefined, true, 2);
        expect(result).toEqual(new Uint8Array([4, 5, 6]));
        expect(callCount).toBe(2); // Retried
    });
});
