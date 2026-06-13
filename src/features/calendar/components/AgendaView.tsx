"use client";

import { useCalendarStore } from "../store";
import { format, parseISO, isSameDay, isToday, isTomorrow } from "date-fns";
import { COLOR_MAP } from "../constants";
import { cn } from "@/src/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { getFestivalsForDay, getObservancesForDay } from "../utils";
import { addDays, startOfDay, eachDayOfInterval } from "date-fns";
import { CalendarEvent } from "../types";
import { WorldEvent } from "../world-events-db";


export function AgendaView() {
  const events = useCalendarStore(state => state.events);

  // Show next 14 days
  const today = startOfDay(new Date());
  const endDate = addDays(today, 14);
  const days = eachDayOfInterval({ start: today, end: endDate });

  const agendaDays = days.map(day => {
    const dayEvents = events.filter(e => isSameDay(parseISO(e.startDate), day));
    const festivals = getFestivalsForDay(day);
    const observances = getObservancesForDay(day);

    return {
      date: day,
      events: dayEvents,
      festivals,
      observances,
      hasContent: dayEvents.length > 0 || festivals.length > 0 || observances.length > 0
    };
  });

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar space-y-10 pb-12">
      {agendaDays.map(({ date, events: dayEvents, festivals, observances, hasContent }) => {
        if (!hasContent) return null;

        return (
          <AgendaDay 
            key={date.toISOString()}
            date={date}
            dayEvents={dayEvents}
            festivals={festivals}
            observances={observances}
          />
        );
      })}
    </div>
  );
}

function AgendaDay({ 
  date, 
  dayEvents, 
  festivals, 
  observances 
}: { 
  date: Date;
  dayEvents: CalendarEvent[];
  festivals: WorldEvent[];
  observances: WorldEvent[];
}) {
  let label = format(date, 'EEEE, MMMM d');
  if (isToday(date)) label = 'Today';
  else if (isTomorrow(date)) label = 'Tomorrow';

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-end ml-4">
        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-500/50">
          {label}
        </h2>
      </div>

      <div className="space-y-4">
        {/* Festivals and Observances */}
        {festivals.map((f, i) => (
          <div key={`f-${i}`} className="bg-amber-500/5 backdrop-blur-md border border-amber-500/10 p-4 md:p-6 rounded-2xl md:rounded-4xl flex items-center gap-4 md:gap-5 shadow-sm">
            <span className="text-2xl md:text-3xl drop-shadow-sm" aria-hidden="true">{f.emoji}</span>
            <div>
              <h3 className="text-sm md:text-base font-black text-amber-700 dark:text-amber-400">{f.name}</h3>
              <p className="text-tiny md:text-xs font-bold text-amber-600/60 uppercase tracking-widest mt-0.5">Festival</p>
            </div>
          </div>
        ))}

        {observances.map((o, i) => (
          <div key={`o-${i}`} className="bg-blue-500/5 backdrop-blur-md border border-blue-500/10 p-4 md:p-6 rounded-2xl md:rounded-4xl flex items-center gap-4 md:gap-5 shadow-sm">
            <span className="text-2xl md:text-3xl drop-shadow-sm" aria-hidden="true">{o.emoji}</span>
            <div>
              <h3 className="text-sm md:text-base font-black text-blue-700 dark:text-blue-400">{o.name}</h3>
              <p className="text-tiny md:text-xs font-bold text-blue-600/60 uppercase tracking-widest mt-0.5">Global Observance</p>
            </div>
          </div>
        ))}

        {/* Personal Events */}
        <AnimatePresence mode="popLayout">
          {dayEvents.map(event => (
            <motion.div
              key={event.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="group bg-surface/40 backdrop-blur-xl border border-border/30 p-4 md:p-6 rounded-2xl md:rounded-4xl flex items-center gap-4 md:gap-6 hover:border-indigo-500/30 transition-all shadow-md hover:shadow-xl active:scale-[0.98]"
            >
              <div className="w-14 md:w-20 flex-shrink-0 text-center border-r border-border/20 pr-4 md:pr-6">
                <div className="text-xs md:text-sm font-black text-text tabular-nums">
                  {event.allDay ? 'All Day' : format(parseISO(event.startDate), 'h:mm')}
                </div>
                {!event.allDay && (
                  <div className="text-micro md:text-xs font-bold text-text-4 uppercase tracking-wider mt-0.5">
                    {format(parseISO(event.startDate), 'a')}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-base md:text-lg font-black text-text truncate group-hover:text-indigo-600 transition-colors">
                  {event.title}
                </h3>
                {(event.location || event.description) && (
                  <p className="text-xs md:text-xs font-medium text-text-4 truncate mt-1 md:mt-1.5 flex items-center gap-2 md:gap-2.5">
                    {event.location && <><span className="text-indigo-500/80" aria-hidden="true">📍</span> {event.location}</>}
                    {event.description && <><span className="text-text-4/20" aria-hidden="true">|</span> {event.description}</>}
                  </p>
                )}
              </div>

              <button
                onClick={() => useCalendarStore.getState().setSelectedEvent(event.id)}
                aria-label={`Edit event: ${event.title}`}
                className={cn(
                  "w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center border md:opacity-0 group-hover:opacity-100 transition-all active:scale-90 flex-shrink-0",
                  (COLOR_MAP as any)[event.color].bg,
                  (COLOR_MAP as any)[event.color].border,
                  (COLOR_MAP as any)[event.color].text
                )}
              >
                <span className="text-base md:text-lg font-black" aria-hidden="true">✎</span>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
