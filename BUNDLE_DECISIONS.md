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
### [Example Entry]
- **Library:** `pdf-lib`
- **Impact:** ~120KB gzipped (Dynamic Import required)
- **Purpose:** Browser-side PDF modification
- **Alternatives:** `jspdf` (smaller but less capable for modification), `pdfjs` (viewing only)
- **Justification:** Required for core PDF tools functionality.

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
