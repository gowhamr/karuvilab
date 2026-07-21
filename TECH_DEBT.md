# Technical Debt

## TypeScript 6.0.3 Pin

**Date:** 2026-07-12
**Status:** Blocked on upstream dependencies

### Description
TypeScript has been strictly pinned to exactly `6.0.3` (with a guardrail script in `preinstall`/`postinstall` and `.npmrc` `save-exact=true`) to prevent accidental drift to TS 7.x. 

### Why we are pinned to 6.0.3
We attempted to upgrade to TypeScript 7.0.2 but had to revert because of three confirmed blockers:

1. **typescript-eslint AST Parser:** The current `@typescript-eslint` packages depend on the old compiler API. Their peer dependencies cap TypeScript at `<6.1.0`.
2. **Next.js TS Verification:** Next.js 16.2.10's `verify-typescript-setup.js` hardcodes a check for `typescript/lib/typescript.js`. TypeScript 7 removed this file, causing the Next.js build to fail.
3. **Path Alias Resolution:** TypeScript 7's restructured package broke `tsconfig.json` path-alias resolution during our build trial.

### Unblocking the Future Upgrade
We can revisit the upgrade to TypeScript 7.x when one or more of the following occur:
- `typescript-eslint` releases v9/v10 with TS 7 support.
- Next.js updates its TypeScript verification process to support the new TS 7 package structure.
- TypeScript 7.1 releases its promised compatibility layer.

## PDF Editor — Deferred Browser Verification
Phase 2 (viewer, thumbnail sidebar, memory-tier device detection, canvas 
lifecycle cleanup) was implemented and code-reviewed, but not verified in 
a real browser session — CLI environment has no browser access. Before this 
tool is considered production-ready or shipped, a real browser pass must 
confirm: rendering correctness on a real multi-page PDF, the large-file 
warning triggers and "Continue anyway" works, thumbnail canvases are 
actually destroyed on scroll-out (not just coded to be), and no console 
errors on load/navigate-away. Do not skip this before launch.

## OCR / Tesseract.js — Architecture Violation & Offline Failure

**Date:** 2026-07-20  
**Status:** ACTIVE — Deferred Remediation  

### Description
The text extraction feature in Notes (`src/features/notes/components/OCRButton.tsx`) dynamically injects an external JavaScript script tag (`https://unpkg.com/tesseract.js@v5.0.3/dist/tesseract.min.js`) into the DOM at runtime and directly calls `Tesseract.createWorker` on the main UI thread.

### Rules Violated
1. **Section 13 (Security Standards):** Dynamic `<script>` tag injection from remote CDNs.
2. **KL-10 (Worker Isolation):** Spawning Web Workers directly in a component instead of using `WorkerOrchestrator`.
3. **Pillar 1.4 (Offline Resilience):** Requires an active internet connection to download Tesseract runtime and language models from `unpkg.com` / `jsdelivr.net`; silently fails when offline.
4. **KL-05 (AbortSignal Propagation):** Async OCR pipeline cannot be cancelled if the user navigates away or cancels the operation.

### Remediation Plan
1. **Package Governance:** Add `tesseract.js` as an official dependency (logged in `BUNDLE_DECISIONS.md`).
2. **Static Asset Bundling:** Update `scripts/sync-workers.js` to bundle `tesseract-core.wasm`, `worker.min.js`, and `eng.traineddata.gz` into `/public/tesseract/`.
3. **`WorkerOrchestrator` Integration:** Create a dedicated `ocr-extract` handler in `src/engine/workers/karuvi.worker.ts` with local asset paths and `AbortSignal` cancellation support.
4. **Offline Pre-caching:** Cache language traineddata in IndexedDB (`idbStorage`) and precache WASM assets via Service Worker.
5. **Component Refactor:** Refactor `OCRButton.tsx` to dispatch tasks via `workerOrchestrator.run('ocr-extract', { file, signal })`.
