"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ToolIcon } from "@/components/ui/Icons";
import { cn } from "@/src/lib/utils";
import { useFavoriteStore } from "@/src/store/useFavoriteStore";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
export const ToolCard = memo(function ToolCard({ tool, compact, hideCategory }) {
    const router = useRouter();
    const favorites = useFavoriteStore(state => state.favorites);
    const toggleFavorite = useFavoriteStore(state => state.toggleFavorite);
    const { toast } = useToast();
    const [hydrated, setHydrated] = useState(false);
    useEffect(() => {
        setHydrated(true);
    }, []);
    const isFavorite = hydrated && favorites.includes(tool.id);
    const handlePreload = useCallback(() => {
        if (!tool.href)
            return;
        if (typeof navigator !== "undefined" && "connection" in navigator) {
            const conn = navigator.connection;
            if (conn?.saveData || conn?.effectiveType === "2g" || conn?.effectiveType === "slow-2g") {
                return; // Skip prefetching on data saver mode or 2G networks
            }
        }
        router.prefetch(tool.href);
    }, [router, tool.href]);
    const handleFavClick = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        const willBeFav = !isFavorite;
        toggleFavorite(tool.id);
        toast(willBeFav ? `Added ${tool.name} to favorites` : `Removed ${tool.name} from favorites`, "info");
    }, [toggleFavorite, tool.id, isFavorite, tool.name, toast]);
    return (_jsxs("div", { className: "relative group w-full h-full", children: [_jsx(Link, { href: tool.href, "aria-label": tool.name, onMouseEnter: handlePreload, onTouchStart: handlePreload, className: "block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-card transition-transform duration-150 active:scale-[0.98]", children: _jsxs(Card, { variant: "interactive", padding: compact ? "sm" : "md", className: cn("flex flex-col h-full gap-3 select-none justify-between transition-all duration-150 group-active:border-primary/40 group-active:bg-primary/5", compact ? "min-h-[105px]" : "min-h-[160px]"), children: [_jsxs("div", { className: "space-y-3", children: [_jsx("div", { className: "flex items-start justify-between", children: _jsx("div", { className: "w-10 h-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform duration-200", children: _jsx(ToolIcon, { toolId: tool.id, category: tool.category, className: "w-5 h-5" }) }) }), _jsxs("div", { className: "space-y-1", children: [_jsx("h3", { className: "text-body font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-1", children: tool.name }), _jsx("p", { className: "text-sm text-text-secondary line-clamp-2 leading-relaxed", children: tool.desc })] })] }), !hideCategory && (_jsx("div", { className: "flex items-center gap-1.5 flex-wrap mt-auto", children: _jsx(Badge, { variant: "neutral", size: "sm", className: "bg-surface-elevated/50 text-xs", children: tool.category }) }))] }) }), hydrated && (_jsx("button", { onClick: handleFavClick, className: cn("absolute top-3 right-3 z-content p-2 rounded-full border transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-90", "before:absolute before:-inset-2 before:content-['']", isFavorite
                    ? "bg-danger/10 border-danger/20 text-danger"
                    : "bg-surface border-divider text-text-secondary hover:text-danger hover:border-danger/30 hover:bg-danger/5"), "aria-label": isFavorite ? `Remove ${tool.name} from favorites` : `Add ${tool.name} to favorites`, "aria-pressed": isFavorite, children: _jsx(Heart, { className: cn("w-4 h-4", isFavorite && "fill-current"), "aria-hidden": "true" }) }))] }));
});
ToolCard.displayName = "ToolCard";
