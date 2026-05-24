# KaruviLab (KV) — Elite Engineering Manifesto (GEMINI.md)

Welcome to **KaruviLab (KV)**. This document is the single source of truth for the platform's identity, architecture, and engineering standards. All human contributors and AI agents (Gemini CLI, Cursor, Claude Code, etc.) must adhere strictly to the philosophy, constraints, and technical policies defined herein.

## 0. Hard Prohibitions

The following patterns are **NEVER** allowed unless explicitly approved through a formal exception:

- Raw `URL.createObjectURL` usage – always use `blobManager` or `useObjectUrlManager`.
- Full Zustand store subscriptions (`const { ... } = useXxxStore()`) – always use atomic selectors.
- `useEffect` dependency suppression (`eslint-disable exhaustive-deps`).
- Main-thread CPU processing >5ms – offload heavy work to Web Workers.
- Non-abortable async operations – every promise chain must accept an `AbortSignal`.
- Raw HTML injection without `DOMPurify.sanitize()`.
- Inline styles bypassing Tailwind tokens.
- New dependencies without bundle-size justification.
- Server-side processing for local tools – everything happens in the browser.
- Client components importing Node‑only APIs (e.g., `fs`, `path`).

## 1. Project Identity & Philosophy

- **Name:** KaruviLab (KV)
- **Vision:** The world's fastest, most private browser-native productivity platform.
- **Non‑Negotiable Philosophy:**
  - **Zero‑Server‑Upload:** All data stays on the user's device.
  - **Privacy‑First:** No telemetry, no tracking, no cloud storage.
  - **Local‑First Execution:** Web Workers, WebAssembly, Web Crypto.
  - **Offline Resilience:** Fully functional without the internet via Service Workers and IndexedDB.
  - **Enterprise UX:** Raycast/Linear‑tier, keyboard‑first, motion‑rich but subtle.

## 2. Tech Stack (A‑Z)

- **Next.js 16.2+** (App Router, strict Server/Client separation)
- **React 19.0.6** (Concurrent Mode)
- **Tailwind CSS v4.2.4** (JIT, container queries)
- **TypeScript** (strict mode, no `any` without justification)
- **WorkerOrchestrator** (singleton Web Worker pool)
- **Comlink 4.4** (RPC‑style worker communication)
- **Zustand 5.0+** (atomic selectors, IndexedDB persistence via `idb`)
- **Framer Motion 12.38+** (hardware‑accelerated animations)
- **DOMPurify 3.1+** (XSS protection)
- **pdf‑lib 1.17+**, **Terser 5.47+**, **fflate**, **date‑fns**

## 3. Design System & Tokens

### Branding
- **Logo:** Circular brand mark with Indigo‑to‑Blue gradient.
- **Wordmark:** DM Serif Display, weight 800.

### Core Tokens
- `rounded-[32px]` – Large containers/cards
- `rounded-2xl` (24px) – Secondary containers
- `rounded-xl` (20px) – Modals/Dialogs
- `rounded-lg` – Input elements/Buttons
- Colors: Indigo `#4F46E5` (primary), Surface `#0F172A` (dark), Border `#1E293B`
- Motion: `ease-expo` (0.16, 1, 0.3, 1), max 400ms

## 4. Architecture & Key Paths

- `/app/` – Routing, layouts, metadata, error boundaries
- `/app/(tools)/` – Category‑based tool pages
- `/components/ui/` – Shared atomic UI components (`ToolShell`, `MetricCard`, `ToolInput`, `SliderField`, `KVLogo`)
- `/src/engine/workers/` – `karuvi.worker.ts`, `WorkerOrchestrator`, `TaskScheduler`
- `/src/features/` – Tool‑specific logic, separated from UI
- `/src/store/` – Global Zustand stores (settings, favorites, session)
- `/src/lib/` – Stateless utilities
- `/src/registry/` – Tool metadata and discovery
- `/scripts/` – Build‑time scripts (favicons, data sync)

## 5. React Reactivity Standards

### Zustand
- **Atomic selectors only:** `useStore(s => s.field)`. Never destructure the entire store.
- Use `useShallow` when selecting objects/arrays to prevent reference‑change re‑renders.
- Stable `EMPTY_ARRAY` / `EMPTY_OBJECT` constants must be used as fallback references.

### React
- `setState` must never be called during render (outside of event handlers or effects).
- All child‑bound handlers must be wrapped in `useCallback`.
- Expensive computations must be wrapped in `useMemo`.
- Effects must return a cleanup function when they subscribe to timers, listeners, or workers.
- No suppression of `exhaustive-deps` warnings.

### Rendering
- Use `React.memo` for repeated list items that receive stable props.
- Avoid passing inline objects/arrays as props.
- Framer Motion layout animations should only be used where necessary; prefer opacity/transform transitions.

## 6. Immutable Architectural Guardrails (KL‑Series)

These rules **cannot** be reverted. They were established to prevent critical production failures.

| Rule | Description |
|------|-------------|
| **KL‑01** | Zero raw `URL.createObjectURL` anywhere outside the central `blobManager`. |
| **KL‑02** | Worker concurrency enforced: max **3** on desktop, **2** on mobile. All scheduling must go through `WorkerOrchestrator`. |
| **KL‑03** | Every dynamic import must have a `<Suspense>` boundary with a `<ToolSkeleton>` fallback. No `loading: null`. |
| **KL‑04** | `HtmlViewerClient` and any `postMessage` listener must validate `event.origin === window.location.origin`. |
| **KL‑05** | All async pipelines (workers, fetch, ZIP) must accept and propagate an `AbortSignal`. Cancelling a task must immediately release resources. |
| **KL‑06** | Blob URLs that are persisted in Zustand stores must be owned by the store's lifecycle (`removeFile`/`clearFiles`). Components must never revoke store‑owned URLs. |

### Performance Manifesto (PERF‑Series)
| Rule | Description |
|------|-------------|
| **PERF‑01** | No synchronous heavy computation on the main thread (e.g., `zipSync`). All heavy work is async/worker‑based. |
| **PERF‑02** | ArrayBuffers are **transferred** (not copied) when passed to/from workers. |
| **PERF‑03** | Main‑thread responsiveness is prioritized. Interactions must remain smooth (60fps) regardless of background tasks. |

## 7. Performance Budgets

### Main Thread
- Maximum blocking time per task: **5ms**.
- Long tasks (>50ms) are forbidden.

### Memory
- Mobile peak memory target: **<150MB**.
- All Blob URLs must be centrally managed and revoked.

### Rendering
- Sidebar interactions: 60fps.
- Tool switch re‑render budget: **<100ms**.
- Avoid cascade re‑renders from global state changes.

### Bundle
- Initial JS bundle growth per new feature: **<20KB gzipped**.
- All heavy libraries must be dynamically imported (`next/dynamic`).

## 8. Concurrency Enforcement

- Batch image processing is throttled via `src/lib/concurrency.ts`.
- Max concurrent worker jobs: **3** desktop, **2** mobile.
- PDF Merge processes files **one‑by‑one** (load‑copy‑release).

## 9. Accessibility Standards (WCAG 2.2 AA)

- Full keyboard operability (Tab/Enter/Escape/Arrow keys) for every interactive element.
- Visible focus indicators on all focusable elements.
- Focus trapping in modals, drawers, and the Command Palette.
- `role="alert"` for critical error messages and status announcements.
- ARIA labels for icon‑only buttons.
- Color contrast ≥4.5:1 in all themes (dark, light, high‑contrast).
- `prefers-reduced-motion` must completely disable animations.

## 10. Security Standards

- **DOMPurify** must be applied to all user‑provided HTML/Markdown before rendering.
- `postMessage` listeners must check `event.origin`.
- No `eval()` or `new Function()` outside trusted worker contexts.
- No dynamic script injection.
- Web Crypto API is the preferred cryptographic library.
- No sensitive personal data persisted in IndexedDB without encryption.

## 11. Motion Standards

**Allowed animated properties:**
- `transform` (translate, scale, rotate)
- `opacity`

**Forbidden properties:**
- `width`, `height` (use `scale` or layout animations)
- `box-shadow` (use static tonal elevation tokens)
- `filter` (except subtle `backdrop‑blur` on capable devices)

Always respect `prefers-reduced-motion`. Framer Motion's `MotionConfig` is already set globally to `reducedMotion="user"`.

## 12. AI Coding Workflow

**Before modifying code:**
1. Check for existing architectural utilities (`blobManager`, `WorkerOrchestrator`, `ToolShell`).
2. Reuse shared UI primitives (`ToolInput`, `SliderField`, `MetricCard`).
3. Verify worker compatibility – offload any CPU‑heavy work.
4. Verify offline compatibility – no server‑side fetching unless clearly documented and opt‑in.
5. Verify mobile responsiveness at 320px.
6. Mentally run strict TypeScript checks.

**After modifying code:**
1. Validate no full‑store Zustand subscriptions.
2. Validate all cleanup logic (effects, timers, workers).
3. Validate Blob lifecycle – URLs created centrally, revoked only by the store.
4. Validate `AbortSignal` propagation.
5. Validate accessibility semantics (ARIA labels, keyboard nav).

## 13. State Management Architecture

### Global Stores (used across tools)
Only for:
- Settings (theme, font scale, preferences)
- Favorites
- Workflow state
- Session persistence

### Tool‑Specific Stores
Must remain isolated per tool. Never share raw state across tools.

### Persistence
- **IndexedDB** via `idb` is the only persistence layer.
- Never persist: `Blob` objects, `File` objects, raw `ArrayBuffer`, transient worker state.
- Zustand `persist` middleware is used for serialisable state.

## 14. Tool Production Quality Gates

A tool is considered **production‑ready** only if:
- Zero TypeScript errors.
- Zero unhandled promise rejections.
- Works offline after first visit.
- Responsive and usable at 320px width.
- Keyboard accessible.
- No memory leaks (verified via DevTools heap snapshots).
- CPU‑intensive work is offloaded to a Worker.
- Uses `ToolShell` as the standard layout wrapper.
- Uses atomic Zustand selectors exclusively.
- Gracefully recovers from errors (ErrorBoundary with retry).

## 15. Development Workflow & Registry

1. Add tool metadata to `src/registry/tools/[tool-id].ts`.
2. Create route in `/app/(tools)/[category]/[tool-id]/`.
3. Implement `page.tsx` (server‑side metadata, ToolShell wrapper).
4. Implement client component (`.client.tsx`) with interactive logic.
5. Add atomic Zustand store in `src/store/` if global state is needed (rare).

## 16. Known Fixed Bugs (Historical)

*These are documented to prevent regression. The architectural guardrails (KL‑series) already encode the enforcement.*

- **BUG‑001:** Minification now uses Terser in a worker.
- **BUG‑002:** Calculator division‑by‑zero guards in place.
- **BUG‑003:** Batch concurrency limited.
- **BUG‑004:** Accessible checkboxes via Radix.
- **BUG‑005:** JSON tree depth and size limits.
- **BUG‑006:** Blob URL lifecycle hardened.
- **BUG‑007:** PDF Merge sequential processing.

## 17. Current Priorities

1. SEO indexing fix (sitemap, structured data).
2. Sidebar performance optimization.
3. Phase‑1 everyday tools (Word Counter, Text Case Converter, PDF to Word, etc.).
4. Hybrid UI polish & micro‑interactions rollout.
5. Offline PWA audit completion.

## 18. Severity Classification

- **BLOCKER** → Production crash, memory leak, security issue
- **CRITICAL** → Architecture violation, severe rendering instability
- **MAJOR** → Significant UX/performance degradation
- **MINOR** → Non-critical standards deviation
- **NIT** → Cosmetic or maintainability issue

## 19. Bundle Governance

- New dependencies require bundle impact justification.
- Heavy libraries must be dynamically imported.
- Duplicate utility libraries are forbidden.
- Bundle regressions >20KB gzipped require approval.

## 20. Testing Standards

Required validation before production:
- `npm run typecheck`
- `npm run lint`
- `npm run test`
- Production build verification
- Mobile viewport validation
- Offline mode validation
- Worker cancellation testing

## 21. SEO Standards

- Every tool page must define metadata.
- Canonical URLs required.
- Structured data required where applicable.
- Sitemap entries generated automatically.
- No duplicate metadata generation across layouts.

## 22. Worker Lifecycle Standards

- Workers must terminate idle tasks when possible.
- Transferable objects must be released after processing.
- Large buffers must be nulled after completion.
- Worker queues must support cancellation and cleanup.

## 23. Accessibility Validation

All tools must be validated against:
- Keyboard-only navigation
- Screen reader announcements
- Focus visibility
- Reduced motion mode
- 320px viewport usability

## 24. Error Isolation Standards

- Every tool route must have an `ErrorBoundary`.
- Worker failures must surface user-safe messages.
- No raw stack traces shown to users.
- Failed batch items must not terminate the entire queue.

## 25. Service Worker Standards

- All tool bundles must be precached.
- Worker files must use cache-first strategy.
- Version mismatches must trigger automatic stale cache invalidation.
- Dynamic cache growth must be bounded.
- Failed cache hydration must degrade gracefully.

## 26. IndexedDB Constraints

- IndexedDB writes must be debounced when triggered by rapid UI updates.
- Large binary payloads must never be duplicated in persistence layers.
- Expired cached entries must support cleanup/version migration.
- Persisted Zustand stores must define explicit schema versions.

## 27. React Server Component Rules

- Server Components must never import browser APIs.
- Client Components must be marked with `"use client"` only when interactivity is required.
- Avoid unnecessary client boundaries.
- Heavy UI islands must be dynamically imported.
- Server Components should own data loading whenever network access is required.

*This manifesto evolves with the platform. Every architectural decision that prevents a production failure must be added here.*
