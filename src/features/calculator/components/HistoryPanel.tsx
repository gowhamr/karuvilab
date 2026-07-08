import React from 'react';
import { useCalculatorStore } from '../store';
import { Trash2, Pin, PinOff, X } from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';

export const HistoryPanel = () => {
  const history = useCalculatorStore(s => s.history);
  const deleteHistory = useCalculatorStore(s => s.deleteHistory);
  const pinHistory = useCalculatorStore(s => s.pinHistory);
  const loadHistory = useCalculatorStore(s => s.loadHistory);
  const clearHistory = useCalculatorStore(s => s.clearHistory);
  const toggleHistory = useCalculatorStore(s => s.toggleHistory);
  const historyOpen = useCalculatorStore(s => s.historyOpen);

  if (!historyOpen) return null;

  return (
    <m.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="absolute right-0 top-0 bottom-0 w-80 bg-surface-2 border-l border-border shadow-2xl z-20 flex flex-col"
    >
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="font-bold text-text">History</h3>
        <div className="flex items-center gap-2">
          <button onClick={clearHistory} className="p-2 text-text-4 hover:text-red-500 rounded-xl hover:bg-red-500/10">
            <Trash2 className="w-4 h-4" />
          </button>
          <button onClick={toggleHistory} className="p-2 text-text-4 hover:text-text rounded-xl hover:bg-surface">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {history.length === 0 ? (
          <div className="text-center text-text-4 mt-8 text-sm">No history yet.</div>
        ) : (
          <AnimatePresence>
            {history.map(item => (
              <m.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-bg rounded-xl p-3 border border-border group cursor-pointer hover:border-brand-primary/50 transition-colors"
                onClick={() => loadHistory(item)}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs text-text-4">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); pinHistory(item.id); }}
                      className={`p-1.5 rounded-md hover:bg-surface ${item.isPinned ? 'text-brand-primary' : 'text-text-4'}`}
                    >
                      {item.isPinned ? <Pin className="w-3.5 h-3.5 fill-current" /> : <PinOff className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteHistory(item.id); }}
                      className="p-1.5 rounded-md text-text-4 hover:text-red-500 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="text-right text-text-3 text-sm font-mono truncate">{item.expression}</div>
                <div className="text-right text-text font-bold text-lg mt-1">{item.result}</div>
              </m.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </m.div>
  );
};
