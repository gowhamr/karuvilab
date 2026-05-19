"use client";

import { useCalendarStore } from "../store";
import { format, parseISO, startOfDay, endOfDay, differenceInMinutes, addHours } from "date-fns";
import { getEventsInInterval } from "../utils";
import { COLOR_MAP } from "../constants";
import { cn } from "@/src/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTamilCalendar } from "../hooks/useTamilCalendar";

export function TimeGridView({ days }: { days: Date[] }) {
  const { events, tamilModeEnabled } = useCalendarStore();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const hours = Array.from({ length: 24 }, (_, i) => addHours(startOfDay(new Date()), i));

  return (
    <div className="flex-1 flex flex-col bg-surface border border-border/40 rounded-[32px] overflow-hidden shadow-premium relative">
      {/* Headers */}
      <div className="flex border-b border-border/40 bg-bg/50">
        <div className="w-16 border-r border-border/20 flex-shrink-0" />
        <div className={cn("grid flex-1", days.length > 1 ? "grid-cols-7" : "grid-cols-1")}>
          {days.map(day => (
            <HeaderCell key={day.toISOString()} day={day} tamilModeEnabled={tamilModeEnabled} />
          ))}
        </div>
      </div>

      {/* Grid Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar relative min-h-[600px]">
        {/* Time Labels */}
        <div className="absolute top-0 left-0 bottom-0 w-16 border-r border-border/20 bg-bg/20 z-10">
          {hours.map(hour => (
            <div key={hour.toISOString()} className="h-[80px] px-2 pt-1 text-[9px] font-black text-text-4 uppercase text-right">
              {format(hour, 'h a')}
            </div>
          ))}
        </div>

        {/* Columns & Event Cards */}
        <div className={cn("grid flex-1 ml-16 relative", days.length > 1 ? "grid-cols-7" : "grid-cols-1")}>
          {/* Background Lines */}
          {hours.map((hour, i) => (
            <div
              key={hour.toISOString()}
              className="absolute left-0 right-0 border-b border-border/10"
              style={{ top: `${i * 80}px`, height: '80px' }}
            />
          ))}

          {/* Day Columns */}
          {days.map(day => {
            const dayEvents = getEventsInInterval(startOfDay(day), endOfDay(day), events);
            const isToday = format(day, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd');

            return (
              <div key={day.toISOString()} className="relative h-[1920px] border-r border-border/10 last:border-r-0">
                {/* Current Time Indicator */}
                {isToday && (
                  <div 
                    className="absolute left-0 right-0 border-t-2 border-red-500 z-20 pointer-events-none flex items-center"
                    style={{ top: `${(now.getHours() * 60 + now.getMinutes()) / 1440 * 1920}px` }}
                  >
                    <div className="w-2 h-2 rounded-full bg-red-500 -ml-1 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                  </div>
                )}

                {/* Event Cards */}
                {dayEvents.map(event => {
                  const start = parseISO(event.startDate);
                  const end = parseISO(event.endDate);
                  const startMin = start.getHours() * 60 + start.getMinutes();
                  const duration = differenceInMinutes(end, start);
                  
                  // Position calculations
                  const top = (startMin / 1440) * 1920;
                  const height = (duration / 1440) * 1920;

                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={() => {
                        useCalendarStore.getState().setSelectedEvent(event.id);
                        // This usually triggers the modal in CalendarPage
                      }}
                      className={cn(
                        "absolute left-1 right-1 rounded-xl p-2 border shadow-sm cursor-pointer z-10 overflow-hidden group hover:z-30 transition-all hover:shadow-lg",
                        COLOR_MAP[event.color].bg,
                        COLOR_MAP[event.color].border,
                        COLOR_MAP[event.color].text
                      )}
                      style={{ top: `${top}px`, height: `${Math.max(height, 30)}px` }}
                    >
                      <div className="text-[10px] font-black truncate">{event.title}</div>
                      {duration >= 45 && (
                        <div className="text-[8px] font-bold opacity-60 mt-0.5">
                          {format(start, 'h:mm a')}
                        </div>
                      )}
                      {duration >= 60 && event.location && (
                        <div className="text-[8px] font-medium opacity-50 mt-1 truncate flex items-center gap-1">
                          📍 {event.location}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function HeaderCell({ day, tamilModeEnabled }: { day: Date, tamilModeEnabled: boolean }) {
  const tamil = useTamilCalendar(day);
  const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="py-4 text-center border-r border-border/20 last:border-r-0 relative group">
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-4 block mb-1">
        {tamilModeEnabled ? tamil.weekday : format(day, 'EEE')}
      </span>
      <div className="flex flex-col items-center">
        <span className={cn(
          "w-8 h-8 inline-flex items-center justify-center rounded-xl text-sm font-black transition-all",
          isToday
            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
            : "text-text-2 group-hover:text-indigo-600"
        )}>
          {format(day, 'd')}
        </span>
        {tamilModeEnabled && (
          <span className="text-[9px] font-bold text-indigo-500/60 mt-1">
            {tamil.day} ({tamil.tamilDayNumeral})
          </span>
        )}
      </div>
    </div>
  );
}
