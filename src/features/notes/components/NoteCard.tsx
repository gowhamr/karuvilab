"use client";

import React from "react";
import { Note } from "../types";
import { useNotesStore } from "../store";
import { formatNoteDate, truncateText } from "../utils";
import { m } from "framer-motion";
import { Pin, Archive, Trash2, Hash, CheckSquare } from "lucide-react";

interface NoteCardProps {
  note: Note;
  onClick: () => void;
}

export function NoteCard({ note, onClick }: NoteCardProps) {
  const togglePin = useNotesStore(state => state.togglePin);
  const toggleArchive = useNotesStore(state => state.toggleArchive);
  const toggleDelete = useNotesStore(state => state.toggleDelete);
  const viewMode = useNotesStore(state => state.viewMode);

  const handleAction = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  return (
    <m.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className={`group relative bg-surface/50 backdrop-blur-xl border border-border rounded-[24px] p-5 cursor-pointer hover:border-blue/30 hover:shadow-xl hover:shadow-blue/5 transition-all flex flex-col ${
        viewMode === "list" ? "flex-row items-center gap-6" : "h-full"
      }`}
    >
      {/* Pin Badge */}
      {note.pinned && (
        <div className="absolute -top-2 -right-2 bg-blue text-white p-1.5 rounded-full shadow-lg z-10">
          <Pin size={12} fill="currentColor" />
        </div>
      )}

      <div className={`flex-1 min-w-0 ${viewMode === "list" ? "flex items-center gap-6" : ""}`}>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="text-lg font-black text-text truncate leading-tight group-hover:text-blue transition-colors">
              {note.title || "Untitled Note"}
            </h3>
            {note.isChecklist && (
              <CheckSquare size={16} className="text-blue shrink-0 mt-1" />
            )}
          </div>

          <p className="text-sm text-text-3 line-clamp-3 mb-4 leading-relaxed opacity-80">
            {note.isChecklist 
              ? note.checklistItems.map(item => `${item.checked ? '✓' : '○'} ${item.text}`).join(' ')
              : note.content || "No content..."}
          </p>
        </div>

        <div className={`flex items-center justify-between ${viewMode === "list" ? "shrink-0 gap-8" : "mt-auto pt-4 border-t border-border/50"}`}>
          <div className="flex flex-wrap gap-1.5">
            {note.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="flex items-center gap-1 px-2 py-0.5 bg-blue/5 text-blue text-[10px] font-bold rounded-md uppercase tracking-wider">
                <Hash size={10} />
                {tag}
              </span>
            ))}
            {note.tags.length > 2 && (
              <span className="text-[10px] text-text-4 font-bold mt-1">
                +{note.tags.length - 2}
              </span>
            )}
          </div>
          <span className="text-[11px] font-bold text-text-4 uppercase tracking-widest whitespace-nowrap">
            {formatNoteDate(note.updatedAt)}
          </span>
        </div>
      </div>

      {/* Hover Actions */}
      <div className={`absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ${viewMode === "list" ? "relative top-0 right-0 opacity-100" : ""}`}>
        <button
          onClick={(e) => handleAction(e, () => togglePin(note.id))}
          className={`p-2 rounded-xl transition-all ${note.pinned ? 'text-blue bg-blue/10' : 'text-text-4 hover:bg-bg hover:text-blue'}`}
          title={note.pinned ? "Unpin" : "Pin"}
        >
          <Pin size={16} fill={note.pinned ? "currentColor" : "none"} />
        </button>
        <button
          onClick={(e) => handleAction(e, () => toggleArchive(note.id))}
          className="p-2 text-text-4 hover:bg-bg hover:text-blue rounded-xl transition-all"
          title="Archive"
        >
          <Archive size={16} />
        </button>
        <button
          onClick={(e) => handleAction(e, () => toggleDelete(note.id))}
          className="p-2 text-text-4 hover:bg-error/10 hover:text-error rounded-xl transition-all"
          title="Move to Trash"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </m.div>
  );
}
