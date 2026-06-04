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
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => toggleFavorite(toolId)}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
        active
          ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
          : "bg-surface border border-border text-text-4 hover:border-red-500/30 hover:text-red-500"
      }`}
    >
      <m.div
        animate={active ? { scale: [1, 1.3, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <Heart className={`w-3 h-3 ${active ? "fill-current" : ""}`} />
      </m.div>
      {active ? "Favorited" : "Add to Favorites"}
    </m.button>
  );
}
