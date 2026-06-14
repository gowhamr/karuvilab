'use client';

import React from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { cn } from "@/src/lib/utils";

interface LogEntry {
  type: "log" | "error" | "warn" | "info";
  content: string;
  id: number;
}

interface ConsoleDrawerProps {
  isOpen: boolean;
  logs: LogEntry[];
  onClear: () => void;
}

export function ConsoleDrawer({ isOpen, logs, onClear }: ConsoleDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          className="absolute bottom-20 right-6 w-80 max-h-72 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-30"
        >
            <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between bg-white/5">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-light">Output Logs</span>
              <button 
                onClick={onClear} 
                className="text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-300"
                aria-label="Clear console logs"
              >
                Clear
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
              {logs.length === 0 && <p className="text-xs text-white/20 italic">No output yet...</p>}
              {logs.map(log => (
                <div key={log.id} className={cn(
                  "text-xs font-mono break-all",
                  log.type === "error" ? "text-red-400" : log.type === "warn" ? "text-yellow-400" : "text-blue-200"
                )}>
                    <span className="opacity-30 mr-2">[{log.type}]</span>
                    {log.content}
                </div>
              ))}
            </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
