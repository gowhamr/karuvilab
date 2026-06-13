"use client";

import { useCalendarStore } from "../store";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay,
  addMonths,
  subMonths
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useState } from "react";

export function MiniCalendar({ onSelect }: { onAddEvent?: () => void, onSelect?: (date: Date) => void }) {
  const currentDate = useCalendarStore(state => state.currentDate);
  const setCurrentDate = useCalendarStore(state => state.setCurrentDate);
  const [viewDate, setViewDate] = useState(currentDate);

  const start = startOfWeek(startOfMonth(viewDate));
  const end = endOfWeek(endOfMonth(viewDate));
  const days = eachDayOfInterval({ start, end });

  return (
    <div className="w-64 p-4 bg-surface border border-border rounded-3xl shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xs font-black uppercase tracking-widest text-text">
          {format(viewDate, 'MMMM yyyy')}
        </h4>
        <div className="flex gap-1">
          <button 
            aria-label="Previous month"
            onClick={() => setViewDate(subMonths(viewDate, 1))} 
            className="p-2 -m-1 hover:bg-bg rounded-lg"
          >
            <ChevronLeft className="w-4 h-4 text-text-4" />
          </button>
          <button 
            aria-label="Next month"
            onClick={() => setViewDate(addMonths(viewDate, 1))} 
            className="p-2 -m-1 hover:bg-bg rounded-lg"
          >
            <ChevronRight className="w-4 h-4 text-text-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={i} className="text-micro font-black text-text-4 text-center py-1">{d}</div>
        ))}
        {days.map((day) => {
          const isCurrentMonth = isSameMonth(day, viewDate);
          const isSelected = isSameDay(day, currentDate);
          const isToday = isSameDay(day, new Date());

          return (
            <button
              key={day.toISOString()}
              onClick={() => {
                setCurrentDate(day);
                if (onSelect) onSelect(day);
              }}
              className={cn(
                "h-7 w-7 rounded-lg text-xs font-bold flex items-center justify-center transition-all",
                !isCurrentMonth && "opacity-20",
                isSelected && "bg-indigo-600 text-white shadow-md",
                isToday && !isSelected && "text-indigo-600 bg-indigo-500/10",
                !isSelected && !isToday && "hover:bg-bg text-text-2"
              )}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>
    </div>
  );
}
