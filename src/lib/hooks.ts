import { useState, useEffect, useCallback } from 'react';
import { getToolState, saveToolState } from './db';

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
