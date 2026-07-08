"use client";

import { useCalendarStore } from "../store";
import { format, parseISO, startOfDay, endOfDay, differenceInMinutes, addHours } from "date-fns";
import { getEventsInInterval } from "../utils";
import { COLOR_MAP } from "../constants";
import { cn } from "@/src/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { computeEventPositions } from "../utils/layout-solver";

export function TimeGridView({ days }: { days: Date[] }) {
  const events = useCalendarStore(state => state.events);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const hours = Array.from({ length: 24 }, (_, i) => addHours(startOfDay(new Date()), i));

  return (
    <div className="flex-1 flex flex-col bg-surface/60 backdrop-blur-xl border border-border/30 rounded-2xl md:rounded-4xl overflow-hidden shadow-premium relative">
      {/* Scrollable Container for Mobile */}
      <div className="flex-1 flex flex-col overflow-x-auto no-scrollbar">
        <div className={cn(
          "flex flex-col min-w-full",
          days.length > 1 ? "md:min-w-0" : ""
        )} style={{ minWidth: days.length > 1 ? (typeof window !== 'undefined' && window.innerWidth < 768 ? '700px' : '1000px') : 'auto' }}>
          {/* Headers */}
          <div className="flex border-b border-border/30 bg-bg/50 sticky top-0 z-sidebar backdrop-blur-md">
            <div className="w-12 md:w-16 border-r border-border/20 flex-shrink-0" />
            <div className={cn("grid flex-1", days.length > 1 ? "grid-cols-7" : "grid-cols-1")}>
              {days.map(day => (
                <HeaderCell key={day.toISOString()} day={day} />
              ))}
            </div>
          </div>

          {/* Grid Content */}
          <div className="flex-1 overflow-y-auto no-scrollbar relative min-h-full">
            {/* Time Labels */}
            <div className="absolute top-0 left-0 bottom-0 w-12 md:w-16 border-r border-border/20 bg-bg/20 z-content">
              {hours.map(hour => (
                <div key={hour.toISOString()} className="h-20 px-1 md:px-2 pt-1 text-micro md:text-tiny font-black text-text-4 uppercase text-right">
                  {format(hour, 'h a')}
                </div>
              ))}
            </div>

            {/* Columns & Event Cards */}
            <div className={cn("grid flex-1 ml-12 md:ml-16 relative", days.length > 1 ? "grid-cols-7" : "grid-cols-1")}>
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
                const positionedEvents = computeEventPositions(dayEvents);
                const isToday = format(day, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd');

                return (
                  <div key={day.toISOString()} className="relative h-full border-r border-border/10 last:border-r-0">
                    {/* Current Time Indicator */}
                    {isToday && (
                      <div 
                        className="absolute left-0 right-0 border-t-2 border-red-500 z-above pointer-events-none flex items-center"
                        style={{ top: `${(now.getHours() * 60 + now.getMinutes()) / 1440 * 1920}px` }}
                      >
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500 -ml-1.25 shadow-glow-error" />
                      </div>
                    )}

                    {/* Event Cards */}
                    {positionedEvents.map(({ event, column, totalColumns }) => {
                      const start = parseISO(event.startDate);
                      const end = parseISO(event.endDate);
                      const startMin = start.getHours() * 60 + start.getMinutes();
                      const duration = differenceInMinutes(end, start);
                      
                      // Position calculations
                      const top = (startMin / 1440) * 1920;
                      const height = (duration / 1440) * 1920;

                      // Column width adjustments
                      const widthPercentage = 100 / totalColumns;
                      const leftOffset = column * widthPercentage;

                      return (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          onClick={() => {
                            const baseId = event.id.split(':')[0] || null;
                            useCalendarStore.getState().setSelectedEvent(baseId);
                          }}
                          className={cn(
                            "absolute rounded-2xl p-3 border shadow-md cursor-pointer z-content overflow-hidden group hover:z-sidebar transition-all hover:shadow-xl hover:scale-102",
                            (COLOR_MAP as any)[event.color].bg,
                            (COLOR_MAP as any)[event.color].border,
                            (COLOR_MAP as any)[event.color].text
                          )}
                          style={{ 
                            top: `${top}px`, 
                            height: `${Math.max(height, 35)}px`,
                            left: `calc(${leftOffset}% + 4px)`,
                            width: `calc(${widthPercentage}% - 8px)`
                          }}
                        >
                          <div className="text-xs font-black truncate">{event.title}</div>
                          {duration >= 45 && (
                            <div className="text-tiny font-bold opacity-70 mt-0.5">
                              {format(start, 'h:mm a')}
                            </div>
                          )}
                          {duration >= 60 && event.location && (
                            <div className="text-tiny font-medium opacity-60 mt-1 truncate flex items-center gap-1.5">
                              <span className="text-xs">📍</span> {event.location}
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
      </div>
    </div>
  );
}

function HeaderCell({ day }: { day: Date }) {
  const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="py-3 md:py-5 text-center border-r border-border/20 last:border-r-0 relative group">
      <span className="text-tiny md:text-tiny font-bold uppercase tracking-widest-sm-md md:tracking-widest-lg text-text-4 block mb-1 md:mb-1.5">
        {format(day, 'EEE')}
      </span>
      <div className="flex flex-col items-center">
        <span className={cn(
          "w-8 h-8 md:w-10 md:h-10 inline-flex items-center justify-center rounded-xl md:rounded-2xl text-sm md:text-base font-black transition-all",
          isToday
            ? "bg-indigo-600 text-white shadow-lg md:shadow-xl shadow-indigo-500/40"
            : "text-text-2 group-hover:text-indigo-600 group-hover:bg-indigo-500/5"
        )}>
          {format(day, 'd')}
        </span>
      </div>
    </div>
  );
}
