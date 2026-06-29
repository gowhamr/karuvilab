"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { m } from "framer-motion";
import { FocusModeWrapper } from "@/components/ui/FocusModeWrapper";
import { 
  X, Hash, CheckSquare, Trash, Sparkles, Plus
} from "lucide-react";
import { Note, ChecklistItem } from "../types";
import { useNotesStore } from "../store";
import { useAutoSave } from "../hooks/useAutoSave";
import { renderMarkdown, generateId, formatFullDate } from "../utils";
import { cn } from "@/src/lib/utils";
import { useToast } from "@/components/ui/Toast";

import { NoteHeader } from "./NoteHeader";
import { NotePasswordGate } from "./NotePasswordGate";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { DrawingModal } from "./DrawingModal";
import { OCRButton } from "./OCRButton";
import { Mic, MicOff, PenTool } from "lucide-react";

export function NoteEditor() {
  const notes = useNotesStore(state => state.notes);
  const selectedNoteId = useNotesStore(state => state.selectedNoteId);
  const setSelectedNoteId = useNotesStore(state => state.setSelectedNoteId);
  const updateNote = useNotesStore(state => state.updateNote);
  const togglePin = useNotesStore(state => state.togglePin);
  const toggleArchive = useNotesStore(state => state.toggleArchive);
  const toggleDelete = useNotesStore(state => state.toggleDelete);

  const encryptNote = useNotesStore(state => state.encryptNote);
  const decryptNote = useNotesStore(state => state.decryptNote);
  const unlockNote = useNotesStore(state => state.unlockNote);
  const lockNote = useNotesStore(state => state.lockNote);
  const notePasswords = useNotesStore(state => state.notePasswords);
  
  const initialNote = useMemo(() => {
    return notes.find(n => n.id === selectedNoteId) || null;
  }, [notes, selectedNoteId]);

  const [localNote, setLocalNote] = useState<Note | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");
  const [newTag, setNewTag] = useState("");
  const [fontSize, setFontSize] = useState(14);
  const [wordWrap, setWordWrap] = useState(true);

  const [unlockPassword, setUnlockPassword] = useState("");
  const [unlockError, setUnlockError] = useState("");
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [encryptionPassword, setEncryptionPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [encryptionError, setEncryptionError] = useState("");
  const { toast } = useToast();

  const [isDrawingModalOpen, setIsDrawingModalOpen] = useState(false);

  const { isListening, toggleListening, error: speechError, isSupported: speechSupported } = useSpeechRecognition((transcript) => {
    if (localNote) {
      handleChange({ content: localNote.content + transcript });
    }
  });

  useEffect(() => {
    if (speechError) {
      toast(`Speech error: ${speechError}`, "error");
    }
  }, [speechError, toast]);

  const isUnlocked = useMemo(() => {
    return localNote ? (!localNote.isEncrypted || !!notePasswords[localNote.id]) : false;
  }, [localNote, notePasswords]);

  const wordCount = useMemo(() => {
    if (!localNote?.content) return 0;
    return localNote.content.trim() ? localNote.content.trim().split(/\s+/).length : 0;
  }, [localNote?.content]);

  const charCount = useMemo(() => localNote?.content?.length || 0, [localNote?.content]);
  const lineCount = useMemo(() => localNote?.content?.split('\n').length || 0, [localNote?.content]);

  useEffect(() => {
    if (initialNote) {
      setLocalNote(initialNote);
      setIsPreview(false);
      setUnlockPassword("");
      setUnlockError("");
      setIsEncrypting(false);
      setEncryptionPassword("");
      setConfirmPassword("");
      setEncryptionError("");
    } else {
      setLocalNote(null);
    }
  }, [initialNote]);

  useAutoSave(localNote, (note) => {
    if (note) updateNote(note);
  });

  useEffect(() => {
    if (isPreview && localNote && !localNote.isChecklist) {
      renderMarkdown(localNote.content).then(setPreviewHtml);
    }
  }, [isPreview, localNote]);

  if (!localNote) return null;

  const handleUnlockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!unlockPassword) return;
    setUnlockError("");
    const success = await unlockNote(localNote.id, unlockPassword);
    if (success) {
      setUnlockPassword("");
      toast("Note decrypted successfully for session", "info");
    } else {
      setUnlockError("Incorrect password. Please try again.");
    }
  };

  const handleEncryptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!encryptionPassword) return;
    if (encryptionPassword !== confirmPassword) {
      setEncryptionError("Passwords do not match.");
      return;
    }
    setEncryptionError("");
    try {
      await encryptNote(localNote.id, encryptionPassword);
      setIsEncrypting(false);
      setEncryptionPassword("");
      setConfirmPassword("");
      toast("Note encrypted and locked with AES-256", "info");
    } catch (err) {
      setEncryptionError("Encryption failed.");
    }
  };

  const handleDecryptClick = async () => {
    const password = notePasswords[localNote.id];
    if (!password) {
      toast("Please unlock the note first", "warn");
      return;
    }
    try {
      await decryptNote(localNote.id, password);
      toast("Encryption removed from note", "info");
    } catch (err) {
      toast("Failed to decrypt note", "error");
    }
  };

  const handleCopyCiphertext = () => {
    if (!localNote.encryptedData) {
      toast("Note is not encrypted or missing data.", "error");
      return;
    }
    navigator.clipboard.writeText(localNote.encryptedData);
    toast("Ciphertext copied to clipboard!", "success");
  };

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
        <Dialog.Overlay className="fixed inset-0 z-modal-backdrop bg-bg/60 backdrop-blur-sm animate-in fade-in duration-300" />
        
        <Dialog.Content className={cn(
          "fixed z-modal bg-surface border border-border shadow-2xl overflow-hidden flex flex-col transition-all duration-300 outline-none",
          "inset-0 md:inset-10 lg:inset-20 md:rounded-4xl md:max-w-4xl md:mx-auto"
        )}>
          {localNote.isEncrypted && !isUnlocked ? (
            <NotePasswordGate 
              isEncrypted={true}
              isEncrypting={false}
              unlockPassword={unlockPassword}
              setUnlockPassword={setUnlockPassword}
              unlockError={unlockError}
              onUnlockSubmit={handleUnlockSubmit}
              onCancelUnlock={() => setSelectedNoteId(null)}
              encryptionPassword=""
              setEncryptionPassword={() => {}}
              confirmPassword=""
              setConfirmPassword={() => {}}
              encryptionError=""
              onEncryptSubmit={() => {}}
              onCancelEncrypt={() => {}}
            />
          ) : isEncrypting ? (
            <NotePasswordGate 
              isEncrypted={false}
              isEncrypting={true}
              unlockPassword=""
              setUnlockPassword={() => {}}
              unlockError=""
              onUnlockSubmit={() => {}}
              onCancelUnlock={() => {}}
              encryptionPassword={encryptionPassword}
              setEncryptionPassword={setEncryptionPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              encryptionError={encryptionError}
              onEncryptSubmit={handleEncryptSubmit}
              onCancelEncrypt={() => {
                setIsEncrypting(false);
                setEncryptionPassword("");
                setConfirmPassword("");
                setEncryptionError("");
              }}
            />
          ) : (
            <>
              <NoteHeader 
                localNote={localNote}
                isPreview={isPreview}
                setIsPreview={setIsPreview}
                onClose={() => setSelectedNoteId(null)}
                onUpdate={handleChange}
                onTogglePin={togglePin}
                onToggleArchive={toggleArchive}
                onToggleDelete={toggleDelete}
                onLock={lockNote}
                onEncrypt={() => setIsEncrypting(true)}
                onDecrypt={handleDecryptClick}
                onCopyCiphertext={handleCopyCiphertext}
              />

              <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 custom-scrollbar">
                <input
                  type="text"
                  value={localNote.title}
                  onChange={(e) => handleChange({ title: e.target.value })}
                  placeholder="Note Title"
                  className="w-full bg-transparent text-3xl md:text-4xl font-black tracking-tight text-text placeholder:text-text-4 outline-none border-none"
                />

                <div className="min-h-72">
                  {localNote.isChecklist ? (
                    <div className="space-y-3">
                      {localNote.checklistItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 group animate-in slide-in-from-left-4 duration-200">
                          <button
                            onClick={() => handleUpdateChecklistItem(item.id, { checked: !item.checked })}
                            aria-label={item.checked ? "Uncheck item" : "Check item"}
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
                            aria-label="Remove checklist item"
                            className="p-2 text-text-4 hover:text-error opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Trash size={14} />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={handleAddChecklistItem}
                        aria-label="Add new checklist item"
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
                    <div className="relative">
                      {/* Editor Toolbar */}
                      <div className="absolute top-2 right-2 flex items-center gap-2 z-content">
                        {speechSupported && (
                          <button
                            onClick={toggleListening}
                            className={cn(
                              "p-2 rounded-xl backdrop-blur-md border transition-all",
                              isListening 
                                ? "bg-error/20 border-error/50 text-error shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse" 
                                : "bg-surface/50 border-border text-text-muted hover:text-text hover:bg-surface"
                            )}
                            title={isListening ? "Stop Voice Note" : "Start Voice Note"}
                          >
                            {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                          </button>
                        )}
                        <OCRButton 
                          onResult={(text) => {
                            if (localNote) {
                              handleChange({ content: localNote.content + `\n\n> **OCR Extraction**:\n> ${text.split('\n').join('\n> ')}\n\n` });
                            }
                          }}
                        />
                        <button
                          onClick={() => setIsDrawingModalOpen(true)}
                          className="p-2 rounded-xl backdrop-blur-md bg-surface/50 border border-border text-text-muted hover:text-text hover:bg-surface transition-all"
                          title="Add Sketch"
                        >
                          <PenTool size={16} />
                        </button>
                      </div>

                      <FocusModeWrapper
                        toolId="notes"
                        toolName="Notepad"
                        wordCount={wordCount}
                        charCount={charCount}
                        lineCount={lineCount}
                        onFontSizeChange={setFontSize}
                        onWrapToggle={() => setWordWrap(v => !v)}
                      >
                        <textarea
                          value={localNote.content}
                          onChange={(e) => handleChange({ content: e.target.value })}
                          placeholder="Start writing your thoughts... (Markdown supported)"
                          className={`w-full h-full bg-transparent outline-none border-none text-lg text-text-2 leading-relaxed resize-none min-h-[400px] pt-12 ${wordWrap ? '' : 'whitespace-pre overflow-x-auto'}`}
                          style={{ fontSize: `${fontSize}px` }}
                        />
                      </FocusModeWrapper>
                    </div>
                  )}
                </div>
              </div>

              <div className="px-6 py-4 border-t border-border/50 bg-bg/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Hash size={14} className="text-text-4" />
                  {localNote.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="flex items-center gap-1 px-2 py-1 bg-blue/5 text-blue text-xs font-black rounded-lg uppercase tracking-widest border border-blue/10 group animate-in zoom-in-75"
                    >
                      {tag}
                      <button onClick={() => handleRemoveTag(tag)} aria-label={`Remove tag ${tag}`} className="hover:text-error">
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
                    className="bg-transparent text-tiny font-bold uppercase tracking-widest-sm text-text outline-none w-20 placeholder:text-text-4"
                  />
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6">
                  <span className="text-xs font-bold text-text-4 uppercase tracking-widest flex items-center gap-2">
                    <Sparkles size={12} className="text-blue" />
                    Updated {formatFullDate(localNote.updatedAt)}
                  </span>
                  <div className="flex items-center gap-1.5 text-text-4">
                    <CheckSquare size={14} className="text-success" />
                    <span className="text-xs font-bold uppercase tracking-widest">Saved</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
      
      {localNote && (
        <DrawingModal
          open={isDrawingModalOpen}
          onOpenChange={setIsDrawingModalOpen}
          onSave={(dataUrl) => {
            handleChange({
              content: localNote.content + `\n\n![Sketch](${dataUrl})\n\n`
            });
          }}
        />
      )}
    </Dialog.Root>
  );
}
