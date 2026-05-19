"use client";

import { useCalendarStore } from "../store";
import { format, parseISO, isSameDay, isToday, isTomorrow } from "date-fns";
import { COLOR_MAP } from "../constants";
import { cn } from "@/src/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function AgendaView() {
  const { events } = useCalendarStore();
  
  // Sort events by date
  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  // Group events by day
  const groups: Record<string, typeof events> = {};
  sortedEvents.forEach(event => {
    const date = format(parseISO(event.startDate), 'yyyy-MM-dd');
    if (!groups[date]) groups[date] = [];
    groups[date].push(event);
  });

  const groupDates = Object.keys(groups).sort();

  if (sortedEvents.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 bg-surface border border-border/40 rounded-[32px] text-center space-y-4 shadow-premium">
        <div className="w-20 h-20 rounded-[28px] bg-indigo-500/5 flex items-center justify-center text-indigo-500/20">
          <span className="text-5xl">📅</span>
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-black text-text">No upcoming events</h3>
          <p className="text-sm text-text-4 max-w-xs font-medium">Your agenda is clear. Create a new event to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar space-y-8 pb-12">
      {groupDates.map(dateStr => {
        const date = parseISO(dateStr);
        const dayEvents = groups[dateStr]!;
        
        let label = format(date, 'EEEE, MMMM d');
        if (isToday(date)) label = 'Today';
        else if (isTomorrow(date)) label = 'Tomorrow';

        return (
          <div key={dateStr} className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500/60 ml-4">
              {label}
            </h3>
            
            <div className="space-y-2">
              <AnimatePresence>
                {dayEvents.map(event => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group bg-surface border border-border/40 p-4 rounded-3xl flex items-center gap-6 hover:border-indigo-500/30 transition-all shadow-sm"
                  >
                    <div className="w-16 flex-shrink-0 text-center">
                      <div className="text-xs font-black text-text tabular-nums">
                        {event.allDay ? 'All Day' : format(parseISO(event.startDate), 'h:mm')}
                      </div>
                      {!event.allDay && (
                        <div className="text-[10px] font-bold text-text-4 uppercase tracking-tighter">
                          {format(parseISO(event.startDate), 'a')}
                        </div>
                      )}
                    </div>

                    <div className="w-1 h-10 rounded-full" style={{ backgroundColor: COLOR_MAP[event.color].hex }} />

                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-black text-text truncate group-hover:text-indigo-600 transition-colors">
                        {event.title}
                      </h4>
                      {event.location && (
                        <p className="text-[10px] font-bold text-text-4 truncate uppercase tracking-widest mt-0.5">
                          📍 {event.location}
                        </p>
                      )}
                    </div>

                    <div className={cn(
                      "px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border opacity-0 group-hover:opacity-100 transition-all",
                      COLOR_MAP[event.color].bg,
                      COLOR_MAP[event.color].border,
                      COLOR_MAP[event.color].text
                    )}>
                      View Details
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        );
      })}
    </div>
  );
}
