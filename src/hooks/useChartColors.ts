"use client";

import { useEffect, useState } from 'react';

/**
 * useChartColors
 * Safely extracts theme-aware colors from CSS variables for use in SVG/Canvas components.
 * Prevents hardcoding of hex values and ensures dark-mode parity.
 */
export function useChartColors() {
  const [colors, setColors] = useState({
    blue: '#4F46E5',
    success: '#10B981',
    error: '#EF4444',
    warn: '#F59E0B',
    text: '#0F172A',
    muted: '#94A3B8',
    border: '#DDE4EE',
  });

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    const style = getComputedStyle(root);

    const getVar = (name: string, fallback: string) => {
      const val = style.getPropertyValue(name).trim();
      return val || fallback;
    };

    setColors({
      blue: getVar('--blue', '#4F46E5'),
      success: getVar('--success', '#10B981'),
      error: getVar('--error', '#EF4444'),
      warn: getVar('--warn', '#F59E0B'),
      text: getVar('--text', '#0F172A'),
      muted: getVar('--text-4', '#94A3B8'),
      border: getVar('--border', '#DDE4EE'),
    });
  }, []);

  return colors;
}
