# KaruviLab (KV) — Elite Engineering Manifesto (GEMINI.md)

Welcome to **KaruviLab (KV)**. This document is the single source of truth for the platform's identity, architecture, and engineering standards. All future AI interactions must adhere strictly to the philosophy and technical constraints defined herein.

## 1. Project Identity & Philosophy
- **Name:** KaruviLab (KV)
- **Vision:** The world's fastest, most private browser-native productivity platform.
- **Philosophy (Non-Negotiable):**
  - **Zero-Server-Upload:** All processing (PDF, Image, Code) MUST happen locally in the user's browser.
  - **Privacy-First:** User data never leaves the device. No tracking, no telemetry, no cloud storage.
  - **Local-First Execution:** Leveraging Web Workers (Comlink), WebAssembly, and Web Crypto for native-like performance in the browser.
  - **Offline Resilience:** 100% functional without an internet connection via Service Workers and IndexedDB.
  - **Enterprise UX:** Raycast/Linear-tier interface with keyboard-first productivity and motion-rich feedback.

## 2. Tech Stack (A-Z)
### Core Frameworks
- **Next.js 16.2+:** App Router architecture with strict Server/Client component separation.
- **React 19.0.6:** Utilizing latest hooks and Concurrent Mode features.
- **Tailwind CSS v4.2.4:** Standardized styling via modern JIT and container queries.

### Engineering & Concurrency
- **WorkerOrchestrator:** Unified singleton pool for managing Web Workers.
- **Comlink 4.4:** RPC-style communication between main thread and workers.
- **karuvi.worker.ts:** Monolithic worker entry point containing all CPU-intensive logic.

### Core Libraries
- **pdf-lib 1.17+:** High-performance PDF manipulation (merge, compress, watermark).
- **idb 8.0:** Lightweight wrapper for IndexedDB state persistence.
- **Zustand 5.0+:** Global state management with storage middleware.
- **Framer Motion 12.38+:** Production-grade animations and transitions.
- **DOMPurify 3.1+:** Essential XSS protection for all user-provided HTML/Markdown.
- **Terser 5.47+:** Browser-side JS minification and AST processing.

## 3. Design System & Tokens
### Branding
- **Logo:** Circular brand mark with Indigo-to-Blue gradient.
- **Wordmark:** DM Serif Display, Weight 800.

### Core Tokens
- **Corner Radius:**
  - `rounded-[32px]` (Large Containers/Cards)
  - `rounded-2xl` (24px, Secondary containers)
  - `rounded-xl` (20px, Modals/Dialogs)
  - `rounded-lg` (Input elements/Buttons)
- **Interactive Palette:**
  - `Blue`: `#4F46E5` (Action primary)
  - `Surface`: `#0F172A` (Dark mode background)
  - `Border`: `#1E293B` (Subtle separator)
- **Motion:** `ease-expo` (cubic-bezier 0.16, 1, 0.3, 1) for sub-400ms feedback.

## 4. Architecture & Key Paths
- `/app/`: Next.js App Router (Layouts and Page entry points).
- `/app/(tools)/`: Category-based tool logic.
- `/components/ui/`: Atomic components (`ToolShell`, `MetricCard`, `ToolInput`).
- `/src/engine/workers/`: Worker orchestration and monolithic worker code.
- `/src/lib/`: Core processing logic and stateless utility functions.
- `/src/store/`: Persistence-enabled Zustand stores.
- `/scripts/`: Build-time utilities (favicon generation, data sync).

## 5. Tool Registry (Detailed Map)
### 📊 Calculators (24)
- **Financial:** EMI, SIP, Compound Interest, GST, Discount, Salary, Mutual Fund Returns, Lumpsum, PPF, FD, RD, CAGR, Stock Average, Retirement Planner, SWP, Inflation, Safe-to-Spend.
- **Date & Time:** Age, World Clock, Date Calculator, Time Calculator, Work Hours, UTC ↔ IST.
- **Data:** Data Unit Converter (Bit/Byte/KiB/MB).

### 📄 PDF Tools (10)
- Compress PDF, Merge PDF, Split PDF, Image to PDF, PDF to Word, Lock / Unlock PDF, Watermark PDF, Page Numbering, Rotate PDF, Extract Images.

### 🖼️ Image Tools (7)
- Compress Image, Image Converter, Image Resizer, Image Crop, Bulk Image Resize, Background Remover, Image to Base64.

### 💻 Developer Tools (8)
- JSON Formatter, JSON ↔ CSV, Regex Tester, Code Minifier, Diff Checker, Code Formatter, HTML Online Viewer, File Viewer & Diff.

### 🛡️ Security & Encoding (6)
- Base64 Encode/Decode, Password Generator, Hash Generator (MD5/SHA/HMAC), URL Encoder, HTML Entities, JWT Decoder.

### 🛠️ Daily Utilities (9)
- QR Code Generator, Split & Copy, Text Utility, Grammar Checker, Task Reminder, Markdown Editor, URL Cleaner, File Validator, Speed Tester.

### 📈 SEO Tools (7)
- Meta Tags Generator, OG Preview, Sitemap Generator, robots.txt Builder, Image SEO, Slug Generator, SEO Title Tester.

## 6. Known Fixed Issues (Do Not Reintroduce)
*These architectural guardrails and logic fixes are immutable. Do not revert to legacy patterns.*

- **BUG-001 (Code Minifier):** Replaced regex-based minification with **Terser** in Web Workers. Template literals and modern JS syntax are now fully preserved.
- **BUG-002 (Calculator Integrity):** Implemented `n <= 0` guards in `emi-calculations.ts`. Tenure/Rate of 0 must return 0, not `Infinity` or `NaN`.
- **BUG-003 (Concurrency Limits):** Batch image processing is throttled (max 3 concurrent files) via `src/lib/concurrency.ts` to prevent UI freezing.
- **BUG-004 (Accessibility):** Password Generator and other tools use **Radix UI Checkboxes** for semantic `aria-checked` states and keyboard focus.
- **BUG-005 (DOM Protection):** JSON Formatter implements `maxAutoExpandDepth: 10` and truncates large collections (>100 items) to prevent OOM/UI freeze.
- **BUG-006 (Blob Lifecycle):** Image tools must revoke compressed/preview URLs on item removal via `useObjectUrlManager` or the central `blobManager`.
- **BUG-007 (Sequential PDF Merge):** PDF Merge processes files one-by-one (load-copy-release) to handle 100MB+ on low-RAM mobile devices.

### 🛡️ Platform Hardening (KL-Series)
- **KL-01:** Zero raw `URL.createObjectURL` calls allowed in client components.
- **KL-02:** Worker limits: **2 (Mobile) / 4 (Desktop)** via `WorkerOrchestrator`.
- **KL-03:** Every dynamic import MUST have a `Suspense` boundary with a `ToolSkeleton`.
- **KL-04:** `HtmlViewerClient` validates `event.origin` in its message listener.
- **KL-05:** `AbortSignal` is required for all worker tasks for instant cancellation.

## 7. Development Workflow & Conventions
### The Registry Flow
1. Add tool metadata to `src/tool-registry.ts`.
2. Create folder in `/app/(tools)/[category]/[tool-id]/`.
3. Implement `page.tsx` (Metadata + ToolShell wrapper).
4. Implement `[ToolId]Client.tsx` (Interactive logic).

### Component Standards
- **Inputs:** ALWAYS use `ToolInput`. Do not use raw `<input>` tags.
- **Sliders:** ALWAYS use `SliderField`. No raw `type="range"`.
- **Checkboxes:** ALWAYS use `Checkbox` (Radix-based).
- **Layout:** Use `rounded-[32px]` for all primary content containers.

### Performance Mandate
- Offload any logic taking >5ms to `workerManager`.
- Use `useObjectUrlManager` for all file previews.
- Ensure 0 horizontal overflow at 320px width.

## 8. Current Priorities
1. **Tool Expansion:** Adding complex data parsers (Excel/XML).
2. **UX Polish:** Refining the "Workflow Suggestions" logic between tools.
3. **PWA Offline Audit:** Ensuring every tool bundle is cached by the Service Worker.
