# KaruviLab Roadmap (Audit 2026)

## Immediate Fixes (P0)
- **Next.js Build Stability**: Resolve `optimizePackageImports` build failures and ensure stable production builds.
- **Hydration Mismatches**: Audit and fix any remaining React hydration mismatch errors caused by browser-only API executions before mount.
- **Service Worker Refinement**: Ensure Edge cases for Service Worker caching (e.g., failed updates, stale Workbox caches) are handled smoothly to avoid user disruption.

## High Priority (P1)
- **Extend Banking Tool Suite**: Expand parsers for complex financial formats like SWIFT (MT/MX), EMV TLV data, and Core Banking trace logs. 
- **Data & Financial Calculators**: Add new comprehensive financial calculators (e.g., CAGR, EMI, Compound Interest) with offline visualization.
- **Offline Sync Resilience**: Solidify IndexedDB state recovery mechanisms for tools that perform batch processing across unstable network conditions.

## Medium Priority (P2)
- **Mobile Ergonomics**: Refine touch targets, responsive layouts, and contextual action bars for smaller screens. 
- **Accessibility (a11y) Overhaul**: Ensure all tools meet WCAG standards with proper ARIA attributes, keyboard navigation, and screen reader support.
- **Image & PDF Enhancements**: Improve performance for Bulk Image Resizer, Background Remover, and heavy PDF manipulations directly in the browser.

## Future (P3)
- **Multi-Tab Workbench**: Allow users to keep multiple tools open in internal tabs with shared context, avoiding the need to duplicate files across tools.
- **Advanced Pipeline Chaining**: Enable users to pipe the output of one tool (e.g., PDF Split) directly into another (e.g., PDF Compress) without manual re-upload.
- **Collaborative Local P2P Sharing**: Investigate WebRTC for secure, peer-to-peer data sharing between devices on the same local network without server intermediaries.

## Impact vs Effort Matrix

| Feature | Impact | Effort | Priority |
| :--- | :--- | :--- | :--- |
| **New Math Calculators** | High | Low | P1 |
| **UI Touch Adjustments** | Medium | Low | P2 |
| **SWIFT/EMV Parsers** | High | High | P1 |
| **WASM Image Manipulation** | High | High | P2 |
| **Multi-Tab Workbench** | High | Very High | Future |
| **P2P Local Sharing** | Medium | Very High | Future |
