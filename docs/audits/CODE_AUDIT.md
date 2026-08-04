# Code Quality Audit

## Overview
This audit evaluates the codebase structure, file sizes, and duplicate logic to identify areas for refactoring and optimization.

## Large Files
The following files are excessively large and should be considered for splitting or optimization:
1. `public/lib/monaco/vs/assets/ts.worker-CMbG-7ft.js` (~67,731 lines) - Vendor file, consider CDN or dynamic import.
2. `src/registry/core-registry.ts` (~3,786 lines) - Centralized registry has grown too large. Recommend splitting by category.
3. `src/registry/categories/calculators.ts` (~1,044 lines) - Large array of objects. Recommend moving metadata to individual tool definitions.
4. `src/features/regex/library.ts` (~1,028 lines) - Library data should be separated into a JSON file or smaller modular files.
5. `src/workers/karuvi.worker.ts` (~873 lines) - Web worker is growing monolithic. Consider separating business logic from worker message handling.
6. `src/registry/categories/developer.ts` (~780 lines)
7. `src/content/blog/articles.ts` (~577 lines) - Recommend using MDX or a CMS instead of a hardcoded array.

## Duplicate Logic & Architecture
- **Registries:** There are multiple large registry files in `src/registry/categories/`. The manual curation of these registries (`calculators.ts`, `developer.ts`, `security.ts`) likely causes merge conflicts and acts as a bottleneck. An automated approach using file-system based registry generation or co-location is recommended.
- **Client Components:** Components like `CspBuilderClient.tsx` and `RegexTesterClient.tsx` are monolithic. Business logic should be extracted into custom hooks.

## Recommendations
1. **Refactor Registries:** Migrate from monolithic registry files to co-located metadata inside each tool's folder, aggregated automatically.
2. **Component Splitting:** Break down large client components into smaller, pure UI components.
3. **Extract Data:** Move hardcoded data (`library.ts`, `articles.ts`) into separate `.json` files or leverage a headless CMS.
