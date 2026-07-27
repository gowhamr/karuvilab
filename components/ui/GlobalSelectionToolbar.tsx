"use client";

import React, { useEffect, useState, useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Copy, Save, ArrowRight } from 'lucide-react';
import { useDraftStore } from '@/src/store/useDraftStore';
import { useSearchStore } from '@/src/store/useSearchStore';
import { useToast } from '@/components/ui/Toast';

export const GlobalSelectionToolbar = React.memo(function GlobalSelectionToolbar() {
  const [selection, setSelection] = useState<{ text: string; x: number; y: number } | null>(null);
  const addDraft = useDraftStore(s => s.addDraft);
  const setIsPaletteOpen = useSearchStore(s => s.setIsPaletteOpen);
  const setSearchQuery = useSearchStore(s => s.setSearchQuery);
  const { toast } = useToast();
  const isMouseDown = useRef(false);

  useEffect(() => {
    const handleMouseUp = () => {
      isMouseDown.current = false;
      setTimeout(() => {
        const sel = window.getSelection();
        if (sel && !sel.isCollapsed && sel.rangeCount > 0) {
          const text = sel.toString().trim();
          if (text.length > 0) {
            const range = sel.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            // Position above the selection
            setSelection({
              text,
              x: rect.left + rect.width / 2,
              y: rect.top - 10
            });
            return;
          }
        }
        setSelection(null);
      }, 50);
    };

    const handleMouseDown = () => {
      isMouseDown.current = true;
      setSelection(null);
    };

    const handleSelectionChange = () => {
      if (isMouseDown.current) return; // Wait until mouse up
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed) {
        setSelection(null);
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('selectionchange', handleSelectionChange);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);

  if (!selection) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(selection.text);
    toast("Copied to clipboard", "success");
    window.getSelection()?.removeAllRanges();
    setSelection(null);
  };

  const handleSaveDraft = () => {
    addDraft(selection.text, 'selection');
    toast("Saved to Drafts", "success");
    window.getSelection()?.removeAllRanges();
    setSelection(null);
  };

  const handleSendToTool = () => {
    // Copy the text to clipboard just in case
    navigator.clipboard.writeText(selection.text);
    // Pre-fill search with process command
    setSearchQuery(`> process ${selection.text.slice(0, 20)}...`);
    setIsPaletteOpen(true);
    window.getSelection()?.removeAllRanges();
    setSelection(null);
  };

  return (
    <AnimatePresence>
      <m.div
        initial={{ opacity: 0, y: 10, scale: 0.95, x: '-50%' }}
        animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
        exit={{ opacity: 0, scale: 0.95, y: 5, x: '-50%' }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="fixed z-dropdown flex items-center bg-surface border border-border shadow-xl shadow-black/10 rounded-xl p-1 gap-1"
        style={{
          left: selection.x,
          top: Math.max(10, selection.y - 40) // prevent going off top screen
        }}
        onMouseDown={e => { e.preventDefault(); e.stopPropagation(); }} // prevent selection loss on click
        onMouseUp={e => e.stopPropagation()} // prevent document from re-triggering selection
      >
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-text-3 hover:text-text hover:bg-bg rounded-lg transition-colors"
        >
          <Copy className="w-3.5 h-3.5" /> Copy
        </button>
        <div className="w-px h-4 bg-border mx-1" />
        <button
          onClick={handleSaveDraft}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-text-3 hover:text-text hover:bg-bg rounded-lg transition-colors"
        >
          <Save className="w-3.5 h-3.5" /> Draft
        </button>
        <div className="w-px h-4 bg-border mx-1" />
        <button
          onClick={handleSendToTool}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors"
        >
          <ArrowRight className="w-3.5 h-3.5" /> Send to Tool
        </button>
      </m.div>
    </AnimatePresence>
  );
});
