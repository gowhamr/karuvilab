"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function ReactionDistributionChart({ analytics, className }) {
    const { distribution, attemptCount } = analytics;
    if (attemptCount === 0)
        return null;
    const tiers = [
        {
            label: 'Top Tier (<200ms)',
            count: distribution.topTierCount,
            pct: (distribution.topTierCount / attemptCount) * 100,
            color: 'bg-emerald-500',
            textColor: 'text-emerald-400',
        },
        {
            label: 'Fast (200–260ms)',
            count: distribution.fastCount,
            pct: (distribution.fastCount / attemptCount) * 100,
            color: 'bg-blue',
            textColor: 'text-blue',
        },
        {
            label: 'Typical (260–340ms)',
            count: distribution.typicalCount,
            pct: (distribution.typicalCount / attemptCount) * 100,
            color: 'bg-amber-400',
            textColor: 'text-amber-400',
        },
        {
            label: 'Slower (>340ms)',
            count: distribution.slowCount,
            pct: (distribution.slowCount / attemptCount) * 100,
            color: 'bg-slate-500',
            textColor: 'text-text-muted',
        },
    ];
    return (_jsxs("div", { className: className, children: [_jsxs("div", { className: "flex items-center justify-between text-xs font-bold text-text-muted mb-2", children: [_jsx("span", { children: "Reaction Tier Distribution" }), _jsxs("span", { children: [attemptCount, " Attempts"] })] }), _jsx("div", { className: "space-y-2 bg-surface-2/30 border border-border rounded-2xl p-3.5", children: tiers.map((t, idx) => (_jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "flex justify-between text-xs font-medium", children: [_jsx("span", { className: t.textColor, children: t.label }), _jsxs("span", { className: "text-text-muted font-mono", children: [t.count, " (", t.pct.toFixed(0), "%)"] })] }), _jsx("div", { className: "w-full h-2 rounded-full bg-surface-2 overflow-hidden", children: _jsx("div", { className: `h-full rounded-full transition-all duration-300 ${t.color}`, style: { width: `${t.pct}%` } }) })] }, idx))) })] }));
}
