/**
 * Centralized object URL manager to prevent memory leaks.
 */
class ObjectUrlManager {
  private urls = new Set<string>();

  create(blob: Blob | MediaSource): string {
    const url = URL.createObjectURL(blob);
    this.urls.add(url);
    return url;
  }

  revoke(url: string) {
    if (this.urls.has(url)) {
      URL.revokeObjectURL(url);
      this.urls.delete(url);
    }
  }

  revokeAll() {
    this.urls.forEach(url => URL.revokeObjectURL(url));
    this.urls.clear();
  }
}

export const objectUrlManager = new ObjectUrlManager();

/**
 * Hook for managing blob URLs within components safely.
 */
import { useEffect, useRef } from "react";

export const useObjectUrl = (blob: Blob | null) => {
  const urlRef = useRef<string | null>(null);

  useEffect(() => {
    if (blob) {
      urlRef.current = objectUrlManager.create(blob);
    }

    return () => {
      if (urlRef.current) {
        objectUrlManager.revoke(urlRef.current);
        urlRef.current = null;
      }
    };
  }, [blob]);

  return urlRef.current;
};
