# KaruviLab Architecture Guide

The tools index now aggregates to 193 tools.

## Project Architecture
KaruviLab is a Next.js (App Router) application prioritizing client-side execution for privacy.

## Folder Structure
- `app/(tools)/`: Tool-specific routes.
- `src/registry/`: Centralized tool metadata and discovery (single source of truth for 19 explicitly defined categories).
- `components/ui/`: Shared atomic UI.
- `src/features/`: Contains isolated client logic (e.g., Advanced PDF Editor).

## SSR Strategy
- Server Components handle metadata and ToolShell loading.
- Client boundaries encapsulate browser-only APIs and heavy libraries.

## 3-File Pattern
1. `page.tsx`: Server Component for metadata.
2. `ToolClientWrapper.tsx`: SSR false boundary.
3. `ToolClient.tsx`: Interactive logic.

## Worker Architecture
`WorkerOrchestrator` manages Web Worker lifecycle with concurrency limits.

## State Management
Zustand provides atomic state with IndexedDB persistence.
