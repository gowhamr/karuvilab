# KaruviLab (KV) — Architectural Exceptions Log

This file logs every intentional deviation from the
Elite Engineering Manifesto (GEMINI.md).
All entries reviewed and approved via PR.

---

| ID    | Rule Violated           | Reason                          | Mitigation                          | Resolution Date | Status   |
|-------|-------------------------|---------------------------------|-------------------------------------|-----------------|----------|
| E-001 | KL-01 Storage Standards | Legacy localStorage in settings | try/catch + graceful fallback       | 2026-06-12      | RESOLVED |
| E-002 | P-07 Inline Styles      | Dynamic width on progress bars  | width property only, no color/font  | Permanent       | ACTIVE   |
| E-003 | P-07 Inline Styles      | Dynamic backgroundColor swatches| backgroundColor only, color tools   | Permanent       | ACTIVE   |
| E-004 | Design Token System     | New --kv-mat-* tokens added     | Formally in src/theme/tokens.css    | Permanent       | ACTIVE   |
| E-005 | P-15 Hardcoded Colors   | SliderField thumb bg-white      | --kv-text used as token equivalent  | Light mode only | ACTIVE   |
| E-006 | P-07 Inline Styles      | CategoryChips active color      | backgroundColor & boxShadow only    | Permanent       | ACTIVE   |
| E-007 | P-15 Hardcoded colors   | Sidebar favorites Heart color   | Single red Heart icon               | Permanent       | ACTIVE   |

---

### E-001
- **Rule:** KL-01 (Browser Storage Standards)
- **Reason:** Legacy localStorage in settings/store.ts predates
  IndexedDB migration. Settings format requires refactor.
- **Mitigation:** Wrapped in try/catch. Graceful fallback to
  defaults if localStorage unavailable.
- **Resolution Date:** 2026-06-12 — migrated to IndexedDB via idb
- **Status:** RESOLVED

### E-002
- **Rule:** P-07 (Inline Styles)
- **Reason:** Progress bars (BatchQueue, SafeToSpend) require
  dynamic fractional widths from runtime math calculations.
  Tailwind cannot compile dynamic values at build time.
- **Mitigation:** Constrained to width property ONLY.
  No color, font, or spacing via inline styles.
- **Resolution Date:** Permanent architectural exception.
- **Status:** ACTIVE

### E-003
- **Rule:** P-07 (Inline Styles)
- **Reason:** Color tools (ColorConverter, ColorPaletteExtractor)
  require dynamic hex rendering from user input or image
  extraction. Cannot be expressed as Tailwind classes.
- **Mitigation:** Constrained to backgroundColor and color
  properties ONLY. No layout or typography via inline styles.
- **Resolution Date:** Permanent architectural exception.
- **Status:** ACTIVE

### E-004
- **Rule:** Design Token System (GEMINI.md §3.3)
- **Reason:** Hybrid Material migration introduced new
  --kv-mat-* and --kv-glass-* tokens not in original set.
- **Mitigation:** All tokens formally defined in
  src/theme/tokens.css and documented in GEMINI.md §3.3.
  No arbitrary hex values in components.
- **Resolution Date:** Permanent — this IS the token system.
- **Status:** ACTIVE

### E-005
- **Rule:** P-15 (Hardcoded Colors)
- **Reason:** SliderField thumb requires high-contrast surface
  against the colored track. Pure white provides best contrast.
- **Mitigation:** --kv-text (#F8FAFC) used as token equivalent.
  Visually identical to white. If light mode introduced,
  this must be revisited immediately.
- **Resolution Date:** Permanent until light mode introduced.
- **Status:** ACTIVE

### E-006
- **Rule:** P-07 (Inline Styles)
- **Reason:** CategoryChips active state requires dynamic
  backgroundColor from tool registry cat.color values.
  These are data-driven hex values that cannot be expressed
  as static Tailwind tokens at build time.
- **Mitigation:** Constrained to backgroundColor and
  boxShadow only. No layout, typography, or spacing.
- **Resolution Date:** Permanent — category colors are
  data-driven from tool registry.
- **Status:** ACTIVE

### E-007
- **Rule:** P-15 (Hardcoded colors)
- **Reason:** Sidebar favorites Heart icon uses text-red-500
  as a semantic color for favorites (universal UX convention).
  This is intentional and not a dark mode violation.
- **Mitigation:** Single icon, semantic purpose documented.
- **Resolution Date:** Permanent — semantic color.
- **Status:** ACTIVE

