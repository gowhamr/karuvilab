"use client";
import { useState, useEffect, useCallback } from "react";
import { useWorldClockStore, type ClockItem } from "@/src/features/world-clock/store";
import { useFullscreenContext } from "@/src/contexts/FullscreenContext";
import { Plus, Globe, Clock, Maximize2, Minimize2, Search, ArrowUpDown, Filter, Download, ArrowRight } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { TimezoneSearchModal } from "@/components/tools/world-clock/TimezoneSearchModal";
import * as Popover from '@radix-ui/react-popover';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { useToast } from "@/components/ui/Toast";
import { useSupportStore } from "@/src/store/useSupportStore";
import { Settings2 } from "lucide-react";

import { getTimeInZone, getBusinessStatus } from "./utils";
import { ClockCard } from "./ClockCard";


export default function WorldClockClient() {
  const [now, setNow] = useState<Date | null>(null);
  const clocks = useWorldClockStore(state => state.clocks);
  const settings = useWorldClockStore(state => state.settings);
  const updateSettings = useWorldClockStore(state => state.updateSettings);
  const removeClock = useWorldClockStore(state => state.removeClock);
  const reorderClocks = useWorldClockStore(state => state.reorderClocks);
  const { displayMode, activeToolId, toggleFocus } = useFullscreenContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localTz, setLocalTz] = useState('');
  const [filterMode, setFilterMode] = useState<"all" | "open">("all");
  const { toast } = useToast();
  const openFeedback = useSupportStore(state => state.openFeedback);
  
  const isDashboard = displayMode === 'dashboard' && activeToolId === 'world-clock';
  const isFocus = displayMode === 'focus' && activeToolId === 'world-clock';

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = clocks.findIndex((c) => c.id === active.id);
      const newIndex = clocks.findIndex((c) => c.id === over.id);
      
      const newClocks = arrayMove(clocks, oldIndex, newIndex);
      reorderClocks(newClocks);
    }
  };

  useEffect(() => {
    setLocalTz(Intl.DateTimeFormat().resolvedOptions().timeZone);
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const handleCloseModal = useCallback(() => setIsModalOpen(false), []);

  // Keyboard shortcut for adding clock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!now) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-surface border border-border rounded-3xl p-6 h-64" />
        ))}
      </div>
    );
  }

  if (isDashboard) {
    const bgClasses = {
      dark: 'bg-bg text-text',
      light: 'bg-slate-50 text-slate-900',
      amoled: 'bg-black text-white',
      blue: 'bg-blue-950 text-blue-50',
      matrix: 'bg-black text-green-500',
    }[settings.dashboardTheme] || 'bg-bg text-text';

    const textSize = {
      small: 'text-xl md:text-3xl',
      medium: 'text-2xl md:text-4xl',
      large: 'text-4xl md:text-6xl',
      huge: 'text-6xl md:text-8xl',
    }[settings.clockSize] || 'text-4xl md:text-6xl';

    return (
      <div className={cn("h-full w-full flex flex-col items-center justify-center font-mono relative", bgClasses)}>
        <div className="absolute top-6 right-6 z-modal">
          <Popover.Root>
            <Popover.Trigger asChild>
              <button className="p-3 rounded-xl bg-surface-2/20 hover:bg-surface-2/40 backdrop-blur-md transition-colors border border-border/10">
                <Settings2 className="w-6 h-6 opacity-60 hover:opacity-100" />
              </button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content sideOffset={8} align="end" className="w-80 bg-surface border border-border shadow-2xl rounded-2xl p-4 z-popover animate-in fade-in zoom-in-95">
                <h3 className="font-bold text-sm uppercase tracking-widest text-text-4 mb-4">Dashboard Settings</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-3">Theme</label>
                    <select 
                      value={settings.dashboardTheme} 
                      onChange={e => updateSettings({ dashboardTheme: e.target.value as any })}
                      className="w-full bg-surface-2 border border-border rounded-lg p-2 text-sm outline-none"
                    >
                      <option value="dark">Dark</option>
                      <option value="amoled">Pitch Black</option>
                      <option value="light">Light Mode</option>
                      <option value="matrix">Matrix Hacker</option>
                    </select>
                  </div>
                </div>
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </div>

        <div className="flex flex-col gap-12 w-full max-w-7xl px-8 relative z-content">
          <div className="flex items-center justify-center gap-4 opacity-50 mb-4">
            <Globe className="w-12 h-12" />
            <h1 className="text-4xl md:text-5xl font-black tracking-[0.3em] uppercase">World Clock</h1>
          </div>
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {clocks.map(({ id, city, country, tz, customLabel }) => {
              const t = getTimeInZone(tz, now, settings.hourFormat, localTz);
              const biz = getBusinessStatus(tz, now);
              
              let displayLabel = city;
              if (settings.primaryLabel === 'country') displayLabel = country;
              if (settings.primaryLabel === 'custom') displayLabel = customLabel || city;

              return (
                <div key={id} className="flex items-center justify-between py-6 px-10 bg-surface-2/10 backdrop-blur-md rounded-[40px] border border-border/20 shadow-2xl">
                  <div className="flex flex-col w-1/3">
                    <span className="text-3xl md:text-5xl font-bold truncate opacity-90">{displayLabel}</span>
                    <span className="text-sm font-bold opacity-50 uppercase tracking-widest mt-1">{t.relativeText}</span>
                  </div>
                  
                  <div className="flex flex-col items-center w-1/3">
                    <div className="flex items-baseline gap-4 justify-center">
                      <span className={cn("font-black tabular-nums tracking-tight", textSize)}>{t.displayTime}</span>
                      {settings.showSeconds && (
                        <span className="text-2xl md:text-4xl font-bold opacity-50 tabular-nums">:{t.displaySeconds}</span>
                      )}
                      {settings.hourFormat === 12 && (
                        <span className="text-2xl md:text-4xl font-black opacity-80 ml-2">{t.ampm}</span>
                      )}
                    </div>
                    {settings.showUtcOffset && (
                      <span className="text-sm font-bold opacity-40 uppercase tracking-widest mt-1">{t.offset} • {t.date}</span>
                    )}
                  </div>

                  <div className="w-1/3 flex justify-end">
                    {settings.showBusinessHours && (
                      <div className="flex flex-col items-end gap-1">
                        <div className={cn("px-6 py-3 rounded-full text-lg font-black uppercase tracking-widest flex items-center gap-3 border", biz.isOpen ? "bg-success/10 text-success border-success/20" : "bg-text-4/10 text-text-4 border-text-4/20 opacity-60")}>
                          <div className={cn("w-3 h-3 rounded-full", biz.isOpen ? "bg-success animate-pulse" : "bg-text-4")} />
                          {biz.isOpen ? "Open" : "Closed"}
                        </div>
                        <span className="text-xs font-bold opacity-50 uppercase tracking-wider mr-2">{biz.text}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 flex items-center justify-between opacity-30 text-sm font-bold uppercase tracking-widest border-t-2 border-current pt-8">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Updates every second
            </div>
            <div>Esc to Exit Full Screen</div>
          </div>
        </div>
      </div>
    );
  }

  const openClocks = clocks.filter(c => getBusinessStatus(c.tz, now).isOpen).length;
  const displayClocks = filterMode === "all" ? clocks : clocks.filter(c => getBusinessStatus(c.tz, now).isOpen);

  const handleSort = () => {
    useWorldClockStore.setState(state => ({
      clocks: [...state.clocks].sort((a, b) => a.city.localeCompare(b.city))
    }));
    toast("Sorted alphabetically", "success");
  };

  const handleExport = () => {
    const csv = "City,Timezone,Country\n" + clocks.map(c => `${c.city},${c.tz},${c.country}`).join("\n");
    const a = document.createElement("a");
    a.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
    a.download = "world-clock-export.csv";
    a.click();
    toast("Exported to CSV", "success");
  };

  return (
    <div className={cn("space-y-8 mx-auto transition-all duration-300", isFocus ? "max-w-none pt-4 pb-12 px-4 sm:px-8" : "max-w-[1400px]")}>
      <TimezoneSearchModal isOpen={isModalOpen} onClose={handleCloseModal} />
      
      {/* Header: Primary Search Action & Minimized Stats/Tools */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-2 bg-surface border border-border rounded-2xl shadow-sm">
         <button 
           onClick={() => setIsModalOpen(true)}
           className="w-full md:w-auto px-6 py-3.5 bg-blue text-white rounded-xl text-sm font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:shadow-lg hover:shadow-blue/20 active:scale-98 transition-all"
         >
           <Search className="w-4 h-4 fill-current" />
           Add City 
           <kbd className="hidden sm:inline-flex px-2 py-0.5 bg-black/20 rounded text-[10px] shadow-inner font-mono tracking-normal">⌘K</kbd>
         </button>

         <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto px-2 md:px-0 pb-1 md:pb-0 no-scrollbar">
           {/* Minimized Stats */}
           <div className="hidden lg:flex items-center gap-4 px-4 text-text-4 text-xs font-bold uppercase tracking-widest border-r border-border mr-1">
             <span>{clocks.length} Zones</span>
             <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-success animate-pulse" /> {openClocks} Open</span>
           </div>
           
           <button onClick={handleSort} title="Sort Alphabetically" className="p-3 bg-surface-2 hover:bg-surface border border-border hover:border-text-4/30 rounded-xl text-text-3 hover:text-text transition-all flex items-center justify-center">
             <ArrowUpDown className="w-4 h-4" />
           </button>
           <button onClick={() => setFilterMode(f => f === "all" ? "open" : "all")} title="Toggle Open Only" className={cn("p-3 border rounded-xl transition-all flex items-center justify-center", filterMode === "open" ? "bg-success/10 border-success/30 text-success" : "bg-surface-2 border-border text-text-3 hover:text-text")}>
             <Filter className="w-4 h-4" />
           </button>
           <button onClick={handleExport} title="Export to CSV" className="p-3 bg-blue/10 border border-blue/20 rounded-xl text-blue hover:bg-blue/20 transition-all flex items-center justify-center">
             <Download className="w-4 h-4" />
           </button>
           
           <div className="w-[1px] h-8 bg-border mx-1" />
           
           <button 
             onClick={() => toggleFocus('world-clock')} 
             title={isFocus ? "Exit Focus Mode (Esc)" : "Focus Mode (F)"} 
             className="p-3 bg-surface-2 hover:bg-surface border border-border hover:border-text-4/30 rounded-xl text-text-3 hover:text-text transition-all flex items-center justify-center"
           >
             {isFocus ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
           </button>
         </div>
      </div>

      {/* Grid Layout: scales up for ultrawide */}
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={displayClocks.map(c => c.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Clock Cards */}
            {displayClocks.map((clock) => (
              <ClockCard 
                key={clock.id} 
                clock={clock} 
                now={now} 
                localTz={localTz} 
                isDraggable={filterMode === "all"} 
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Enhanced Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-4 font-bold uppercase tracking-widest bg-surface/40 backdrop-blur-md border border-border p-5 rounded-3xl mt-8">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            Auto Refresh Active
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5" />
            IANA Time Zone Database
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" />
            Sync: {now.toISOString().split('T')[1]?.split('.')[0]} UTC
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="opacity-50">v2.1.0</span>
          <button 
            onClick={() => openFeedback("feature", { toolId: "world-clock", toolName: "World Clock" })}
            className="flex items-center gap-2 text-blue hover:text-blue-400 transition-colors bg-blue/10 px-3 py-1.5 rounded-lg"
          >
            Feedback <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
