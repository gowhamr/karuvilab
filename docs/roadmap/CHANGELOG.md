# Changelog

All notable changes to KaruviLab are documented here.
Format: `## [Version] YYYY-MM-DD — Summary`

---

## [2.1.0] 2026-07-26 — ELS Security Domain & Production Readiness

### Added
- **Engineering Learning System (ELS) — Security Domain (Phase 5):**
  - JWT Decoder, UUID Generator, Base64 Encoder, Password Generator upgraded to full ELS standard
  - AES, RSA Sign/Verify, PBKDF2, ECDSA, ECDH, HKDF upgraded to LearningHub ELS
  - Hash Generator, RSA Key Gen, RSA Crypt, HMAC upgraded to LearningHub ELS
  - Base64URL, Card Masker, Cipher Tools, CSP Builder upgraded to LearningHub ELS
  - CSR Generator, X.509 Viewer, SAML Decoder, OAuth Token Decoder upgraded to LearningHub ELS
- **Production Readiness (Phase 10):**
  - TECH_DEBT.md fully populated (11 deferred items logged per AGENTS.md Rule 12)
  - EXCEPTIONS.md E-011 (CSP unsafe-inline/Framer Motion) and E-012 (SW console.log) formally added
  - BUNDLE_DECISIONS.md backfilled with 8 missing production dependency entries
  - Service worker static cache bounded with ExpirationPlugin (max 200 entries / 30d TTL)
  - Security headers: COOP, COEP, X-XSS-Protection added to next.config.mjs
  - Legacy `legacy:build` and `legacy:watch` scripts removed from package.json

### Fixed
- ClientToolShell crash on undefined content prop
- ToolInfoSection expand bug and empty ToolShell Learn More section

---

## [2.0.9] 2026-07-25 — ELS Phases 2–4, QA Workbench, UI Fixes

### Added
- **Engineering Learning System (ELS):**
  - JSON Formatter (Phase 2 — "Patient Zero" reference implementation)
  - Regex Tester, Diff Checker (Phase 4 Batch 1)
  - Code Minifier (Phase 4 Batch 1)
  - Defined 10-phase ROADMAP.md with ELS vision and engineering phases
- QA Workbench unified testing suite (API Tester, Regex, JSON, Diff, Mock Data)
- All-tools page: tools grouped by category/subcategory
- Timezone Converter: improved search state and offset display
- Command Cheat Sheet: expanded commands and responsive grid

### Fixed
- Infinite loop in AVIF and Aspect Ratio converters (removed resultUrl from dependency array)
- Safari crossOrigin bug with blob URLs for image tools
- Tool pages displaying tool ID instead of proper name in header
- Mobile download button in batch queue
- PdfOrganizer Node error
- React error 185 — Zustand selector in AnnotationLayer

---

## [2.0.8] 2026-07-23–24 — PDF Tools Completion & SEO Migration

### Added
- PDF Editor Phase 1 and Phase 2 complete
- Complete PDF tools roadmap (Phases 1–9): merge, split, compress, rotate, watermark, image-to-pdf, word-to-pdf, extract-images, lock/unlock, page-numbering, pdf-editor
- SEO category migrated into Developer Tools with subCategory grouping
- PDF tools subCategory grouping in UI and registry
- OCR abort/cancellation logic (Phase D)

### Fixed
- PDF worker fallback URL resolution; upgraded pdfjs-dist to 6.1.200
- Legacy URL redirects added for broken QA test links (20 permanent redirect rules)
- Build and typecheck errors after SEO category migration
- Double slashes in generated tool and category URLs
- React hook violation in PdfEditor

---

## [2.0.7] 2026-07-20–22 — Grammar Checker & Calculator Fixes

### Added
- Grammar Checker: local offline grammar engine (150+ typo dictionary, tone settings, personal dictionary, capitalization, spacing, style rules)

### Fixed
- Age Calculator: hybrid date input with calendar + manual typing
- Compress PDF: upload moved to primary position

---

## [2.0.6] 2026-07-16–17 — Security Audit, Dependency Fixes, PWA Icons

### Fixed
- Security and performance audit fixes (Next.js server/client boundary issues)
- PWA icons updated with new KaruviLab logo
- picomatch ELSPROBLEMS resolved in package-lock.json
- Added extraneous WASM runtime dependencies as devDependencies to satisfy `npm ls`
- Node.js upgraded to 22; regenerated package-lock.json

---

## [2.0.5] 2026-07-10 — Barcode Scanner, Image Crop, Phone Mockup

### Added
- Barcode Scanner: native BarcodeDetector API + `jsqr` fallback (Firefox/Safari/iOS)
- Image Crop: `react-image-crop` integration with interactive mouse/touch selection
- Phone Mockup Generator: realistic device frames (iPhone 15 Pro, Pixel 8, iPad Pro) with dynamic island and notch

---

## [2.0.4] 2026-07-02 — Banking & Crypto Tool Completions

### Added
- Core Banking Parser: real ISO 8583 log decoding (was shell only)
- EMV TLV Tree: recursive BER-TLV byte buffer decoder
- SWIFT MT/MX: real SWIFT FIN parser + ISO 20022 XML DOM parser
- ISO 8583 Bitmap Decoder: actual bitmap decode with LLVAR/LLLVAR field parsing
- CSR Generator: ASN.1 DER encoding + Web Crypto API signing
- Track-2 Parser: full separator splits, expiration, service code, LRC checksum
- IBAN Validator: 75+ country codes + BigInt mod-97 checksum
- TLV Parser: recursive EMV tag decoder with EMV dictionary lookup
- AES Encrypt/Decrypt: Raw Key formats, custom IV, GCM/CBC modes
- @dnd-kit: drag-and-drop reordering for World Clock grid

---

## [2.0.3] 2026-06-25 — Framer Motion, NLP & Grammar Engine

### Added
- Framer Motion v12+ for hardware-accelerated animations
- mammoth: client-side .docx parsing for Word-to-PDF conversion
- mermaid: local diagram rendering in Markdown Editor
- gifenc: client-side GIF encoding
- nspell + dictionary-en: offline spell checking (Web Worker)
- compromise: offline NLP/POS tagging (Web Worker)
- syllable: readability score calculations

---

## [2.0.2] 2026-06-18 — QR Code Generation & Initial PDF Tools

### Added
- qrcode: client-side QR generation (text, URL, UPI, WIFI, VCARD)
- pdf-lib: browser-side PDF manipulation (initial integration)

---

## [2.0.1] 2026-06-12 — IDB Migration & Settings Store

### Changed
- E-001 RESOLVED: Settings store migrated from localStorage to IndexedDB via `idb`

---

## [2.0.0] 2026-06-04 — Project Bootstrap

### Added
- Initial KaruviLab v2.0.0 on Next.js 16 + React 19 + TypeScript strict + Tailwind v4
- 9 tool categories: calculators, pdf-tools, image-tools, security-tools, developer-tools, utilities, productivity, media-tools, break-time-tools
- Core tool registry: single source of truth pattern
- Worker architecture: karuvi.worker, crypto.worker, image.worker, compute.worker + WorkerOrchestrator
- Design token system: colors, motion, radius, shadows, spacing, typography, zindex
- PWA: manifest.json, sw.js (Workbox), iOS splash screens, all icon sizes
- Security headers: CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy
- EXCEPTIONS.md, BUNDLE_DECISIONS.md, AGENTS.md, GEMINI.md engineering governance
