"use client";
import { useState, useEffect } from "react";
import { useWorldClockStore } from "@/src/features/world-clock/store";
import { useFullscreenContext } from "@/src/contexts/FullscreenContext";
import { Plus, Trash2, Globe, Clock, Star, Maximize2, Search, ArrowUpDown, Filter, Download, ArrowRight, Sun, Moon } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { AnalogClock } from "@/components/tools/world-clock/AnalogClock";
import { TimezoneSearchModal } from "@/components/tools/world-clock/TimezoneSearchModal";
import * as Popover from '@radix-ui/react-popover';
import { m } from "framer-motion";
import { useToast } from "@/components/ui/Toast";
import { useSupportStore } from "@/src/store/useSupportStore";
import { Settings2 } from "lucide-react";

const formatterCache = new Map<string, Intl.DateTimeFormat>();
function getCachedFormatter(tz: string, options: Intl.DateTimeFormatOptions) {
  const key = `${tz}-${JSON.stringify(options)}`;
  let formatter = formatterCache.get(key);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat("en-US", { ...options, timeZone: tz });
    formatterCache.set(key, formatter);
  }
  return formatter;
}

function getTimeInZone(tz: string, now: Date, hourFormat: 12 | 24, localTz: string) {
  try {
    const timeParts = getCachedFormatter(tz, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: hourFormat === 12,
    }).formatToParts(now);
    
    const dateParts = getCachedFormatter(tz, {
      weekday: "short",
      month: "short",
      day: "numeric",
    }).formatToParts(now);

    const h = parseInt(timeParts.find((p) => p.type === "hour")?.value ?? "0");
    const m = parseInt(timeParts.find((p) => p.type === "minute")?.value ?? "0");
    const s = parseInt(timeParts.find((p) => p.type === "second")?.value ?? "0");
    
    const wday = dateParts.find((p) => p.type === "weekday")?.value ?? "";
    const month = dateParts.find((p) => p.type === "month")?.value ?? "";
    const day = dateParts.find((p) => p.type === "day")?.value ?? "";

    const ampm = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 === 0 ? 12 : h % 12;

    const fullDateTimeOptions: Intl.DateTimeFormatOptions = { 
      year: 'numeric', month: 'numeric', day: 'numeric', 
      hour: 'numeric', minute: 'numeric', second: 'numeric', 
      hour12: false 
    };
    
    const nowLocal = new Date(getCachedFormatter(tz, fullDateTimeOptions).format(now));
    const nowUtc = new Date(getCachedFormatter("UTC", fullDateTimeOptions).format(now));
    const diffMs = nowLocal.getTime() - nowUtc.getTime();
    
    const diffH = Math.floor(Math.abs(diffMs) / 3600000);
    const diffM = Math.floor((Math.abs(diffMs) % 3600000) / 60000);
    const sign = diffMs >= 0 ? "+" : "-";
    const offset = `UTC${sign}${String(diffH).padStart(2, "0")}:${String(diffM).padStart(2, "0")}`;

    // Relative to Local
    const baseLocal = new Date(getCachedFormatter(localTz, fullDateTimeOptions).format(now)).getTime();
    const relativeMs = nowLocal.getTime() - baseLocal;
    const relDiffH = Math.round(relativeMs / 3600000);
    let relativeText = "Same time";
    if (relDiffH > 0) relativeText = `${relDiffH}h ahead`;
    if (relDiffH < 0) relativeText = `${Math.abs(relDiffH)}h behind`;

    const isNight = h >= 18 || h < 6;

    return {
      hours: h,
      minutes: m,
      seconds: s,
      displayTime: `${String(hourFormat === 12 ? hour12 : h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
      displaySeconds: String(s).padStart(2, "0"),
      date: `${wday}, ${month} ${day}`,
      offset,
      ampm,
      relativeText,
      isNight
    };
  } catch {
    return { hours: 0, minutes: 0, seconds: 0, displayTime: "--:--", displaySeconds: "--", date: "Invalid TZ", offset: "UTC+0", ampm: "AM", relativeText: "", isNight: false };
  }
}

function getBusinessStatus(tz: string, now: Date) {
  try {
    const parts = getCachedFormatter(tz, { hour: "numeric", minute: "numeric", weekday: "short", hour12: false }).formatToParts(now);
    const hour = parseInt(parts.find((p) => p.type === "hour")?.value ?? "0");
    const minute = parseInt(parts.find((p) => p.type === "minute")?.value ?? "0");
    const weekday = parts.find((p) => p.type === "weekday")?.value ?? "";
    
    const isWeekend = ["Sat", "Sun"].includes(weekday);
    const isOpen = !isWeekend && hour >= 9 && hour < 18;
    
    let text = "";
    let progress = 0;

    if (isOpen) {
      const minutesLeft = (18 * 60) - ((hour * 60) + minute);
      const totalBizMinutes = 9 * 60;
      progress = ((totalBizMinutes - minutesLeft) / totalBizMinutes) * 100;
      
      const hLeft = Math.floor(minutesLeft / 60);
      const mLeft = minutesLeft % 60;
      text = hLeft > 0 ? `Closes in ${hLeft}h ${mLeft}m` : `Closes in ${mLeft}m`;
    } else {
      progress = 0;
      if (isWeekend || hour >= 18) {
        text = "Opens Mon 9 AM";
      } else {
        const minutesLeft = (9 * 60) - ((hour * 60) + minute);
        const hLeft = Math.floor(minutesLeft / 60);
        const mLeft = minutesLeft % 60;
        text = hLeft > 0 ? `Opens in ${hLeft}h ${mLeft}m` : `Opens in ${mLeft}m`;
      }
    }

    return { isOpen, text, progress };
  } catch {
    return { isOpen: false, text: "", progress: 0 };
  }
}

export default function WorldClockClient() {
  const [now, setNow] = useState<Date | null>(null);
  const clocks = useWorldClockStore(state => state.clocks);
  const settings = useWorldClockStore(state => state.settings);
  const updateSettings = useWorldClockStore(state => state.updateSettings);
  const removeClock = useWorldClockStore(state => state.removeClock);
  const { displayMode, activeToolId } = useFullscreenContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localTz, setLocalTz] = useState('');
  const [filterMode, setFilterMode] = useState<"all" | "open">("all");
  const { toast } = useToast();
  const openFeedback = useSupportStore(state => state.openFeedback);
  
  const isDashboard = displayMode === 'dashboard' && activeToolId === 'world-clock';

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
            {clocks.map(({ id, city, tz }) => {
              const t = getTimeInZone(tz, now, settings.hourFormat, localTz);
              const biz = getBusinessStatus(tz, now);
              return (
                <div key={id} className="flex items-center justify-between py-6 px-10 bg-surface-2/10 backdrop-blur-md rounded-[40px] border border-border/20 shadow-2xl">
                  <div className="flex flex-col w-1/3">
                    <span className="text-3xl md:text-5xl font-bold truncate opacity-90">{city}</span>
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
    <div className="space-y-8 max-w-[1400px] mx-auto">
      <TimezoneSearchModal isOpen={isModalOpen} onClose={handleCloseModal} />
      
      {/* Quick Actions & Stats Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-surface border border-border rounded-3xl shadow-sm">
        <div className="flex items-center gap-6 px-2">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue" />
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-text-4">Total Zones</p>
              <p className="text-sm font-bold">{clocks.length} Cities</p>
            </div>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-text-4">Business Active</p>
              <p className="text-sm font-bold">{openClocks} Open / {clocks.length - openClocks} Closed</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button onClick={handleSort} className="px-4 py-2 bg-surface-2 border border-border rounded-xl text-xs font-bold uppercase tracking-widest text-text-3 hover:text-text hover:border-text-4 transition-all flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4" /> Sort
          </button>
          <button onClick={() => setFilterMode(f => f === "all" ? "open" : "all")} className={cn("px-4 py-2 border rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2", filterMode === "open" ? "bg-success/10 border-success/30 text-success" : "bg-surface-2 border-border text-text-3 hover:text-text hover:border-text-4")}>
            <Filter className="w-4 h-4" /> {filterMode === "all" ? "Filter" : "Showing Open"}
          </button>
          <button onClick={handleExport} className="px-4 py-2 bg-blue/10 border border-blue/20 rounded-xl text-xs font-bold uppercase tracking-widest text-blue hover:bg-blue/20 transition-all flex items-center gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Grid Layout: scales up for ultrawide */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        
        {/* Add City Card */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="border-2 border-dashed border-border rounded-3xl p-6 flex flex-col items-center justify-center gap-4 text-text-4 hover:border-blue hover:text-blue hover:bg-blue/5 transition-all group min-h-[280px]"
        >
          <div className="w-16 h-16 rounded-full bg-surface border border-border flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ease-expo shadow-sm">
            <Search className="w-8 h-8" />
          </div>
          <div className="text-center">
            <span className="block text-sm font-black uppercase tracking-widest-lg mb-1">Add City</span>
            <span className="block text-xs font-medium opacity-80">Search any timezone...</span>
          </div>
          <kbd className="hidden sm:inline-flex bg-surface-2 border border-border px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm">
            ⌘K
          </kbd>
        </button>

        {/* Clock Cards */}
        {displayClocks.map(({ id, city, country, tz }) => {
          const t = getTimeInZone(tz, now, settings.hourFormat, localTz);
          const biz = getBusinessStatus(tz, now);
          const isLocal = tz === localTz;

          return (
            <m.div
              layout
              key={id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={cn(
                "bg-surface border rounded-3xl p-6 flex flex-col justify-between group transition-all duration-300 min-h-[280px] relative overflow-hidden",
                isLocal ? "border-blue shadow-lg shadow-blue/5" : "border-border hover:border-text-4/50 shadow-sm hover:shadow-md"
              )}
            >
              {/* Decorative Time of Day Gradient Background */}
              <div className={cn(
                "absolute inset-0 opacity-[0.03] pointer-events-none transition-colors duration-1000",
                t.isNight ? "bg-gradient-to-br from-indigo-900 to-black" : "bg-gradient-to-br from-blue to-amber-500"
              )} />

              {/* Header */}
              <div className="flex items-start justify-between relative z-content">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {isLocal ? (
                      <Star className="w-4 h-4 text-blue fill-current" />
                    ) : (
                      t.isNight ? <Moon className="w-4 h-4 text-text-4" /> : <Sun className="w-4 h-4 text-amber-500" />
                    )}
                    <h2 className="font-black text-xl text-text leading-tight tracking-tight">{city}</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-text-4 font-bold uppercase tracking-wider">{country}</p>
                    <span className="text-[10px] font-black uppercase tracking-widest bg-surface-2 px-1.5 py-0.5 rounded text-text-3">
                      {t.relativeText}
                    </span>
                  </div>
                </div>
                
                <button 
                  onClick={() => removeClock(id)} 
                  className="opacity-100 lg:opacity-0 group-hover:opacity-100 p-2 bg-surface-2 hover:bg-error/10 border border-transparent hover:border-error/20 text-text-4 hover:text-error rounded-xl transition-all shadow-sm" 
                  title="Remove clock"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Clock Face & Time */}
              <div className="flex flex-col items-center justify-center py-4 relative z-content">
                <div className="flex items-center gap-6 w-full px-2">
                  <div className="shrink-0 drop-shadow-md">
                    <AnalogClock hours={t.hours} minutes={t.minutes} seconds={t.seconds} />
                  </div>
                  
                  <div className="font-mono flex flex-col justify-center">
                    <div className="flex items-baseline gap-1">
                      <p className="text-4xl md:text-5xl font-black text-text tabular-nums tracking-tighter">{t.displayTime}</p>
                      <p className="text-xl font-bold text-text-4 tabular-nums">:{t.displaySeconds}</p>
                    </div>
                    {settings.hourFormat === 12 && (
                      <p className="text-sm font-black text-blue mt-0.5">{t.ampm}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer details */}
              <div className="space-y-3 relative z-content">
                {/* Business Hours Progress */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                    <span className={biz.isOpen ? "text-success" : "text-text-4 opacity-70"}>
                      {biz.isOpen ? "Open" : "Closed"}
                    </span>
                    <span className="text-text-4">{biz.text}</span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-2 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full rounded-full transition-all duration-1000", biz.isOpen ? "bg-success" : "bg-text-4 opacity-20")}
                      style={{ width: `${biz.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-3 border-t border-border/50">
                  <span className="text-text-3 font-bold uppercase tracking-wider">{t.date}</span>
                  <span className="text-text-4 font-mono font-semibold bg-surface-2 px-1.5 py-0.5 rounded">{t.offset}</span>
                </div>
              </div>
            </m.div>
          );
        })}
      </div>

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
