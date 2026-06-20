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
    <header className="flex flex-col gap-6 md:gap-8 pb-8 border-b border-border/20">
      {/* Top Row: Navigation and Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center justify-between md:justify-start gap-4 md:gap-8">
          <Popover.Root open={isPickerOpen} onOpenChange={setIsPickerOpen}>
            <Popover.Trigger asChild>
              <button 
                aria-label="Open date picker"
                className="text-left group outline-none focus:ring-4 focus:ring-indigo-500/10 rounded-2xl p-2 -m-2 transition-all min-h-11"
              >
                <h2 className="text-2xl md:text-5xl font-black tracking-tighter font-serif text-text group-hover:text-indigo-600 transition-colors flex items-center gap-2 md:gap-3">
                  {format(currentDate, 'MMMM')} <span className="text-text-4 font-sans font-normal opacity-50">{format(currentDate, 'yyyy')}</span>
                  <ChevronDown className="w-4 h-4 md:w-6 md:h-6 text-text-4 opacity-40 group-hover:opacity-100 transition-all" />
                </h2>
              </button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content className="z-popover animate-in fade-in zoom-in-95 duration-200" sideOffset={12} align="start">
                <MiniCalendar onSelect={() => setIsPickerOpen(false)} />
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>

          <div className="flex items-center bg-surface/40 backdrop-blur-md border border-border/30 rounded-xl p-1 md:p-1.5 shadow-sm">
            <button
              onClick={handlePrev}
              aria-label="Previous period"
              className="p-3 md:p-2 hover:bg-surface rounded-lg md:rounded-xl text-text-3 hover:text-text transition-all active:scale-90 min-w-11 min-h-11 flex items-center justify-center"
            >
              <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button
              onClick={handleToday}
              className="px-2 md:px-4 py-2 text-tiny md:text-tiny font-bold uppercase tracking-widest-sm-md md:tracking-widest-lg text-text-4 hover:text-indigo-600 transition-colors min-h-11"
            >
              Today
            </button>
            <button
              onClick={handleNext}
              aria-label="Next period"
              className="p-3 md:p-2 hover:bg-surface rounded-lg md:rounded-xl text-text-3 hover:text-text transition-all active:scale-90 min-w-11 min-h-11 flex items-center justify-center"
            >
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden flex items-center justify-center gap-2 px-5 py-3.5 bg-surface border border-border/30 rounded-xl font-black text-xs md:text-xs uppercase tracking-widest-md hover:bg-hover active:scale-95 transition-all text-text-2 flex-1 min-h-11"
            aria-label="Toggle calendar settings"
          >
            <Settings className="w-4 h-4 text-indigo-500" />
            <span>Filters</span>
          </button>

          <button
            onClick={onAddEvent}
            className="flex items-center justify-center gap-2 px-6 md:px-8 py-3.5 md:py-4 bg-indigo-600 text-white rounded-xl font-black text-xs md:text-xs uppercase tracking-widest-md md:tracking-widest-lg hover:bg-indigo-700 transition-all shadow-lg md:shadow-xl shadow-indigo-500/30 active:scale-95 group flex-1 md:flex-none min-h-11"
          >
            <Plus className="w-4 h-4 md:w-5 md:h-5 group-hover:rotate-90 transition-transform duration-300" />
            <span>New Event</span>
          </button>
        </div>
      </div>

      {/* Bottom Row: View Switching */}
      <div className="overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
        <ToggleGroup.Root
          type="single"
          value={currentView}
          onValueChange={(value) => value && setCurrentView(value as any)}
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
