'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
export function useUrlState(options) {
    const { defaults, debounceMs = 400, prefix = '', encode = true, historyMode = 'replace', } = options;
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const debounceRef = useRef(undefined);
    const [isSynced, setIsSynced] = useState(false);
    const defaultsStr = JSON.stringify(defaults);
    const parseFromUrl = useCallback(() => {
        const currentDefaults = JSON.parse(defaultsStr);
        const result = { ...currentDefaults };
        for (const key in currentDefaults) {
            const paramKey = prefix ? `${prefix}_${key}` : key;
            const raw = searchParams.get(paramKey);
            if (raw === null)
                continue;
            const defaultVal = currentDefaults[key];
            try {
                if (typeof defaultVal === 'number') {
                    const parsed = Number(raw);
                    if (!isNaN(parsed))
                        result[key] = parsed;
                }
                else if (typeof defaultVal === 'boolean') {
                    result[key] = raw === '1' || raw === 'true';
                }
                else {
                    result[key] = encode ? decodeURIComponent(raw) : raw;
                }
            }
            catch {
                // keep default value on parse error
            }
        }
        return result;
    }, [defaultsStr, prefix, encode, searchParams]);
    const [state, setStateInternal] = useState(() => parseFromUrl());
    const buildUrl = useCallback((s) => {
        const currentDefaults = JSON.parse(defaultsStr);
        const params = new URLSearchParams();
        let hasNonDefault = false;
        for (const key in s) {
            const paramKey = prefix ? `${prefix}_${key}` : key;
            const val = s[key];
            const def = currentDefaults[key];
            if (val === def || val === null || val === undefined)
                continue;
            hasNonDefault = true;
            if (typeof val === 'boolean') {
                params.set(paramKey, val ? '1' : '0');
            }
            else if (typeof val === 'string' && encode) {
                params.set(paramKey, encodeURIComponent(val));
            }
            else {
                params.set(paramKey, String(val));
            }
        }
        if (!hasNonDefault)
            return pathname;
        return `${pathname}?${params.toString()}`;
    }, [defaultsStr, prefix, encode, pathname]);
    const setState = useCallback((updates) => {
        setStateInternal(prev => {
            const next = { ...prev, ...updates };
            setIsSynced(false);
            clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => {
                const url = buildUrl(next);
                if (historyMode === 'replace') {
                    window.history.replaceState(window.history.state, '', url);
                }
                else {
                    window.history.pushState(window.history.state, '', url);
                }
                setIsSynced(true);
            }, debounceMs);
            return next;
        });
    }, [debounceMs, historyMode, buildUrl]);
    const resetState = useCallback(() => {
        clearTimeout(debounceRef.current);
        setStateInternal(JSON.parse(defaultsStr));
        window.history.replaceState(window.history.state, '', pathname);
        setIsSynced(true);
    }, [pathname, defaultsStr]);
    useEffect(() => {
        return () => clearTimeout(debounceRef.current);
    }, []);
    useEffect(() => {
        const parsed = parseFromUrl();
        Promise.resolve().then(() => {
            setStateInternal(prev => {
                if (JSON.stringify(prev) === JSON.stringify(parsed))
                    return prev;
                return parsed;
            });
            setIsSynced(true);
        });
    }, [parseFromUrl]);
    const shareUrl = typeof window !== 'undefined'
        ? `${window.location.origin}${buildUrl(state)}`
        : buildUrl(state);
    const hasParams = searchParams.toString().length > 0;
    return { state, setState, resetState, shareUrl, isSynced, hasParams };
}
