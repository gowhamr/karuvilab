import type React from "react";
import { useWorldClockStore, type ClockItem } from "@/src/features/world-clock/store";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from "@/src/lib/utils";
import { Star, Moon, Sun, GripVertical, Trash2 } from "lucide-react";
import { getTimeInZone, getBusinessStatus } from "./utils";

export function ClockCard({ clock, now, localTz, isDraggable }: { clock: ClockItem, now: Date, localTz: string, isDraggable: boolean }) {
  const settings = useWorldClockStore(state => state.settings);
  const removeClock = useWorldClockStore(state => state.removeClock);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: clock.id, disabled: !isDraggable });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  const { id, city, country, tz } = clock;
  const t = getTimeInZone(tz, now, settings.hourFormat, localTz);
  const biz = getBusinessStatus(tz, now);
  const isLocal = tz === localTz;

  let title = city;
  let subtitle = country;
  
  if (settings.primaryLabel === 'country') {
    title = country;
    subtitle = city;
  } else if (settings.primaryLabel === 'custom') {
    title = clock.customLabel || city; // Fallback to city
    subtitle = `${city}, ${country}`;
  }

  const handleCustomLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    useWorldClockStore.getState().updateClock(id, { customLabel: e.target.value });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-surface border rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 flex flex-col justify-between group transition-all duration-300 min-h-44 sm:min-h-72 relative overflow-hidden",
        isLocal ? "border-blue shadow-lg shadow-blue/5" : "border-border hover:border-text-4/50 shadow-sm hover:shadow-md",
        t.isNight ? "bg-indigo-950/10" : "bg-amber-500/5",
        isDragging ? "shadow-2xl scale-102 opacity-90 border-blue/50" : ""
      )}
    >


      {/* Decorative Time of Day Gradient Background */}
      <div className={cn(
        "absolute inset-0 opacity-[0.03] pointer-events-none transition-colors duration-1000",
        t.isNight ? "bg-gradient-to-br from-indigo-900 to-black" : "bg-gradient-to-br from-blue to-amber-500"
      )} />

      {/* Header */}
      <div className="flex items-start justify-between relative z-content">
        <div className="space-y-1 min-w-0 flex-1 pr-1.5">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            {isLocal ? (
              <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue fill-current shrink-0 mt-0.5" />
            ) : (
              t.isNight ? <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-text-muted shrink-0 mt-0.5" /> : <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 shrink-0 mt-0.5" />
            )}
            {settings.primaryLabel === 'custom' ? (
              <input 
                type="text" 
                value={clock.customLabel || ""}
                onChange={handleCustomLabelChange}
                placeholder={city}
                className="font-black text-sm sm:text-xl text-text leading-tight tracking-tight bg-transparent border-b border-dashed border-border/50 hover:border-text-4 focus:border-blue outline-none transition-colors w-full pb-0.5 truncate"
                onPointerDown={e => e.stopPropagation()} // Prevent drag when focusing input
              />
            ) : (
              <h2 className="font-black text-sm sm:text-xl text-text leading-tight tracking-tight truncate">{title}</h2>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
            <p className="text-[10px] sm:text-xs text-text-muted font-bold uppercase tracking-wider truncate max-w-[90px] sm:max-w-none">{subtitle}</p>
            <span className="text-[9px] sm:text-tiny font-bold uppercase tracking-widest-sm bg-surface-2 px-1.5 py-0.5 rounded text-text-3 shrink-0">
              {t.relativeText}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          {isDraggable && (
            <div 
              {...attributes}
              {...listeners}
              className="p-1 sm:p-2 cursor-grab active:cursor-grabbing text-text-muted hover:text-text bg-surface-2 hover:bg-surface-2/80 rounded-lg sm:rounded-xl touch-none flex items-center justify-center shadow-sm border border-transparent hover:border-border"
            >
              <GripVertical className="w-3.5 h-3.5 sm:w-4 sm:h-4 pointer-events-none" />
            </div>
          )}
          <button 
            onClick={() => removeClock(id)} 
            className="p-1 sm:p-2 bg-surface-2 hover:bg-error/10 border border-transparent hover:border-error/20 text-text-muted hover:text-error rounded-lg sm:rounded-xl transition-all shadow-sm flex items-center justify-center" 
            title="Remove clock"
          >
            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      {/* Clock Face & Time */}
      <div className="flex flex-col items-center justify-center py-3 sm:py-8 relative z-content">
        <div className="font-mono flex flex-col items-center justify-center">
          <div className="flex items-baseline justify-center gap-0.5 sm:gap-1">
            <p className="text-2xl sm:text-5xl md:text-6xl font-black text-text tabular-nums tracking-tighter">{t.displayTime}</p>
            <p className="text-sm sm:text-2xl font-bold text-text-muted tabular-nums">:{t.displaySeconds}</p>
          </div>
          {settings.hourFormat === 12 && (
            <p className="text-[10px] sm:text-base font-black text-blue mt-0.5 sm:mt-1">{t.ampm}</p>
          )}
        </div>
      </div>

      {/* Footer details */}
      <div className="space-y-2 sm:space-y-3 relative z-content">
        {/* Business Hours Progress & Status Indicator Dot */}
        <div className="space-y-1 sm:space-y-1.5">
          <div className="flex items-center justify-between text-[10px] sm:text-xs font-bold uppercase tracking-wider">
            <div className="flex items-center gap-1.5 shrink-0">
              <span className={cn("w-2 h-2 rounded-full shrink-0", biz.isOpen ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse" : "bg-text-4/40")} />
              <span className={cn("text-[10px] sm:text-xs font-bold uppercase tracking-wider", biz.isOpen ? "text-emerald-500 dark:text-emerald-400" : "text-text-4")}>
                {biz.isOpen ? "Open" : "Closed"}
              </span>
            </div>
            <span className="text-text-muted text-[9px] sm:text-xs truncate max-w-[80px] sm:max-w-none text-right">{biz.text}</span>
          </div>
          <div className="h-1 sm:h-1.5 w-full bg-surface-2 rounded-full overflow-hidden">
            <div 
              className={cn("h-full rounded-full transition-all duration-1000", biz.isOpen ? "bg-emerald-500" : "bg-text-4 opacity-20")}
              style={{ width: `${biz.progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] sm:text-xs pt-1.5 sm:pt-3 border-t border-border/50">
          <span className="text-text-3 font-bold uppercase tracking-wider truncate pr-1 text-[9px] sm:text-xs">{t.date}</span>
          <span className="text-text-muted font-mono font-semibold bg-surface-2 px-1.5 py-0.5 rounded shrink-0 text-[9px] sm:text-xs">{t.offset}</span>
        </div>
      </div>
    </div>
  );
}
