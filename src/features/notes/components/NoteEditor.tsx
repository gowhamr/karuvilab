"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Popover from "@radix-ui/react-popover";
import { m, AnimatePresence } from "framer-motion";
import { 
  X, Pin, Archive, Trash2, Hash, CheckSquare, 
  Type, Eye, Edit3, Plus, Trash, GripVertical,
  ChevronLeft, Save, Sparkles, MoreVertical
} from "lucide-react";
import { Note, ChecklistItem } from "../types";
import { useNotesStore } from "../store";
import { useAutoSave } from "../hooks/useAutoSave";
import { renderMarkdown, generateId, formatFullDate } from "../utils";
import { cn } from "@/src/lib/utils";
import { TAG_COLORS } from "../constants";

export function NoteEditor() {
  const notes = useNotesStore(state => state.notes);
  const selectedNoteId = useNotesStore(state => state.selectedNoteId);
  const setSelectedNoteId = useNotesStore(state => state.setSelectedNoteId);
  const updateNote = useNotesStore(state => state.updateNote);
  const togglePin = useNotesStore(state => state.togglePin);
  const toggleArchive = useNotesStore(state => state.toggleArchive);
  const toggleDelete = useNotesStore(state => state.toggleDelete);
  
  const initialNote = useMemo(() => {
    return notes.find(n => n.id === selectedNoteId) || null;
  }, [notes, selectedNoteId]);

  const [localNote, setLocalNote] = useState<Note | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    if (initialNote) {
      setLocalNote(initialNote);
      setIsPreview(false);
    } else {
      setLocalNote(null);
    }
  }, [initialNote]);

  // Auto-save logic
  useAutoSave(localNote, (note) => {
    if (note) updateNote(note);
  });

  // Render markdown for preview
  useEffect(() => {
    if (isPreview && localNote && !localNote.isChecklist) {
      renderMarkdown(localNote.content).then(setPreviewHtml);
    }
  }, [isPreview, localNote]);

  if (!localNote) return null;

  const handleChange = (updates: Partial<Note>) => {
    setLocalNote(prev => prev ? { ...prev, ...updates } : null);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newTag.trim()) {
      e.preventDefault();
      const tag = newTag.trim().toLowerCase();
      if (!localNote.tags.includes(tag)) {
        handleChange({ tags: [...localNote.tags, tag] });
      }
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    handleChange({ tags: localNote.tags.filter(t => t !== tagToRemove) });
  };

  const handleAddChecklistItem = () => {
    const newItem: ChecklistItem = { id: generateId(), text: "", checked: false };
    handleChange({ checklistItems: [...localNote.checklistItems, newItem] });
  };

  const handleUpdateChecklistItem = (id: string, updates: Partial<ChecklistItem>) => {
    handleChange({
      checklistItems: localNote.checklistItems.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    });
  };

  const handleRemoveChecklistItem = (id: string) => {
    handleChange({
      checklistItems: localNote.checklistItems.filter(item => item.id !== id)
    });
  };

  return (
    <Dialog.Root open={!!selectedNoteId} onOpenChange={(open) => !open && setSelectedNoteId(null)}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[400] bg-bg/60 backdrop-blur-sm animate-in fade-in duration-300" />
        
        <Dialog.Content className={cn(
          "fixed z-[401] bg-surface border border-border shadow-2xl overflow-hidden flex flex-col transition-all duration-300 outline-none",
          "inset-0 md:inset-10 lg:inset-20 md:rounded-[32px] md:max-w-4xl md:mx-auto"
        )}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-border/50 bg-bg/30">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setSelectedNoteId(null)}
                className="p-2 hover:bg-surface rounded-xl text-text-3 hover:text-text transition-all md:hidden"
              >
                <ChevronLeft size={20} />
              </button>
              
              <div className="flex items-center gap-1 bg-surface border border-border rounded-xl p-1">
                <button
                  onClick={() => handleChange({ isChecklist: false })}
                  className={cn("p-2 rounded-lg transition-all", !localNote.isChecklist ? "bg-blue text-white shadow-md shadow-blue/20" : "text-text-3 hover:bg-bg hover:text-text")}
                  title="Note Mode"
                >
                  <Type size={16} />
                </button>
                <button
                  onClick={() => handleChange({ isChecklist: true })}
                  className={cn("p-2 rounded-lg transition-all", localNote.isChecklist ? "bg-blue text-white shadow-md shadow-blue/20" : "text-text-3 hover:bg-bg hover:text-text")}
                  title="Checklist Mode"
                >
                  <CheckSquare size={16} />
                </button>
              </div>
              
              {!localNote.isChecklist && (
                <>
                  <div className="h-6 w-px bg-border/50 mx-1 md:mx-2" />
                  <div className="flex items-center gap-1 bg-surface border border-border rounded-xl p-1">
                    <button
                      onClick={() => setIsPreview(false)}
                      className={cn("p-2 rounded-lg transition-all", !isPreview ? "bg-blue/10 text-blue" : "text-text-3 hover:bg-bg hover:text-text")}
                      title="Edit Markdown"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => setIsPreview(true)}
                      className={cn("p-2 rounded-lg transition-all", isPreview ? "bg-blue/10 text-blue" : "text-text-3 hover:bg-bg hover:text-text")}
                      title="Preview Rendered"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-1">
              <Popover.Root>
                <Popover.Trigger asChild>
                  <button className="p-2 text-text-3 hover:bg-surface hover:text-text rounded-xl transition-all outline-none">
                    <MoreVertical size={20} />
                  </button>
                </Popover.Trigger>
                <Popover.Portal>
                  <Popover.Content align="end" sideOffset={8} className="z-[500] w-48 bg-surface border border-border rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 p-1">
                    <button
                      onClick={() => togglePin(localNote.id)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-text-3 hover:text-text hover:bg-bg rounded-xl transition-all"
                    >
                      <Pin size={16} fill={localNote.pinned ? "currentColor" : "none"} className={localNote.pinned ? "text-blue" : ""} />
                      {localNote.pinned ? "Unpin Note" : "Pin Note"}
                    </button>
                    <button
                      onClick={() => toggleArchive(localNote.id)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-text-3 hover:text-text hover:bg-bg rounded-xl transition-all"
                    >
                      <Archive size={16} className={localNote.isArchived ? "text-blue" : ""} />
                      {localNote.isArchived ? "Unarchive Note" : "Archive Note"}
                    </button>
                    <div className="h-px bg-border/50 my-1" />
                    <button
                      onClick={() => {
                        toggleDelete(localNote.id);
                        setSelectedNoteId(null);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-error hover:bg-error/10 rounded-xl transition-all"
                    >
                      <Trash2 size={16} />
                      Move to Trash
                    </button>
                  </Popover.Content>
                </Popover.Portal>
              </Popover.Root>
              
              <div className="h-6 w-px bg-border/50 mx-1 md:mx-2 hidden md:block" />
              <Dialog.Close className="hidden md:flex p-2 hover:bg-surface hover:text-text rounded-xl text-text-3 transition-all active:scale-90">
                <X size={20} />
              </Dialog.Close>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 custom-scrollbar">
            {/* Title */}
            <input
              type="text"
              value={localNote.title}
              onChange={(e) => handleChange({ title: e.target.value })}
              placeholder="Note Title"
              className="w-full bg-transparent text-3xl md:text-4xl font-black tracking-tight text-text placeholder:text-text-4 outline-none border-none"
            />

            {/* Content Area */}
            <div className="min-h-[300px]">
              {localNote.isChecklist ? (
                <div className="space-y-3">
                  {localNote.checklistItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 group animate-in slide-in-from-left-4 duration-200">
                      <button
                        onClick={() => handleUpdateChecklistItem(item.id, { checked: !item.checked })}
                        className={cn(
                          "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                          item.checked ? "bg-blue border-blue text-white shadow-md shadow-blue/20" : "border-border hover:border-blue/50"
                        )}
                      >
                        {item.checked && <CheckSquare size={14} />}
                      </button>
                      <input
                        type="text"
                        value={item.text}
                        onChange={(e) => handleUpdateChecklistItem(item.id, { text: e.target.value })}
                        placeholder="List item..."
                        className={cn(
                          "flex-1 bg-transparent outline-none border-none text-lg transition-all",
                          item.checked ? "text-text-4 line-through italic" : "text-text"
                        )}
                      />
                      <button
                        onClick={() => handleRemoveChecklistItem(item.id)}
                        className="p-2 text-text-4 hover:text-error opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash size={14} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={handleAddChecklistItem}
                    className="flex items-center gap-3 text-blue hover:bg-blue/5 px-2 py-2 rounded-xl transition-all w-full text-left font-bold text-sm"
                  >
                    <Plus size={18} />
                    Add Item
                  </button>
                </div>
              ) : isPreview ? (
                <div 
                  className="prose prose-invert max-w-none text-lg text-text-2"
                  dangerouslySetInnerHTML={{ __html: previewHtml || "Nothing to preview..." }}
                />
              ) : (
                <textarea
                  value={localNote.content}
                  onChange={(e) => handleChange({ content: e.target.value })}
                  placeholder="Start writing your thoughts... (Markdown supported)"
                  className="w-full h-full bg-transparent outline-none border-none text-lg text-text-2 leading-relaxed resize-none min-h-[400px]"
                />
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border/50 bg-bg/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Tag Input */}
            <div className="flex flex-wrap items-center gap-2">
              <Hash size={14} className="text-text-4" />
              {localNote.tags.map((tag) => (
                <span 
                  key={tag} 
                  className="flex items-center gap-1 px-2 py-1 bg-blue/5 text-blue text-[10px] font-black rounded-lg uppercase tracking-widest border border-blue/10 group animate-in zoom-in-75"
                >
                  {tag}
                  <button onClick={() => handleRemoveTag(tag)} className="hover:text-error">
                    <X size={10} />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Add tag..."
                className="bg-transparent text-[10px] font-black uppercase tracking-widest text-text outline-none w-20 placeholder:text-text-4"
              />
            </div>

            <div className="flex items-center justify-between md:justify-end gap-6">
              <span className="text-[10px] font-bold text-text-4 uppercase tracking-widest flex items-center gap-2">
                <Sparkles size={12} className="text-blue" />
                Updated {formatFullDate(localNote.updatedAt)}
              </span>
              <div className="flex items-center gap-1.5 text-text-4">
                <CheckSquare size={14} className="text-success" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Saved</span>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
