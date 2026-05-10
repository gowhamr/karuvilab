"use client";

import { Heart } from "lucide-react";
import { useFavoriteStore } from "@/src/store/useFavoriteStore";
import { useState, useEffect } from "react";

export function FavoriteButton({ toolId }: { toolId: string }) {
  const { isFavorite, toggleFavorite } = useFavoriteStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return (
      <div className="w-32 h-10 bg-surface border border-border rounded-xl animate-pulse" />
    );
  }

  const active = isFavorite(toolId);

  return (
    <button
      onClick={() => toggleFavorite(toolId)}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
        active
          ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
          : "bg-surface border border-border text-text-4 hover:border-red-500/30 hover:text-red-500"
      }`}
    >
      <Heart className={`w-3 h-3 ${active ? "fill-current" : ""}`} />
      {active ? "Favorited" : "Add to Favorites"}
    </button>
  );
}
