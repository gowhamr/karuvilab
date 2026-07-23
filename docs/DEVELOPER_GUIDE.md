# KaruviLab Developer Guide

The tools index now aggregates to 189 tools.

## Coding Standards
Follow rules defined in `GEMINI.md`. TypeScript 6.0.3 is strictly pinned.

## Adding a Tool
1. Register in `src/registry/core-registry.ts` (the single source of truth for all tools and categories).
2. Implement using the 3-file pattern in `app/(tools)`.

## Testing
Run `npm run build` before submitting changes to ensure type checking and build pass.
