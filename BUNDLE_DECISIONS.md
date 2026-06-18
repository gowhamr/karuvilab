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
