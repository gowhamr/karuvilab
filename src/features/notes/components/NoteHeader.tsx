'use client';

import React from 'react';
import * as Popover from "@radix-ui/react-popover";
import * as Dialog from "@radix-ui/react-dialog";
import { 
  X, Pin, Archive, Trash2, CheckSquare, 
  Type, Eye, Edit3, ChevronLeft, MoreVertical,
  Lock, Unlock, Key, Copy
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { Note } from "../types";

interface NoteHeaderProps {
  localNote: Note;
  isPreview: boolean;
  setIsPreview: (val: boolean) => void;
  onClose: () => void;
  onUpdate: (updates: Partial<Note>) => void;
  onTogglePin: (id: string) => void;
  onToggleArchive: (id: string) => void;
  onToggleDelete: (id: string) => void;
  onLock: (id: string) => void;
  onEncrypt: () => void;
  onDecrypt: () => void;
  onCopyCiphertext: () => void;
}

export function NoteHeader({
  localNote,
  isPreview,
  setIsPreview,
  onClose,
  onUpdate,
  onTogglePin,
  onToggleArchive,
  onToggleDelete,
  onLock,
  onEncrypt,
  onDecrypt,
  onCopyCiphertext
}: NoteHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-border/50 bg-bg/30">
      <div className="flex items-center gap-2">
        <button 
          onClick={onClose}
          className="p-2 hover:bg-surface rounded-xl text-text-3 hover:text-text transition-all md:hidden"
          aria-label="Back to notes"
        >
          <ChevronLeft size={20} />
        </button>
        
        <div className="flex items-center gap-1 bg-surface border border-border rounded-xl p-1">
          <button
            onClick={() => onUpdate({ isChecklist: false })}
            className={cn("p-2 rounded-lg transition-all", !localNote.isChecklist ? "bg-blue text-white shadow-md shadow-blue/20" : "text-text-3 hover:bg-bg hover:text-text")}
            title="Note Mode"
            aria-label="Switch to note mode"
          >
            <Type size={16} />
          </button>
          <button
            onClick={() => onUpdate({ isChecklist: true })}
            className={cn("p-2 rounded-lg transition-all", localNote.isChecklist ? "bg-blue text-white shadow-md shadow-blue/20" : "text-text-3 hover:bg-bg hover:text-text")}
            title="Checklist Mode"
            aria-label="Switch to checklist mode"
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
                aria-label="Edit mode"
              >
                <Edit3 size={16} />
              </button>
              <button
                onClick={() => setIsPreview(true)}
                className={cn("p-2 rounded-lg transition-all", isPreview ? "bg-blue/10 text-blue" : "text-text-3 hover:bg-bg hover:text-text")}
                title="Preview Rendered"
                aria-label="Preview mode"
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
            <button 
              className="p-2 text-text-3 hover:bg-surface hover:text-text rounded-xl transition-all outline-none"
              aria-label="More options"
            >
              <MoreVertical size={20} />
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content align="end" sideOffset={8} className="z-[500] w-56 bg-surface border border-border rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 p-1">
              <button
                onClick={() => onTogglePin(localNote.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-text-3 hover:text-text hover:bg-bg rounded-xl transition-all"
              >
                <Pin size={16} fill={localNote.pinned ? "currentColor" : "none"} className={localNote.pinned ? "text-blue" : ""} />
                {localNote.pinned ? "Unpin Note" : "Pin Note"}
              </button>
              <button
                onClick={() => onToggleArchive(localNote.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-text-3 hover:text-text hover:bg-bg rounded-xl transition-all"
              >
                <Archive size={16} className={localNote.isArchived ? "text-blue" : ""} />
                {localNote.isArchived ? "Unarchive Note" : "Archive Note"}
              </button>
              
              <div className="h-px bg-border/50 my-1" />
              
              {localNote.isEncrypted ? (
                <>
                  <button
                    onClick={() => onLock(localNote.id)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-text-3 hover:text-text hover:bg-bg rounded-xl transition-all"
                  >
                    <Lock size={16} className="text-error" />
                    Lock Note
                  </button>
                  <button
                    onClick={onDecrypt}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-text-3 hover:text-text hover:bg-bg rounded-xl transition-all"
                  >
                    <Unlock size={16} className="text-success" />
                    Decrypt Note
                  </button>
                  <button
                    onClick={onCopyCiphertext}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-text-3 hover:text-text hover:bg-bg rounded-xl transition-all"
                  >
                    <Copy size={16} className="text-blue" />
                    Copy Ciphertext
                  </button>
                </>
              ) : (
                <button
                  onClick={onEncrypt}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-text-3 hover:text-text hover:bg-bg rounded-xl transition-all"
                >
                  <Key size={16} className="text-blue" />
                  Encrypt Note
                </button>
              )}

              <div className="h-px bg-border/50 my-1" />
              
              <button
                onClick={() => onToggleDelete(localNote.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-error hover:bg-error/10 rounded-xl transition-all"
              >
                <Trash2 size={16} />
                Move to Trash
              </button>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
        
        <div className="h-6 w-px bg-border/50 mx-1 md:mx-2 hidden md:block" />
        <Dialog.Close 
          className="hidden md:flex p-2 hover:bg-surface hover:text-text rounded-xl text-text-3 transition-all active:scale-90"
          aria-label="Close editor"
        >
          <X size={20} />
        </Dialog.Close>
      </div>
    </div>
  );
}
