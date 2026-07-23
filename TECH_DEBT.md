# Technical Debt Log

## Global-Broadcast-Listener Pattern in Stores
**Date**: 2026-07-22
**Component**: `useWorkflowStore` & `useWorkflowIntegration`
**Description**: The current workflow integration relies on a passive, global-broadcast-listener pattern where tools passively observe a central store (`useWorkflowStore.activeItems`) and auto-feed data into their local queues (`useBatchStore`). This implicit state syncing is brittle, hard to trace, and has already caused infinite loop / file duplication bugs (e.g. tools re-ingesting their own output, forcing us to use a `sourceToolId` guard).
**Proposed Fix**: A more robust, explicit routing system should be implemented. Instead of tools listening blindly to a global array, the central workflow manager should explicitly target and push items to the intended tool's queue.
**Note**: Verified via Vitest reproduction of the state flow, not a live browser session (CLI environment, no browser access) — recommend a manual browser pass to confirm before treating this as fully closed.
