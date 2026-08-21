/**
 * KaruviLab Document Revision Tracker
 *
 * A universal stale-result protection mechanism for the Markdown Document Engine.
 * Every asynchronous operation (Markdown parse, Mermaid render, Preview update, Export)
 * carries the document revision at the time it was initiated. Before committing a result,
 * the operation checks whether its revision matches the current revision.
 *
 * Architecture:
 *
 *   Document Revision
 *         │
 *    ┌────┼────────────┐
 *    ▼    ▼            ▼
 *  Markdown  Mermaid  Export
 *   Worker   Queue    Barrier
 *    │       │         │
 *    └───────┼─────────┘
 *            ▼
 *    Commit only if
 *    revision matches
 *
 * This replaces ad-hoc per-system generation guards with a single source of truth.
 */
export class DocumentRevisionTracker {
    static instance = null;
    revision = 0;
    constructor() { }
    static getInstance() {
        if (!DocumentRevisionTracker.instance) {
            DocumentRevisionTracker.instance = new DocumentRevisionTracker();
        }
        return DocumentRevisionTracker.instance;
    }
    /**
     * Increment the document revision. Call this whenever the canonical Markdown source changes.
     * Returns the new revision number.
     */
    bump() {
        return ++this.revision;
    }
    /**
     * Get the current document revision without incrementing.
     */
    current() {
        return this.revision;
    }
    /**
     * Check whether a captured revision is still current.
     * Use this before committing the result of an asynchronous operation.
     */
    isCurrent(capturedRevision) {
        return capturedRevision === this.revision;
    }
    /**
     * Capture the current revision as a token for later comparison.
     * Semantically identical to `current()` but communicates intent more clearly.
     */
    capture() {
        return this.revision;
    }
    /**
     * Reset for testing purposes only.
     */
    _resetForTesting() {
        this.revision = 0;
    }
}
export const documentRevision = DocumentRevisionTracker.getInstance();
