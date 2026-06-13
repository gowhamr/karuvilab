"use client";
import { useEffect, useState } from 'react';
export function useChartColors() {
  const [colors, setColors] = useState({ blue: '#4F46E5', success: '#10B981', error: '#EF4444', warn: '#F59E0B', text: '#0F172A', muted: '#94A3B8', border: '#DDE4EE' });
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const style = getComputedStyle(document.documentElement);
    const getVar = (name: string, fb: string) => style.getPropertyValue(name).trim() || fb;
    setColors({ blue: getVar('--blue', '#4F46E5'), success: getVar('--success', '#10B981'), error: getVar('--error', '#EF4444'), warn: getVar('--warn', '#F59E0B'), text: getVar('--text', '#0F172A'), muted: getVar('--text-4', '#94A3B8'), border: getVar('--border', '#DDE4EE') });
  }, []);
  return colors;
}
