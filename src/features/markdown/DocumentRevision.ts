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
  private static instance: DocumentRevisionTracker | null = null;
  private revision: number = 0;

  private constructor() {}

  public static getInstance(): DocumentRevisionTracker {
    if (!DocumentRevisionTracker.instance) {
      DocumentRevisionTracker.instance = new DocumentRevisionTracker();
    }
    return DocumentRevisionTracker.instance;
  }

  /**
   * Increment the document revision. Call this whenever the canonical Markdown source changes.
   * Returns the new revision number.
   */
  public bump(): number {
    return ++this.revision;
  }

  /**
   * Get the current document revision without incrementing.
   */
  public current(): number {
    return this.revision;
  }

  /**
   * Check whether a captured revision is still current.
   * Use this before committing the result of an asynchronous operation.
   */
  public isCurrent(capturedRevision: number): boolean {
    return capturedRevision === this.revision;
  }

  /**
   * Capture the current revision as a token for later comparison.
   * Semantically identical to `current()` but communicates intent more clearly.
   */
  public capture(): number {
    return this.revision;
  }

  /**
   * Reset for testing purposes only.
   */
  public _resetForTesting(): void {
    this.revision = 0;
  }
}

export const documentRevision = DocumentRevisionTracker.getInstance();
