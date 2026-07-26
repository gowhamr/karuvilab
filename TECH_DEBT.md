# Technical Debt Log

All deferred items must be logged here immediately per AGENTS.md Rule 12.
Format: `[Date] [Severity] Description — context and resolution path`

---

## Open Items

### TD-001 · `compress-pdf` — No real image downsampling
- **Date logged:** 2026-07-26
- **Severity:** Medium
- **Source:** TOOL_AUDIT.md Batch 5
- **Description:** `pdf-lib` save with object streams only repacks PDF objects; it does NOT downsample images or strip unused fonts. Image-heavy PDFs see minimal compression reduction.
- **Resolution path:** Integrate a WASM-based Ghostscript build (e.g., `ghostscript.js`) for true image downsampling. Until then, update the UI to set clear user expectations about compression limitations.
- **Blocked by:** Requires user approval for new dependency (AGENTS Rule 6). `ghostscript.js` gzipped size TBD.

### TD-002 · `bg-remover` — Canvas thresholding only, no AI removal
- **Date logged:** 2026-07-26
- **Severity:** Medium
- **Source:** TOOL_AUDIT.md Batch 6
- **Description:** Background removal uses basic canvas color thresholding ("Magic Wand" style), which fails on complex or gradient backgrounds. The AI WASM model is not integrated.
- **Resolution path:** Integrate `@imgly/background-removal` WASM module for true local AI background removal. Requires BUNDLE_DECISIONS.md entry and user approval (large WASM bundle, ~20MB).
- **Blocked by:** Bundle size approval required (AGENTS Rule 6).

### TD-003 · `card-masker` — PAN regex fails on space/dash-delimited formats
- **Date logged:** 2026-07-26
- **Severity:** Low
- **Source:** TOOL_AUDIT.md Batch 2
- **Description:** The regex `\b\d{13,19}\b` only matches contiguous digit sequences. Cards formatted as `4111 1111 1111 1111` or `4111-1111-1111-1111` are not detected.
- **Resolution path:** Pre-process input by stripping common delimiters (spaces, hyphens) before PAN regex matching. Small fix, no new dependencies.
- **Blocked by:** Nothing. Ready for implementation.

### TD-004 · `split-pdf` — Multi-download blocked by browser when output > 3 parts
- **Date logged:** 2026-07-26
- **Severity:** Low
- **Source:** TOOL_AUDIT.md Batch 5
- **Description:** When splitting a PDF into more than 3 parts, sequential `a.click()` downloads are often blocked by browser pop-up blockers.
- **Resolution path:** Bundle output into a `.zip` file using `fflate` (already in dependencies) when output parts > 3.
- **Blocked by:** Nothing. `fflate` is already available.

### TD-005 · Web Notifications not implemented for productivity timers
- **Date logged:** 2026-07-26
- **Severity:** Low
- **Source:** TOOL_AUDIT.md Batch 8
- **Description:** `pomodoro-timer`, `countdown-timer`, and `task-reminder` use AudioContext for alerts only. When the tab is in the background, users miss the alert.
- **Resolution path:** Add Web Notifications API integration with permission prompt on first use. Degrade gracefully if permission denied (show AudioContext fallback message).
- **Blocked by:** Nothing. Browser API only, no new dependencies.

### TD-006 · Unbounded service worker static cache
- **Date logged:** 2026-07-26
- **Severity:** High (GEMINI.md §15)
- **Status:** ✅ RESOLVED 2026-07-26 — Added `ExpirationPlugin(maxEntries: 200, maxAgeSeconds: 30d)` to `CacheFirst` static route in `public/sw.js`.

### TD-007 · `@onlyrex/pulse` — Undocumented dependency with no source usage
- **Date logged:** 2026-07-26
- **Severity:** High (P-08 violation)
- **Description:** `@onlyrex/pulse@^1.0.5` is in `package.json` dependencies but has zero import usage in `src/`, `components/`, or `app/`. Source confirmed by `grep -r "@onlyrex/pulse" --include="*.ts" --include="*.tsx"` returning no results.
- **Resolution path:** Investigate if this is a transitive peer dependency requirement. If no direct usage, remove from `package.json` and add a BUNDLE_DECISIONS.md removal record.
- **Blocked by:** Needs user decision on removal.

### TD-008 · Missing `@next/bundle-analyzer` — no bundle size visibility
- **Date logged:** 2026-07-26
- **Severity:** High (PERF-04)
- **Description:** No bundle analyzer is configured. With monaco-editor (~3–5MB), mermaid (~1.2MB), pdfjs worker (~1.3MB), tesseract (~large WASM), and nspell+dictionary (~1.2MB) in the dependency tree, PERF-04 compliance cannot be enforced without automated bundle reporting.
- **Resolution path:** Add `@next/bundle-analyzer` to devDependencies, configure in `next.config.mjs` behind `ANALYZE=true` env var, add entry to `BUNDLE_DECISIONS.md`.
- **Blocked by:** User approval for dev dependency (minimal bundle impact).

### TD-009 · CHANGELOG.md under-maintained — 1 entry for 208-tool platform
- **Date logged:** 2026-07-26
- **Severity:** Low
- **Description:** CHANGELOG.md reflects only 6 items from 2026-07-23. Per ROADMAP Phase 9, per-tool version history and "Last Verified" timestamps are planned but not implemented.
- **Resolution path:** Backfill with major milestones from git log. Establish a policy of updating CHANGELOG.md with every meaningful PR.
- **Blocked by:** Nothing.

### TD-010 · `pdf-to-word` — drops images/tables (text-only extraction)
- **Date logged:** 2026-07-26
- **Severity:** Low (UX clarity gap, not a bug)
- **Source:** TOOL_AUDIT.md Batch 5
- **Description:** The tool's UI does not communicate that it performs raw text extraction only (no formatting, images, or tables preserved). Users may expect a full Word document.
- **Resolution path:** Update tool description, ToolShell header, and output area to clarify this is "text extraction" not "format-preserved conversion."
- **Blocked by:** Nothing. Documentation-only change.

### TD-011 · `public/sw.js` — `console.log` in production code (P-14)
- **Date logged:** 2026-07-26
- **Severity:** Low
- **Description:** `public/sw.js` uses `console.log` throughout (lines 8, 11, 124, etc.) in violation of P-14. In a Service Worker context the structured logger is unavailable, but the violation should be acknowledged.
- **Resolution path:** Consider prefixing with an `[SW]` tag and wrapping in a `DEBUG` flag that strips in production, or formally log this as an EXCEPTIONS.md entry.
- **Blocked by:** Formal EXCEPTIONS.md entry needed.

---

## Resolved Items

| ID | Description | Resolved |
|----|-------------|---------|
| TD-006 | Unbounded SW static cache | 2026-07-26 |

---

*This file is maintained per AGENTS.md Rule 12. All deferred items — fixes, decisions, scope cuts — must be logged here immediately.*
