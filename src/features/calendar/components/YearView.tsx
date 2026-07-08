"use client";

import { useCalendarStore } from "../store";
import { 
  startOfYear, 
  endOfYear, 
  eachMonthOfInterval, 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isToday
} from "date-fns";
import { cn } from "@/src/lib/utils";
import { getEventsForDay } from "../utils";

/**
 * YearView component renders a 12-month calendar grid representing the current date's year.
 * Highlights the current day and days with scheduled events.
 */
export function YearView() {
  const currentDate = useCalendarStore(state => state.currentDate);
  const setCurrentDate = useCalendarStore(state => state.setCurrentDate);
  const setCurrentView = useCalendarStore(state => state.setCurrentView);
  const events = useCalendarStore(state => state.events);

  const yearStart = startOfYear(currentDate);
  const yearEnd = endOfYear(currentDate);
  const months = eachMonthOfInterval({ start: yearStart, end: yearEnd });

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-12 bg-surface/60 backdrop-blur-xl border border-border/30 rounded-2xl md:rounded-4xl p-6 shadow-premium">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {months.map(month => {
          const monthStart = startOfMonth(month);
          const monthEnd = endOfMonth(month);
          const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
          const startDayOfWeek = monthStart.getDay(); // 0 = Sunday, 1 = Monday, etc.

          // Create empty placeholders for weekday offset
          const placeholders = Array.from({ length: startDayOfWeek });

          return (
            <div 
              key={month.toISOString()} 
              className="space-y-4 p-4 rounded-2xl hover:bg-surface-2/20 border border-transparent hover:border-border/20 transition-all cursor-pointer group"
              onClick={() => {
                setCurrentDate(monthStart);
                setCurrentView('month');
              }}
            >
              <h3 className="text-sm font-black text-text group-hover:text-indigo-500 transition-colors uppercase tracking-wider pl-1">
                {format(month, 'MMMM')}
              </h3>

              <div className="grid grid-cols-7 gap-1 text-center">
                {/* Weekday headers */}
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                  <span key={i} className="text-[9px] font-black text-text-4 uppercase">
                    {day}
                  </span>
                ))}

                {/* Offset placeholders */}
                {placeholders.map((_, i) => (
                  <div key={`p-${i}`} className="w-5 h-5" />
                ))}

                {/* Days */}
                {days.map(day => {
                  const dayEvents = getEventsForDay(day, events);
                  const hasEvents = dayEvents.length > 0;
                  const isCurrentDay = isToday(day);

                  return (
                    <div 
                      key={day.toISOString()} 
                      className="w-5 h-5 flex items-center justify-center relative text-[10px]"
                    >
                      <span className={cn(
                        "w-4 h-4 flex items-center justify-center rounded-full font-bold",
                        isCurrentDay ? "bg-indigo-600 text-white shadow-sm" : "text-text-2",
                        hasEvents && !isCurrentDay && "border border-indigo-500/40 text-indigo-400 font-black"
                      )}>
                        {format(day, 'd')}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
