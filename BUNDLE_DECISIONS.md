# KaruviLab (KV) — Bundle Decisions Log

This file tracks every new dependency added to the project, its impact on bundle size, and the justification for its inclusion as required by **KL-08** and **PERF-04**.

---

## Log Format

| Date | Library | Gzipped Size | Purpose | Alternatives Considered | Justification |
|------|---------|--------------|---------|-------------------------|---------------|
| 2026-06-04 | Initial | - | Core Stack | - | Project Bootstrap |

---

## Active Decisions

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
