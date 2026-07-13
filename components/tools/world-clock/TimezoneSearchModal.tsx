"use client";

import React, { useState, useMemo } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Search, X, Globe, Plus } from 'lucide-react';
import { getAllTimezones, COMMON_CITIES } from '@/src/lib/timezone-data';
import { useWorldClockStore } from '@/src/features/world-clock/store';

interface TimezoneSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * A full-screen modal for searching and adding timezones.
 * Provides a focused, keyboard-friendly search experience.
 */
export const TimezoneSearchModal: React.FC<TimezoneSearchModalProps> = React.memo(({ isOpen, onClose }) => {
  const [search, setSearch] = useState('');
  const addClock = useWorldClockStore(state => state.addClock);

  const allZones = useMemo(() => getAllTimezones(), []);

  const filteredZones = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return COMMON_CITIES;

    return allZones
      .filter(z => 
        z.city.toLowerCase().includes(q) || 
        z.country?.toLowerCase().includes(q) || 
        z.tz.toLowerCase().replace(/_/g, ' ').includes(q)
      )
      .slice(0, 50);
  }, [search, allZones]);

  const handleAddClock = (zone: { city: string; country: string | undefined; tz: string }) => {
    addClock({ 
      id: Math.random().toString(36).substring(7),
      city: zone.city, 
      country: zone.country || '', 
      tz: zone.tz 
    });
    setSearch('');
    onClose();
  };

  return (
    <AnimatePresence>
      {/* NOTE: z-modal shared across modal overlays (SearchOverlay, QRModal, TimezoneSearchModal, SessionRestoredBanner). Safe because only one modal renders at a time. */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-modal-backdrop bg-black/80 backdrop-blur-lg cursor-pointer"
            onClick={onClose}
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-modal flex items-start justify-center p-4 sm:p-16 pointer-events-none">
            <m.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              className="w-full max-w-2xl bg-surface border border-border rounded-3xl shadow-2xl flex flex-col max-h-tool-viewport-lg pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 flex items-center justify-between border-b border-border">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-blue" />
                  <h2 className="text-lg font-black text-text">Add Timezone</h2>
                </div>
                <button 
                  onClick={onClose} 
                  className="min-w-11 min-h-11 text-text-4 hover:text-text rounded-full transition-colors flex items-center justify-center"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search input */}
              <div className="p-6 border-b border-border bg-bg/50">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-4" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by city, country or time zone..."
                    className="w-full pl-12 pr-4 h-12 bg-surface border border-border rounded-2xl text-sm font-bold text-text placeholder-text-4 focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue/15 transition-all outline-none"
                    autoFocus
                  />
                </div>
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-2">
                <AnimatePresence mode="popLayout">
                  {filteredZones.length > 0 ? (
                    <m.ul className="space-y-1">
                      {filteredZones.map((zone, idx) => (
                        <m.li
                          key={zone.tz}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2, delay: Math.min(idx * 0.02, 0.2) }}
                          className="overflow-hidden rounded-2xl"
                        >
                          <button
                            onClick={() => handleAddClock(zone)}
                            className="w-full flex items-center justify-between p-4 bg-surface-2 hover:bg-surface border border-transparent hover:border-border rounded-2xl transition-all text-left group"
                          >
                            <div>
                              <p className="text-base font-bold text-text group-hover:text-blue">{zone.city}</p>
                              <p className="text-xs text-text-4">{zone.country || ''}</p>
                            </div>
                            <div className="flex items-center gap-4">
                              <p className="text-xs font-mono text-text-4">{zone.tz.replace(/_/g, ' ')}</p>
                              <Plus className="w-5 h-5 text-text-4 group-hover:text-blue transition-transform group-hover:scale-125" />
                            </div>
                          </button>
                        </m.li>
                      ))}
                    </m.ul>
                  ) : (
                    <m.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-12"
                    >
                      <p className="font-bold text-text">No results found.</p>
                      <p className="text-sm text-text-4">Try a different search term.</p>
                    </m.div>
                  )}
                </AnimatePresence>
              </div>
            </m.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
});

TimezoneSearchModal.displayName = "TimezoneSearchModal";
