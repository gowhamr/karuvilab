# KaruviLab Roadmap & Vision

> **North Star:** KaruviLab helps engineers understand technology—not just use it. Every tool is private, offline-first, technically accurate, and teaches the concepts, standards, architecture, security, and real-world engineering behind it.

## Phase 1 — Freeze Features (Complete the Foundation)
**Goal:** Every existing tool should be the best browser-native implementation available.
**Do not add any new tools until Phase 1 and 2 are complete.**

For every existing tool, ensure:
- [ ] Reliable implementation
- [ ] Offline-first
- [ ] Worker support (no main-thread blocking)
- [ ] Mobile optimization
- [ ] Error handling
- [ ] Accessibility
- [ ] Learn More section
- [ ] Failure Cases
- [ ] Best Practices
- [ ] Standards/RFC references
- [ ] FAQ
- [ ] Examples

## Phase 2 — Engineering Learning System (Highest Priority)
Every tool must become an educational resource using the ELS framework (see `ELS_v1.0_Framework_Spec.md`).
The content flow for each tool should be:
Tool -> Learn -> How it Works -> Algorithm -> Architecture -> Browser APIs -> Security -> Performance -> Real-world Usage -> Standards -> Failure Cases -> Quiz -> Further Reading

## Phase 3 — Browser Engineering Excellence
Make KaruviLab known for technical quality.
Examples:
- Web Workers & Worker pools
- WASM (only where justified)
- IndexedDB
- Service Worker & Background processing
- Lazy loading & Bundle optimization
- Memory & Mobile optimization

## Phase 4 — Domain Knowledge (Biggest Opportunity)
Focus on deep expertise domains where few utility sites excel.
Priority order:
1. **Banking Engineering** (ISO 8583, EMV, TLV, SWIFT, Payment systems)
2. **Cryptography** (RSA, ECC, JWT, OAuth, TLS, X.509)
3. **PDF Engineering** (PDF internals, Digital signatures, PDF/A, Compression, Object model)
4. **Image Engineering** (JPEG, PNG, WebP, AVIF, EXIF, Color spaces)

## Phase 5 — Quality Before Quantity
A tool is not complete until it scores 100% on: Functionality, UI/UX, Mobile support, Accessibility, Worker support, Offline support, Learn section, Failure cases, Quiz, Standards, References, Examples. If one is missing, it stays in "Work in Progress."

## Phase 6 — Community Trust
Over time, add: Changelog, Version history, "Last verified" date, Browser compatibility, Source references (RFCs, standards, official documentation), Educational articles, Engineering blogs.

## What NOT to do
- ❌ Chasing 500 tools.
- ❌ Adding AI to every feature.
- ❌ Adding dependencies without a clear need.
- ❌ Copying competitors feature-for-feature.
