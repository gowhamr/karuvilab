"use client";

import { useCalendarStore } from "../store";
import { format, isSameMonth, isSameDay, startOfMonth } from "date-fns";
import { getMonthDays, getEventsForDay, getFestivalsForDay, getObservancesForDay } from "../utils";
import { useTamilCalendar } from "../hooks/useTamilCalendar";
import { COLOR_MAP } from "../constants";
import { cn } from "@/src/lib/utils";

import { useState } from "react";
import { DayDetailsSheet } from "./DayDetailsSheet";

export function MonthView({ onAddEvent }: { onAddEvent: (date: Date) => void }) {
  const { currentDate, events, tamilModeEnabled } = useCalendarStore();
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
    <div className="flex-1 flex flex-col min-h-0 bg-surface border border-border/40 rounded-[32px] overflow-hidden shadow-premium">
      {/* Weekday Headers */}
      <div className="grid grid-cols-7 border-b border-border/40 bg-bg/50">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
          <div key={day} className="py-4 text-center">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-4">
              {tamilModeEnabled ? ['Gnayiru', 'Thingal', 'Sevvai', 'Budhan', 'Vyazhan', 'Velli', 'Sani'][i] : day}
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
  const { events, tamilModeEnabled, setSelectedEvent } = useCalendarStore();
  const isToday = isSameDay(day, new Date());
  const dayEvents = getEventsForDay(day, events);
  const festivals = getFestivalsForDay(day);
  const observances = getObservancesForDay(day);
  const tamil = useTamilCalendar(day);

  const hasSpecialDay = festivals.length > 0 || observances.length > 0 || tamil.festival;

  return (
    <div
      onClick={onClick}
      className={cn(
        "min-h-[100px] md:min-h-[140px] p-2 border-r border-b border-border/20 last:border-r-0 relative group cursor-pointer transition-all",
        !isCurrentMonth && "bg-bg/20 opacity-40",
        isCurrentMonth && "hover:bg-indigo-500/5",
        isToday && "bg-indigo-500/[0.02]"
      )}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex flex-col">
          <span className={cn(
            "w-8 h-8 flex items-center justify-center rounded-xl text-sm font-black transition-all",
            isToday ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" : "text-text-2"
          )}>
            {format(day, 'd')}
          </span>
          
          {tamilModeEnabled && (
            <div className="flex items-center gap-1 mt-1 ml-1">
              <span className="text-[9px] font-bold text-indigo-500/80">
                {tamil.tamilDayNumeral}
              </span>
              {tamil.festival && (
                <span title={tamil.festival} className="text-[10px] cursor-help">🌾</span>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-1">
          {tamilModeEnabled && tamil.day === 1 && (
            <span className="text-[8px] font-black uppercase tracking-widest text-indigo-500/60 bg-indigo-500/5 px-2 py-0.5 rounded-lg border border-indigo-500/10">
              {tamil.monthName}
            </span>
          )}
          
          <div className="flex gap-0.5">
            {festivals.map((f, i) => (
              <span key={i} title={f.name} className="text-xs">{f.emoji}</span>
            ))}
            {observances.map((o, i) => (
              <span key={i} title={o.name} className="text-xs">{o.emoji}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-1 overflow-hidden">
        {/* Festivals and Observances as mini-badges if no emoji */}
        {!tamilModeEnabled && festivals.map((f, i) => (
          <div key={`f-${i}`} className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-[8px] font-bold truncate">
            {f.name}
          </div>
        ))}

        {dayEvents.slice(0, 3).map(event => (
          <div
            key={event.id}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedEvent(event.id);
              onAddEvent(day);
            }}
            className={cn(
              "px-2 py-1 rounded-lg text-[9px] font-bold truncate border shadow-sm",
              COLOR_MAP[event.color].bg,
              COLOR_MAP[event.color].border,
              COLOR_MAP[event.color].text
            )}
          >
            {event.title}
          </div>
        ))}
        {dayEvents.length > 3 && (
          <div className="px-2 text-[8px] font-black text-text-4 uppercase tracking-widest">
            + {dayEvents.length - 3} more
          </div>
        )}
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
