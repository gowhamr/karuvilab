"use client";

import { useCalendarStore } from "../store";
import { format, parseISO, isSameDay, isToday, isTomorrow } from "date-fns";
import { COLOR_MAP } from "../constants";
import { cn } from "@/src/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { getFestivalsForDay, getObservancesForDay } from "../utils";
import { addDays, startOfDay, eachDayOfInterval } from "date-fns";
import { useTamilCalendar } from "../hooks/useTamilCalendar";
import { CalendarEvent } from "../types";
import { GlobalFestival, GlobalObservance } from "../data/static-data";

export function AgendaView() {
  const { events, tamilModeEnabled } = useCalendarStore();

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
      hasContent: dayEvents.length > 0 || festivals.length > 0 || observances.length > 0 || tamilModeEnabled
    };
  });

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar space-y-8 pb-12">
      {agendaDays.map(({ date, events: dayEvents, festivals, observances, hasContent }) => {
        if (!hasContent) return null;

        return (
          <AgendaDay 
            key={date.toISOString()}
            date={date}
            dayEvents={dayEvents}
            festivals={festivals}
            observances={observances}
            tamilModeEnabled={tamilModeEnabled}
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
  observances, 
  tamilModeEnabled 
}: { 
  date: Date;
  dayEvents: CalendarEvent[];
  festivals: GlobalFestival[];
  observances: GlobalObservance[];
  tamilModeEnabled: boolean;
}) {
  const tamil = useTamilCalendar(date);

  let label = format(date, 'EEEE, MMMM d');
  if (isToday(date)) label = 'Today';
  else if (isTomorrow(date)) label = 'Tomorrow';

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end ml-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500/60">
          {label}
        </h3>
        {tamilModeEnabled && (
          <div className="text-[9px] font-black text-text-4 uppercase tracking-widest bg-bg/50 px-3 py-1 rounded-full border border-border/40">
            {tamil.day} {tamil.monthName} ({tamil.tamilDayNumeral})
          </div>
        )}
      </div>

      <div className="space-y-3">
        {/* Tamil Festival */}
        {tamilModeEnabled && tamil.festival && (
          <div className="bg-indigo-500/5 border border-indigo-500/10 p-4 rounded-[32px] flex items-center gap-4">
            <span className="text-2xl">🌾</span>
            <div>
              <h4 className="text-sm font-black text-indigo-700 dark:text-indigo-400">{tamil.festival}</h4>
              <p className="text-[10px] font-bold text-indigo-600/60 uppercase tracking-widest">Tamil Festival</p>
            </div>
          </div>
        )}

        {/* Festivals and Observances */}
        {festivals.map((f, i) => (
          <div key={`f-${i}`} className="bg-amber-500/5 border border-amber-500/10 p-4 rounded-[32px] flex items-center gap-4">
            <span className="text-2xl">{f.emoji}</span>
            <div>
              <h4 className="text-sm font-black text-amber-700 dark:text-amber-400">{f.name}</h4>
              <p className="text-[10px] font-bold text-amber-600/60 uppercase tracking-widest">Festival</p>
            </div>
          </div>
        ))}

        {observances.map((o, i) => (
          <div key={`o-${i}`} className="bg-blue-500/5 border border-blue-500/10 p-4 rounded-[32px] flex items-center gap-4">
            <span className="text-2xl">{o.emoji}</span>
            <div>
              <h4 className="text-sm font-black text-blue-700 dark:text-blue-400">{o.name}</h4>
              <p className="text-[10px] font-bold text-blue-600/60 uppercase tracking-widest">Global Observance</p>
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
              className="group bg-surface border border-border/40 p-5 rounded-[32px] flex items-center gap-6 hover:border-indigo-500/30 transition-all shadow-sm hover:shadow-md"
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

              <div className="w-1.5 h-12 rounded-full" style={{ backgroundColor: (COLOR_MAP as any)[event.color].hex }} />

              <div className="flex-1 min-w-0">
                <h4 className="text-base font-black text-text truncate group-hover:text-indigo-600 transition-colors">
                  {event.title}
                </h4>
                {(event.location || event.description) && (
                  <p className="text-[11px] font-medium text-text-4 truncate mt-1 flex items-center gap-2">
                    {event.location && <><span className="text-indigo-500">📍</span> {event.location}</>}
                    {event.description && <><span className="text-text-4/20">|</span> {event.description}</>}
                  </p>
                )}
              </div>

              <button
                onClick={() => useCalendarStore.getState().setSelectedEvent(event.id)}
                className={cn(
                  "px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border opacity-0 group-hover:opacity-100 transition-all active:scale-95",
                  (COLOR_MAP as any)[event.color].bg,
                  (COLOR_MAP as any)[event.color].border,
                  (COLOR_MAP as any)[event.color].text
                )}
              >
                Edit
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
