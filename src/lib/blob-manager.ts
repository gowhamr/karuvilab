/**
 * Centralized Blob URL Manager to prevent memory leaks.
 * Tracks all created Blob URLs and provides automatic cleanup mechanisms.
 */

type BlobEntry = {
  url: string;
  createdAt: number;
  metadata?: any;
};

class BlobManager {
  private registry = new Map<string, BlobEntry>();

  /**
   * Creates a Blob URL and registers it for management.
   */
  create(blob: Blob | File | any, metadata?: any): string {
    const url = URL.createObjectURL(blob);
    this.registry.set(url, {
      url,
      createdAt: Date.now(),
      metadata,
    });
    return url;
  }

  /**
   * Revokes a specific Blob URL and removes it from the registry.
   */
  revoke(url: string | null | undefined): void {
    if (!url) return;
    if (this.registry.has(url)) {
      URL.revokeObjectURL(url);
      this.registry.delete(url);
    }
  }

  /**
   * Revokes all managed Blob URLs.
   */
  revokeAll(): void {
    for (const url of this.registry.keys()) {
      URL.revokeObjectURL(url);
    }
    this.registry.clear();
  }

  /**
   * Returns the number of active Blob URLs.
   */
  getStats() {
    return {
      count: this.registry.size,
      urls: Array.from(this.registry.keys()),
    };
  }

  /**
   * Cleanup URLs older than a certain age (e.g., for long sessions)
   */
  cleanupIdle(maxAgeMs: number = 1000 * 60 * 60): void {
    const now = Date.now();
    for (const [url, entry] of this.registry.entries()) {
      if (now - entry.createdAt > maxAgeMs) {
        this.revoke(url);
      }
    }
  }
}

export const blobManager = new BlobManager();

// Global cleanup on page hide/unload
if (typeof globalThis !== 'undefined' && (globalThis as any).window) {
  (globalThis as any).window.addEventListener('pagehide', () => {
    // We don't necessarily want to revoke everything on hide if it's a PWA,
    // but maybe on visibilitychange if it stays hidden for a long time.
  });
}
