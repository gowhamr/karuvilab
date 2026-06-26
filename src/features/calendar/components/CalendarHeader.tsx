"use client";

import { useCalendarStore } from "../store";
import { format, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays } from "date-fns";
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  Calendar as CalendarIcon, 
  Plus,
  LayoutGrid,
  Rows,
  List,
  Settings
} from "lucide-react";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import * as Popover from "@radix-ui/react-popover";
import { MiniCalendar } from "./MiniCalendar";
import { cn } from "@/src/lib/utils";
import { useState } from "react";
import { useDragScroll } from "@/src/hooks/useDragScroll";

export function CalendarHeader({ 
  onAddEvent, 
  onToggleSidebar 
}: { 
  onAddEvent: () => void; 
  onToggleSidebar: () => void;
}) {
  const currentDate = useCalendarStore(state => state.currentDate);
  const setCurrentDate = useCalendarStore(state => state.setCurrentDate);
  const currentView = useCalendarStore(state => state.currentView);
  const setCurrentView = useCalendarStore(state => state.setCurrentView);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const { containerRef, events, dragged } = useDragScroll<HTMLDivElement>();

  const handlePrev = () => {
    if (currentView === 'month') setCurrentDate(subMonths(currentDate, 1));
    else if (currentView === 'week') setCurrentDate(subWeeks(currentDate, 1));
    else setCurrentDate(subDays(currentDate, 1));
  };

  const handleNext = () => {
    if (currentView === 'month') setCurrentDate(addMonths(currentDate, 1));
    else if (currentView === 'week') setCurrentDate(addWeeks(currentDate, 1));
    else setCurrentDate(addDays(currentDate, 1));
  };

  const handleToday = () => setCurrentDate(new Date());

  return (
    <header className="flex flex-col gap-4 md:gap-6 pb-4 md:pb-6 border-b border-border/20 sticky top-0 z-above bg-bg/95 backdrop-blur-xl -mx-4 px-4 md:mx-0 md:px-0">
      {/* Top Row: Navigation and Action */}
      <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4">
        
        {/* Navigation Group */}
        <div className="flex items-center gap-1 md:gap-3 bg-surface/40 backdrop-blur-md border border-border/30 rounded-2xl p-1 shadow-sm w-full md:w-auto justify-between md:justify-start">
          <button
            onClick={handlePrev}
            aria-label="Previous month"
            className="p-2 md:p-2.5 hover:bg-surface rounded-xl text-text-3 hover:text-text transition-all active:scale-90"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <Popover.Root open={isPickerOpen} onOpenChange={setIsPickerOpen}>
            <Popover.Trigger asChild>
              <button 
                aria-label="Open date picker"
                className="text-center group outline-none focus:ring-4 focus:ring-indigo-500/10 rounded-xl px-2 py-1 transition-all flex items-center gap-2"
              >
                <h2 className="text-lg md:text-2xl font-black tracking-tight text-text group-hover:text-indigo-600 transition-colors">
                  {format(currentDate, 'MMMM')} <span className="opacity-50">{format(currentDate, 'yyyy')}</span>
                </h2>
                <ChevronDown className="w-4 h-4 text-text-4 opacity-40 group-hover:opacity-100 transition-all" />
              </button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content className="z-popover animate-in fade-in zoom-in-95 duration-200" sideOffset={12} align="center">
                <MiniCalendar onSelect={() => setIsPickerOpen(false)} />
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>

          <button
            onClick={handleNext}
            aria-label="Next month"
            className="p-2 md:p-2.5 hover:bg-surface rounded-xl text-text-3 hover:text-text transition-all active:scale-90"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Action Group */}
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto no-scrollbar pb-1 md:pb-0 shrink-0">
          <button
            onClick={handleToday}
            className="px-4 py-3 md:py-2.5 bg-surface border border-border/30 text-xs font-bold uppercase tracking-widest text-text-3 hover:text-indigo-600 hover:border-indigo-500/30 rounded-xl transition-all active:scale-95 min-h-11 md:min-h-0 whitespace-nowrap"
          >
            Today
          </button>

          <button
            onClick={onToggleSidebar}
            className="lg:hidden flex items-center justify-center gap-2 px-4 py-3 bg-surface border border-border/30 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-hover active:scale-95 transition-all text-text-2 min-h-11 shrink-0"
            aria-label="Toggle calendar settings"
          >
            <Settings className="w-4 h-4 text-indigo-500" />
            <span>Filters</span>
          </button>

          <button
            onClick={onAddEvent}
            className="flex items-center justify-center gap-2 px-5 py-3 md:py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-md shadow-indigo-500/20 active:scale-95 group min-h-11 md:min-h-0 shrink-0"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
            <span className="hidden sm:inline">New Event</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* Bottom Row: View Switching */}
      <div 
        ref={containerRef}
        {...events}
        className="overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 select-none"
      >
        <ToggleGroup.Root
          type="single"
          value={currentView}
          onValueChange={(value) => {
            if (dragged) return;
            if (value) setCurrentView(value as any);
          }}
          className="flex bg-surface/30 backdrop-blur-xl border border-border/20 rounded-2xl p-1.5 w-max md:w-auto"
        >
          <ToggleGroupItem value="month" icon={LayoutGrid} label="Month" />
          <ToggleGroupItem value="week" icon={Rows} label="Week" />
          <ToggleGroupItem value="day" icon={CalendarIcon} label="Day" />
          <ToggleGroupItem value="agenda" icon={List} label="Agenda" />
        </ToggleGroup.Root>
      </div>
    </header>
  );
}

function ToggleGroupItem({ value, icon: Icon, label }: { value: string, icon: any, label: string }) {
  return (
    <ToggleGroup.Item
      value={value}
      className={cn(
        "flex items-center gap-3 px-6 py-3.5 md:py-3 rounded-xl text-xs md:text-tiny font-bold uppercase tracking-widest-sm-md transition-all relative group min-h-11",
        "data-[state=on]:bg-indigo-600 data-[state=on]:text-white data-[state=on]:shadow-lg data-[state=on]:shadow-indigo-500/20",
        "data-[state=off]:text-text-4 data-[state=off]:hover:bg-surface/50 data-[state=off]:hover:text-text-2"
      )}
      title={label}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </ToggleGroup.Item>
  );
}
