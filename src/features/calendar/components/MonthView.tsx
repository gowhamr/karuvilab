"use client";

import { useCalendarStore } from "../store";
import { format, isSameMonth, isSameDay, startOfMonth } from "date-fns";
import { getMonthDays, getEventsForDay, getFestivalsForDay, getObservancesForDay } from "../utils";
import { COLOR_MAP } from "../constants";
import { cn } from "@/src/lib/utils";

import { useState } from "react";
import { DayDetailsSheet } from "./DayDetailsSheet";

import { WorldEvent } from "../world-events-db";

export function MonthView({ onAddEvent }: { onAddEvent: (date: Date) => void }) {
  const currentDate = useCalendarStore(state => state.currentDate);
  const events = useCalendarStore(state => state.events);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const days = getMonthDays(currentDate);
  const monthStart = startOfMonth(currentDate);

  const handleDayClick = (day: Date) => {
    if (window.innerWidth < 768) {
      setSelectedDate(day);
    } else {
      onAddEvent(day);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-surface/60 backdrop-blur-xl border border-border/30 rounded-2xl md:rounded-4xl overflow-hidden shadow-premium">
      <div className="flex-1 flex flex-col overflow-x-auto no-scrollbar">
        <div className="min-w-80 md:min-w-full flex-1 flex flex-col">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 border-b border-border/30 bg-bg/50 sticky top-0 z-20 backdrop-blur-md">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
              <div key={day} className="py-3 md:py-5 text-center">
                <span className="text-xs md:text-tiny font-bold uppercase tracking-widest-sm-sm md:tracking-widest-xl text-text-4">
                  <span className="md:hidden">{day[0]}</span>
                  <span className="hidden md:inline">{day}</span>
                </span>
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-7 flex-1">
            {days.map((day) => (
              <DayCell 
                key={day.toISOString()} 
                day={day} 
                isCurrentMonth={isSameMonth(day, monthStart)}
                onClick={() => handleDayClick(day)}
                onAddEvent={onAddEvent}
              />
            ))}
          </div>
        </div>
      </div>

      <DayDetailsSheet 
        date={selectedDate || new Date()} 
        isOpen={!!selectedDate} 
        onClose={() => setSelectedDate(null)}
        onAddEvent={onAddEvent}
      />
    </div>
  );
}

function DayCell({ day, isCurrentMonth, onClick, onAddEvent }: { day: Date, isCurrentMonth: boolean, onClick: () => void, onAddEvent: (date: Date) => void }) {
  const events = useCalendarStore(state => state.events);
  const setSelectedEvent = useCalendarStore(state => state.setSelectedEvent);
  const setSelectedWorldEvent = useCalendarStore(state => state.setSelectedWorldEvent);
  
  const showWorldEvents = useCalendarStore(state => state.worldEventsSettings.showWorldEvents);
  const showCategories = useCalendarStore(state => state.worldEventsSettings.showCategories);
  const showImportance = useCalendarStore(state => state.worldEventsSettings.showImportance);
  const highlightIndianEvents = useCalendarStore(state => state.worldEventsSettings.highlightIndianEvents);
  const compactBadges = useCalendarStore(state => state.worldEventsSettings.compactBadges);

  const isToday = isSameDay(day, new Date());
  const dayEvents = getEventsForDay(day, events);
  const festivals = getFestivalsForDay(day);
  const observances = getObservancesForDay(day);

  // Filter and sort world events
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Day cell for ${format(day, 'MMMM d, yyyy')}`}
      className={cn(
        "min-h-15 md:min-h-36 p-1 md:p-2 border-r border-b border-border/20 last:border-r-0 relative group cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-inset",
        !isCurrentMonth && "bg-bg/20 opacity-40",
        isCurrentMonth && "hover:bg-indigo-500/5",
        isToday && "bg-indigo-500/[0.05]"
      )}
    >
      <div className="flex justify-between items-start mb-1 md:mb-2">
        <div className="flex flex-col">
          <span className={cn(
            "w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded-lg md:rounded-xl text-xs md:text-sm font-black transition-all",
            isToday ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" : "text-text-2"
          )}>
            {format(day, 'd')}
          </span>
        </div>

        <div className="flex flex-col items-end gap-1">
          <div className="flex gap-0.5">
            {sortedWorldEvents.slice(0, 3).map((evt) => (
              <span key={evt.id} title={evt.name} className="text-xs md:text-xs">{evt.emoji}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-1 overflow-hidden">
        {/* World Events Badges */}
        <div className="hidden md:block space-y-1">
          {sortedWorldEvents.slice(0, 2).map((evt) => (
            <div
              key={evt.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedWorldEvent({ event: evt, date: day });
              }}
              className={cn(
                "flex items-center gap-1 px-1.5 py-0.5 rounded-md text-tiny font-bold truncate transition-all hover:opacity-80 border shadow-sm",
                evt.colors.bg,
                evt.colors.border,
                evt.colors.text
              )}
            >
              <span>{evt.emoji}</span>
              {!compactBadges && <span className="truncate">{evt.shortName}</span>}
            </div>
          ))}
          {sortedWorldEvents.length > 2 && (
            <div className="text-micro font-black text-text-4 uppercase tracking-widest pl-1">
              + {sortedWorldEvents.length - 2} more
            </div>
          )}
        </div>

        {/* Personal Events */}
        <div className="flex flex-wrap gap-1 md:block md:space-y-1">
          {dayEvents.slice(0, 3).map(event => (
            <div
              key={event.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedEvent(event.id);
                onAddEvent(day);
              }}
              className={cn(
                "md:px-2 md:py-1 rounded-full md:rounded-lg text-tiny font-bold truncate border shadow-sm",
                "w-1.5 h-1.5 md:w-auto md:h-auto",
                COLOR_MAP[event.color].bg,
                COLOR_MAP[event.color].border,
                COLOR_MAP[event.color].text
              )}
            >
              <span className="hidden md:inline">{event.title}</span>
            </div>
          ))}
          {dayEvents.length > 3 && (
            <div className="text-tiny md:text-micro font-black text-text-4 uppercase tracking-widest">
              <span className="md:hidden">+{dayEvents.length - 3}</span>
              <span className="hidden md:inline">+ {dayEvents.length - 3} more</span>
            </div>
          )}
        </div>
      </div>

      {/* Hover Indicator */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-6 h-6 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-600">
          <span className="text-xs font-black">+</span>
        </div>
      </div>
    </div>
  );
}
