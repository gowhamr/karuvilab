"use client";
import { useEffect, useState } from 'react';
import { KV_BLUE, KV_SUCCESS, KV_ERROR, KV_WARN } from '@/src/theme/constants';
/**
 * useChartColors
 * Safely extracts theme-aware colors from CSS variables for use in SVG/Canvas components.
 * Prevents hardcoding of hex values and ensures dark-mode parity.
 */
export function useChartColors() {
    const [colors, setColors] = useState({
        blue: KV_BLUE,
        success: KV_SUCCESS,
        error: KV_ERROR,
        warn: KV_WARN,
        text: '#0F172A',
        muted: '#94A3B8',
        border: '#DDE4EE',
    });
    useEffect(() => {
        // Only run on client
        if (typeof window === 'undefined')
            return;
        const root = document.documentElement;
        const style = getComputedStyle(root);
        const getVar = (name, fallback) => {
            const val = style.getPropertyValue(name).trim();
            return val || fallback;
        };
        Promise.resolve().then(() => {
            setColors({
                blue: getVar('--blue', KV_BLUE),
                success: getVar('--success', KV_SUCCESS),
                error: getVar('--error', KV_ERROR),
                warn: getVar('--warn', KV_WARN),
                text: getVar('--text', '#0F172A'),
                muted: getVar('--text-4', '#94A3B8'),
                border: getVar('--border', '#DDE4EE'),
            });
        });
    }, []);
    return colors;
}
