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
