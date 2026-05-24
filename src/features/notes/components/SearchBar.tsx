"use client";

import React from "react";
import { Search, X, List, Grid } from "lucide-react";
import { useNotesStore } from "../store";
import { m } from "framer-motion";

export function SearchBar() {
  const { filter, setSearch, viewMode, setViewMode } = useNotesStore();

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center w-full mb-6">
      <div className="relative w-full flex-1 group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-4 group-focus-within:text-blue transition-colors">
          <Search size={18} />
        </div>
        <input
          type="text"
          value={filter.search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search notes, tags, or content..."
          className="w-full bg-surface border border-border rounded-2xl py-3 pl-12 pr-12 text-sm focus:outline-none focus:border-blue/50 focus:ring-4 focus:ring-blue/5 transition-all"
        />
        {filter.search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-4 hover:text-text transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

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
  );
}
