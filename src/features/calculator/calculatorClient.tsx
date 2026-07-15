"use client";

import React, { useEffect, useCallback, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { CalculatorDisplay } from './components/CalculatorDisplay';
import { StandardKeypad } from './components/StandardKeypad';
import { ScientificKeypad } from './components/ScientificKeypad';
import { HistoryPanel } from './components/HistoryPanel';
import { useCalculatorStore } from './store';
import { History, Maximize2, Minimize2 } from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';

export default function CalculatorClient() {
  const { mode, setMode, toggleHistory, append, calculate, deleteLast, clear } = useCalculatorStore(
    useShallow(s => ({
      mode: s.mode,
      setMode: s.setMode,
      toggleHistory: s.toggleHistory,
      append: s.append,
      calculate: s.calculate,
      deleteLast: s.deleteLast,
      clear: s.clear
    }))
  );
  const [isLandscape, setIsLandscape] = useState(false);

  // Responsive mode switching
  useEffect(() => {
    const handleResize = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keyboard Shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    
    const key = e.key;
    if (/[0-9]/.test(key)) { append(key); e.preventDefault(); }
    else if (['+', '-', '*', '/', '(', ')', '%', '.', '^'].includes(key)) { append(key); e.preventDefault(); }
    else if (key === 'Enter' || key === '=') { calculate(); e.preventDefault(); }
    else if (key === 'Backspace') { deleteLast(); e.preventDefault(); }
    else if (key === 'Escape') { clear(); e.preventDefault(); }
    else if (key === 'p') { append('pi'); e.preventDefault(); }
    else if (key === 'e') { append('e'); e.preventDefault(); }
  }, [append, calculate, deleteLast, clear]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const toggleScientific = () => {
    setMode(mode === 'standard' ? 'scientific' : 'standard');
  };

  const isScientific = mode === 'scientific' || isLandscape;

  return (
    <div className="relative w-full max-w-4xl mx-auto h-[700px] max-h-[85vh] bg-surface rounded-3xl overflow-hidden shadow-2xl border border-border flex flex-col md:flex-row">
      <div className="flex-1 flex flex-col p-4 space-y-4">
        {/* Header Controls */}
        <div className="flex justify-between items-center px-2">
          <button 
            onClick={toggleScientific}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface hover:bg-surface-2 border border-border text-xs font-semibold text-text-primary transition-colors"
          >
            {isScientific ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            {isScientific ? 'Standard' : 'Scientific'}
          </button>
          
          <button
            onClick={toggleHistory}
            className="p-2 rounded-full bg-surface hover:bg-surface-2 border border-border text-text-primary transition-colors"
            title="History"
          >
            <History className="w-4 h-4" />
          </button>
        </div>

        {/* Display */}
        <CalculatorDisplay />

        {/* Keypads Area */}
        <div className={`flex-1 flex gap-4 min-h-0 relative ${isLandscape ? 'flex-row' : 'flex-col sm:flex-row'}`}>
          <AnimatePresence initial={false}>
            {isScientific && (
              <m.div
                key="scientific"
                initial={{ opacity: 0, scale: 0.9, flex: 0 }}
                animate={{ opacity: 1, scale: 1, flex: 1 }}
                exit={{ opacity: 0, scale: 0.9, flex: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="h-full min-w-[280px] origin-right"
              >
                <ScientificKeypad />
              </m.div>
            )}
          </AnimatePresence>

          <m.div layout className="flex-1 h-full min-w-[280px]">
            <StandardKeypad />
          </m.div>
        </div>
      </div>

      {/* History Panel */}
      <AnimatePresence>
        <HistoryPanel />
      </AnimatePresence>
    </div>
  );
}
