"use client";

import React, { useMemo } from "react";
import { useNotesStore } from "../store";
import { NoteCard } from "./NoteCard";
import { AnimatePresence, m } from "framer-motion";
import { StickyNote } from "lucide-react";

export function NoteList() {
  const { notes, filter, viewMode, setSelectedNoteId } = useNotesStore();

  const filteredNotes = useMemo(() => {
    return notes
      .filter((note) => {
        // Exclude archived and deleted from the main view
        if (note.isArchived || note.isDeleted) return false;

        // Tag filter
        if (filter.tag && !note.tags.includes(filter.tag)) return false;

        // Search filter
        if (filter.search) {
          const search = filter.search.toLowerCase();
          return (
            note.title.toLowerCase().includes(search) ||
            note.content.toLowerCase().includes(search) ||
            note.tags.some((tag) => tag.toLowerCase().includes(search))
          );
        }

        return true;
      })
      .sort((a, b) => {
        // Pinned notes always first
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;

        // Then sort by chosen option
        const field = filter.sort;
        const order = filter.order === "asc" ? 1 : -1;

        if (a[field] < b[field]) return -1 * order;
        if (a[field] > b[field]) return 1 * order;
        return 0;
      });
  }, [notes, filter]);

  if (filteredNotes.length === 0) {
    return (
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20 text-text-4 opacity-50 space-y-4"
      >
        <StickyNote size={64} strokeWidth={1} />
        <p className="text-sm font-medium">
          {filter.search || filter.tag
            ? "No notes match your filters"
            : "Capture your first thought. Click the + button to start."}
        </p>
      </m.div>
    );
  }

  return (
    <div
      className={
        viewMode === "grid"
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          : "flex flex-col gap-4"
      }
    >
      <AnimatePresence mode="popLayout">
        {filteredNotes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onClick={() => setSelectedNoteId(note.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
