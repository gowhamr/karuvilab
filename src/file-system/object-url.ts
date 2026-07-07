/**
 * Centralized object URL manager to prevent memory leaks.
 */
import { blobManager } from '@/src/lib/blob-manager';

class ObjectUrlManager {
  private urls = new Set<string>();

  create(blob: Blob | MediaSource): string {
    const url = blobManager.create(blob);
    this.urls.add(url);
    return url;
  }

  revoke(url: string) {
    if (this.urls.has(url)) {
      blobManager.revoke(url);
      this.urls.delete(url);
    }
  }

  revokeAll() {
    this.urls.forEach(url => blobManager.revoke(url));
    this.urls.clear();
  }
}

export const objectUrlManager = new ObjectUrlManager();

import { useEffect, useState } from "react";

export const useObjectUrl = (blob: Blob | null) => {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let newUrl: string | null = null;

    if (blob) {
      newUrl = objectUrlManager.create(blob);
      const urlToSet = newUrl;
      Promise.resolve().then(() => {
        if (active) setUrl(urlToSet);
      });
    } else {
      Promise.resolve().then(() => {
        if (active) setUrl(null);
      });
    }

    return () => {
      active = false;
      if (newUrl) {
        objectUrlManager.revoke(newUrl);
      }
    };
  }, [blob]);

  return url;
};
