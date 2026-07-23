# KaruviLab — Phase 2: PDF Tools Architecture & Quality Audit

**Version:** 1.0.0 | **Focus:** PDF Tools (Batch 1)

*Note: For the broader compliance status of other heavy operation tools (Image, NLP), see [HEAVY_OPS_COMPLIANCE_CHECKLIST.md](HEAVY_OPS_COMPLIANCE_CHECKLIST.md).*

This document represents a deep, rigorous Phase 2 auditing process specifically for PDF Tools. It strictly scores tools based on enterprise engineering quality, adherence to KaruviLab Elite Engineering Manifesto constraints, specific race conditions, React component correctness, and performance budgets.

---

## 1. merge-pdf
**Status:** ★★★★☆ | **Production Ready:** YES (with minor caveats)

### Ratings
| Metric | Score | Notes |
|---|---|---|
| **Architecture** | ★★★★☆ | Utilizes `workerManager` effectively. |
| **React Quality** | ★★★★★ | Functional state updates correctly used; no inline re-render traps. |
| **Resource Safety** | ★★★★☆ | Safe Object URL creation via `useObjectUrlManager`, but URL revocation is optimistically set to `100ms`, which could lead to race conditions if the download takes longer. |
| **Worker Usage** | ★★★★★ | Offloads merging to `workerManager` passing raw `File` objects. |
| **Cancellation** | ★★★★★ | Correct implementation of `AbortController` passed to the worker. |

### Issues Found (Priority: LOW)
1. **Race Condition in URL Revocation:** `setTimeout(() => revokeUrl(url), 100)` is unsafe. If the browser takes longer than 100ms to register the download of a large blob, the URL will be revoked before it finishes.
   - *Fix:* Use the store lifecycle to revoke URLs or rely purely on unmount hooks, rather than arbitrary timeouts.

---

## 2. compress-pdf
**Status:** ★★☆☆☆ | **Production Ready:** NO (Main-Thread Blocker)

### Ratings
| Metric | Score | Notes |
|---|---|---|
| **Architecture** | ★★★☆☆ | Good use of `useBatchStore` for queue management. |
| **React Quality** | ★★★★★ | UI and state are well separated. |
| **Resource Safety** | ★★★★☆ | URL management delegated to `useBatchStore`/`useObjectUrlManager`. |
| **Worker Usage** | ☆☆☆☆☆ | **VIOLATION (PERF-01, PERF-06):** Performs heavy PDF manipulation (`PDFDocument.load` and `doc.save`) directly on the main thread. |
| **Cancellation** | ★★★☆☆ | `useBatchStore` likely handles queue pausing, but individual PDF processing is not abortable. |

### Issues Found (Priority: BLOCKER)
1. **Main-Thread Blocking:** Compression logic runs synchronously on the main UI thread. For PDFs > 5MB, this will freeze the browser tab entirely, violating the 60fps main-thread responsiveness requirement.
   - *Fix:* Move the `pdf-lib` compression logic to a dedicated Web Worker via `WorkerOrchestrator` or `workerManager`.

---

## 3. split-pdf
**Status:** ★★☆☆☆ | **Production Ready:** NO (Main-Thread Blocker & Memory Risks)

### Ratings
| Metric | Score | Notes |
|---|---|---|
| **Architecture** | ★★☆☆☆ | Heavy processing logic mixed tightly into the UI component. |
| **React Quality** | ★★★★☆ | Generally stable, but lacks memoization on `splitAll` condition paths. |
| **Resource Safety** | ★★☆☆☆ | Same 100ms URL revocation race condition as `merge-pdf`, multiplied in a tight loop. High risk of memory spike due to generating numerous Blobs concurrently in a loop. |
| **Worker Usage** | ☆☆☆☆☆ | **VIOLATION (PERF-01, PERF-06):** Splits and generates multiple PDFs sequentially directly on the main thread. |
| **Cancellation** | ☆☆☆☆☆ | **VIOLATION (KL-05):** The `split` function is a single long-running async loop without an `AbortController`. If a user navigates away, the loop continues in the background, leaking memory. |

### Issues Found (Priority: BLOCKER)
1. **Main-Thread Blocking & Missing Worker:** The loop parsing and creating new `PDFDocument` instances runs on the main thread, freezing the UI.
   - *Fix:* Offload the splitting algorithm to a worker.
2. **Missing Cancellation:** The split loop cannot be cancelled.
   - *Fix:* Implement an `AbortController` and check `signal.aborted` within the loop.
3. **Unsafe Download Loop:** Triggering programmatic `a.click()` inside a `for` loop with a `150ms` delay is highly brittle. Browsers may block multiple rapid downloads as a security measure.
   - *Fix:* If splitting into many files, zip them in a worker (using `fflate`) and trigger a single download.
