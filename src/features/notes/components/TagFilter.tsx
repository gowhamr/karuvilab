"use client";

import React, { useMemo } from "react";
import { useNotesStore } from "../store";
import { m } from "framer-motion";
import { Hash } from "lucide-react";

export function TagFilter() {
  const { notes, filter, setTagFilter } = useNotesStore();

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    notes.forEach((note) => {
      if (!note.isDeleted) {
        note.tags.forEach((tag) => tags.add(tag));
      }
    });
    return Array.from(tags).sort();
  }, [notes]);

  if (allTags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => setTagFilter(null)}
        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
          filter.tag === null
            ? "bg-blue border-blue text-white shadow-lg shadow-blue/20"
            : "bg-surface border-border text-text-3 hover:border-blue/50 hover:text-blue"
        }`}
      >
        All Notes
      </button>
      {allTags.map((tag) => (
        <button
          key={tag}
          onClick={() => setTagFilter(tag === filter.tag ? null : tag)}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
            filter.tag === tag
              ? "bg-blue border-blue text-white shadow-lg shadow-blue/20"
              : "bg-surface border-border text-text-3 hover:border-blue/50 hover:text-blue"
          }`}
        >
          <Hash size={12} className={filter.tag === tag ? "text-white/70" : "text-text-4"} />
          {tag}
        </button>
      ))}
    </div>
  );
}
