# Technical Debt Audit

## Overview
This audit identifies unresolved tasks, sub-optimal typings, and potential architectural liabilities in the codebase.

## Codebase Indicators
- **TODOs:** 16 `TODO` comments found.
- **FIXMEs:** 2 `FIXME` comments found.
- **TypeScript Exceptions:** 7 instances of `@ts-ignore` or `@ts-expect-error` used to bypass strict type checking.
- **Explicit `any` types:** ~545 occurrences of the word `any` (a mix of English prose and `any` type casting like `(state as any)`).

## Major Findings

### TypeScript Strictness
The codebase has a few occurrences of TypeScript escape hatches (`@ts-ignore`, `@ts-expect-error`). 
Examples:
- `components/layout/MobileSidebar.tsx: @ts-expect-error – inert is a valid HTML attribute`
- `src/engine/workers/WorkerOrchestrator.ts: @ts-ignore`
- `src/features/video-metadata-viewer/components/VideoMetadataViewerClient.tsx: @ts-ignore`

**Recommendation:**
Replace `any` types with `unknown` or specific interfaces. For HTML attributes like `inert`, use interface augmentation (`declare module 'react' { interface HTMLAttributes<T> { inert?: boolean; } }`).

### Unresolved TODOs
18 pending TODO/FIXME items indicate technical debt that has been deferred.

**Recommendation:**
Map all TODOs to tracked issues in the backlog to ensure they are scheduled for resolution and don't linger indefinitely.

### Web Workers and ToolEngine
`WorkerOrchestrator` and `karuvi.worker.ts` handle intense logic. The worker implementation might become a bottleneck. There are `@ts-ignore` comments in these files which suggest type safety gaps in message passing.

**Recommendation:**
Consider using libraries like `comlink` to strongly type Web Worker communication instead of raw `postMessage` with `@ts-ignore`.
