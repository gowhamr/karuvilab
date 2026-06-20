'use client';

import React from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { X, Trash2 } from 'lucide-react';

interface CdnOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  inputId: string;
  newCdn: string;
  setNewCdn: (val: string) => void;
  onAddCdn: () => void;
  cdns: string[];
  onRemoveCdn: (url: string) => void;
  onAddPreset: (url: string) => void;
}

export function CdnOverlay({
  isOpen,
  onClose,
  inputId,
  newCdn,
  setNewCdn,
  onAddCdn,
  cdns,
  onRemoveCdn,
  onAddPreset
}: CdnOverlayProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          className="absolute inset-0 z-above bg-surface dark:bg-black/90 p-6 flex flex-col space-y-6"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-widest text-text">
              <label htmlFor={inputId}>External Libraries</label>
            </h3>
            <button onClick={onClose} className="text-text-4 hover:text-blue" aria-label="Close libraries overlay">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex gap-2">
              <input 
                id={inputId}
                type="text" 
                placeholder="CDN URL (CSS or JS)..."
                className="flex-1 bg-bg border border-border rounded-xl px-4 py-2 text-xs outline-none focus:border-blue"
                value={newCdn}
                onChange={e => setNewCdn(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && onAddCdn()}
              />
              <button onClick={onAddCdn} className="px-4 bg-blue text-white rounded-xl text-xs font-bold" aria-label="Add library">Add</button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-2">
              {cdns.length === 0 && <p className="text-xs text-text-4 text-center py-8">No libraries added.</p>}
              {cdns.map(url => (
                <div key={url} className="flex items-center justify-between p-3 bg-bg border border-border rounded-xl">
                  <span className="text-xs font-mono truncate text-text-3 max-w-52">{url}</span>
                  <button onClick={() => onRemoveCdn(url)} className="text-text-4 hover:text-red-500 transition-colors" aria-label={`Remove ${url}`}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-border">
                <p className="text-xs font-bold text-text-4 uppercase mb-2">Common Presets</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: "Tailwind", url: "https://cdn.tailwindcss.com" },
                    { name: "Bootstrap", url: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" },
                    { name: "jQuery", url: "https://code.jquery.com/jquery-3.7.0.min.js" },
                    { name: "React", url: "https://unpkg.com/react@18/umd/react.development.js" }
                  ].map(lib => (
                    <button 
                      key={lib.name}
                      onClick={() => onAddPreset(lib.url)}
                      className="px-3 py-1.5 rounded-lg bg-blue/5 border border-blue/10 text-xs font-bold text-blue hover:bg-blue hover:text-white transition-all"
                      aria-label={`Add ${lib.name} library`}
                    >
                      + {lib.name}
                    </button>
                  ))}
                </div>
            </div>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
