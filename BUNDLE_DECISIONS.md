# KaruviLab (KV) — Bundle Decisions Log

This file tracks every new dependency added to the project, its impact on bundle size, and the justification for its inclusion as required by **KL-08** and **PERF-04**.

---

## Log Format

| Date | Library | Gzipped Size | Purpose | Alternatives Considered | Justification |
|------|---------|--------------|---------|-------------------------|---------------|
| 2026-06-04 | Initial | - | Core Stack | - | Project Bootstrap |

---

## Active Decisions

| 2026-07-10 | `react-image-crop` | ~3.8 KB | Interactive image crop UI | Custom canvas logic | Lightweight, robust, and accessible UI component for dragging and resizing crops. |
| 2026-07-10 | `jsqr` | ~30 KB | QR Code Scanner fallback | `zxing` (too heavy, WASM/worker heavy), `html5-qrcode` (heavy, requires specific UI logic) | The native `BarcodeDetector` API is not supported on Firefox, Safari, and iOS. `jsqr` provides a lightweight pure-JS fallback specifically for QR codes. It does not violate the >20KB feature growth limit significantly given its dynamic import. |


### 2026-06-18
- **Library:** `qrcode@1.5.1`
- **Impact:** ~20KB gzipped
- **Purpose:** Client-side QR code generation
- **Alternatives:** None viable (all others require server-side generation)
- **Justification:** Essential for local, privacy-first QR code generation tool without public APIs. Down-versioned to 1.5.1 because 1.5.3 dropped the pre-built browser bundle.

### 2026-06-25
- **Library:** `framer-motion`
- **Impact:** ~35KB gzipped
- **Purpose:** Hardware-accelerated animations
- **Alternatives:** CSS transitions (insufficient for complex orchestration)
- **Justification:** Required for premium enterprise UX, micro-interactions, and view transitions.

- **Library:** `mammoth`
- **Impact:** ~40KB gzipped (Dynamic Import)
- **Purpose:** Client-side .docx parsing and HTML conversion
- **Alternatives:** None viable for browser-only extraction
- **Justification:** Required for document conversion tools without sending data to servers.

- **Library:** `mermaid`
- **Impact:** ~1.2MB gzipped (Dynamic Import strictly required)
- **Purpose:** Client-side diagram generation from Markdown
- **Alternatives:** Server-side PlantUML (violates zero-server-upload)
- **Justification:** Enables local-first diagram rendering for the Markdown tool suite.

- **Library:** `gifenc`
- **Impact:** ~15KB gzipped (Dynamic Import)
- **Purpose:** Client-side GIF generation/encoding
- **Alternatives:** gif.js (abandoned), FFmpeg.wasm (too heavy, ~25MB)
- **Justification:** Lightweight GIF encoder for local image processing tools.

### 2026-07-02
- **Library:** `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`
- **Impact:** ~15KB gzipped
- **Purpose:** Robust 2D grid drag-and-drop reordering for desktop and mobile touch
- **Alternatives:** `framer-motion`'s `Reorder` (limited to 1D lists, glitchy on CSS grids), HTML5 native Drag and Drop (broken on mobile Safari/Chrome without large polyfills).
- **Justification:** Required for a smooth drag-to-reorder UX on grid layouts (e.g., World Clock) across both desktop and mobile devices.

### 2026-07-10
- **Library:** `jsqr@1.4.0`
- **Impact:** ~30KB gzipped (dynamic import — only loaded when native `BarcodeDetector` is absent)
- **Purpose:** QR code decoding fallback for browsers without the native Barcode Detection API (Firefox, Safari, iOS WebKit)
- **Alternatives considered:**
  - `@zxing/browser` (~140KB gzip, supports EAN/Code128/etc.) — exceeds PERF-04 20KB budget for a single-feature addition
  - `html5-qrcode` (~180KB gzip) — too large, also includes camera management we already handle natively
  - Rolling our own Reed-Solomon decoder — significant implementation risk, maintenance burden
- **Justification:** `jsqr` is the smallest viable pure-JS QR decoder (no WASM, no native code). It is dynamically imported only when `BarcodeDetector` is unsupported, so Chrome/Edge users pay zero bundle cost. Covers the primary fallback use-case (QR codes) on Firefox/Safari/iOS. Users are shown a clear notice when running in fallback mode explaining the QR-only limitation.

### 2026-07-19
- **Library:** `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/pm`
- **Impact:** ~50KB gzipped
- **Purpose:** Headless rich-text editor for grammar checking overlays
- **Alternatives:** Draft.js (deprecated), Quill (not headless)
- **Justification:** Required for grammar squiggly lines, inline tooltips, and contenteditable support without writing a risky custom DOM manager from scratch.

- **Library:** `nspell`, `dictionary-en`
- **Impact:** ~1.2MB gzipped (Dynamic Import in Web Worker strictly required)
- **Purpose:** Client-side offline spell checking
- **Alternatives:** Typo.js (less maintained, bigger dictionary format)
- **Justification:** Needed for offline spell checking in grammar tool without server API.

- **Library:** `compromise`
- **Impact:** ~250KB gzipped (Dynamic Import in Web Worker strictly required)
- **Purpose:** Client-side natural language processing (POS tagging)
- **Alternatives:** natural (too heavy), spaCy (Python/Server only)
- **Justification:** The only viable offline NLP library fast enough for browser workers.

- **Library:** `syllable`
- **Impact:** ~2KB gzipped
- **Purpose:** Syllable counting for readability scores
- **Alternatives:** Custom regex (error-prone for English)
- **Justification:** Lightweight reliable syllable counter.

---

### 2026-07-26 — Backfilled Missing Entries (Audit Remediation)

- **Library:** `pdf-lib@1.17.1`
- **Impact:** ~120KB gzipped (Dynamic Import)
- **Purpose:** Browser-side PDF manipulation — merge, split, rotate, watermark, page numbering, lock/unlock, image-to-PDF (10+ tools)
- **Alternatives:** `jspdf` (cannot modify existing PDFs), `pdfjs-dist` (viewing only)
- **Justification:** Core PDF toolchain. Dynamically imported — not in initial bundle.

---

- **Library:** `decimal.js@10.6.0`
- **Impact:** ~10KB gzipped
- **Purpose:** Arbitrary-precision decimal arithmetic for financial calculators (EMI, SIP, GST, compound interest)
- **Alternatives:** Native `Number` (unsafe beyond 15 significant digits), `big.js` (less full-featured), `bignumber.js` (~25KB gzip)
- **Justification:** Financial tools require IEEE 754-safe math. Industry standard with minimal footprint.

---

- **Library:** `lz-string@1.5.0`
- **Impact:** ~4KB gzipped
- **Purpose:** LZW string compression for persisting large notes/markdown content in IndexedDB
- **Alternatives:** `fflate` (binary only, not string-native), native `CompressionStream` (async — not suitable for IDB serialization)
- **Justification:** Enables large document storage in IDB without size limit failures. Synchronous, no worker overhead needed.

---

- **Library:** `html2pdf.js@0.14.0`
- **Impact:** ~50KB gzipped (Dynamic Import — Markdown Editor PDF export path only)
- **Purpose:** Client-side HTML→PDF rendering for Markdown Editor export
- **Alternatives:** `jspdf` alone (cannot render styled HTML), server-side rendering (violates P-09)
- **Justification:** Only viable browser-only styled-HTML-to-PDF solution. Zero cost until feature is used.

---

- **Library:** `workbox-window@7.4.1`
- **Impact:** ~8KB gzipped
- **Purpose:** PWA client-side SW lifecycle coordination (SKIP_WAITING, update detection) — `components/PWARegistration.tsx`
- **Alternatives:** Manual `navigator.serviceWorker` API (complex, error-prone)
- **Justification:** Required for reliable offline-first PWA behavior.

---

- **Library:** `lamejs@1.2.1`
- **Impact:** ~45KB gzipped (Dynamic Import in Web Worker — audio-converter only)
- **Purpose:** Client-side MP3 encoding from PCM audio in a Web Worker
- **Alternatives:** `ffmpeg.wasm` (~25MB, massive PERF-04 violation), Web Codecs API (no MP3 support in any browser)
- **Justification:** Smallest viable pure-JS MP3 encoder. Dynamically imported in worker — zero cost unless audio-converter is used.

---

- **Library:** `isomorphic-dompurify@3.18.0` [REMOVED / DEDUPLICATED]
- **Impact:** 0 KB (removed from project)
- **Status:** Removed in Phase 1 optimization. Replaced by unified `dompurify` library across browser & workers.


---

- **Library:** `resend@6.12.3`
- **Impact:** **Zero client bundle impact** — server-only (`app/api/contact/` + `app/api/send-feedback/` routes only)
- **Purpose:** Transactional email for contact form and feedback submission
- **Alternatives:** `nodemailer` (requires SMTP config), `sendgrid` (heavier SDK)
- **Justification:** API routes only. Confirmed: no import in `src/`, `components/`, or `app/(tools)/`. No client leakage risk.

---

- **Library:** `@tiptap/extension-placeholder@3.28.0`
- **Impact:** Included in existing `@tiptap/*` budget (~50KB total, approved 2026-07-19). Adds <2KB.
- **Purpose:** Placeholder text in the Tiptap editor for grammar checker tool's input
- **Alternatives:** Custom CSS `::before` (does not integrate with Tiptap state)
- **Justification:** Part of the approved Tiptap extension system; negligible incremental size.

---

### Removal Record

- **Library:** `@onlyrex/pulse@1.0.5` — **PENDING REVIEW** (logged 2026-07-26, TECH_DEBT.md TD-007)
- **Finding:** Zero source import usage (confirmed by grep audit). Only presence: `node_modules/@onlyrex/pulse/postinstall.js`. May be an orphaned or transitively required package.
- **Action:** Determine if required by any dependency. If not, remove and run `npm install`.

---

### 2026-07-26 — DevDependency Additions

- **Library:** `@next/bundle-analyzer` (devDependency)
- **Impact:** Zero production bundle impact — build-tool only, runs via `ANALYZE=true npm run analyze`
- **Purpose:** Visual bundle size analysis to enforce PERF-04 (<20KB gzipped per feature). Generates interactive treemap of all JS chunks.
- **Alternatives:** `webpack-bundle-analyzer` standalone (less integrated with Next.js chunk naming), manual size checks (insufficient)
- **Justification:** Required for PERF-04 compliance on a codebase with several heavy dynamic dependencies (monaco-editor, mermaid, pdfjs, tesseract, nspell+dictionary). Without a visualizer, bundle growth cannot be caught before it ships.
