"use client";
import { useState, useEffect } from "react";
import { useWorldClockStore } from "@/src/features/world-clock/store";
import { useFullscreenContext } from "@/src/contexts/FullscreenContext";
import { Plus, Trash2, Globe, Clock, Star, Maximize2 } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { AnalogClock } from "@/components/tools/world-clock/AnalogClock";
import { TimezoneSearchModal } from "@/components/tools/world-clock/TimezoneSearchModal";

import * as Popover from '@radix-ui/react-popover';
import { Settings2 } from "lucide-react";

function getTimeInZone(tz: string, now: Date, hourFormat: 12 | 24) {
  try {
    const timeParts = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: hourFormat === 12,
    }).formatToParts(now);
    const dateParts = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
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

    const nowLocal = new Date(now.toLocaleString("en-US", { timeZone: tz }));
    const diffMs = nowLocal.getTime() - new Date(now.toLocaleString("en-US", { timeZone: "UTC" })).getTime();
    const diffH = Math.floor(Math.abs(diffMs) / 3600000);
    const diffM = Math.floor((Math.abs(diffMs) % 3600000) / 60000);
    const sign = diffMs >= 0 ? "+" : "-";
    const offset = `UTC${sign}${String(diffH).padStart(2, "0")}:${String(diffM).padStart(2, "0")}`;

    return {
      hours: h,
      minutes: m,
      seconds: s,
      displayTime: `${String(hour12).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
      displaySeconds: String(s).padStart(2, "0"),
      date: `${wday}, ${month} ${day}`,
      offset,
      ampm,
    };
  } catch {
    return { hours: 0, minutes: 0, seconds: 0, displayTime: "--:--", displaySeconds: "--", date: "Invalid TZ", offset: "UTC+0", ampm: "AM" };
  }
}

function isBusinessHours(tz: string, now: Date): boolean {
  try {
    const parts = new Intl.DateTimeFormat("en-US", { timeZone: tz, hour: "numeric", weekday: "short", hour12: false }).formatToParts(now);
    const hour = parseInt(parts.find((p) => p.type === "hour")?.value ?? "0");
    const weekday = parts.find((p) => p.type === "weekday")?.value ?? "";
    return !["Sat", "Sun"].includes(weekday) && hour >= 9 && hour < 18;
  } catch {
    return false;
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
  
  const isDashboard = displayMode === 'dashboard' && activeToolId === 'world-clock';

  useEffect(() => {
    setLocalTz(Intl.DateTimeFormat().resolvedOptions().timeZone);
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!now) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-surface border border-border rounded-3xl p-6 h-40" />
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
                      <option value="dark">Dark (Default)</option>
                      <option value="amoled">Pitch Black (AMOLED)</option>
                      <option value="light">Light Mode</option>
                      <option value="matrix">Matrix Hacker</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-3">Clock Size</label>
                    <div className="flex gap-2">
                      {['small', 'medium', 'large', 'huge'].map(size => (
                        <button 
                          key={size}
                          onClick={() => updateSettings({ clockSize: size as any })}
                          className={cn("flex-1 py-1.5 rounded text-xs font-bold capitalize transition-colors", settings.clockSize === size ? "bg-blue text-white" : "bg-surface-2 text-text-4 hover:text-text")}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-3">Time Format</label>
                    <div className="flex gap-2">
                      {[12, 24].map(fmt => (
                        <button 
                          key={fmt}
                          onClick={() => updateSettings({ hourFormat: fmt as 12|24 })}
                          className={cn("flex-1 py-1.5 rounded text-xs font-bold transition-colors", settings.hourFormat === fmt ? "bg-blue text-white" : "bg-surface-2 text-text-4 hover:text-text")}
                        >
                          {fmt}-Hour
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-border">
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-sm font-medium">Show Seconds</span>
                      <input type="checkbox" checked={settings.showSeconds} onChange={e => updateSettings({ showSeconds: e.target.checked })} className="accent-blue" />
                    </label>
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-sm font-medium">Show Business Status</span>
                      <input type="checkbox" checked={settings.showBusinessHours} onChange={e => updateSettings({ showBusinessHours: e.target.checked })} className="accent-blue" />
                    </label>
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-sm font-medium">Show UTC Offset</span>
                      <input type="checkbox" checked={settings.showUtcOffset} onChange={e => updateSettings({ showUtcOffset: e.target.checked })} className="accent-blue" />
                    </label>
                  </div>
                </div>
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </div>

        <div className="flex flex-col gap-12 w-full max-w-5xl px-8 relative z-content">
          <div className="flex items-center justify-center gap-4 opacity-50 mb-4">
            <Globe className="w-12 h-12" />
            <h1 className="text-4xl md:text-5xl font-black tracking-[0.3em] uppercase">World Clock</h1>
          </div>
          
          <div className="flex flex-col gap-6">
            {clocks.map(({ id, city, tz }) => {
              const t = getTimeInZone(tz, now, settings.hourFormat);
              const biz = isBusinessHours(tz, now);
              return (
                <div key={id} className="flex items-center justify-between py-6 px-10 bg-surface-2/10 backdrop-blur-md rounded-[40px] border border-border/20 shadow-2xl">
                  <span className="text-3xl md:text-5xl font-bold w-1/3 truncate opacity-90">{city}</span>
                  
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
                      <div className={cn("px-6 py-3 rounded-full text-lg font-black uppercase tracking-widest flex items-center gap-3 border", biz ? "bg-success/10 text-success border-success/20" : "bg-text-4/10 text-text-4 border-text-4/20 opacity-60")}>
                        <div className={cn("w-3 h-3 rounded-full", biz ? "bg-success animate-pulse" : "bg-text-4")} />
                        {biz ? "Open" : "Closed"}
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

  return (
    <div className="space-y-8">
      <TimezoneSearchModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {clocks.map(({ id, city, country, tz }) => {
          const t = getTimeInZone(tz, now, settings.hourFormat);
          const biz = isBusinessHours(tz, now);
          const isLocal = tz === localTz;

          return (
            <div
              key={id}
              className={cn(
                "bg-surface border rounded-3xl p-6 space-y-4 group transition-all duration-300",
                isLocal ? "border-blue shadow-2xl shadow-blue/10" : "border-border hover:border-blue/30"
              )}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    {isLocal && <Star className="w-3.5 h-3.5 text-blue fill-current" />}
                    <p className="font-black text-lg text-text leading-tight">{city}</p>
                  </div>
                  <p className="text-xs text-text-4 font-bold uppercase tracking-wider">{country}</p>
                </div>
                <div className="flex items-center gap-2">
                   <div className={cn("px-2.5 py-1 rounded-full text-tiny font-black uppercase tracking-widest", biz ? "bg-success/10 text-success" : "bg-text-4/10 text-text-4")}>
                    {biz ? "Open" : "Closed"}
                  </div>
                  <button onClick={() => removeClock(id)} className="opacity-100 md:opacity-0 group-hover:opacity-100 p-1.5 hover:bg-error/10 text-text-4 hover:text-error rounded-lg transition-all" title="Remove clock">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <AnalogClock hours={t.hours} minutes={t.minutes} seconds={t.seconds} />
                <div className="font-mono flex items-baseline gap-2 flex-1">
                  <p className="text-5xl font-black text-text tabular-nums">{t.displayTime}</p>
                  <p className="text-2xl font-bold text-text-4 tabular-nums">:{t.displaySeconds}</p>
                  <p className="text-lg font-black text-blue ml-auto">{t.ampm}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-4 border-t-2 border-border/50">
                <span className="text-text-3 font-bold uppercase tracking-wider">{t.date}</span>
                <span className="text-text-4 font-mono font-semibold">{t.offset}</span>
              </div>
            </div>
          );
        })}
          
        <button 
          onClick={() => setIsModalOpen(true)}
          className="border-2 border-dashed border-border rounded-3xl p-6 flex flex-col items-center justify-center gap-4 text-text-4 hover:border-blue hover:text-blue transition-all group min-h-45"
        >
          <div className="w-16 h-16 rounded-full bg-surface border border-border flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ease-expo">
            <Plus className="w-8 h-8" />
          </div>
          <span className="text-sm font-black uppercase tracking-widest-lg">Add Clock</span>
        </button>
      </div>

      <div className="flex items-center justify-center gap-8 text-xs text-text-4 font-bold uppercase tracking-widest bg-surface/50 border border-border py-4 rounded-2xl">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-success" />
          Business Hours
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5" />
          Live Updates
        </div>
        <div className="flex items-center gap-2">
          <Globe className="w-3.5 h-3.5" />
          Persistent
        </div>
      </div>
    </div>
  );
}
