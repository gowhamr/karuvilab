"use client";

import { Heart } from "lucide-react";
import { useFavoriteStore } from "@/src/store/useFavoriteStore";
import { useState, useEffect } from "react";
import { m } from "framer-motion";
import { useShallow } from "zustand/react/shallow";

export function FavoriteButton({ toolId }: { toolId: string }) {
  const favorites = useFavoriteStore(useShallow(state => state.favorites));
  const toggleFavorite = useFavoriteStore(state => state.toggleFavorite);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return (
      <div className="w-32 h-10 bg-surface border border-border rounded-xl shimmer-wrapper opacity-50" />
    );
  }

  const active = favorites.includes(toolId);

  return (
    <m.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => toggleFavorite(toolId)}
      className={`min-w-11 min-h-11 p-2.5 rounded-xl transition-all shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-blue/20 flex items-center justify-center ${
        active
          ? "bg-red-500/10 border border-red-500/20 text-red-500"
          : "bg-surface border border-border text-text-3 hover:text-red-500 hover:border-red-500/30 hover:bg-red-500/5"
      }`}
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
    >
      <m.div
        animate={active ? { scale: [1, 1.3, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <Heart className={`w-5 h-5 ${active ? "fill-current" : ""}`} />
      </m.div>
    </m.button>
  );
}
