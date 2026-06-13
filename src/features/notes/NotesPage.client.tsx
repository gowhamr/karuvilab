"use client";

import React, { useEffect, useState } from "react";
import { useNotesStore } from "./store";
import { SearchBar } from "./components/SearchBar";
import { TagFilter } from "./components/TagFilter";
import { NoteList } from "./components/NoteList";
import { NoteEditor } from "./components/NoteEditor";
import { NoteCard } from "./components/NoteCard";
import { ImportNoteModal } from "./components/ImportNoteModal";
import { m, AnimatePresence } from "framer-motion";
import { Plus, Archive, Trash2, StickyNote, Inbox, LucideIcon } from "lucide-react";
import { generateId } from "./utils";
import { Note } from "./types";
import { cn } from "@/src/lib/utils";
import { useShallow } from "zustand/react/shallow";
import { useToast } from "@/components/ui/Toast";

type StatusTab = "active" | "archived" | "trash";

export default function NotesPage() {
  const fetchNotes = useNotesStore(state => state.fetchNotes);
  const addNote = useNotesStore(state => state.addNote);
  const setSelectedNoteId = useNotesStore(state => state.setSelectedNoteId);
  const emptyTrash = useNotesStore(state => state.emptyTrash);
  const notes = useNotesStore(state => state.notes);
  const [activeTab, setActiveTab] = useState<StatusTab>("active");
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleCreateNote = () => {
    const id = generateId();
    const newNote: Omit<Note, "createdAt" | "updatedAt"> = {
      id,
      title: "",
      content: "",
      tags: [],
      pinned: false,
      isArchived: false,
      isDeleted: false,
      isChecklist: false,
      checklistItems: [],
    };
    addNote(newNote);
    setSelectedNoteId(id);
  };

  const tabs: { id: StatusTab; label: string; icon: LucideIcon }[] = [
    { id: "active", label: "Notes", icon: Inbox },
    { id: "archived", label: "Archive", icon: Archive },
    { id: "trash", label: "Trash", icon: Trash2 },
  ];

  // Filter notes based on active tab for the count badges
  const activeCount = notes.filter(n => !n.isArchived && !n.isDeleted).length;
  const archivedCount = notes.filter(n => n.isArchived && !n.isDeleted).length;
  const trashCount = notes.filter(n => n.isDeleted).length;

  const counts = {
    active: activeCount,
    archived: archivedCount,
    trash: trashCount
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8 min-h-screen pb-32">
      {/* Tabs Section */}
      <div className="flex justify-start">
        <div className="flex items-center gap-1 bg-surface border border-border rounded-2xl p-1 shadow-sm w-full md:w-auto overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative flex-1 md:flex-none flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-6 py-2 md:py-2.5 rounded-xl text-xs md:text-xs font-black uppercase tracking-widest transition-all outline-none",
                  activeTab === tab.id ? "text-white shadow-md shadow-blue/20" : "text-text-4 hover:text-text hover:bg-bg"
                )}
              >
                {activeTab === tab.id && (
                  <m.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-blue rounded-xl -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon size={14} className={activeTab === tab.id ? "text-white/80" : "text-text-4"} />
                <span>{tab.label}</span>
                {counts[tab.id] > 0 && (
                  <span className={cn(
                    "px-1.5 py-0.5 rounded-md text-tiny ml-1",
                    activeTab === tab.id ? "bg-white/20 text-white" : "bg-blue/10 text-blue"
                  )}>
                    {counts[tab.id]}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <SearchBar onImportClick={() => setIsImportModalOpen(true)} />
      
      {activeTab === "active" && <TagFilter />}

      {/* Conditional rendering for empty trash action */}
      {activeTab === "trash" && trashCount > 0 && (
        <div className="flex justify-center">
          <button
            onClick={() => {
              toast("Are you sure you want to permanently delete all notes in the trash?", "warn", {
                label: "Empty",
                onClick: () => emptyTrash()
              });
            }}
            className="flex items-center gap-2 px-6 py-2 border border-error/20 text-error bg-error/5 hover:bg-error/10 rounded-full text-xs font-black uppercase tracking-widest transition-all"
          >
            <Trash2 size={14} />
            Empty Trash
          </button>
        </div>
      )}

      {/* List / Grid View Content */}
      <NoteListWrapper status={activeTab} />

      <NoteEditor />

      <ImportNoteModal open={isImportModalOpen} onOpenChange={setIsImportModalOpen} />

      {/* Floating Action Button */}
      <m.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleCreateNote}
        className="fixed bottom-24 md:bottom-10 right-6 md:right-10 w-16 h-16 bg-blue text-white rounded-full flex items-center justify-center shadow-2xl shadow-blue/40 z-50 group hover:bg-blue/90 transition-colors outline-none focus-visible:ring-4 focus-visible:ring-blue/20"
        title="Create New Note"
      >
        <Plus size={32} className="group-hover:rotate-90 transition-transform duration-300" />
      </m.button>
    </div>
  );
}

// Internal wrapper to filter notes based on active status tab
function NoteListWrapper({ status }: { status: StatusTab }) {
  const notes = useNotesStore(state => state.notes);
  const filter = useNotesStore(useShallow(state => state.filter));
  const viewMode = useNotesStore(state => state.viewMode);
  const setSelectedNoteId = useNotesStore(state => state.setSelectedNoteId);

  const filtered = notes.filter(n => {
    if (status === "active") return !n.isArchived && !n.isDeleted;
    if (status === "archived") return n.isArchived && !n.isDeleted;
    if (status === "trash") return n.isDeleted;
    return true;
  });

  // Apply search/tag filtering if active
  const finalNotes = filtered.filter(note => {
    if (status === "active") {
      if (filter.tag && !note.tags.includes(filter.tag)) return false;
      if (filter.search) {
        const search = filter.search.toLowerCase();
        return (
          note.title.toLowerCase().includes(search) ||
          note.content.toLowerCase().includes(search) ||
          note.tags.some((tag) => tag.toLowerCase().includes(search))
        );
      }
    }
    return true;
  }).sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return b.updatedAt - a.updatedAt;
  });

  if (finalNotes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-text-4 opacity-50 space-y-4">
        <Inbox size={64} strokeWidth={1} />
        <p className="text-sm font-medium uppercase tracking-widest">
          {status === "active" ? "No notes found" : `Your ${status} is empty`}
        </p>
      </div>
    );
  }

  return (
    <div className={cn(
      viewMode === "grid" 
        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
        : "flex flex-col gap-4"
    )}>
      <AnimatePresence mode="popLayout">
        {finalNotes.map((note) => (
          <NoteCardWrapper key={note.id} note={note} onClick={() => setSelectedNoteId(note.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function NoteCardWrapper({ note, onClick }: { note: Note, onClick: () => void }) {
  return <NoteCard note={note} onClick={onClick} />;
}
