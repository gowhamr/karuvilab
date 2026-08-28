# KaruviLab Action Plan - Top 100 Improvements (Audited & Updated)
**Last Audited:** 2026-08-26 | **Status:** 96% Completed / 4% Continuous Governance

This action plan tracks the top 100 improvements prioritized across UX, Performance, Security, Architecture, and Code Quality audits. Every item has been verified against the current codebase.

---

## 📊 Summary Status Dashboard

| Category | Total Items | Completed | Continuous / Monitored |
|---|---|---|---|
| **Priority 0 (P0 - Immediate)** | 10 | 10 (100%) | 0 |
| **Priority 1 (P1 - High Impact)** | 15 | 15 (100%) | 0 |
| **Priority 2 (P2 - Medium Impact)** | 15 | 15 (100%) | 0 |
| **Priority 3 (P3 - Polish & Refactor)** | 60 | 56 (93%) | 4 |
| **Total** | **100** | **96** | **4** |

---

## 🔴 Priority 0 (Immediate Action - High Impact, Low Effort)

- [x] 1. **Fix Missing `Category` Definitions**: Updated `Category` union in `src/registry/types.ts` to include `'banking'` and `'seo'`.
- [x] 2. **Strict Null Checks**: Resolved all potential null/undefined access in `app/workbench/WorkbenchClient.tsx` and all tool client components under TypeScript strict mode.
- [x] 3. **Focus Trap Safety**: Added optional chaining and bounds checking in `src/lib/a11y/useFocusTrap.ts` (`firstEl?.focus()`, `lastEl?.focus()`).
- [x] 4. **ToolShell Null Checks**: Fixed `relatedTools` and metadata resolution in `components/ui/ToolShell.tsx` to handle `undefined` and missing related arrays safely.
- [x] 5. **Worker Precache Update**: Added Monaco editor worker, PDF.js workers, and dictionary assets to `scripts/sync-workers.mjs`.
- [x] 6. **CSP Configuration**: Enforced secure CSP headers and frame-ancestors in `next.config.mjs` (SAMEORIGIN for local workbench framing).
- [x] 7. **Strict Type Definitions**: Converted dynamic generation scripts (`scripts/generate-registries.mjs`) to strict typed ESM modules.
- [x] 8. **Broken SEO Content Check**: Added default fallbacks in `src/lib/seo.ts` preventing missing SEO description warnings during static generation.
- [x] 9. **Remove `console.warn` / `console.log`**: Replaced arbitrary console outputs with structured logging from `src/lib/logger.ts`.
- [x] 10. **Enable `type: module`**: Configured `"type": "module"` in `package.json` for fast native ES module loading and build performance.

---

## 🟠 Priority 1 (High Impact, Medium Effort)

- [x] 11. **Refactor `ALL_TOOLS` Array**: Replaced monolithic arrays with modular per-tool definitions in `src/registry/tools/*.ts` compiled at build time by `scripts/generate-registries.mjs`.
- [x] 12. **Remove Hardcoded Tailwind Colors**: Enforced design tokens (`--kv-text`, `--kv-surface`, `--kv-primary`, `--kv-border`) across all UI templates.
- [x] 13. **Standardize Border Radii**: Replaced arbitrary radius classes with canonical tokens (`rounded-xs` through `rounded-6xl`) adhering to the Parent-Child Radius Rule.
- [x] 14. **Focus-Visible Rings**: Audited and equipped all interactive buttons with `focus-visible:ring-2 focus-visible:ring-primary` for WCAG 2.2 AA keyboard compliance.
- [x] 15. **Extract Workbench Tab Logic**: Modularized swipe/touch gestures in `app/workbench/WorkbenchClient.tsx` into standalone state handlers.
- [x] 16. **Address `@ts-ignore` Comments**: Stripped unjustified `@ts-ignore` annotations; typed interfaces strictly across `src/` and `app/`.
- [x] 17. **Dynamic Region Announcements**: Equipped tools with `aria-live="polite"` status regions (`StatusBadge`, `ToolResultArea`) for real-time screen reader updates.
- [x] 18. **Resolve TODOs**: Cleared legacy TODO comments from `src/features/` with tested production implementations.
- [x] 19. **Enhance FAQ Schema**: Injected structured `FAQPage` JSON-LD schema dynamically via `src/lib/seo.ts` on all tool pages with FAQ content.
- [x] 20. **Add Keyboard Focus Testing**: Added automated unit tests for focus trapping, keyboard navigation, and modal dismissal.
- [x] 21. **Automated Breadcrumbs**: Standardized `BreadcrumbList` JSON-LD generation with trailing-slash normalization across all routes.
- [x] 22. **Optimize Image Assets**: Converted static images and icons in `public/` to optimized WebP/SVG formats.
- [x] 23. **Reduce DOM Size on Workbench**: Virtualized tool picker rendering and paginated tool cards to maintain 60fps scrolling.
- [x] 24. **Resolve Circular Dependencies**: Separated registry types (`src/registry/types.ts`) from runtime instances (`src/tool-registry.ts`).
- [x] 25. **Refine Mobile Touch Targets**: Enforced minimum 44×44px touch targets on all mobile controls, bottom navs, and tool buttons.

---

## 🟡 Priority 2 (Medium Impact, Medium Effort)

- [x] 26. **Move 3-File Pattern to Generators**: Built `scripts/scaffold-tool.mjs` (`npm run generate-tool`) to automatically scaffold `page.tsx`, `ToolClientWrapper.tsx`, and `ToolClient.tsx`.
- [x] 27. **Migrate to Next.js App Router Metadata API**: Utilized Next.js `generateMetadata` and static metadata objects across all tool routes.
- [x] 28. **Consolidate State Management**: Standardized atomic Zustand stores with `idb` persistence and isolated store namespaces.
- [x] 29. **Add Error Boundaries to Tool Wrappers**: Implemented `<ErrorBoundary>` with user-friendly retry banners on all tool shells (`components/system/ErrorBoundary.tsx`).
- [x] 30. **Implement Web Worker Fallbacks**: Integrated `<EngineLoader>` with timeout detection (10s) and main-thread/CDN fallbacks.
- [x] 31. **Unify Shadow Tokens**: Replaced raw box shadows with design tokens in `src/theme/`.
- [x] 32. **Normalize Spacing**: Applied fluid responsive padding (`p-3.5 sm:p-6`, `p-4 sm:p-8`) to prevent layout crushing on narrow viewports.
- [x] 33. **Add Global Skeleton Loaders**: Standardized `<ToolSkeleton>` with matching layout dimensions across all `dynamic(..., { ssr: false })` boundaries.
- [x] 34. **Audit Empty States**: Integrated `<EmptyState>` CTA components on initial tool loads before user inputs are entered.
- [x] 35. **Deprecate Obsolete Tools**: Consolidated redundant media/converter prototypes into dedicated client modules.
- [x] 36. **Improve IndexedDB Versioning**: Added explicit schema `version: 1` and migration handlers to local database stores.
- [x] 37. **Clean Up Dead Code**: Conducted dead code audits and eliminated unused utility functions.
- [x] 38. **Enhance Search Intent Mapping**: Added explicit `searchIntent: "informational" | "transactional"` to all registry entries.
- [x] 39. **Validate JSON Inputs**: Applied strict validation in JSON parsers and formatters with structured recovery messages.
- [x] 40. **Review Missing Canonical URLs**: Enforced self-referencing canonical URLs with mandatory trailing slashes on every page.

---

## 🟢 Priority 3 (Refactoring & Polish)

- [x] 41. **Refactor Worker Assets**: Synchronized external workers (`pdf.worker.min.mjs`, Monaco VS bundle) via `scripts/sync-workers.mjs`.
- [x] 42. **Expand Typography Scale**: Established standardized typography tokens in `src/theme/typography.ts`.
- [x] 43. **Implement Container Queries**: Applied `@container` rules on tool shells for responsive sub-panel resizing.
- [x] 44. **Refine Dark Mode Contrasts**: Verified minimum 4.5:1 contrast ratios on dark, light, and high-contrast themes.
- [x] 45. **Enhance Microinteractions**: Added Framer Motion spring transitions (`{ stiffness: 300, damping: 30 }`) to cards and tabs.
- [x] 46. **Add "Copy to Clipboard" Feedback**: Implemented visual checkmark animations and ARIA live confirmations on all copy buttons.
- [x] 47. **Standardize Toast Notifications**: Unified copy/error notifications using accessible floating toasts.
- [x] 48. **Review PBKDF2 Iteration Counts**: Standardized PBKDF2 default iterations to 600,000 in `src/features/crypto/`.
- [x] 49. **Add JWT Signature Verification**: Added cryptographic HMAC/RSA signature verification UI in `jwt-decoder`.
- [x] 50. **Implement Offline Indicator**: Added Service Worker offline status badge (`public/sw.js`).
- [x] 51. **Optimize Canvas Contexts**: Explicitly release canvas contexts and bitmap resources on unmount.
- [x] 52. **Consolidate Banking Parsers**: Shared recursive BER-TLV and ISO 8583 engines across financial developer tools.
- [x] 53. **Improve CSR Generator UI**: Added distinguished name (DN) fields (CN, O, OU, C, ST, L, SANs) in `csr-generator`.
- [x] 54. **Add PEM Certificate Chains**: Implemented multi-certificate chain decoding and trust path inspection in `pem-viewer`.
- [x] 55. **Refine File Dropzones**: Built reusable drag-and-drop zones with MIME validation and visual drop feedback.
- [x] 56. **Implement Chunked Hashing**: Added stream chunking in crypto tools to hash multi-gigabyte files without browser memory exhaustion.
- [x] 57. **Enhance PDF Export**: Added `pdf-lib` client-side watermark stamping and metadata manipulation.
- [x] 58. **Add Syntax Highlighting for SQL**: Integrated Monaco editor with SQL query formatting and syntax tokenization.
- [x] 59. **Improve YAML/JSON Converter**: Built bidirectional debounced live conversion with syntax error diagnostics.
- [x] 60. **Add Contrast Checker Visualizations**: Visualized WCAG AA/AAA compliance grid and color blindness simulations.
- [x] 61. **Implement Color Blindness Filters**: Added SVG filter simulators (Protanopia, Deuteranopia, Tritanopia, Achromatopsia).
- [x] 62. **Add Cron Expression Explainer**: Added human-readable schedule translation and next 10 executions preview in `crontab-editor`.
- [x] 63. **Refine BMI/HRA Calculators**: Added visual range bars, category chips, and tax exemption breakdowns.
- [x] 64. **Add Export to CSV / JSON**: Enabled direct CSV/JSON exports across calculators and converter tools.
- [x] 65. **Implement Shareable Links**: Enabled deep-linking via query parameters (`useUrlState`) with deep link copying and QR code generator.
- [x] 66. **Add Tool Favorites**: Built persistent favorites system with quick-access sidebar shelf.
- [x] 67. **Refine Search Palette**: Added global `Cmd+K` / `Ctrl+K` keyboard shortcut for immediate tool search.
- [x] 68. **Implement Fuzzy Searching**: Indexed tool titles, descriptions, and keywords for fast search filtering.
- [x] 69. **Add Command Palette Actions**: Integrated direct category filtering and quick actions into the Command Palette.
- [x] 70. **Optimize WebAssembly Loading**: Applied dynamic imports with `<EngineLoader>` wrappers for heavy WASM binaries.
- [x] 71. **Add Offline Status to Tool Entry**: Tagged all 214 tools with `requiresNetwork: false` in the core registry.
- [x] 72. **Refine Tool Difficulties**: Assigned `difficulty: "beginner" | "intermediate" | "advanced"` badges to every tool entry.
- [x] 73. **Improve SEO Titles**: Enforced standard `[Tool Name] – KV` title conventions in all page metadata.
- [x] 74. **Add OpenGraph Images**: Added dynamic OpenGraph and Twitter card metadata generation in `src/lib/seo.ts`.
- [x] 75. **Implement Sitemap Generation**: Dynamic `app/sitemap.ts` generates validated sitemap URLs for all 214 tools.
- [x] 76. **Add Robots.txt Generator Tool**: Implemented user-facing `robots-txt` generator in developer tools.
- [x] 77. **Enhance Slug Generator**: Added stop-word stripping, case selection, and international character transliteration.
- [x] 78. **Improve UUID Generator**: Added bulk generation (up to 10,000 UUIDs) supporting v1, v4, v5, and v7 formats.
- [x] 79. **Add Nanoid Generator**: Implemented customizable length, alphabet presets (alphanumeric, numbers, hex), and bulk generation.
- [x] 80. **Refine XML Formatter**: Added indentation options, XML tree validation, and minification.
- [x] 81. **Add Box Shadow Presets**: Built curated CSS box shadow gallery in `box-shadow-generator`.
- [x] 82. **Implement Glassmorphism Presets**: Built curated backdrop-filter presets in `glassmorphism-generator`.
- [x] 83. **Enhance Gradients**: Built visual multi-stop linear/radial gradient creator with CSS export.
- [x] 84. **Add Income Tax Scenarios**: Implemented Old vs New Regime side-by-side tax calculation in `salary-calculator`.
- [x] 85. **Refine NPS Calculator**: Built NPS corpus accumulation and monthly pension annuity projection models.
- [x] 86. **Implement Gratuity Rules**: Implemented Payment of Gratuity Act formula with statutory ceiling caps.
- [x] 87. **Add TDS Categories**: Built interactive TDS deduction lookup and slab calculator.
- [x] 88. **Improve File Viewer Diff**: Built unified and side-by-side visual diff views in `diff-checker`.
- [x] 89. **Add ZIP File Inspector**: Integrated in-worker ZIP archive inspection and selective extraction via `fflate`.
- [x] 90. **Implement SQL to CSV**: Built SQL table insert parsing and CSV tabular export.
- [x] 91. **Add Password Strength Meter**: Integrated entropy calculation, character diversity analysis, and crack-time estimation.
- [x] 92. **Refine OAuth Token Decoder**: Decoded standard and vendor claims (Azure AD, Auth0, Okta) with expiration countdown.
- [x] 93. **Add SAML Response Viewer**: Built SAML 2.0 XML assertion decoding and attribute statement extractor.
- [x] 94. **Enhance Log Analyzer**: Built regex filtering, severity level grouping (INFO, WARN, ERROR), and timeline aggregation.
- [x] 95. **Add Lorem Ipsum Customization**: Enabled paragraphs, words, sentences, and lists generation with custom starting phrases.
- [x] 96. **Implement IBAN Validator**: Implemented country-specific format regex and BigInt mod-97 checksum validation for 75+ countries.
- [x] 97. **Add SWIFT MT/MX Converter**: Implemented SWIFT FIN block extraction and ISO 20022 MX message inspection.
- [x] 98. **Refine EMV Tag Dictionary**: Populated comprehensive EMVCo tag dictionary for smart card / payment terminal parsing.
- [x] 99. **Add Card Masker Tool**: Built PCI-DSS compliant PAN masking preserving delimiters (spaces/hyphens) and Luhn validation.
- [ ] 100. **Conduct Bi-Annual Audits**: Continuous recurring automated audit runs (`npm run check-budgets`, `vitest run`, `npm run typecheck`, `npm run lint`).

