# KaruviLab Action Plan - Top 100 Improvements

This plan prioritizes the top 100 actionable improvements discovered across the UX, Performance, Security, Architecture, and Code Quality audits. It is ordered by Impact vs. Effort.

## 🔴 Priority 0 (Immediate Action - High Impact, Low Effort)
1. **Fix Missing `Category` Definitions**: Update `Category` types in `src/registry/types.ts` to include `banking` and `seo`.
2. **Strict Null Checks**: Resolve all `Object is possibly 'undefined'` errors in `app/workbench/WorkbenchClient.tsx`.
3. **Focus Trap Safety**: Add nullish coalescing to `focusable[0]!.focus()` in `useFocusTrap.ts`.
4. **ToolShell Null Checks**: Fix `relatedTools` property merging in `ToolShell.tsx` to explicitly handle `undefined`.
5. **Worker Precache Update**: Add missing monaco-editor worker paths to the `sync-workers.js` build script.
6. **CSP Configuration**: Enforce `frame-ancestors 'none'` in `next.config.ts` to prevent clickjacking.
7. **Strict Type Definitions**: Replace all explicit `any` usages in `generate-registries.ts` with concrete types.
8. **Broken SEO Content Check**: Suppress or handle the 40+ "No on-demand SEO content found" warnings during build.
9. **Remove `console.warn`**: Strip development console logs from the `ToolShell` server component.
10. **Enable `type: module`**: Add `"type": "module"` to `package.json` to resolve Tailwind config ES module reparsing performance penalty.

## 🟠 Priority 1 (High Impact, Medium Effort)
11. **Refactor `ALL_TOOLS` Array**: Break down the monolithic 158-item array in `core-registry.ts` into smaller category-based lazy chunks.
12. **Remove Hardcoded Tailwind Colors**: Search for and replace `text-[#1E293B]` and `bg-[#0F172A]` with `--kv-text` and `--kv-surface` tokens.
13. **Standardize Border Radii**: Replace arbitrary `rounded-[18px]` values with `rounded-3xl` or `rounded-2xl` tokens.
14. **Focus-Visible Rings**: Audit all `outline-none` buttons to ensure they have `focus-visible:ring-2 focus-visible:ring-blue` for keyboard navigation.
15. **Extract Workbench Tab Logic**: Move the complex swipe/touch logic out of `WorkbenchClient.tsx` into a custom hook (e.g., `useWorkbenchTouch.ts`).
16. **Address `@ts-ignore` Comments**: Remove the 7 instances of `@ts-ignore` and properly type the respective interfaces.
17. **Dynamic Region Announcements**: Implement `aria-live="polite"` for dynamic content updates in the `ToolShell` to assist screen readers.
18. **Resolve 16 TODOs**: Search for and resolve all legacy `TODO` comments scattered in `src/features/`.
19. **Enhance FAQ Schema**: Inject `FAQPage` JSON-LD schema dynamically into tools that supply FAQ arrays.
20. **Add Keyboard Focus Testing**: Create automated tests for focus trapping in modals and sidebars.
21. **Automated Breadcrumbs**: Inject `BreadcrumbList` JSON-LD to improve Google Search result hierarchy.
22. **Optimize Image Assets**: Convert any remaining PNG/JPG static assets to WebP/AVIF.
23. **Reduce DOM Size on Workbench**: Virtualize the rendering of the `ToolPicker` list to avoid loading all 158 tools into the DOM at once.
24. **Resolve Circular Dependencies**: Check and resolve cyclical imports between `tool-registry.ts` and `src/registry/types.ts`.
25. **Refine Mobile Touch Targets**: Ensure all interactive elements on mobile are at least 44x44px.

## 🟡 Priority 2 (Medium Impact, Medium Effort)
26. **Move 3-File Pattern to Generators**: Create a CLI script to scaffold the `page.tsx`, `ToolClientWrapper.tsx`, and `ToolClient.tsx` pattern automatically.
27. **Migrate to Next.js App Router Metadata API**: Fully utilize the Next.js `metadata` object instead of manual `<head>` tags in legacy tools.
28. **Consolidate State Management**: Review `Zustand` stores to ensure they do not share duplicate state keys in IndexedDB.
29. **Add Error Boundaries to Tool Wrappers**: Wrap `ClientToolShellProps` children with a strict Error Boundary that provides a fallback "Retry" UI.
30. **Implement Web Worker Fallbacks**: Ensure every Web Worker has a main-thread fallback logic if worker initialization fails in constrained environments.
31. **Unify Shadow Tokens**: Replace raw CSS shadows with the designated shadow tokens in `tailwind.config.ts`.
32. **Normalize Spacing**: Replace hardcoded padding/margins like `px-[140px]` with standard Tailwind spacing scale (`px-32`, etc.).
33. **Add Global Skeleton Loaders**: Enhance the shimmer effect for `ToolSkeleton` to perfectly match the layout of tools before hydration.
34. **Audit Empty States**: Ensure all tools have a dedicated `<EmptyState>` component before files or inputs are provided.
35. **Deprecate Obsolete Tools**: Evaluate the 4 "media" tools for consolidation into a single "Media Converter" tool.
36. **Improve IndexedDB Versioning**: Add strict schema versioning and upgrade mechanisms to the local database wrapper.
37. **Clean Up Dead Code**: Run a dead-code elimination tool like `ts-prune` to remove unused exports.
38. **Enhance Search Intent Mapping**: Add "transactional" or "informational" tags to the remaining 100 tools for better SEO categorization.
39. **Validate JSON Inputs**: Implement strict `zod` validation for tools that parse user JSON input.
40. **Review Missing Canonical URLs**: Ensure all tools define a self-referencing canonical URL in their `ToolEntry`.

## 🟢 Priority 3 (Refactoring & Polish)
41. **Refactor `ts.worker`**: Break the large Monaco editor worker into smaller, task-specific chunks.
42. **Expand Typography Scale**: Add standard tokens for micro-copy and massive hero headers.
43. **Implement Container Queries**: Replace media queries with container queries (`@container`) inside highly reusable tool components.
44. **Refine Dark Mode Contrasts**: Ensure muted text (`--kv-text-muted`) maintains a minimum 4.5:1 contrast ratio against `--kv-surface`.
45. **Enhance Microinteractions**: Add framer-motion layout animations to list reordering in the Workbench.
46. **Add "Copy to Clipboard" Feedback**: Ensure all copy buttons provide visual feedback (e.g., changing icon to a checkmark) and an ARIA announcement.
47. **Standardize Toast Notifications**: Use a unified toast system (like `sonner`) across all tools instead of custom alerts.
48. **Review PBKDF2 Iteration Counts**: Ensure crypto tools are using modern default iteration counts (e.g., 600,000 for PBKDF2-HMAC-SHA256).
49. **Add JWT Signature Verification**: Enhance the JWT decoder to visually distinguish valid vs invalid signatures.
50. **Implement Offline Indicator**: Add a subtle status badge when the Service Worker enters offline mode.
51. **Optimize Canvas Contexts**: Ensure tools using HTML Canvas (like Image SEO) release the context when unmounted.
52. **Consolidate Banking Parsers**: Combine `emv-tlv-tree`, `track-2-parser`, and `core-banking-parser` underlying parsing logic into a shared module.
53. **Improve CSR Generator UI**: Add more granular distinguished name (DN) fields to the CSR generator tool.
54. **Add PEM Certificate Chains**: Allow the PEM Viewer to parse and display full certificate chains.
55. **Refine File Dropzones**: Standardize the drag-and-drop file upload zones with a unified component.
56. **Implement Chunked Hashing**: Ensure hashing tools process large files in chunks to avoid memory limits.
57. **Enhance PDF Export**: Use `pdf-lib` to allow adding custom watermarks to generated PDFs.
58. **Add Syntax Highlighting for SQL**: Integrate Monaco editor into the SQL formatter tool.
59. **Improve YAML/JSON Converter**: Add bi-directional live conversion with debounced input.
60. **Add Contrast Checker Visualizations**: Show a 3D color contrast map in the Contrast Checker tool.
61. **Implement Color Blindness Filters**: Add a simulator to the UI/UX tools category.
62. **Add Cron Expression Explainer**: Enhance the crontab editor to show a human-readable explanation of the schedule.
63. **Refine BMI/HRA Calculators**: Add visual charts to financial and health calculators using a lightweight charting library.
64. **Add Export to CSV**: Allow all calculators and data parsers to export their results to CSV.
65. **Implement Shareable Links**: Allow users to share tool configurations via base64url encoded query parameters.
66. **Add Tool Favorites**: Implement a quick-access "Favorites" section in the sidebar.
67. **Refine Search Palette**: Add keyboard shortcuts (Cmd+K) to focus the tool search input globally.
68. **Implement Fuzzy Searching**: Use `fuse.js` for more forgiving search results in the Tool Picker.
69. **Add Command Palette Actions**: Allow users to trigger specific tool actions directly from the command palette.
70. **Optimize WebAssembly Loading**: Pre-load WASM modules for heavy tools only when the user hovers over their links.
71. **Add Offline Status to Tool Entry**: Explicitly tag tools that require network access with `requiresNetwork: true`.
72. **Refine Tool Difficulties**: Add a visual badge indicating if a tool is `beginner`, `intermediate`, or `advanced`.
73. **Improve SEO Titles**: Ensure all tool SEO titles strictly follow the `[Tool Name] – KV` pattern.
74. **Add OpenGraph Images**: Generate unique OG images for all 158 tools dynamically using Vercel OG.
75. **Implement Sitemap Pagination**: Split the sitemap if the number of URLs exceeds 50,000 (future proofing).
76. **Add Robots.txt Generator Tool**: Create a tool to help users build their own `robots.txt` files safely.
77. **Enhance Slug Generator**: Add options to strip stop words and transliterate non-Latin characters.
78. **Improve UUID Generator**: Add bulk generation options for up to 10,000 UUIDs.
79. **Add Nanoid Generator**: Implement a highly customizable Nanoid generator tool.
80. **Refine XML Formatter**: Add XPath querying capabilities to the XML formatter.
81. **Add Box Shadow Presets**: Include a gallery of popular box shadows in the generator tool.
82. **Implement Glassmorphism Presets**: Add curated glassmorphism templates.
83. **Enhance Gradients**: Add a visual color stop editor to the gradient generator.
84. **Add Income Tax Scenarios**: Allow comparing multiple income tax regimes side-by-side.
85. **Refine NPS Calculator**: Add inflation-adjusted withdrawal simulations.
86. **Implement Gratuity Rules**: Add specific regional rule sets to the Gratuity Calculator.
87. **Add TDS Categories**: Include an up-to-date table of TDS deduction rates for quick reference.
88. **Improve File Viewer Diff**: Add side-by-side vs unified diff toggle.
89. **Add ZIP File Inspector**: Create a tool to peek inside ZIP files without extracting them locally.
90. **Implement SQL to CSV**: Add direct conversion from SQL INSERT statements to CSV format.
91. **Add Password Strength Meter**: Include `zxcvbn` to evaluate the entropy of generated passwords.
92. **Refine OAuth Token Decoder**: Add decoding for specific vendor claims (e.g., Azure AD, Okta).
93. **Add SAML Response Viewer**: Implement XML decoding and signature verification for SAML responses.
94. **Enhance Log Analyzer**: Add regex-based grouping and filtering.
95. **Add Lorem Ipsum Customization**: Allow generating text in different styles (e.g., Corporate, Hipster).
96. **Implement IBAN Validator**: Add support for all SEPA country formats.
97. **Add SWIFT MT/MX Converter**: Enhance the SWIFT parser to translate between legacy MT and modern ISO 20022 MX formats.
98. **Refine EMV Tag Dictionary**: Ensure the EMV TLV tree parser has a comprehensive description for all EMVCo tags.
99. **Add Card Masker Tool**: Implement robust PCI-DSS compliant PAN masking rules.
100. **Conduct Bi-Annual Audits**: Schedule recurring automated audits using this framework to prevent technical debt regression.
