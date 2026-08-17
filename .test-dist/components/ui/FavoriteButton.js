"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { Heart } from "lucide-react";
import { useFavoriteStore } from "@/src/store/useFavoriteStore";
import { useState, useEffect } from "react";
import { m } from "framer-motion";
import { useShallow } from "zustand/react/shallow";
export function FavoriteButton({ toolId }) {
    const favorites = useFavoriteStore(useShallow(state => state.favorites));
    const toggleFavorite = useFavoriteStore(state => state.toggleFavorite);
    const [hydrated, setHydrated] = useState(false);
    useEffect(() => {
        Promise.resolve().then(() => {
            setHydrated(true);
        });
    }, []);
    if (!hydrated) {
        return (_jsx("div", { className: "w-12 h-12 bg-surface border border-border rounded-xl shimmer-wrapper opacity-50" }));
    }
    const active = favorites.includes(toolId);
    return (_jsx(m.button, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.9 }, onClick: () => toggleFavorite(toolId), className: `w-12 h-12 p-2 rounded-xl transition-all shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-blue/20 flex items-center justify-center ${active
            ? "bg-red-500/10 border border-red-500/20 text-red-500"
            : "bg-surface border border-border text-text-3 hover:text-red-500 hover:border-red-500/30 hover:bg-red-500/5"}`, "aria-label": active ? "Remove from favorites" : "Add to favorites", children: _jsx(m.div, { animate: active ? { scale: [1, 1.3, 1] } : {}, transition: { duration: 0.3 }, children: _jsx(Heart, { className: `w-5 h-5 ${active ? "fill-current" : ""}` }) }) }));
}
