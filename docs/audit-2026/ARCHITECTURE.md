# KaruviLab Architecture Guide (Audit 2026)

## Overview
KaruviLab is built on the Next.js App Router, utilizing a privacy-first, local-execution model. The architecture is heavily optimized for zero-server-upload file processing, relying on the browser's capabilities via Web Workers and WebAssembly.

## 1. SSR Strategy
- **Server Components:** Used primarily for routing, SEO metadata generation, and loading shells. This minimizes the initial JavaScript bundle sent to the client.
- **Client Components:** Handle all interactive UI and tool logic. Since KaruviLab tools require browser-specific APIs (e.g., File API, Web Workers, IndexedDB), heavy lifting is strictly deferred to the client.

## 2. Client Boundaries
To prevent SSR hydration errors and avoid loading heavy WASM or browser-only APIs on the server, KaruviLab establishes strict `"use client"` boundaries. These boundaries encapsulate interactive components, ensuring that tool-specific libraries are only evaluated in the browser.

## 3. The 3-File Pattern
Tools within the `app/(tools)/` directory generally follow a structured 3-file pattern to separate concerns:
1. `page.tsx`: A Server Component responsible for fetching metadata (from `tool-registry.ts`) and defining the page shell.
2. `ToolClientWrapper.tsx`: The `"use client"` boundary. It often dynamically imports the heavy tool logic (sometimes with `ssr: false`) to keep the initial payload lightweight.
3. `ToolClient.tsx`: The core Client Component containing the interactive logic, state bindings, and UI for the specific tool.

## 4. State Management & Store Usage
- **Zustand:** Provides modular, atomic state management across the application (e.g., `useBatchStore`, `useWorkflowStore`, `useFileViewerStore`).
- **Persistence:** State is persisted securely on the client side using IndexedDB (via `idb-storage.ts`). This ensures user preferences and offline tool outputs remain available across sessions without server storage.

## 5. Web Worker Architecture
Heavy computations (cryptography, PDF manipulation, image processing, complex parsing) are offloaded to Web Workers using **Comlink**. The `src/engine/` and `src/workers/` directories manage worker pooling, concurrency limits, and task cancellation to ensure the UI thread remains responsive even on low-end devices.

## 6. Service Worker & PWA
- **Workbox Integration:** Located in `public/sw.js`, the Service Worker implements robust caching strategies.
- **Caching Strategies:** 
  - `StaleWhileRevalidate` for static assets and fonts.
  - `CacheFirst` for images with long expirations.
  - `NetworkFirst` for navigational requests (tool pages), ensuring fresh content while allowing an offline fallback (`/offline/`).
- **App Shell:** Critical assets and worker modules are precached to guarantee base functionality offline.
