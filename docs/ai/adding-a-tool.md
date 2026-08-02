# How to Add a New AI Tool to KaruviLab

Follow this 5-step workflow to build new local AI tools:

1. **Register Manifest in `src/ai/registry.ts`**:
   Add model entry with SHA-256 hash, size, and dynamic capability metadata.

2. **Build Feature Domain (`src/features/[tool-id]/`)**:
   Implement `constants.ts`, `preprocess.ts`, and `postprocess.ts` using `src/ai/pipeline/`.

3. **Build 3-File App Router Route (`app/(tools)/[category]/[tool-id]/`)**:
   - `page.tsx`: Server Component with SEO metadata & schema.
   - `ToolClientWrapper.tsx`: `ssr: false` boundary with `<ToolSkeleton />`.
   - `ToolClient.tsx`: DropZone UI, controls, before/after slider, and 4-tab ELS section.

4. **Reuse Shared AI UI Components**:
   - `<ModelStatusBadge>`
   - `<InferenceProgress>`
   - `<BackendSelector>`
   - `<ModelManagerDialog>`

5. **Verify**:
   Run `npm run typecheck` and `npm run lint`.
