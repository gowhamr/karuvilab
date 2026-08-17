/* ===== tool-registry.ts — KaruviLab Core Engine =====
 *
 * The single source of truth for the KaruviLab platform.
 * Defines metadata, SEO, UI hints, and relationships for every tool.
 */
import { CORE_TOOLS } from './registry/core-registry';
import { toolRelationships } from './registry/tool-relationships';
export function isNewTool(tool) {
    if (!tool.lastAdded)
        return false;
    const cutoff = Date.now() - (14 * 24 * 60 * 60 * 1000);
    // 14 days — stricter than 30 days
    return new Date(tool.lastAdded).getTime() > cutoff;
}
export const CATEGORIES = [
    { id: 'calculators', label: 'Calculators', href: '/calculators/', emoji: '🧮', description: 'Precision tools for financial, date, and mathematical calculations.', color: '#4F46E5' },
    { id: 'pdf', label: 'PDF Tools', href: '/pdf-tools/', emoji: '📄', description: 'Fast, browser-side PDF merging, compression, and conversion.', color: '#B91C1C' },
    { id: 'image', label: 'Image Tools', href: '/image-tools/', emoji: '🖼️', description: 'Optimize, convert, and resize images without uploading them.', color: '#BE123C' },
    { id: 'security', label: 'Security', href: '/security-tools/', emoji: '🔒', description: 'Private password generators, encoders, and hash utilities.', color: '#B45309' },
    { id: 'developer', label: 'Developer Tools', href: '/developer-tools/', emoji: '💻', description: 'Essential utilities for formatting, minifying, and debugging code.', color: '#6366F1' },
    { id: 'utilities', label: 'Daily Utilities', href: '/utilities/', emoji: '🛠️', description: 'Lightweight helpers for text, reminders, and daily productivity.', color: '#64748B' },
    { id: 'productivity', label: 'Productivity', href: '/productivity/', emoji: '🚀', description: 'Professional tools to manage your time and workflow privately.', color: '#4F46E5' },
    { id: 'media', label: 'Media Tools', href: '/media-tools/', emoji: '🎬', description: 'Professional browser-native tools for video, audio, and GIF editing.', color: '#6366F1' },
    { id: 'break-time', label: 'Break Time', href: '/break-time-tools/', emoji: '🧩', description: 'Quick offline brain-training games and focus breaks — no sign-in, no ads.', color: '#7C3AED' }
];
export const SUBCATEGORY_COLORS = {
    'Financial': '#10B981', // Green
    'Date & Time': '#A855F7', // Purple
    'Math & Units': '#3B82F6', // Blue
};
export function getToolColor(tool) {
    if (tool.color)
        return tool.color;
    const subCatColor = tool.subCategory ? SUBCATEGORY_COLORS[tool.subCategory] : undefined;
    if (subCatColor)
        return subCatColor;
    return CATEGORIES.find(c => c.id === tool.category)?.color || '#4F46E5';
}
export const ALL_TOOLS = CORE_TOOLS;
export const TOOL_RELATIONSHIPS = toolRelationships;
import { idbStorage } from "./store/idb-storage";
export const RECENT_PATH_KEY = 'karuvi.recent.paths';
let recentPathsCache = [];
if (typeof window !== 'undefined') {
    const migrateRecent = async () => {
        const legacyVal = localStorage.getItem(RECENT_PATH_KEY);
        if (legacyVal) {
            try {
                recentPathsCache = JSON.parse(legacyVal);
                await idbStorage.setItem(RECENT_PATH_KEY, legacyVal);
            }
            catch { }
            localStorage.removeItem(RECENT_PATH_KEY);
        }
        else {
            const idbVal = await idbStorage.getItem(RECENT_PATH_KEY);
            if (idbVal) {
                try {
                    recentPathsCache = JSON.parse(idbVal);
                }
                catch { }
            }
        }
    };
    migrateRecent();
}
export function findToolById(id) {
    return ALL_TOOLS.find(t => t.id === id);
}
export function findToolByPath(pathname) {
    const norm = '/' + pathname.replace(/^\/+/, '').replace(/index\.html$/, '').replace(/\/+$/, '');
    return ALL_TOOLS.find(t => {
        const h = '/' + t.href.replace(/^\/+/, '').replace(/\/+$/, '');
        return norm === h || norm.endsWith(h);
    });
}
export function getRecentTools() {
    if (typeof window === 'undefined')
        return [];
    try {
        const seen = new Set();
        const out = [];
        for (const p of recentPathsCache) {
            if (typeof p !== 'string')
                continue;
            const t = findToolByPath(p);
            if (t && !seen.has(t.id)) {
                seen.add(t.id);
                out.push(t);
            }
        }
        return out;
    }
    catch {
        return [];
    }
}
