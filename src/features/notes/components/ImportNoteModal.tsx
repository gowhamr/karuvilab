"use client";

import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, KeyRound, Clipboard, CheckCircle2, ChevronRight, Download } from "lucide-react";
import { decryptData } from "../crypto";
import { generateId } from "../utils";
import { Note } from "../types";
import { useNotesStore } from "../store";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/src/lib/utils";

interface ImportNoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImportNoteModal({ open, onOpenChange }: ImportNoteModalProps) {
  const addNote = useNotesStore(state => state.addNote);
  const encryptNote = useNotesStore(state => state.encryptNote);
  const { toast } = useToast();

  const [ciphertext, setCiphertext] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  // Preview of decrypted note
  const [decryptedNote, setDecryptedNote] = useState<{
    title: string;
    content: string;
    tags: string[];
    isChecklist: boolean;
    checklistItems: any[];
  } | null>(null);

  const handleDecrypt = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setDecryptedNote(null);

    if (!ciphertext.trim()) {
      setError("Please paste the encrypted ciphertext.");
      return;
    }
    if (!password) {
      setError("Please enter the decryption password.");
      return;
    }

    try {
      const decryptedString = await decryptData(ciphertext.trim(), password);
      const parsed = JSON.parse(decryptedString);
      
      if (typeof parsed.title !== "string" || typeof parsed.content !== "string") {
        throw new Error("Invalid note data structure");
      }

      setDecryptedNote(parsed);
      toast("Note decrypted successfully!", "success");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Decryption failed. Check the password or ciphertext.");
    }
  };

  const handleImport = async (saveEncrypted: boolean) => {
    if (!decryptedNote) return;

    try {
      const id = generateId();
      
      if (saveEncrypted) {
        // Add note first
        await addNote({
          id,
          title: decryptedNote.title,
          content: decryptedNote.content,
          tags: decryptedNote.tags,
          isChecklist: decryptedNote.isChecklist,
          checklistItems: decryptedNote.checklistItems,
          pinned: false,
          isArchived: false,
          isDeleted: false,
        });
        
        // Encrypt with the same password
        await encryptNote(id, password);
        toast("Imported note securely (encrypted)", "success");
      } else {
        await addNote({
          id,
          title: decryptedNote.title,
          content: decryptedNote.content,
          tags: decryptedNote.tags,
          isChecklist: decryptedNote.isChecklist,
          checklistItems: decryptedNote.checklistItems,
          pinned: false,
          isArchived: false,
          isDeleted: false,
        });
        toast("Imported note (unencrypted)", "success");
      }

      // Reset & Close
      setCiphertext("");
      setPassword("");
      setDecryptedNote(null);
      onOpenChange(false);
    } catch (err) {
      toast("Failed to import note", "error");
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setCiphertext(text);
        toast("Clipboard text pasted!", "info");
      }
    } catch (err) {
      toast("Clipboard access blocked. Please paste manually.", "warn");
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[400] bg-bg/60 backdrop-blur-sm animate-in fade-in duration-300" />
        
        <Dialog.Content className={cn(
          "fixed z-[401] bg-surface border border-border shadow-2xl overflow-hidden flex flex-col transition-all duration-300 outline-none",
          "inset-0 md:inset-x-10 md:top-20 md:bottom-auto md:max-w-2xl md:mx-auto md:rounded-4xl"
        )}>
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-bg/30">
            <div className="flex items-center gap-2">
              <KeyRound className="text-blue" size={20} />
              <h3 className="text-lg font-black text-text uppercase tracking-widest">Decrypt & Import Note</h3>
            </div>
            <Dialog.Close className="p-2 hover:bg-surface hover:text-text rounded-xl text-text-3 transition-all active:scale-90">
              <X size={20} />
            </Dialog.Close>
          </div>

          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
            {!decryptedNote ? (
              <form onSubmit={handleDecrypt} className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-black uppercase tracking-widest text-text-3">Ciphertext</label>
                    <button
                      type="button"
                      onClick={handlePaste}
                      className="flex items-center gap-1.5 text-xs text-blue hover:text-blue/80 font-bold"
                    >
                      <Clipboard size={14} />
                      Paste
                    </button>
                  </div>
                  <textarea
                    value={ciphertext}
                    onChange={(e) => setCiphertext(e.target.value)}
                    placeholder="Paste the 'KVSECURE:...' encrypted text here"
                    className="w-full h-32 bg-bg border border-border rounded-2xl p-4 text-sm font-mono focus:outline-none focus:border-blue/50 focus:ring-4 focus:ring-blue/5 transition-all resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-text-3">Decryption Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter the password used to encrypt the note"
                    className="w-full bg-bg border border-border rounded-2xl py-3 px-4 text-sm focus:outline-none focus:border-blue/50 focus:ring-4 focus:ring-blue/5 transition-all"
                  />
                </div>

                {error && (
                  <p className="text-xs text-error font-semibold">{error}</p>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-blue hover:bg-blue/90 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-blue/20 flex items-center justify-center gap-2"
                >
                  Decrypt Note
                  <ChevronRight size={14} />
                </button>
              </form>
            ) : (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="bg-bg/50 border border-border rounded-2xl p-5 space-y-4">
                  <div className="flex items-start gap-2 border-b border-border/30 pb-3">
                    <CheckCircle2 className="text-success shrink-0 mt-0.5" size={18} />
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-wider text-text-3">Decrypted Note Preview</h4>
                      <h3 className="text-xl font-bold text-text mt-1">{decryptedNote.title || "Untitled Note"}</h3>
                    </div>
                  </div>

                  <div className="text-sm text-text-2 max-h-48 overflow-y-auto custom-scrollbar leading-relaxed whitespace-pre-wrap">
                    {decryptedNote.isChecklist ? (
                      <div className="space-y-1.5">
                        {decryptedNote.checklistItems.map((item: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-2 text-xs">
                            <input type="checkbox" checked={item.checked} readOnly className="pointer-events-none rounded" />
                            <span className={cn(item.checked && "line-through italic text-text-4")}>{item.text}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      decryptedNote.content || "No content"
                    )}
                  </div>

                  {decryptedNote.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {decryptedNote.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-blue/5 text-blue text-xs font-bold rounded uppercase tracking-wider">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setDecryptedNote(null)}
                    className="flex-1 py-3 border border-border bg-transparent text-text-3 hover:text-text hover:bg-bg/50 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                  >
                    Back to edit
                  </button>
                  <button
                    onClick={() => handleImport(false)}
                    className="flex-1 py-3 border border-blue/20 bg-blue/5 text-blue hover:bg-blue/10 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                  >
                    Import Decrypted
                  </button>
                  <button
                    onClick={() => handleImport(true)}
                    className="flex-1 py-3 bg-blue hover:bg-blue/90 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-blue/20 flex items-center justify-center gap-1.5"
                  >
                    <Download size={14} />
                    Import Encrypted
                  </button>
                </div>
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
