# Technical Debt Log

All deferred items must be logged here immediately per AGENTS.md Rule 12.
Format: `[Date] [Severity] Description — context and resolution path`

---

## Open Items

### TD-001 · `compress-pdf` — No real image downsampling
- **Date logged:** 2026-07-26
- **Severity:** Medium
- **Source:** TOOL_AUDIT.md Batch 5
- **Description:** `pdf-lib` save with object streams and metadata removal optimizes PDF structure and strips unused objects; it does NOT downsample high-resolution raster images or convert colorspaces. Image-heavy PDFs see modest compression.
- **Resolution path:** Integrate a lightweight client-side downsampling pipeline or WASM-based Ghostscript build (e.g. `ghostscript.js`). Ensure strict bundle budget approval per AGENTS.md Rule 6.
- **Blocked by:** Requires user approval for new dependency (AGENTS Rule 6).

### TD-012 · Secondary AI ONNX model files are placeholder binaries
- **Date logged:** 2026-08-12
- **Severity:** P0 (Feature Availability)
- **Source:** v1.3 QA Audit — AI/ONNX Phase
- **Description:** `modnet.onnx`, `realesrgan-4x.onnx`, and `yolov8-face.onnx` in `public/models/` are placeholder binaries and guarded as `available: false` in `src/ai/registry.ts`. Note: Primary RMBG 2.0 (`rmbg-2.0.onnx`) and `paddle-ocr.onnx` are fully active and functional.
- **Tools affected:** `face-blur`, `super-resolution`.
- **Resolution path:** Source real quantized ONNX weight files (<25MB each), place in `public/models/`, verify SHA-256 hashes, and set `available: true` in `src/ai/registry.ts`.
- **Blocked by:** Real quantized model weight files must be sourced from trusted model hubs.

---

## Resolved Items

| ID | Description | Resolution Date | Resolution Details |
|----|-------------|-----------------|-------------------|
| **TD-002** | `bg-remover` — Canvas thresholding only | 2026-08-10 | Implemented multi-tier architecture in `src/features/background-remover/` (`instant-canvas.engine.ts`, `u2netp.engine.ts`, `rmbg.engine.ts`, `engine-selector.ts`). |
| **TD-003** | `card-masker` — PAN regex delimiter failures | 2026-08-10 | Updated candidate regex to `/(?<!\d)\d(?:[\s-]*\d){12,18}(?!\d)/g` + Luhn checksum validation in `CardMaskerClient.tsx`. |
| **TD-004** | `split-pdf` — Multi-download blocked by browser | 2026-08-10 | Integrated `fflate` ZIP auto-bundling via Web Worker in `SplitPdfClient.tsx` for multi-page/multi-range outputs. |
| **TD-005** | Productivity timers missing Web Notifications | 2026-08-10 | Implemented Web Notifications API with permission prompt and audio fallback in `PomodoroTimerClient.tsx` and `src/lib/notifications.ts`. |
| **TD-006** | Unbounded SW static cache | 2026-07-26 | Added `ExpirationPlugin(maxEntries: 200, maxAgeSeconds: 30d)` to `CacheFirst` static route in `public/sw.js`. |
| **TD-007** | `@onlyrex/pulse` — Undocumented dependency | 2026-08-15 | Removed `@onlyrex/pulse` from `package.json` and cleaned `node_modules`. |
| **TD-008** | Missing `@next/bundle-analyzer` | 2026-08-15 | Added `@next/bundle-analyzer` to `devDependencies`, wired `next.config.mjs` with `withAnalyzer()`, and logged in `BUNDLE_DECISIONS.md`. |
| **TD-009** | `CHANGELOG.md` under-maintained | 2026-08-22 | Synchronized `docs/roadmap/CHANGELOG.md` with v2.1.1 releases and milestones. |
| **TD-010** | `pdf-to-word` — Format preservation UX clarity | 2026-08-15 | Updated UI copy, button labels ("Extract PDF Content"), and `LearningHub` to clearly explain text extraction vs OCR. |
| **TD-011** | `public/sw.js` — `console.log` in production | 2026-08-15 | Formally logged as architectural exception `E-012` in `EXCEPTIONS.md`. |
| **TD-013** | User signature stored in `localStorage` | 2026-08-18 | Migrated signature storage to IndexedDB in `src/features/pdf-editor/utils/signature-db.ts` with automatic `localStorage` migration shim. |
| **TD-014** | Monaco & PDF.js imported synchronously | 2026-08-18 | Wrapped with `dynamic(() => import(...), { ssr: false })` and `<ToolSkeleton>` in `HtmlViewerClientWrapper.tsx` and `PdfEditorClientWrapper.tsx`. |
| **TD-015** | HEIC Converter injected CDN script at runtime | 2026-08-18 | Bundled `heic2any` and `utif` locally in `package.json` and imported lazily via dynamic `import()`. |
| **TD-016** | `Markdown Editor` — `window.prompt` in TipTap toolbar | 2026-08-22 | Replaced synchronous `window.prompt` with an accessible Link Dialog modal conforming to KV design tokens in `MarkdownVisualEditor.tsx`. |

---

*This file is maintained per AGENTS.md Rule 12. All deferred items — fixes, decisions, scope cuts — must be logged here immediately.*


### TD-045 · Spell Check V2 Scope Limitations
- **Issue:** Markdown Editor spell checking currently only operates in the raw Monaco view (write/split mode). It does not support the TipTap visual editor.
- **Resolution:** Implement TipTap-compatible spell check decorations using `@tiptap/pm` plugins (similar to Grammar Checker's custom `GrammarDecorations` node).
- **Status:** Deferred to V2.

### TD-046 · CheckGrammar API Type Incompleteness
- **Issue:** `src/workers/types.ts` defines `checkGrammar` stats with 5 fields, but `engine.ts` returns 9 fields.
- **Resolution:** Update `types.ts` to include `paragraphs`, `readabilityGrade`, `avgSentenceLength`, and `uniqueWords`.
- **Status:** Needs fixing.

### TD-047 · Incomplete Accessibility (WCAG 2.2 AA) Audit Remediation
- **Date logged:** 2026-08-30
- **Severity:** Medium
- **Source:** Automated Accessibility Auditor Subagent
- **Description:** A sweep of `components/ui` and `components/system` identified 50 component files lacking `focus-visible:ring-2` on interactive elements, `aria-hidden="true"` on decorative icons, or proper ARIA roles/labels on custom modals/progress bars.
- **Resolution path:** Wrote an automated AST/Node script to safely inject `aria-hidden="true"` onto imported `<LucideIcon>` elements and `focus-visible:ring-2` onto `<button>`/`<Link>` elements, or phase the fixes. The most critical items (DeveloperPanel and ModelManagerDialog) have been patched manually.
- **Blocked by:** Mass AST rewriting in a single pass is unsafe without a tailored ESLint plugin/AST script and thorough visual QA testing.
