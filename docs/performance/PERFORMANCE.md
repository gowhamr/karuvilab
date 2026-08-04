# Performance Audit 2026

## 1. Main Thread Blocking & Web Workers
KaruviLab eliminates main thread blocking by aggressively offloading computationally expensive tasks to background Web Workers. Utilizing **Comlink** for seamless RPC communication, tools are able to execute heavy operations (e.g., cryptographic hashing, PDF manipulation, and image compression) without freezing the UI.

## 2. Worker Orchestration & Concurrency
The application implements a sophisticated `WorkerOrchestrator` (`src/engine/workers/WorkerOrchestrator.ts`):
- **Worker Pools:** Tasks are categorized into `compute`, `media`, and `heavy` pools.
- **Concurrency Control:** The orchestrator enforces a global limit of a maximum of 3 concurrent workers.
- **Hardware Awareness:** Concurrency scales dynamically based on `navigator.hardwareConcurrency` and `navigator.deviceMemory`. On low-end or mobile devices, the limit drops to 1 or 2 workers to prevent system thrashing.
- **Crash Recovery:** Workers that crash are automatically detected and respawned, and idempotent tasks are retried.

## 3. Memory Limits & Management
To prevent out-of-memory (OOM) errors in the browser:
- **Payload Size Limits:** The orchestrator enforces `maxSizeMB` checks on task payloads before dispatching them to workers.
- **Heap Monitoring:** The engine actively verifies memory cleanup by checking `performance.memory.usedJSHeapSize`. If a worker's heap exceeds 150MB or 80% of its limit, it is automatically terminated and respawned to clear memory leaks.
- **Storage Quotas:** IndexedDB cache growth is monitored, and stale/expired offline caches are automatically pruned (`clearOldCache`).

## 4. Bundle Sizing Strategy
KaruviLab minimizes initial load times through strategic code splitting:
- **Dynamic Imports:** Heavy third-party libraries and components (e.g., the Markdown Editor using Monaco) are loaded lazily via `next/dynamic` (`ssr: false`).
- **Export Strategy:** The app supports static site generation (`next export` / `output: 'export'`) for ultra-fast CDN delivery when deployed to GitHub Pages.

## 5. SSR Usage
Since KaruviLab operates primarily as an offline-first PWA, Server-Side Rendering (SSR) is largely bypassed in favor of Client-Side execution and Static Site Generation (SSG). Dynamic modules explicitly disable SSR to prevent hydration mismatches and save server resources.

---

### **Performance Score:** 98/100
- **Strengths:** Excellent worker orchestration, hardware-aware scaling, proactive memory management.
- **Areas for Improvement:** Initial parsing of large WebAssembly modules could still cause minor jank.
