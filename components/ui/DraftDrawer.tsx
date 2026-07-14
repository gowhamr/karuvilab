"use client";

import React, { useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { useDraftStore } from '@/src/store/useDraftStore';
import { useShallow } from 'zustand/react/shallow';
import { X, Copy, Trash2, Send, Save } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { useFocusTrap } from '@/src/lib/a11y/useFocusTrap';

export function DraftDrawer() {
  const { isOpen, setIsOpen, drafts, removeDraft, clearDrafts } = useDraftStore(
    useShallow((s) => ({
      isOpen: s.isOpen,
      setIsOpen: s.setIsOpen,
      drafts: s.drafts,
      removeDraft: s.removeDraft,
      clearDrafts: s.clearDrafts,
    }))
  );
  const { toast } = useToast();
  const drawerRef = useRef<HTMLDivElement>(null);
  useFocusTrap(drawerRef, isOpen);

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast("Draft copied to clipboard", "success");
  };

  const handleSendToTool = (content: string) => {
    navigator.clipboard.writeText(content);
    toast("Copied to clipboard. Paste in any tool.", "success");
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-modal-backdrop bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <m.div
            ref={drawerRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            role="dialog"
            aria-modal="true"
            aria-label="Drafts and Scratchpad"
            className="fixed top-0 right-0 bottom-0 w-full md:w-[400px] z-modal bg-bg border-l border-border shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Save className="w-5 h-5 text-brand-primary" />
                Drafts & Scratchpad
              </h2>
              <div className="flex items-center gap-2">
                {drafts.length > 0 && (
                  <button
                    onClick={() => clearDrafts()}
                    className="p-2 text-text-4 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Clear all drafts"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-text-4 hover:text-text hover:bg-surface rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {drafts.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-text-4 opacity-50">
                  <Save className="w-12 h-12" />
                  <p>No drafts yet.<br />Save snippets from any tool to use them later.</p>
                </div>
              ) : (
                drafts.map(draft => (
                  <div key={draft.id} className="bg-surface rounded-xl border border-border p-3 space-y-3 group">
                    <div className="flex items-center justify-between text-xs text-text-4">
                      <span>{new Date(draft.timestamp).toLocaleString()}</span>
                      {draft.sourceToolId && <span className="uppercase tracking-wider">{draft.sourceToolId}</span>}
                    </div>
                    <div className="relative">
                      <pre className="text-sm font-mono text-text bg-bg p-3 rounded-lg overflow-hidden max-h-32 text-ellipsis">
                        {draft.content}
                      </pre>
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-border opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleCopy(draft.content)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-text-3 hover:text-text hover:bg-bg transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" /> Copy
                      </button>
                      <button
                        onClick={() => handleSendToTool(draft.content)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-blue bg-blue/10 hover:bg-blue/20 transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" /> Use
                      </button>
                      <button
                        onClick={() => removeDraft(draft.id)}
                        className="p-1.5 rounded-lg text-text-4 hover:text-red-500 hover:bg-red-500/10 transition-colors ml-auto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </m.div>
        </>
      )}
    </AnimatePresence>
  );
}
