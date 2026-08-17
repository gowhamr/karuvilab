import { useState, useEffect, useCallback, useRef } from 'react';
import { getToolState, saveToolState } from './db';
import { blobManager } from './blob-manager';
/**
 * Hook to manage Blob URL lifecycles automatically.
 * Returns a createUrl function that tracks the URL and revokes it on unmount,
 * and a revokeUrl function to manually clean up.
 * Use { autoRevoke: false } for URLs that should persist across navigation.
 */
export function useObjectUrlManager(options = { autoRevoke: true }) {
    const urls = useRef(new Set());
    const createUrl = useCallback((obj) => {
        const url = blobManager.create(obj);
        if (options.autoRevoke) {
            urls.current.add(url);
        }
        return url;
    }, [options.autoRevoke]);
    const revokeUrl = useCallback((url) => {
        if (url) {
            blobManager.revoke(url);
            urls.current.delete(url);
        }
    }, []);
    useEffect(() => {
        const currentUrls = urls.current;
        return () => {
            if (options.autoRevoke) {
                currentUrls.forEach(url => {
                    blobManager.revoke(url);
                });
                currentUrls.clear();
            }
        };
    }, [options.autoRevoke]);
    return { createUrl, revokeUrl };
}
/**
 * Hook to prevent state updates after a component has unmounted.
 * (IMG-RUNTIME-006)
 */
export function useIsMounted() {
    const isMounted = useRef(true);
    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);
    return useCallback(() => isMounted.current, []);
}
export function useAsyncSafeState(initialValue) {
    const [state, setState] = useState(initialValue);
    const isMounted = useIsMounted();
    const safeSetState = useCallback((val) => {
        if (isMounted()) {
            setState(val);
        }
    }, [isMounted]);
    return [state, safeSetState];
}
export function usePersistentState(toolId, initialState) {
    const [state, setState] = useState(initialState);
    const [isLoaded, setIsLoaded] = useState(false);
    // Load state from IndexedDB on mount
    useEffect(() => {
        async function load() {
            try {
                const saved = await getToolState(toolId);
                if (saved && saved.state) {
                    setState(saved.state);
                }
            }
            catch (err) {
                console.error(`Failed to load state for ${toolId}:`, err);
            }
            finally {
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
    return [state, setState, isLoaded];
}
export function useOnlineStatus() {
    const [isOnline, setIsOnline] = useState(true);
    useEffect(() => {
        Promise.resolve().then(() => {
            setIsOnline(navigator.onLine);
        });
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
export function useNetworkQuality() {
    const [quality, setQuality] = useState({
        isOnline: true,
        trueInternet: true,
        effectiveType: null,
        downlink: null,
        rtt: null
    });
    useEffect(() => {
        let mounted = true;
        const updateQuality = (trueInternetVal) => {
            if (!mounted)
                return;
            const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            setQuality(prev => ({
                isOnline: navigator.onLine,
                trueInternet: trueInternetVal !== undefined ? trueInternetVal : prev.trueInternet,
                effectiveType: conn?.effectiveType || null,
                downlink: conn?.downlink || null,
                rtt: conn?.rtt || null
            }));
        };
        const checkTrueInternet = async () => {
            if (!navigator.onLine) {
                updateQuality(false);
                return;
            }
            try {
                const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
                const res = await fetch(`${basePath}/manifest.json?_t=${Date.now()}`, { method: 'HEAD', cache: 'no-store' });
                updateQuality(res.ok);
            }
            catch (err) {
                updateQuality(false);
            }
        };
        Promise.resolve().then(() => {
            updateQuality();
            checkTrueInternet();
        });
        const conn = navigator.connection;
        const handleChange = () => updateQuality();
        if (conn)
            conn.addEventListener('change', handleChange);
        const online = () => { updateQuality(); checkTrueInternet(); };
        const offline = () => updateQuality(false);
        window.addEventListener('online', online);
        window.addEventListener('offline', offline);
        const interval = setInterval(checkTrueInternet, 15000);
        return () => {
            mounted = false;
            if (conn)
                conn.removeEventListener('change', handleChange);
            window.removeEventListener('online', online);
            window.removeEventListener('offline', offline);
            clearInterval(interval);
        };
    }, []);
    return quality;
}
export function usePerformanceSettings() {
    const [shouldBlur, setShouldBlur] = useState(true);
    useEffect(() => {
        if (typeof navigator !== 'undefined') {
            const isLowPerf = (navigator.hardwareConcurrency || 4) < 4;
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (isLowPerf || prefersReducedMotion) {
                Promise.resolve().then(() => {
                    setShouldBlur(false);
                });
            }
        }
    }, []);
    return { shouldBlur };
}
