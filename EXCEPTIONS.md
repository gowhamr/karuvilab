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

### [Hybrid Material Design System]
- **ID:** E-004
- **Rule:** Design Token System (GEMINI.md §3 Color Tokens)
- **Reason:** Migration from glassmorphism introduces new --kv-mat-* surface tokens and --kv-glass-* tokens not present in the original token set. These are being formally added to src/theme/tokens.css as part of the Hybrid Material migration.
- **Mitigation:** All tokens defined in src/theme/tokens.css and documented in GEMINI.md §3.3. No arbitrary hex values used in components — all values reference CSS custom properties only.
- **Resolution Date:** Permanent — this IS the new token system.
- **Status:** ACTIVE
