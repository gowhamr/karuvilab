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
- Silent fallback to degraded mode without user notification (e.g., falling back to unminified code without warning).
- Dead UI elements (visible interactive elements that do nothing).

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

### Server-Side Rendering (SSR) Policy

- **KL-07 (Mandatory `ssr: false`):** Any tool utilizing browser-only APIs (Canvas, Web Workers, BarcodeDetector), heavy external libraries (Monaco, PDF.js), or direct DOM manipulation MUST be loaded via `next/dynamic` with `ssr: false` in a client wrapper. This prevents hydration mismatches and silent initialization failures.
- The `ssr: false` directive must be in the page route (`app/(tools)/.../page.tsx`), not hidden inside a child component.

#### Window/API Guards
- Code that accesses `window`, `navigator`, `document`, or any browser‑specific API must either be wrapped in a `useEffect` (or `useLayoutEffect`), or be guarded by `typeof window !== 'undefined'` if unavoidable in the render body.

#### No Node.js APIs in Client Components
- Client components must never import or use Node.js‑specific modules (`fs`, `path`, `process.env.NEXT_RUNTIME`, etc.).

**Pattern:**
```typescript
import dynamic from 'next/dynamic';

const ToolClient = dynamic(
  () => import('@/features/[tool]/components/ToolClient'),
  { ssr: false }
);
```

### Worker & Engine Loading Standard

#### EngineLoader Component
All tools that load an external worker, WASM module, or CDN dependency must use the shared `<EngineLoader>` component (`components/system/EngineLoader.tsx`).
- **Props:** `loadingMessage`, `errorMessage`, `onReady`, `timeout` (default 10s), `onRetry`.
- **Behavior:** Shows a spinner; if `onReady` isn't called within `timeout`, displays `errorMessage` with a Retry button. Never hangs indefinitely.

#### Worker File Loading Pattern
Every external worker file must be:
1. Copied to `public/` via `scripts/sync-workers.js`.
2. Referenced with an absolute path (`/pdf.worker.min.mjs`).
3. Backed by a CDN fallback if the local file fails.

```typescript
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
} catch {
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://unpkg.com/pdfjs-dist@4.0.379/build/pdf.worker.min.mjs';
}
```

#### Initialization Error Handling
Every async engine initialization must have a `try/catch` block that sets a user‑visible error state and a Retry action. Silent fallbacks are **forbidden**.
- **Forbidden:** Catching an error and returning a `defaultResult` without notifying the user.
- **Required:** Catching an error, setting an error state, and notifying the user.

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

## 10. SEO Standards

### Redirects & Routing (Zero-Chain Policy)
- **Native Redirects Only**: Always define redirects in `next.config.ts` using the native `redirects()` function rather than in `vercel.json`. This prevents multi-hop redirect chains caused by Next.js's internal routing (e.g., trailing slash enforcement) conflicting with external routing layers.
- **Single-Hop Rule**: No redirect should ever require more than one hop to reach its final destination.

### Canonical URLs
- **Strictly Per-Page**: Every page must dynamically generate a unique, self-referencing canonical URL.
- **NEVER globally override**: Do not place a hardcoded `alternates: { canonical: "/" }` in the root `app/metadata.ts`. This forces all subpages to declare the homepage as their canonical URL, triggering massive "Redirect Error" and indexing failures in Google Search Console.
- **Trailing Slashes**: The application uses `trailingSlash: true`. All canonical URLs, structured data URLs, and sitemap entries MUST end with a trailing slash (e.g., `https://karuvilab.com/tools/category/tool-id/`).
- **URL Normalization**: When writing regex to normalize URLs, ensure exactness to avoid malformed double-slashes. Use `.replace(/^\/+|\/+$/g, '')` without accidental spaces.

### Content Quality (E-E-A-T Enhancement)
- Avoid AI-style repetition and generic filler like "In today's digital world..." or "This powerful tool...".
- Maintain a readability level of Grade 8–10.

### Metadata & Structured Data
Every tool page must have:
- A standard content section including Introduction (150-250 words), How-To-Use (min 4 steps), Practical Examples (min 3), FAQ (min 5), and a Privacy Section.
- Trust badges displayed prominently: "✓ No Uploads", "✓ Browser Processing", "✓ Offline Capable", "✓ No Account Required".
- A unique `<title>` tag following the pattern `[Tool Name] – KV`.
- A unique `<meta name='description'>` of 120‑160 characters.
- Valid Open Graph and Twitter Card tags.
- `WebApplication` or `SoftwareApplication` JSON‑LD structured data with `datePublished`, `dateModified`, `applicationCategory`, `operatingSystem`, `offers`.
- `FAQPage` JSON‑LD structured data if the tool page includes an FAQ section.
- `BreadcrumbList` JSON‑LD structured data with canonical URL normalization.

### Canonical URLs
- Every page must have a self‑referencing `<link rel='canonical'>` with a trailing slash (`https://karuvilab.com/tools/[category]/[tool-id]/`).
- No duplicate pages with differing URL patterns.

### Internal Linking
- Every tool must link to at least 3‑5 related tools via the `relatedTools` registry field.
- The ToolShell component must render a 'Related Tools' section when related data is present.
- Cross‑category linking is encouraged where logical (e.g., Image Compressor → Image SEO).

### Sitemap & Crawling
- The dynamic sitemap (`app/sitemap.ts`) must include all tool pages with appropriate `priority` values (1.0 homepage, 0.9 category hubs, 0.8 tool pages).
- `robots.txt` must allow all crawlers and reference the sitemap index.
- No `noindex` tags on public tool pages.

### Content Quality (E‑E‑A‑T)
- Every tool page must have ≥400 words of original, server‑rendered descriptive content.
- Sections required: Introduction (2‑3 paragraphs), How‑To‑Use (numbered steps), Examples (2‑3 use cases), FAQ (4‑6 questions).
- All content must be original and written in natural language; no AI‑generated placeholder text.

## 11. UI/UX Quality Standards

### Zero Dead Elements
- Every visible button, icon, link, toggle, slider, and menu item must perform a functional action (navigation, state change, computation, or feedback).
- Elements that appear interactive but do nothing are **forbidden**.
- All tool pages must pass the Dead Element Strike audit before merging.

### Consistent Micro‑interactions
- **Hover (desktop):** Subtle lift (1‑2px), shadow elevation change, or border accent on cards and buttons. Duration <200ms.
- **Active/press:** Scale down to 0.98 with spring feedback.
- **Touch feedback:** Ripple or scale effect on primary actions and FABs.
- **Loading:** Shimmer skeletons matching content dimensions; no blank screens or spinners without context.
- **Transitions:** View changes, modals, and accordions animated with Framer Motion springs (stiffness: 300, damping: 30).
- All animations respect `prefers‑reduced‑motion`.

### Smart Empty States
- Every tool must show a friendly empty state with a clear call‑to‑action when in its initial state.
- No blank canvases; use the shared `<EmptyState>` component.

### Error & Recovery UX
- All errors must show human‑friendly messages with a Retry action (use `<RecoveryBanner>`).
- No raw stack traces or 'Unhandled Error' messages.
- Silent failures are **forbidden**.

### Status Communication
- Use the shared `<StatusBadge>` component for all processing states (Queued, Processing, Complete, Error).
- All status changes must be announced via `aria‑live` regions.

### Design Token Compliance
- All visual primitives must use the design token system (`src/theme/`).
- No hardcoded colors, border radii, shadows, or spacing values.
- `rounded-[18px]` or similar arbitrary values are **forbidden**.

## 12. User‑Friendly Design Principles

### Clarity & Predictability
- Tool purpose must be immediately clear from the title, description, and empty state.
- All inputs must have visible labels and helper text.
- Primary actions must be visually dominant; secondary actions de‑emphasized.
- Navigation must be consistent across all tools (breadcrumb, sidebar, command palette).

### Privacy Transparency
- File‑processing tools must display a `<PrivacyBadge>` indicating 'Processed entirely in your browser'.
- The Currency Converter must show data freshness (live, cached, stale) with timestamps.
- No tool should silently access hardware (camera, mic) without explicit user permission and clear messaging.

### Keyboard‑First Productivity
- All interactive elements must be keyboard accessible (Tab, Enter, Escape, Arrow keys).
- Global shortcuts: Ctrl+K (Command Palette), Esc (close modal/drawer), Ctrl+Enter (run/execute), Ctrl+S (save/export).
- Shortcuts must be consistent across all tools.

### Mobile‑First Ergonomics
- Touch targets must be ≥44x44px.
- Bottom navigation must respect safe‑area insets (`pb-[env(safe-area-inset-bottom)]`).
- FAB (floating action button) placed `bottom-24` on mobile to avoid overlap.
- No horizontal overflow at 320px width.

### Trust Messaging
- Subtle trust indicators: 'No Upload', 'Offline Capable', 'Private by Design' where appropriate.
- No deceptive patterns, dark patterns, or misleading CTAs.

## 13. Security Standards

- **DOMPurify** must be applied to all user‑provided HTML/Markdown before rendering.
- `postMessage` listeners must check `event.origin`.
- No `eval()` or `new Function()` outside trusted worker contexts.
- No dynamic script injection.
- Web Crypto API is the preferred cryptographic library.
- No sensitive personal data persisted in IndexedDB without encryption.

## 14. Motion Standards

**Allowed animated properties:**
- `transform` (translate, scale, rotate)
- `opacity`

**Forbidden properties:**
- `width`, `height` (use `scale` or layout animations)
- `box-shadow` (use static tonal elevation tokens)
- `filter` (except subtle `backdrop‑blur` on capable devices)

Always respect `prefers-reduced-motion`. Framer Motion's `MotionConfig` is already set globally to `reducedMotion="user"`.

## 15. AI Coding Workflow

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

## 16. State Management Architecture

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

## 17. Tool Production Quality Gates

A tool is considered **production‑ready** only if:
- Zero TypeScript errors and zero unhandled promise rejections.
- Works offline after first visit and responsive/usable at 320px width.
- Keyboard accessible (WCAG 2.2 AA) and screen reader friendly.
- No memory leaks (verified via DevTools heap snapshots).
- CPU‑intensive work is offloaded to a Worker.
- Uses `ToolShell` as the standard layout wrapper and atomic Zustand selectors exclusively.
- Gracefully recovers from errors (ErrorBoundary with retry).
- **Zero dead UI elements:** Every visible interactive element must perform a functional action (verified via Dead Element Strike).
- **SEO Ready:** All SEO requirements met (metadata, structured data, canonical, FAQ section).
- **SSR Safety:** If the tool uses browser‑only APIs, it must have `ssr: false` in the page route.
- **Worker Loading:** If the tool loads a worker or WASM file, it must use the standard worker loading pattern (local copy + CDN fallback + error state).
- **Engine Loading:** If the tool loads an external CDN dependency, it must use `<EngineLoader>` or an equivalent timeout/error mechanism.
- **No Silent Fallbacks:** The user must be notified of any critical loading failure. Silent fallbacks are forbidden.
- **Build Quality:** The tool must pass `npm run typecheck` and `npm run build`.

## 18. Development Workflow & Registry

1. Add tool metadata to `src/registry/tools/[tool-id].ts`.
2. Create route in `/app/(tools)/[category]/[tool-id]/`.
3. Implement `page.tsx` (server‑side metadata, ToolShell wrapper).
4. Implement client component (`.client.tsx`) with interactive logic.
5. Add atomic Zustand store in `src/store/` if global state is needed (rare).

## 18.1. New Tool Implementation Checklist

Before merging a new tool:
1. Does it use a browser‑only API? → Add `dynamic(() => import(...), { ssr: false })` in the page route.
2. Does it load a worker or WASM? → Use the standard worker loading pattern with local copy and CDN fallback.
3. Does it need a worker file? → Add it to `scripts/sync-workers.js`.
4. Does every async initialization have a `try/catch` that sets a user‑visible error state?
5. Does it pass `npm run typecheck` and `npm run build`?
6. Is it tested on a real mobile device (or emulated) at 320px width?
7. Is it keyboard accessible and screen reader friendly?
8. Does it work offline after first visit?
9. Are all Blob URLs managed via `blobManager` (KL‑01 compliant)?
10. Does it use atomic Zustand selectors only?
11. Are there any dead UI elements? → Must be functional or removed.
12. Are all SEO requirements met (metadata, JSON-LD, canonical)?

## 19. Known Fixed Bugs (Historical)

*These are documented to prevent regression. The architectural guardrails (KL‑series) already encode the enforcement.*

- **BUG‑001:** Minification now uses Terser in a worker.
- **BUG‑002:** Calculator division‑by‑zero guards in place.
- **BUG‑003:** Batch concurrency limited.
- **BUG‑004:** Accessible checkboxes via Radix.
- **BUG‑005:** JSON tree depth and size limits.
- **BUG‑006:** Blob URL lifecycle hardened.
- **BUG‑007:** PDF Merge sequential processing.

## 20. Current Priorities

1. SEO indexing fix (sitemap, structured data).
2. Sidebar performance optimization.
3. Phase‑1 everyday tools (Word Counter, Text Case Converter, PDF to Word, etc.).
4. Hybrid UI polish & micro‑interactions rollout.
5. Offline PWA audit completion.

## 21. Severity Classification

- **BLOCKER** → Production crash, memory leak, security issue
- **CRITICAL** → Architecture violation, severe rendering instability
- **MAJOR** → Significant UX/performance degradation
- **MINOR** → Non-critical standards deviation
- **NIT** → Cosmetic or maintainability issue

## 22. Bundle Governance

- New dependencies require bundle impact justification.
- Heavy libraries must be dynamically imported.
- Duplicate utility libraries are forbidden.
- Bundle regressions >20KB gzipped require approval.

## 23. Testing Standards
Required validation before production:
- `npm run typecheck`
- `npm run lint`
- `npm run test`
- Production build verification
- Mobile viewport validation
- Offline mode validation
- Worker cancellation testing

## 24. Worker Lifecycle Standards
- Workers must terminate idle tasks when possible.
- Transferable objects must be released after processing.
- Large buffers must be nulled after completion.
- Worker queues must support cancellation and cleanup.

## 25. Error Isolation Standards
- Every tool route must have an `ErrorBoundary`.
- Worker failures must surface user-safe messages.
- No raw stack traces shown to users.
- Failed batch items must not terminate the entire queue.

## 26. Service Worker Standards
- All tool bundles must be precached.
- Worker files must use cache-first strategy.
- Version mismatches must trigger automatic stale cache invalidation.
- Dynamic cache growth must be bounded.
- Failed cache hydration must degrade gracefully.

## 27. IndexedDB Constraints
- IndexedDB writes must be debounced when triggered by rapid UI updates.
- Large binary payloads must never be duplicated in persistence layers.
- Expired cached entries must support cleanup/version migration.
- Persisted Zustand stores must define explicit schema versions.

## 28. React Server Component Rules
- Server Components must never import browser APIs.
- Client Components must be marked with `"use client"` only when interactivity is required.
- Avoid unnecessary client boundaries.
- Heavy UI islands must be dynamically imported.
- Server Components should own data loading whenever network access is required.

*This manifesto evolves with the platform. Every architectural decision that prevents a production failure must be added here.*
