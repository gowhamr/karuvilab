import { useState, useEffect, useCallback, useRef } from 'react';
import { getToolState, saveToolState } from './db';
import { blobManager } from './blob-manager';

/**
 * Hook to manage Blob URL lifecycles automatically.
 * Returns a createUrl function that tracks the URL and revokes it on unmount,
 * and a revokeUrl function to manually clean up.
 */
export function useObjectUrlManager() {
  const urls = useRef<Set<string>>(new Set());

  const createUrl = useCallback((obj: Blob | MediaSource | File) => {
    const url = blobManager.create(obj);
    urls.current.add(url);
    return url;
  }, []);

  const revokeUrl = useCallback((url: string | null | undefined) => {
    if (url) {
      blobManager.revoke(url);
      urls.current.delete(url);
    }
  }, []);

  useEffect(() => {
    return () => {
      urls.current.forEach(url => {
        blobManager.revoke(url);
      });
      urls.current.clear();
    };
  }, []);

  return { createUrl, revokeUrl };
}

export function usePersistentState<T extends Record<string, unknown>>(toolId: string, initialState: T) {
  const [state, setState] = useState<T>(initialState);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load state from IndexedDB on mount
  useEffect(() => {
    async function load() {
      try {
        const saved = await getToolState(toolId);
        if (saved && saved.state) {
          setState(saved.state as T);
        }
      } catch (err) {
        console.error(`Failed to load state for ${toolId}:`, err);
      } finally {
        setIsLoaded(true);
      }
    }
    load();
  }, [toolId]);

  // Save state to IndexedDB whenever it changes
  useEffect(() => {
    if (isLoaded) {
      const timer = setTimeout(() => {
        saveToolState(toolId, state);
      }, 500); // Debounce saves
      return () => clearTimeout(timer);
    }
  }, [toolId, state, isLoaded]);

  return [state, setState, isLoaded] as const;
}

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const online = () => setIsOnline(true);
    const offline = () => setIsOnline(false);
    window.addEventListener('online', online);
    window.addEventListener('offline', offline);
    return () => {
      window.removeEventListener('online', online);
      window.removeEventListener('offline', offline);
    };
  }, []);

  return isOnline;
}

export function usePerformanceSettings() {
  const [shouldBlur, setShouldBlur] = useState(true);

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const isLowPerf = (navigator.hardwareConcurrency || 4) < 4;
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (isLowPerf || prefersReducedMotion) {
        setShouldBlur(false);
      }
    }
  }, []);

  return { shouldBlur };
}
