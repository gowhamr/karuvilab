# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]
### Added
- `.npmrc` with `legacy-peer-deps=true` to fix CI ERESOLVE.
- Vercel SpeedInsights to track performance metrics.
- Comprehensive desktop sidebar collapse functionality.
- Focus Mode toggle in World Clock action bar.
- Smart collision detection for tool options menus.
- Missing related tools added to Compress PDF and Merge PDF.
- Adaptive all-tools grid limit for returning users.
- Home page restructured to use `QuickActionsDashboard`.
- Premium calendar UX overhaul.
- `dnd-kit` for robust 2D grid drag-and-drop replacing framer-motion Reorder.
- Missing tool registry files and updated core registry.
- 150 enterprise tools, intelligent search, security suite & homepage personalization.
- JWT Decoder: Developer features and signature decode capability.

### Fixed
- TypeScript strict errors for Vercel deployment and CI checks.
- JSONFormatter hooks issue and missing ToolShell title props.
- Incorrect `generateToolMetadata` argument in generated tools.
- Static build bailout in `ClientToolShell` resolving KL-05 performance issues.
- QA fixes, build error resolution, countdown timer UI, and all-tools display.
- JWT-decoder mobile performance and accessibility issues.
- React hook violation in Header when transitioning to Focus Mode.
- AM/PM calculation in world clock using h23 hour format.
- World clock drag handle mobile visibility and clipping issues.
- World clock drag intercepting scroll on mobile.
- Productivity category page rendering issues.
- Infinite render loop in NoteEditor speech recognition.
- Missing version in IndexedDB persisted stores (Rule P-18).
- Calculator CSP, offline PWA mode, and ToolShell type issues.

### Changed
- Global clock display preferences and custom label editing introduced.
- Tool action menu design reverted to popup menu.
- Redesigned World Clock header to emphasize "Add City" and minimize stats.
- Removed redundant "Browse All" links from section headers on the home page.
- Reduced footer size for mobile and refined typography.

### Removed
- Sidebar duplication.

### Security
- Resolved P0 and P1 architectural and security audit findings.

*Note: This log is automatically generated based on recent commits as of the 2026 Audit.*
