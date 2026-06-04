# KaruviLab (KV) — Architectural Exceptions Log

This file logs every intentional deviation from the **Elite Engineering Manifesto (GEMINI.md)**.
All entries must be reviewed and approved via PR.

---

## Exception Format

| ID | Rule Violated | Reason | Mitigation | Resolution Date | Status |
|----|---------------|--------|------------|-----------------|--------|
| E-000 | Example | Legacy code | Wrapped in isolation | 2026-12-31 | PENDING |

---

## Active Exceptions

### [Example Entry]
- **ID:** E-001
- **Rule:** KL-01 (Zero raw `URL.createObjectURL`)
- **Reason:** Legacy component `ImageSeoClient.tsx` uses a complex third-party library that expects raw URLs.
- **Mitigation:** Explicit `useEffect` cleanup hook added to component.
- **Resolution Date:** 2026-07-15 (Target for refactor to `blobManager`).
- **Status:** ACTIVE
