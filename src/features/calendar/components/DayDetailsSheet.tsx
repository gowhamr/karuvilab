"use client";

import { useCalendarStore } from "../store";
import { format, isSameDay, parseISO } from "date-fns";
import { X, Plus, MapPin, AlignLeft, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { COLOR_MAP } from "../constants";
import { getFestivalsForDay, getObservancesForDay } from "../utils";
import { cn } from "@/src/lib/utils";
import { WorldEvent } from "../world-events-db";

export function DayDetailsSheet({ 
  date, 
  isOpen, 
  onClose, 
  onAddEvent 
}: { 
  date: Date; 
  isOpen: boolean; 
  onClose: () => void;
  onAddEvent: (date: Date) => void;
}) {
  const events = useCalendarStore(state => state.events);
  const setSelectedEvent = useCalendarStore(state => state.setSelectedEvent);
  const setSelectedWorldEvent = useCalendarStore(state => state.setSelectedWorldEvent);
  
  const showWorldEvents = useCalendarStore(state => state.worldEventsSettings.showWorldEvents);
  const showCategories = useCalendarStore(state => state.worldEventsSettings.showCategories);
  const showImportance = useCalendarStore(state => state.worldEventsSettings.showImportance);
  const highlightIndianEvents = useCalendarStore(state => state.worldEventsSettings.highlightIndianEvents);

  const dayEvents = events.filter(e => isSameDay(parseISO(e.startDate), date));
  const festivals = getFestivalsForDay(date);
  const observances = getObservancesForDay(date);

  const combinedEvents = showWorldEvents ? [...festivals, ...observances].filter(e => 
    showCategories.includes(e.category) && 
    showImportance.includes(e.importance)
  ) : [];

  const sortedWorldEvents = [...combinedEvents].sort((a, b) => {
    if (highlightIndianEvents) {
      const aIsIndian = a.globalReach === 'india-specific' || a.category.startsWith('indian');
      const bIsIndian = b.globalReach === 'india-specific' || b.category.startsWith('indian');
      if (aIsIndian && !bIsIndian) return -1;
      if (!aIsIndian && bIsIndian) return 1;
    }
    const importanceOrder = { major: 0, moderate: 1, minor: 2 };
    return importanceOrder[a.importance] - importanceOrder[b.importance];
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-surface/20 backdrop-blur-md z-50 md:hidden"
          />
          
          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
            className="fixed bottom-0 left-0 right-0 bg-surface/80 backdrop-blur-2xl border-t border-border/30 rounded-t-[48px] z-50 p-10 shadow-[0_-20px_80px_rgba(0,0,0,0.2)] max-h-[90vh] overflow-y-auto no-scrollbar md:hidden"
          >
            {/* Handle */}
            <div className="w-16 h-1.5 bg-indigo-500/10 rounded-full mx-auto mb-10" />

            <div className="flex items-center justify-between mb-10">
              <div className="space-y-1">
                <h2 className="text-3xl font-black tracking-tighter text-text">{format(date, 'EEEE, d')}</h2>
                <p className="text-xs font-bold text-text-4 uppercase tracking-[0.2em] opacity-60">{format(date, 'MMMM yyyy')}</p>
              </div>
              <button 
                onClick={() => onAddEvent(date)}
                className="w-14 h-14 rounded-3xl bg-indigo-600 text-white flex items-center justify-center shadow-2xl shadow-indigo-500/40 active:scale-90 transition-transform"
              >
                <Plus className="w-7 h-7" />
              </button>
            </div>

            <div className="space-y-10">
              {/* Festivals & Observances */}
              {sortedWorldEvents.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-[0.25em] text-indigo-500/40 ml-2">Today's Context</h3>
                  <div className="grid gap-3">
                    {sortedWorldEvents.map((f) => (
                      <div 
                        key={f.id} 
                        onClick={() => {
                          setSelectedWorldEvent({ event: f, date });
                          onClose();
                        }}
                        className={cn(
                          "border p-5 rounded-4xl flex items-center gap-5 shadow-sm active:scale-98 cursor-pointer transition-all",
                          f.colors.bg,
                          f.colors.border,
                          f.colors.text
                        )}
                      >
                        <span className="text-3xl drop-shadow-sm">{f.emoji}</span>
                        <span className="text-base font-black">{f.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Personal Events */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-[0.25em] text-indigo-500/40 ml-2">Schedule</h3>
                {dayEvents.length === 0 ? (
                  <div className="p-10 border-2 border-dashed border-border/20 rounded-5xl text-center space-y-3">
                    <div className="w-16 h-16 bg-indigo-500/5 rounded-3xl flex items-center justify-center mx-auto text-3xl">📭</div>
                    <p className="text-sm text-text-4 font-bold uppercase tracking-widest opacity-40">Zero Events</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {dayEvents.map(event => (
                      <motion.div 
                        key={event.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setSelectedEvent(event.id);
                          onAddEvent(date);
                          onClose();
                        }}
                        className="bg-surface/40 backdrop-blur-lg border border-border/40 p-6 rounded-4xl flex items-center gap-6 shadow-sm active:shadow-inner transition-all"
                      >
                        <div className="w-2 h-14 rounded-full shadow-sm" style={{ backgroundColor: (COLOR_MAP as any)[event.color].hex }} />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-lg font-black text-text truncate">{event.title}</h4>
                          <div className="flex flex-wrap items-center gap-4 mt-2">
                            <span className="text-xs font-bold text-text-4 flex items-center gap-2 uppercase tracking-tight">
                              <Clock className="w-3.5 h-3.5 text-indigo-500/60" /> {event.allDay ? 'All Day' : format(parseISO(event.startDate), 'h:mm a')}
                            </span>
                            {event.location && (
                              <span className="text-xs font-bold text-text-4 flex items-center gap-2 uppercase tracking-tight truncate">
                                <MapPin className="w-3.5 h-3.5 text-indigo-500/60" /> {event.location}
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button 
              onClick={onClose}
              className="mt-14 w-full py-5 rounded-4xl bg-bg/50 border border-border/30 text-xs font-black uppercase tracking-[0.3em] text-text-4 hover:bg-surface transition-colors"
            >
              Dismiss
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
