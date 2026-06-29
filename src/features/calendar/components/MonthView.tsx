"use client";

import { useCalendarStore } from "../store";
import { format, isSameMonth, isSameDay, startOfMonth } from "date-fns";
import { getMonthDays, getEventsForDay, getFestivalsForDay, getObservancesForDay } from "../utils";
import { COLOR_MAP } from "../constants";
import { cn } from "@/src/lib/utils";

import { useState, useRef, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";
import { DayDetailsSheet } from "./DayDetailsSheet";

import { WorldEvent } from "../world-events-db";

export function MonthView({ onAddEvent }: { onAddEvent: (date: Date) => void }) {
  const currentDate = useCalendarStore(state => state.currentDate);
  const events = useCalendarStore(state => state.events);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const days = getMonthDays(currentDate);
  const monthStart = startOfMonth(currentDate);
  
  const prevMonthRef = useRef(monthStart.getTime());
  const direction = monthStart.getTime() > prevMonthRef.current ? 1 : monthStart.getTime() < prevMonthRef.current ? -1 : 0;
  
  useEffect(() => {
    prevMonthRef.current = monthStart.getTime();
  }, [monthStart]);

  useEffect(() => {
    const handleTodayClicked = () => {
      setTimeout(() => {
        const todayEl = document.querySelector('[data-is-today="true"]');
        if (todayEl) {
          todayEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          todayEl.classList.add('bg-blue/10');
          setTimeout(() => todayEl.classList.remove('bg-blue/10'), 1500);
        }
      }, 100);
    };
    window.addEventListener('calendar-today-clicked', handleTodayClicked);
    return () => window.removeEventListener('calendar-today-clicked', handleTodayClicked);
  }, []);

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
          <div className="grid grid-cols-7 border-b border-border/30 bg-bg/50 sticky top-0 z-above backdrop-blur-md">
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
          <div className="flex-1 relative overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false} custom={direction}>
              <m.div
                key={monthStart.toISOString()}
                custom={direction}
                initial={{ opacity: 0, x: direction * 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -direction * 20 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="grid grid-cols-7 absolute inset-0"
              >
                {days.map((day) => (
                  <DayCell 
                    key={day.toISOString()} 
                    day={day} 
                    isCurrentMonth={isSameMonth(day, monthStart)}
                    isSelected={currentDate ? isSameDay(day, currentDate) : false}
                    onClick={() => {
                      // On click, also set current date so it acts as selected
                      useCalendarStore.getState().setCurrentDate(day);
                      handleDayClick(day);
                    }}
                    onAddEvent={onAddEvent}
                  />
                ))}
              </m.div>
            </AnimatePresence>
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

function DayCell({ day, isCurrentMonth, isSelected, onClick, onAddEvent }: { day: Date, isCurrentMonth: boolean, isSelected: boolean, onClick: () => void, onAddEvent: (date: Date) => void }) {
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
      data-is-today={isToday}
      className={cn(
        "min-h-[72px] md:min-h-36 p-1 md:p-2 border-r border-b border-border/20 last:border-r-0 relative group cursor-pointer transition-all duration-150 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-inset overflow-hidden",
        !isCurrentMonth && "bg-bg/20 opacity-40",
        isCurrentMonth && "hover:bg-bg"
      )}
    >
      <div className="flex justify-between items-start mb-1 md:mb-2">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={cn(
              "w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full md:rounded-xl text-sm font-black transition-all duration-150",
              isSelected ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/30 scale-105" : 
              isToday ? "border-2 border-blue text-blue" : "text-text-2 group-hover:bg-surface"
            )}>
              {format(day, 'd')}
            </span>
            {isToday && <span className="text-[9px] font-black uppercase tracking-widest text-blue hidden md:inline">Today</span>}
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 mt-1 md:mt-0">
          <div className="flex gap-1 items-center">
            {sortedWorldEvents.slice(0, 3).map((evt) => (
              <div key={evt.id} title={evt.name}>
                <span className="text-[11px] md:text-xs">{evt.emoji}</span>
              </div>
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
        <div className="flex flex-col gap-1">
          {dayEvents.slice(0, 3).map(event => (
            <div
              key={event.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedEvent(event.id);
                onAddEvent(day);
              }}
              className={cn(
                "hidden md:block px-2 py-1 rounded-lg text-tiny font-bold truncate border shadow-sm transition-transform hover:scale-[1.02]",
                COLOR_MAP[event.color].bg,
                COLOR_MAP[event.color].border,
                COLOR_MAP[event.color].text
              )}
            >
              <span>{event.title}</span>
            </div>
          ))}
          
          {/* Mobile dots for personal events */}
          <div className="flex flex-wrap gap-1 md:hidden">
            {dayEvents.slice(0, 3).map(event => (
              <div 
                key={event.id}
                className={cn("w-2 h-2 rounded-full", COLOR_MAP[event.color].bg)}
              />
            ))}
            {dayEvents.length > 3 && (
              <span className="text-[9px] font-black text-text-4 leading-none">+{dayEvents.length - 3}</span>
            )}
          </div>
          
          <div className="hidden md:block">
            {dayEvents.length > 3 && (
              <div className="text-micro font-black text-text-4 uppercase tracking-widest pl-1">
                + {dayEvents.length - 3} more
              </div>
            )}
          </div>
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
