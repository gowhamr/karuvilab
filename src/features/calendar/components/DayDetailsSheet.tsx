"use client";

import { useCalendarStore } from "../store";
import { format, isSameDay, parseISO } from "date-fns";
import { X, Plus, MapPin, AlignLeft, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { COLOR_MAP } from "../constants";
import { getFestivalsForDay, getObservancesForDay } from "../utils";
import { cn } from "@/src/lib/utils";

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
  const { events, setSelectedEvent } = useCalendarStore();
  const dayEvents = events.filter(e => isSameDay(parseISO(e.startDate), date));
  const festivals = getFestivalsForDay(date);
  const observances = getObservancesForDay(date);

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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 md:hidden"
          />
          
          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border rounded-t-[40px] z-50 p-8 shadow-2xl max-h-[85vh] overflow-y-auto no-scrollbar md:hidden"
          >
            {/* Handle */}
            <div className="w-12 h-1.5 bg-border/40 rounded-full mx-auto mb-8" />

            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black text-text">{format(date, 'EEEE, d')}</h2>
                <p className="text-sm font-bold text-text-4 uppercase tracking-widest">{format(date, 'MMMM yyyy')}</p>
              </div>
              <button 
                onClick={() => onAddEvent(date)}
                className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30"
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Festivals */}
              {festivals.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500/60 ml-2">Festivals</h3>
                  {festivals.map((f, i) => (
                    <div key={i} className="bg-amber-500/5 border border-amber-500/10 p-4 rounded-3xl flex items-center gap-4">
                      <span className="text-2xl">{f.emoji}</span>
                      <span className="text-sm font-black text-amber-700 dark:text-amber-400">{f.name}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Personal Events */}
              <div className="space-y-3">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500/60 ml-2">Your Schedule</h3>
                {dayEvents.length === 0 ? (
                  <p className="text-sm text-text-4 italic ml-2">No events scheduled</p>
                ) : (
                  <div className="space-y-3">
                    {dayEvents.map(event => (
                      <div 
                        key={event.id}
                        onClick={() => {
                          setSelectedEvent(event.id);
                          onAddEvent(date);
                          onClose();
                        }}
                        className="bg-surface border border-border/40 p-5 rounded-[32px] flex items-center gap-5 active:scale-[0.98] transition-all"
                      >
                        <div className="w-1.5 h-10 rounded-full" style={{ backgroundColor: COLOR_MAP[event.color].hex }} />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-base font-black text-text truncate">{event.title}</h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] font-bold text-text-4 flex items-center gap-1 uppercase tracking-tighter">
                              <Clock className="w-3 h-3" /> {event.allDay ? 'All Day' : format(parseISO(event.startDate), 'h:mm a')}
                            </span>
                            {event.location && (
                              <span className="text-[10px] font-bold text-text-4 flex items-center gap-1 uppercase tracking-tighter truncate">
                                <MapPin className="w-3 h-3" /> {event.location}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Close button for safety */}
            <button 
              onClick={onClose}
              className="mt-12 w-full py-4 rounded-[24px] bg-bg border border-border text-[10px] font-black uppercase tracking-[0.3em] text-text-4"
            >
              Close
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
