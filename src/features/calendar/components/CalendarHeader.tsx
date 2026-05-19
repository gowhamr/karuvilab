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
  List
} from "lucide-react";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import * as Popover from "@radix-ui/react-popover";
import { TamilCalendarToggle } from "./TamilCalendarToggle";
import { MiniCalendar } from "./MiniCalendar";
import { cn } from "@/src/lib/utils";
import { useState } from "react";

export function CalendarHeader({ onAddEvent }: { onAddEvent: () => void }) {
  const { currentDate, setCurrentDate, currentView, setCurrentView } = useCalendarStore();
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
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-border/40">
      <div className="flex items-center gap-6">
        <div className="flex flex-col">
          <Popover.Root open={isPickerOpen} onOpenChange={setIsPickerOpen}>
            <Popover.Trigger asChild>
              <button className="text-left group outline-none">
                <h1 className="text-3xl md:text-4xl font-black tracking-tight font-serif text-text group-hover:text-indigo-600 transition-colors flex items-center gap-3">
                  {format(currentDate, 'MMMM')} <span className="text-text-4 font-sans font-medium">{format(currentDate, 'yyyy')}</span>
                  <ChevronDown className="w-5 h-5 text-text-4 opacity-0 group-hover:opacity-100 transition-all" />
                </h1>
              </button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content className="z-50 animate-in fade-in zoom-in-95 duration-200" sideOffset={10} align="start">
                <MiniCalendar onSelect={() => setIsPickerOpen(false)} />
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </div>

        <div className="flex items-center bg-surface border border-border rounded-2xl p-1">
          <button
            onClick={handlePrev}
            className="p-2 hover:bg-bg rounded-xl text-text-3 hover:text-text transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleToday}
            className="px-4 py-1 text-[10px] font-black uppercase tracking-widest text-text-4 hover:text-blue transition-colors"
          >
            Today
          </button>
          <button
            onClick={handleNext}
            className="p-2 hover:bg-bg rounded-xl text-text-3 hover:text-text transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <TamilCalendarToggle />

        <ToggleGroup.Root
          type="single"
          value={currentView}
          onValueChange={(value) => value && setCurrentView(value as any)}
          className="flex bg-surface border border-border rounded-2xl p-1"
        >
          <ToggleGroupItem value="month" icon={LayoutGrid} label="Month" />
          <ToggleGroupItem value="week" icon={Rows} label="Week" />
          <ToggleGroupItem value="day" icon={CalendarIcon} label="Day" />
          <ToggleGroupItem value="agenda" icon={List} label="Agenda" />
        </ToggleGroup.Root>

        <button
          onClick={onAddEvent}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Event</span>
        </button>
      </div>
    </header>
  );
}

function ToggleGroupItem({ value, icon: Icon, label }: { value: string, icon: any, label: string }) {
  return (
    <ToggleGroup.Item
      value={value}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
        "data-[state=on]:bg-indigo-500/10 data-[state=on]:text-indigo-600 dark:data-[state=on]:text-indigo-400",
        "data-[state=off]:text-text-4 data-[state=off]:hover:bg-bg"
      )}
      title={label}
    >
      <Icon className="w-4 h-4" />
      <span className="hidden lg:inline">{label}</span>
    </ToggleGroup.Item>
  );
}
