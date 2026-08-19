"use client";

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Screen Wake Lock API hook
 * Keeps device screen awake while the stopwatch is actively running.
 */
export function useWakeLock(shouldLock: boolean = false) {
  const [isLocked, setIsLocked] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'wakeLock' in navigator) {
      setIsSupported(true);
    }
  }, []);

  const requestLock = useCallback(async () => {
    if (typeof navigator === 'undefined' || !('wakeLock' in navigator)) return;
    try {
      if (wakeLockRef.current === null) {
        const sentinel = await navigator.wakeLock.request('screen');
        wakeLockRef.current = sentinel;
        setIsLocked(true);

        sentinel.addEventListener('release', () => {
          wakeLockRef.current = null;
          setIsLocked(false);
        });
      }
    } catch {
      // Permission denied or system power state disallowed lock
      setIsLocked(false);
    }
  }, []);

  const releaseLock = useCallback(async () => {
    if (wakeLockRef.current) {
      try {
        await wakeLockRef.current.release();
      } catch {
        // Sentinel already released
      }
      wakeLockRef.current = null;
      setIsLocked(false);
    }
  }, []);

  useEffect(() => {
    if (shouldLock && isSupported) {
      requestLock();
    } else {
      releaseLock();
    }

    return () => {
      releaseLock();
    };
  }, [shouldLock, isSupported, requestLock, releaseLock]);

  // Re-acquire lock when user switches back to tab
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && shouldLock && isSupported) {
        requestLock();
      }
    };

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, [shouldLock, isSupported, requestLock]);

  return { isLocked, isSupported, requestLock, releaseLock };
}
