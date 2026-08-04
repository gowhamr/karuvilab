# KaruviLab (KV) — Elite Engineering Manifesto
**Version:** 3.1.0 | **Last Updated:** 2026-06-20 | **Status:** ACTIVE

> This document is the **single source of truth** for KaruviLab's identity, architecture, and engineering standards.
> All human contributors and AI agents (Gemini CLI, Cursor, Claude Code, etc.) **must** adhere strictly to every rule defined herein.
> No rule may be bypassed without a formal exception logged in `EXCEPTIONS.md`.

---

## Documentation Index

### Core
- [Architecture & Standards](docs/architecture/ARCHITECTURE.md)
- [Product Requirements](docs/audits/PRD.md)
- [Roadmap](docs/roadmap/ROADMAP.md)
- [Changelog](docs/roadmap/CHANGELOG.md)
- [Top 100 Action Plan](docs/roadmap/ACTION_PLAN_TOP_100.md)

### Security
- [Security Guidelines](docs/security/SECURITY.md)

### Performance
- [Performance Expectations](docs/performance/PERFORMANCE.md)

### Accessibility
- [Accessibility Audit & Guidelines](docs/audits/ACCESSIBILITY.md)

### AI Platform
- [AI Integration](docs/ai/README.md)

### Developer & Tech Debt
- [Design System](docs/developer/DESIGN_SYSTEM.md)
- [Framework Spec](docs/developer/ELS_v1.0_Framework_Spec.md)
- [Tech Debt](docs/developer/TECH_DEBT.md)
- [Bundle Decisions](docs/decisions/BUNDLE_DECISIONS.md)
- [Exceptions](docs/decisions/EXCEPTIONS.md)

### Knowledge Vault (KV) Tools
- [KV Index](docs/kv/README.md)

### Audits & Checklists
- [Code Audit](docs/audits/CODE_AUDIT.md)
- [SEO Audit](docs/audits/SEO_AUDIT.md)
- [UX Audit](docs/audits/UX_AUDIT.md)
- [Tool Audit](docs/audits/TOOL_AUDIT.md)
- [Tool Inventory](docs/audits/TOOL_INVENTORY.md)
- [Heavy Ops Inventory](docs/audits/HEAVY_OPERATIONS_INVENTORY.md)
- [Heavy Ops Compliance](docs/audits/HEAVY_OPS_COMPLIANCE_CHECKLIST.md)
- [PDF Tools Audit](docs/audits/PDF_TOOLS_AUDIT.md)

---

## 0. Hard Prohibitions ⛔

The following patterns are **NEVER** allowed under any circumstances:

| # | Prohibited Pattern | Required Alternative |
|---|-------------------|----------------------|
| P-01 | Raw `URL.createObjectURL` | Use `blobManager` or `useObjectUrlManager` |
| P-02 | Full store destructure `const { ... } = useXxxStore()` | Atomic selectors only: `useStore(s => s.field)` |
| P-03 | `// eslint-disable-next-line react-hooks/exhaustive-deps` | Fix the dependency array |
| P-04 | Main-thread CPU work >5ms | Offload to Web Worker via `WorkerOrchestrator` |
| P-05 | Non-abortable async operations | Every promise chain must accept `AbortSignal` |
| P-06 | Raw HTML injection | Always wrap with `sanitizeHtml()` from `src/lib/security.ts` (never raw DOMPurify) |
| P-07 | Inline styles bypassing Tailwind tokens | Use design token system in `src/theme/` |
| P-08 | New dependencies without bundle justification | Add entry to `BUNDLE_DECISIONS.md` |
| P-09 | Server-side processing for local tools | Browser-only execution always |
| P-10 | Client components importing Node-only APIs (`fs`, `path`) | Use browser-safe equivalents |
| P-11 | Silent fallback to degraded mode | Notify user of any degradation |
| P-12 | Dead UI elements | Every interactive element must perform an action |
| P-13 | `any` TypeScript type without justification | Narrow the type; document the exception |
| P-14 | `console.log` in production code | Use structured logger from `src/lib/logger.ts` |
| P-15 | Hardcoded colors, spacing, radii | Use design tokens exclusively |
| P-16 | `eval()` or `new Function()` outside trusted worker contexts | Use safe alternatives |
| P-17 | Non-semantic HTML (e.g., `<div>` for buttons) | Use correct semantic HTML elements |
| P-18 | Unversioned IndexedDB stores | All stores must define an explicit `version` |
| P-19 | Raw numeric z-index Tailwind classes (`z-10`, `z-20`, `z-30`, `z-50`, etc.) | Use named tokens from `src/theme/zindex.ts` (`z-content`, `z-modal`, etc.) |
| P-20 | Setting `X-Frame-Options` to `DENY` | Must use `SAMEORIGIN` to allow Workbench to frame local tools |
| P-21 | Direct import of security libs (DOMPurify, etc.) in UI | Always go through project abstraction layer (`src/lib/security.ts`) |

---

## 1. Project Identity & Philosophy

- **Name:** KaruviLab (KV)
- **Tagline:** KaruviLab — Every Tool Teaches.
- **Vision:** Empowering people to learn technology through practical tools.
- **Mission:** Build high-quality browser tools that solve real problems while teaching the knowledge behind them.
- **Philosophy:** KaruviLab is an offline-first platform where every tool not only solves a problem but also teaches the technology behind it. Users should understand how, why, and when to use a technology—not just click a button and download a result.

- **Non-Negotiable Pillars / Principles:**

| Pillar | Meaning |
|--------|---------|
| **Learn while using** | Every tool teaches its concepts. Expose the "why" and "how". |
| **Privacy-First** | Your data stays in your browser. No telemetry, no tracking, no server uploads. |
| **Fast & Offline** | Works locally without uploading files (Web Workers, IndexedDB, WASM). |
| **Built for Engineers & Learners** | Practical tools with real-world knowledge. Raycast/Linear-tier UX. |
| **Free for Everyone** | Simple, accessible, and useful. |

### Platform Stability Policy

Core platform components are feature-frozen after reaching maturity.

**Examples:**
- WorkerOrchestrator
- Performance Inspector
- Security Layer
- Routing
- Bundle Optimization

**Changes are permitted only for:**
- Bug fixes
- Security vulnerabilities
- Browser compatibility
- Measured performance improvements
- New platform capabilities with documented justification

Avoid feature additions that increase maintenance without clear user value. This complements the philosophy of quality over quantity and helps keep the project focused.

### Curriculum & Content Boundaries

**What users will learn:**
- Engineering concepts
- Algorithms
- Security
- Standards
- Performance
- Browser APIs
- Best practices
- Failure cases
- Real-world public use cases
- Interactive quizzes

**What KaruviLab will never publish:**
- Proprietary or banking product internals

---

## 2. Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.2+ | App Router, SSR/SSG, strict Server/Client separation |
| React | 19.0.6 | Concurrent Mode, Server Components |
| TypeScript | strict | No `any` without documented justification |
| Tailwind CSS | v4.2.4 | JIT, container queries, design tokens |
| Zustand | 5.0+ | Atomic state, IndexedDB persistence via `idb` |
| Comlink | 4.4 | RPC-style worker communication |
| Framer Motion | 12.38+ | Hardware-accelerated animations |
| DOMPurify | 3.1+ | XSS protection on all HTML rendering |
| pdf-lib | 1.17+ | Client-side PDF manipulation |
| Terser | 5.47+ | In-worker JS minification |
| fflate | latest | In-worker compression |
| date-fns | latest | Tree-shakable date utilities |

> **Dependency Rule:** Never add a library without a corresponding entry in `BUNDLE_DECISIONS.md` with gzipped size impact, alternatives considered, and justification.

---

## 3. Design System & Tokens

### 3.1 Branding
- **Logo:** Circular brand mark, Indigo-to-Blue gradient
- **Wordmark:** DM Serif Display, weight 800

### 3.2 Border Radius Tokens
| Token | Value | Usage |
|-------|-------|-------|
| `rounded-full` | 9999px | Chips, badges, toggle pills, avatars |
| `rounded-6xl` | 48px | Ultra-large hero containers, main app entry wrappers |
| `rounded-5xl` | 40px | Large section containers, landing section blocks |
| `rounded-4xl` | 32px | Bottom sheet top corners, edge-to-edge containers |
| `rounded-3xl` | 28px | Hero cards, large feature cards, modals |
| `rounded-2xl` | 24px | Primary tool cards, large dialogs |
| `rounded-xl` | 20px | Primary buttons, main input fields |
| `rounded-lg` | 16px | Secondary buttons, standard dropdowns, menus |
| `rounded-md` | 12px | Nested card items, secondary utility buttons |
| `rounded-sm` | 8px | Checkboxes, tooltips, small indicators |
| `rounded-xs` | 4px | Hairline dividers, micro-elements |

> ⚠️ Arbitrary values like `rounded-[18px]` are **forbidden**. Use only the tokens above.
> Every component must follow the Parent-Child Radius Rule: $\text{Radius}_{\text{child}} = \text{Radius}_{\text{parent}} - \text{Padding}_{\text{parent}}$.


### 3.3 Color Tokens
| Token | Value | Usage |
|-------|-------|-------|
| `--kv-primary` | `#4F46E5` | Primary actions, accents |
| `--kv-surface` | `#0F172A` | Dark background |
| `--kv-border` | `#1E293B` | Borders, dividers |
| `--kv-surface-2` | `#1E293B` | Elevated surface |
| `--kv-text` | `#F8FAFC` | Primary text (dark mode) |
| `--kv-text-muted` | `#94A3B8` | Secondary text |

### 3.4 Motion Tokens
- **Easing:** `ease-expo` → cubic-bezier(0.16, 1, 0.3, 1)
- **Max duration:** 400ms
- **Transition properties allowed:** `transform`, `opacity` only
- **Forbidden properties:** `width`, `height`, `box-shadow`, `filter` (except `backdrop-blur`)
- **Spring config:** `{ stiffness: 300, damping: 30 }`
- `prefers-reduced-motion` **must** disable all animations globally via `MotionConfig reducedMotion="user"`

---

## 4. Architecture & Directory Structure

```
/
├── app/                         # Next.js App Router
│   ├── (tools)/                 # Category-based tool routes
│   │   └── [category]/[tool-id]/
│   │       ├── page.tsx         # Server Component — metadata + ToolShell
│   │       ├── ToolClientWrapper.tsx  # "use client" + ssr:false boundary
│   │       └── ToolClient.tsx   # Interactive logic
│   ├── layout.tsx
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── ui/                      # Shared atomic UI (ToolShell, MetricCard, ToolInput, SliderField, KVLogo)
│   └── system/                  # System-level (EngineLoader, ErrorBoundary, EmptyState, StatusBadge)
├── src/
│   ├── engine/
│   │   └── workers/             # karuvi.worker.ts, WorkerOrchestrator, TaskScheduler
│   ├── features/                # Tool-specific logic — isolated from UI
│   ├── store/                   # Global Zustand stores (settings, favorites, session)
│   ├── lib/                     # Stateless utilities — pure functions only
│   ├── registry/                # Tool metadata and discovery
│   └── theme/                   # Design token definitions
├── public/                      # Static assets, worker files (synced via scripts/)
├── scripts/                     # Build-time: sync-workers.js, favicons, etc.
├── BUNDLE_DECISIONS.md          # Required log for every new dependency
└── EXCEPTIONS.md                # Required log for every rule exception
```

---

## 5. React & Reactivity Standards

### 5.1 Zustand Rules
- **Atomic selectors only:** `const field = useStore(s => s.field)`
- **Never:** `const { field1, field2 } = useStore()` — this re-renders on any store change
- Use `useShallow` when selecting objects/arrays: `useStore(useShallow(s => s.obj))`
- Use module-level `EMPTY_ARRAY = []` and `EMPTY_OBJECT = {}` as stable fallbacks
- Tool-specific stores must remain **isolated** — never share raw state between tools

### 5.2 React Rules
- `setState` must never be called during render
- All handlers passed to children must be wrapped in `useCallback`
- Expensive computations must be wrapped in `useMemo`
- Every `useEffect` that subscribes to timers, listeners, or workers **must** return a cleanup function
- `exhaustive-deps` warnings are never suppressed — fix the root cause
- Use `React.memo` for repeated list items with stable props
- Never pass inline objects/arrays as props: `style={{ color: 'red' }}` → extract to a constant or token

### 5.3 Rendering Performance
- Framer Motion `layout` animations only when structurally necessary; prefer `opacity`/`transform`
- No cascade re-renders from global state changes — profile with React DevTools before merging
- Tool switch re-render budget: **<100ms**
- Sidebar interactions: **60fps** sustained

### 5.4 SSR Policy (KL-07)

Any tool using browser-only APIs (Canvas, Web Workers, BarcodeDetector, IndexedDB), heavy libraries (Monaco, PDF.js), or direct DOM manipulation **MUST** use `ssr: false`.

**Required pattern — 3-file structure:**

```typescript
// ToolClientWrapper.tsx — "use client" boundary
"use client";
import dynamic from 'next/dynamic';
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const ToolClient = dynamic(
  () => import('./ToolClient'),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

export default function ToolClientWrapper() {
  return <ToolClient />;
}
```

```typescript
// page.tsx — Server Component, owns metadata
import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import ToolClientWrapper from './ToolClientWrapper';

export const metadata: Metadata = { /* ... */ };

export default function Page() {
  return (
    <ToolShell>
      <ToolClientWrapper />
    </ToolShell>
  );
}
```

```typescript
// ToolClient.tsx — All interactive logic lives here
"use client";
// ... full tool implementation
```

---

## 6. Immutable Architectural Guardrails (KL-Series)

> These rules **cannot be reverted**. Each was established after a real production failure. Violations are classified as **BLOCKER** severity.

| Rule | Constraint | Why It Exists |
|------|-----------|---------------|
| **KL-01** | Zero raw `URL.createObjectURL` outside `blobManager` | Memory leaks from unreferenced Blob URLs |
| **KL-02** | Worker concurrency: max **3** desktop / **2** mobile via `WorkerOrchestrator` | OOM crashes on low-memory devices |
| **KL-03** | Every `dynamic()` import must have `<Suspense>` + `<ToolSkeleton>`. No `loading: null` | Blank screen flash on slow connections |
| **KL-04** | All `postMessage` listeners must validate `event.origin === window.location.origin` | XSS via malicious iframes |
| **KL-05** | All async pipelines (workers, fetch, ZIP) must accept and propagate `AbortSignal` | Resource leaks on navigation/cancel |
| **KL-06** | Store-owned Blob URLs revoked only by store lifecycle (`removeFile`/`clearFiles`) | Double-revoke crashes |
| **KL-07** | Browser-only tools loaded with `ssr: false` via `ToolClientWrapper` pattern | SSR hydration mismatches |
| **KL-08** | Every `ErrorBoundary` must expose a Retry action — never a dead end | Users get stuck with no recovery path |
| **KL-09** | All user-provided HTML/Markdown rendered through `DOMPurify.sanitize()` | Stored XSS via file content |
| **KL-10** | `WorkerOrchestrator` is the **only** entry point for spawning workers | Duplicate workers exhaust thread limits |
| **KL-11** | No automatic config injection (`static_site_generator: next`) in GitHub Actions | The `configure-pages` action's AST parser crashes on complex `next.config.mjs` files |

### 6.1 Performance Manifesto (PERF-Series)

| Rule | Constraint |
|------|-----------|
| **PERF-01** | No synchronous heavy computation on the main thread (`zipSync`, crypto, parsing >5ms) |
| **PERF-02** | `ArrayBuffer` must be **transferred** (not copied) when passed to/from workers |
| **PERF-03** | Main-thread responsiveness is non-negotiable — 60fps regardless of background tasks |
| **PERF-04** | Initial JS bundle growth per new feature: **<20KB gzipped** |
| **PERF-05** | Mobile peak memory target: **<150MB** |
| **PERF-06** | Long tasks (>50ms) on the main thread are **forbidden** — break with `scheduler.yield()` |

---

## 7. Performance Budgets

| Metric | Budget |
|--------|--------|
| Main thread max blocking per task | 5ms |
| Long task threshold (forbidden) | 50ms |
| Tool switch re-render time | <100ms |
| Sidebar interaction frame rate | 60fps |
| Mobile peak memory | <150MB |
| Initial JS bundle growth per feature | <20KB gzipped |
| Bundle regression requiring approval | >20KB gzipped |
| Worker concurrency (desktop) | 3 max |
| Worker concurrency (mobile) | 2 max |
| EngineLoader default timeout | 10s |

---

## 8. Worker & Engine Loading Standards

### 8.1 EngineLoader Component
All tools loading an external worker, WASM module, or CDN dependency must use `<EngineLoader>` (`components/system/EngineLoader.tsx`).

**Props:** `loadingMessage`, `errorMessage`, `onReady`, `timeout` (default 10s), `onRetry`
**Behavior:** Shows shimmer skeleton → if `onReady` not called within timeout → shows `errorMessage` + Retry button. **Never hangs indefinitely.**

### 8.2 Worker File Loading Pattern

Every external worker file must be:
1. Copied to `public/` via `scripts/sync-workers.js`
2. Referenced with an absolute path
3. Backed by a CDN fallback if local file fails
4. Protected by a 10s timeout via `<EngineLoader>`

```typescript
// Standard worker loading with local + CDN fallback
function initWorkerSrc(): string {
  try {
    // Verify local file exists by checking precache manifest
    return '/pdf.worker.min.mjs';
  } catch {
    return 'https://unpkg.com/pdfjs-dist@4.0.379/build/pdf.worker.min.mjs';
  }
}

pdfjsLib.GlobalWorkerOptions.workerSrc = initWorkerSrc();
```

### 8.3 Initialization Error Handling

**Forbidden:**
```typescript
// ❌ Silent fallback — user has no idea something failed
try {
  await initEngine();
} catch {
  return defaultResult;
}
```

**Required:**
```typescript
// ✅ User-visible error with retry
try {
  await initEngine();
  setEngineReady(true);
} catch (err) {
  setEngineError('Failed to load processing engine. Please retry.');
  logger.error('Engine init failed', err);
}
```

### 8.4 Worker Lifecycle Standards
- Workers must terminate idle tasks where possible
- Transferable objects must be released after processing
- Large buffers must be nulled after completion
- All worker queues must support cancellation and cleanup via `AbortSignal`

---

## 9. Concurrency Enforcement

- Batch image/PDF processing throttled via `src/lib/concurrency.ts`
- Max concurrent worker jobs: **3** desktop, **2** mobile
- PDF Merge processes files **one-by-one** (load → copy → release)
- `WorkerOrchestrator` is the **only** entry point for spawning workers (KL-10)

---

## 10. Accessibility Standards (WCAG 2.2 AA — Non-Negotiable)

| Requirement | Detail |
|-------------|--------|
| Keyboard operability | Tab, Enter, Escape, Arrow keys on every interactive element |
| Focus indicators | Visible on all focusable elements — never `outline: none` without replacement |
| Focus trapping | Required in modals, drawers, Command Palette |
| Error announcements | `role="alert"` for critical errors and status messages |
| Icon-only buttons | Must have `aria-label` |
| Color contrast | ≥4.5:1 in all themes (dark, light, high-contrast) |
| Touch targets | ≥44×44px on all interactive elements |
| Motion | `prefers-reduced-motion` must completely disable animations |
| Screen readers | All tool states must be announced via `aria-live` regions |
| Semantic HTML | Use correct elements — `<button>`, `<nav>`, `<main>`, `<section>` |

---

## 11. SEO Standards

### 11.1 Redirects (Zero-Chain Policy)
- **Native redirects only** — define in `next.config.ts` via `redirects()`, never `vercel.json`
- **Single-hop rule** — no redirect may require more than one hop
- Test all redirects with `curl -L -v` before merging

### 11.2 Canonical URLs
- Every page must dynamically generate a unique, self-referencing canonical URL
- **Never** hardcode `alternates: { canonical: "/" }` in root `app/metadata.ts`
- All canonical URLs, sitemap entries, and structured data URLs must end with trailing slash:
  `https://karuvilab.com/tools/[category]/[tool-id]/`
- URL normalization regex: `.replace(/^\/+|\/+$/g, '')` — no accidental spaces

### 11.3 Required Metadata Per Tool Page
Every tool page must include:
- Unique `<title>` following: `[Tool Name] – KV`
- Unique `<meta name="description">` of 120–160 characters
- Valid Open Graph + Twitter Card tags
- `WebApplication` or `SoftwareApplication` JSON-LD with: `datePublished`, `dateModified`, `applicationCategory`, `operatingSystem`, `offers`
- `FAQPage` JSON-LD (if FAQ section present)
- `BreadcrumbList` JSON-LD with canonical URL normalization
- Self-referencing `<link rel="canonical">` with trailing slash

### 11.4 Content Standards (E-E-A-T)
Every tool page must have:
- ≥400 words of original, server-rendered descriptive content
- **Introduction** (150–250 words)
- **How-To-Use** (minimum 4 steps)
- **Practical Examples** (minimum 3)
- **FAQ** (minimum 5 questions)
- **Privacy Section** — explain what data is/isn't collected
- Trust badges displayed prominently: `✓ No Uploads`, `✓ Browser Processing`, `✓ Offline Capable`, `✓ No Account Required`

> ❌ **Forbidden content patterns:** "In today's digital world...", "This powerful tool...", AI-style repetition, generic filler.

### 11.5 Sitemap & Crawling
- Dynamic sitemap (`app/sitemap.ts`) must include all tool pages
- Priority values: `1.0` homepage, `0.9` category hubs, `0.8` tool pages, `0.5` break-time tools
- `robots.txt` must allow all crawlers and reference sitemap index
- No `noindex` on public tool pages

### 11.6 Internal Linking
- Every tool must link to ≥3–5 related tools via `relatedTools` registry field
- `ToolShell` must render a "Related Tools" section when data is present
- Cross-category linking encouraged where logical

---

## 12. UI/UX Quality Standards

### 12.1 Zero Dead Elements (Mandatory Audit)
- Every button, icon, link, toggle, slider, and menu item must perform a functional action
- Elements that appear interactive but do nothing are a **BLOCKER**
- All tool pages must pass the **Dead Element Strike audit** before merging

### 12.2 Micro-interactions
| Interaction | Spec |
|-------------|------|
| Hover (desktop) | Subtle lift 1–2px, shadow elevation, or border accent. Duration <200ms |
| Active/press | Scale to `0.98` with spring feedback |
| Touch feedback | Ripple or scale on primary actions and FABs |
| Loading | Shimmer skeletons matching content dimensions — no blank screens |
| View transitions | Framer Motion springs: `{ stiffness: 300, damping: 30 }` |

### 12.3 Empty States
- Every tool must show a friendly empty state with a clear CTA in its initial state
- Use shared `<EmptyState>` component — no blank canvases

### 12.4 Error & Recovery UX
- All errors must show human-friendly messages with a Retry action (`<RecoveryBanner>`)
- No raw stack traces, no "Unhandled Error" messages shown to users
- Silent failures are **forbidden**

### 12.5 Status Communication
- Use `<StatusBadge>` for all processing states: `Queued | Processing | Complete | Error`
- All status changes announced via `aria-live` regions

### 12.6 Mobile-First Ergonomics
- Touch targets ≥44×44px
- Bottom nav must respect safe-area insets: `pb-[env(safe-area-inset-bottom)]`
- FAB placed `bottom-24` on mobile to avoid overlap
- No horizontal overflow at 320px — test on every new tool
- **Responsive Padding Rule**: Never use static large paddings (e.g., `p-6`, `p-8`, `p-12`) on structural or layout wrappers. Always use fluid responsive spacing (`p-4 sm:p-6`, `p-4 sm:p-8`) to prevent layout crushing, horizontal scrolling, and CLS on narrow mobile viewports.

### 12.7 Privacy Transparency
- File-processing tools must display `<PrivacyBadge>`: "Processed entirely in your browser"
- Currency Converter must show data freshness: live / cached / stale with timestamp
- No tool may access camera/microphone without explicit permission + clear messaging

---

## 13. Security Standards

| Rule | Requirement |
|------|-------------|
| HTML rendering | `DOMPurify.sanitize()` on ALL user-provided HTML/Markdown |
| `postMessage` | Validate `event.origin === window.location.origin` (KL-04) |
| Dynamic code | No `eval()`, `new Function()` outside trusted worker contexts |
| Script injection | No dynamic `<script>` tag injection |
| Crypto | Web Crypto API is the only cryptographic library |
| IndexedDB | No sensitive personal data without encryption |
| CSP | Content-Security-Policy headers must be configured in `next.config.ts` |
| Subresource integrity | CDN fallback URLs must include `integrity` attribute where possible |
| Security Headers | `X-Frame-Options` must be `SAMEORIGIN` (NEVER `DENY`) so the Workbench can frame local tools. |

---

## 14. State Management Architecture

### 14.1 Global Stores (cross-tool use only)
- Settings (theme, font scale, preferences)
- Favorites
- Workflow state
- Session persistence

### 14.2 Tool-Specific Stores
- Must remain **isolated** per tool
- Never expose raw tool state to other tools
- Located in `src/features/[tool-id]/store.ts`, not `src/store/`

### 14.3 Persistence Rules
- **IndexedDB via `idb`** is the only persistence layer
- All persisted Zustand stores must define explicit `version` + migration functions
- **Never persist:** `Blob`, `File`, raw `ArrayBuffer`, transient worker state
- IndexedDB writes must be **debounced** when triggered by rapid UI events (e.g., slider input)
- Large binary payloads must never be duplicated across persistence layers
- Expired cache entries must support cleanup via version migration

---

## 15. Service Worker Standards

- All tool bundles must be precached
- Worker files use **cache-first** strategy
- Version mismatches must trigger automatic stale cache invalidation
- Dynamic cache growth must be bounded (set explicit max entries)
- Failed cache hydration must degrade gracefully — never crash the tool
- Offline mode must be fully validated as part of every tool's production gate

---

## 16. Error Isolation Standards

- Every tool route must have an `<ErrorBoundary>` with a Retry action (KL-08)
- Worker failures must surface user-safe messages — never raw error objects
- No raw stack traces shown to users in production
- Failed batch items must not terminate the entire queue
- All errors must be logged to `src/lib/logger.ts` with context (tool ID, action, timestamp)

---

## 17. React Server Component Rules

- Server Components must **never** import browser APIs
- `"use client"` only when interactivity is genuinely required — avoid unnecessary client boundaries
- Heavy UI islands must be dynamically imported
- Server Components own data loading whenever network access is required
- `page.tsx` must always remain a Server Component (required for `metadata` export)

---

## 18. Motion Standards

**Allowed animated CSS properties:**
- `transform` (translate, scale, rotate)
- `opacity`

**Forbidden animated properties:**
- `width`, `height` → use `scale` or layout animations
- `box-shadow` → use static tonal elevation tokens
- `filter` → except subtle `backdrop-blur` on capable devices

**Rules:**
- Always respect `prefers-reduced-motion` — `MotionConfig reducedMotion="user"` set globally
- `layout` animations only where structurally required
- Max animation duration: **400ms**
- Spring config: `{ stiffness: 300, damping: 30 }`

---

## 19. Bundle Governance

- Every new dependency requires an entry in `BUNDLE_DECISIONS.md`:
  - Gzipped size impact
  - Alternatives considered and rejected
  - Justification
- Heavy libraries must be dynamically imported via `next/dynamic`
- Duplicate utility libraries are **forbidden** (e.g., don't add `moment` if `date-fns` exists)
- Bundle regression >20KB gzipped requires explicit approval before merge

---

## 20. Testing Standards

### 20.1 Required Before Every Production Merge
```bash
npm run typecheck    # Zero TypeScript errors
npm run lint         # Zero ESLint warnings/errors
npm run test         # All unit/integration tests pass
npm run build        # Clean production build
```

### 20.2 Manual Validation Required
- [ ] Mobile viewport at 320px — no overflow, usable layout
- [ ] Offline mode — works after first visit with no internet
- [ ] Worker cancellation — cancel mid-task, verify no memory leak
- [ ] Keyboard-only navigation — all interactions reachable
- [ ] Screen reader announcement — all state changes announced
- [ ] DevTools heap snapshot — no memory leak after 5 tool operations
- [ ] Dead Element Strike audit — every interactive element does something

---

## 21. Development Workflow & Tool Registry

### 21.1 Adding a New Tool (5-Step Workflow)
1. Add tool metadata to `src/registry/tools/[tool-id].ts`
2. Create route at `/app/(tools)/[category]/[tool-id]/`
3. Implement `page.tsx` (Server Component — metadata + `ToolShell`)
4. Implement `ToolClientWrapper.tsx` (`"use client"` + `ssr: false`)
5. Implement `ToolClient.tsx` (interactive logic — browser-only)

### 21.2 New Tool Pre-Merge Checklist

```
BROWSER APIs
[ ] Uses browser-only APIs? → ToolClientWrapper with ssr: false (KL-07)
[ ] Loads a worker or WASM? → Standard worker loading pattern (local + CDN fallback)
[ ] Worker file needed? → Added to scripts/sync-workers.js

ARCHITECTURE
[ ] Every async init has try/catch → user-visible error state + retry
[ ] No full Zustand store subscriptions → atomic selectors only
[ ] All Blob URLs via blobManager (KL-01)
[ ] All async ops accept AbortSignal (KL-05)

QUALITY GATES
[ ] npm run typecheck → zero errors
[ ] npm run build → clean build
[ ] 320px mobile viewport → no overflow
[ ] Keyboard accessible
[ ] Screen reader friendly
[ ] Works offline after first visit
[ ] Zero dead UI elements
[ ] Memory leak check via DevTools

SEO
[ ] metadata (title, description, OG tags) defined in page.tsx
[ ] JSON-LD structured data (WebApplication + FAQPage + BreadcrumbList)
[ ] Self-referencing canonical URL with trailing slash
[ ] ≥400 words server-rendered content
[ ] Trust badges displayed
[ ] ≥3 related tools in relatedTools registry field
```

---

## 22. Severity Classification

| Level | Meaning | Example |
|-------|---------|---------|
| **BLOCKER** | Production crash, memory leak, security breach | KL-series violation, XSS, OOM |
| **CRITICAL** | Architecture violation, severe rendering instability | Full store subscription, dead UI |
| **MAJOR** | Significant UX or performance degradation | Missing error boundary, no empty state |
| **MINOR** | Non-critical standards deviation | Missing `aria-label` on non-critical icon |
| **NIT** | Cosmetic or maintainability issue | Inconsistent spacing, naming style |

> A BLOCKER or CRITICAL must block the merge. MAJOR requires a fix or a logged exception in `EXCEPTIONS.md`.

---

## 23. Known Fixed Bugs (Regression Prevention)

> These are documented to prevent re-introduction. The KL-series guardrails encode enforcement.

| ID | Summary | Enforced By |
|----|---------|-------------|
| BUG-001 | Minification blocked the main thread | PERF-01, Terser runs in worker |
| BUG-002 | Calculator division-by-zero crashed silently | Input validation required |
| BUG-003 | Uncapped batch concurrency caused OOM | KL-02, WorkerOrchestrator |
| BUG-004 | Checkbox not accessible to screen readers | Radix UI primitives |
| BUG-005 | JSON tree renderer crashed on deep/large trees | Depth + size limits enforced |
| BUG-006 | Blob URLs leaked on component unmount | KL-01, KL-06, blobManager |
| BUG-007 | PDF Merge held all files in memory simultaneously | Sequential one-by-one processing |
| BUG-008 | Silent SSR hydration mismatch on tool load | KL-07, ToolClientWrapper pattern |
| BUG-009 | `postMessage` listener exploitable via iframe | KL-04, origin validation |

---

## 24. Strategic Roadmap

> **North Star:** KaruviLab helps engineers understand technology—not just use it. Every tool is private, offline-first, technically accurate, and teaches the concepts, standards, architecture, security, and real-world engineering behind it.

### Phase 1 — Freeze Features (Complete the Foundation)
**Priority: 🔴 ACTIVE**
- **NO NEW TOOLS.** Focus exclusively on making every existing tool excellent.
- Every tool must be the *best browser-native implementation available*.
- Mandatory completion for every existing tool before moving to Phase 2:
  - Reliable implementation
  - Offline-first & Worker support
  - Mobile optimization & Accessibility
  - Error handling & Failure Cases
  - Learn More section & FAQ
  - Best Practices, Standards/RFC references, and Examples

### Phase 2 — Engineering Learning System (Highest Priority)
**Priority: 🟡 NEXT**
- This differentiates KaruviLab. Every tool must have a structured learning path:
  - `Tool → Learn → How it Works → Algorithm → Architecture → Browser APIs → Security → Performance → Real-world Usage → Standards → Failure Cases → Quiz → Further Reading`

### Phase 3 — Browser Engineering Excellence
- Make KaruviLab known for technical quality. People should inspect any tool to learn how modern browser engineering works:
  - Web Workers, Worker pools, WASM (only where justified), IndexedDB, Service Worker, Background processing, Lazy loading, Bundle/Memory/Mobile optimization.

### Phase 4 — Domain Knowledge (The Biggest Opportunity)
- Focus on domains where very few utility websites have deep expertise. Priority:
  1. **Banking Engineering:** ISO 8583, EMV, TLV, SWIFT, Payment systems
  2. **Cryptography:** RSA, ECC, JWT, OAuth, TLS, X.509
  3. **PDF Engineering:** PDF internals, Digital signatures, PDF/A, Compression, Object model
  4. **Image Engineering:** JPEG, PNG, WebP, AVIF, EXIF, Color spaces

### Phase 5 — Quality Before Quantity
- Create an internal checklist (Functionality, UI/UX, Accessibility, Worker/Offline support, Learn section, Failure cases, Quiz, Standards, References, Examples).
- **Rule:** If one of these is missing, the tool stays in "Work in Progress."

### Phase 6 — Community Trust
- Add: Changelog, Version history, "Last verified" date, Browser compatibility, Source references (RFCs), Educational articles, Engineering blogs.

### What NOT to do
- ❌ Chasing 500 tools.
- ❌ Adding AI to every feature.
- ❌ Adding dependencies without a clear need.
- ❌ Copying competitors feature-for-feature.

---

## 25. Exception Process

Any rule in this document may only be bypassed by:
1. Opening a PR with the exception clearly documented in `EXCEPTIONS.md`
2. Stating: the rule violated, the reason it cannot be followed, the mitigation applied, and the expected resolution date
3. Getting explicit review approval before merging

**No undocumented exceptions. Ever.**

---

## 26. Z-Index SOP — Preventing Layout Overlap Regressions

> **This rule exists because sidebar/modal overlap bugs regressed 10+ times.** Root cause: two parallel z-index scales with contradictory values. This SOP permanently eliminates that class of bug.

### 26.1 Single Source of Truth

**`src/theme/zindex.ts` is the ONLY place z-index values may be defined.**

- The `app/globals.css` `@theme` section contains CSS custom properties (`--z-*`) that **must mirror** `zindex.ts` exactly. Never change one without changing the other.
- `tailwind.config.ts` consumes `zindex.ts` via `zIndex: tokens.zIndex`, producing named Tailwind classes.
- Never define a new z-index value anywhere else in the codebase.

### 26.2 Canonical Z-Index Stack

| Token | Value | Use For |
|-------|-------|---------|
| `z-behind` | -10 | Decorative blobs, background pseudo-elements |
| `z-base` | 0 | Document flow (default) |
| `z-content` | 10 | Local stacking helpers inside a component |
| `z-above` | 20 | Slightly-elevated siblings (e.g. active chip) |
| `z-sidebar` | 30 | Desktop sidebar `<aside>`, sticky scroll-container headers |
| `z-header` | 40 | Page-level sticky `<header>` |
| `z-nav` | 60 | Fixed `<BottomNav>` (mobile only) |
| `z-backdrop` | 90 | Dark scrim **behind** a drawer/sidebar (not a modal) |
| `z-dropdown` | 100 | Dropdowns, tooltips, small absolute popovers |
| `z-modalBackdrop` | 400 | Scrim **behind** a full-screen modal/dialog |
| `z-modal` | 500 | Full-screen modals, drawers, search overlay, mobile sidebar panel |
| `z-popover` | 600 | Floating selects that must clear open modals |
| `z-toast` | 800 | Transient session-restored / info banners |
| `z-max` | 1000 | Always-on-top: Toasts, cookie consent |

### 26.3 Prohibited Patterns (enforced by P-19)

```tsx
// ❌ FORBIDDEN — raw numeric class
<div className="fixed inset-0 z-50">...</div>

// ✅ REQUIRED — named design token
<div className="fixed inset-0 z-modal">...</div>
```

The following raw classes are **banned** in production code:
`z-0`, `z-10`, `z-20`, `z-30`, `z-40`, `z-50`, `z-60`, `z-70`, `z-80`, `z-90`, `z-100`

### 26.4 Adding a New Layer

1. Open `src/theme/zindex.ts`
2. Insert the new token with a value that fits logically between existing layers
3. Add the matching `--z-{name}` entry to `app/globals.css` `@theme` section with the same value
4. Use the named class (`z-{token-name}`) in your component
5. Document it in the table in Section 26.2 of this file

### 26.5 Checklist Before Every Push

> Run this mental checklist any time you touch layout, modals, sidebars, or any `fixed`/`sticky` positioned element:

- [ ] Does every new `z-` class use a **named token** from `zindex.ts`?
- [ ] Does anything `fixed` or `sticky` have a z-index? If yes, is it in the stack above?
- [ ] Are `z-backdrop` (90) and `z-modalBackdrop` (400) used correctly? Backdrop = behind drawer; ModalBackdrop = behind full-screen dialog.
- [ ] Is the mobile `BottomNav` (`z-nav=60`) covered by any fixed element that should appear above it?
- [ ] Does any component create an **unexpected stacking context** (e.g., `transform`, `filter`, `will-change`, `isolation: isolate`) that could trap descendant z-indexes?
- [ ] Are `globals.css` CSS custom property values still in sync with `zindex.ts`?

### 26.6 Stacking Context Gotchas

These CSS properties **create a new stacking context**, which means child `z-index` values become relative to that element, not the document root:
- `transform` (any non-none value)
- `filter` (any non-none value)
- `will-change: transform`
- `opacity` < 1
- `isolation: isolate`
- `position: fixed` or `position: sticky`
- `mix-blend-mode`

**Rule:** Never apply `transform`, `filter`, or `will-change` to the `<Sidebar>`, `<Header>`, `<BottomNav>`, or any layout scaffolding component. These properties can trap child z-indexes and cause modals/dropdowns inside them to be clipped at the wrong z level.

### 26.7 Component-to-Token Reference

| Component | File | Required Token |
|-----------|------|----------------|
| Desktop Sidebar `<aside>` | `Sidebar.tsx` | `z-sidebar` |
| Sticky `<header>` | `Header.tsx` | `z-header` |
| BottomNav `<nav>` | `BottomNav.tsx` | `z-nav` |
| Mobile sidebar scrim | `MobileSidebar.tsx` | `z-backdrop` |
| Mobile sidebar panel | `MobileSidebar.tsx` | `z-modal` |
| SearchOverlay | `SearchOverlay.tsx` | `z-modal` |
| Any Modal backdrop/scrim | any | `z-modalBackdrop` |
| Any Modal panel/content | any | `z-modal` |
| QRModal backdrop | `QRModal.tsx` | `z-modalBackdrop` |
| QRModal panel | `QRModal.tsx` | `z-modal` |
| Dropdown menus | `ShareButton`, `ToolMoreMenu` | `z-dropdown` |
| Toast container | `Toast.tsx` | `z-max` |
| Cookie consent | `CookieConsentBanner.tsx` | `z-max` |
| PWA install banner | `PWARegistration.tsx` | `z-max` |
| RecoveryBanner | `RecoveryBanner.tsx` | `z-modal` |
| SessionRestoredBanner | `SessionRestoredBanner.tsx` | `z-toast` |
| FocusModeWrapper overlay | `FocusModeWrapper.tsx` | `z-modal` |

---

## 27. Deployment Strategy & Environments

KaruviLab operates with a dual-environment deployment strategy to ensure stable production releases while maintaining a live testing ground.

| Environment | Platform | Build Output | Purpose |
|-------------|----------|--------------|---------|
| **Production** | Vercel | Standard Next.js | The live, user-facing application. Utilizes standard Next.js building, allowing for server-side optimizations. |
| **UAT / Staging** | GitHub Pages | `export` (SSG) | User Acceptance Testing. Acts as a staging environment to catch bugs. `next.config.mjs` automatically handles the `output: 'export'` switch and `basePath` mapping when `GITHUB_PAGES` is true. |

> **Requirement:** Never hardcode `output: 'export'` in `next.config.mjs` outside of the `isGithubPages` conditional, as this will cripple the Vercel production build.

---

## 28. Break-Time Category Standards
- **Purpose**: Low-priority mini-games to provide a break. They are not part of the core feature set.
- **Rules**:
  - Must remain strictly client-side.
  - Priority in sitemap is 0.5.
  - No retention guarantees (pending review).

---

*This manifesto evolves with the platform. Every architectural decision that prevents a production failure must be added here with its KL/PERF rule number. Version this document — increment the version header on every material change.*
