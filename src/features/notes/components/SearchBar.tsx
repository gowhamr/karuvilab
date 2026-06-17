"use client";

import React from "react";
import { Search, X, List, Grid, Unlock } from "lucide-react";
import { useNotesStore } from "../store";
import { m } from "framer-motion";

interface SearchBarProps {
  onImportClick?: () => void;
}

export function SearchBar({ onImportClick }: SearchBarProps) {
  const filterSearch = useNotesStore(state => state.filter.search);
  const setSearch = useNotesStore(state => state.setSearch);
  const viewMode = useNotesStore(state => state.viewMode);
  const setViewMode = useNotesStore(state => state.setViewMode);

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center w-full mb-6">
      <div className="relative w-full flex-1 group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-4 group-focus-within:text-blue transition-colors">
          <Search size={18} />
        </div>
        <input
          type="text"
          value={filterSearch}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search notes, tags, or content..."
          className="w-full bg-surface border border-border rounded-2xl py-3 pl-12 pr-12 text-sm focus:outline-none focus:border-blue/50 focus:ring-4 focus:ring-blue/5 transition-all"
        />
        {filterSearch && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-4 hover:text-text transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div className="flex items-center gap-3 shrink-0 w-full md:w-auto justify-end">
        {onImportClick && (
          <button
            onClick={onImportClick}
            className="flex items-center gap-2 px-5 py-3 bg-surface border border-border hover:border-blue/30 text-text-3 hover:text-blue rounded-2xl text-tiny font-bold uppercase tracking-widest-sm transition-all cursor-pointer shadow-sm"
            title="Decrypt Shared Note"
          >
            <Unlock size={14} className="text-blue" />
            <span>Decrypt Note</span>
          </button>
        )}

        <div className="flex items-center gap-2 bg-surface border border-border rounded-2xl p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-xl transition-all ${
              viewMode === "grid"
                ? "bg-blue text-white shadow-lg shadow-blue/20"
                : "text-text-4 hover:bg-bg hover:text-text"
            }`}
            title="Grid View"
          >
            <Grid size={18} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-xl transition-all ${
              viewMode === "list"
                ? "bg-blue text-white shadow-lg shadow-blue/20"
                : "text-text-4 hover:bg-bg hover:text-text"
            }`}
            title="List View"
          >
            <List size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
