"use client";
import { useState, useEffect } from "react";
import { useWorldClockStore } from "@/src/store/useWorldClockStore";
import { Plus, Trash2, Globe, Clock, Star } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { AnalogClock } from "@/components/tools/world-clock/AnalogClock";
import { TimezoneSearchModal } from "@/components/tools/world-clock/TimezoneSearchModal";

function getTimeInZone(tz: string, now: Date) {
  try {
    const timeParts = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
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
  const removeClock = useWorldClockStore(state => state.removeClock);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localTz, setLocalTz] = useState('');

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
          <div key={i} className="bg-surface border border-border rounded-3xl p-6 h-[160px]" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <TimezoneSearchModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {clocks.map(({ id, city, country, tz }) => {
          const t = getTimeInZone(tz, now);
          const biz = isBusinessHours(tz, now);
          const isLocal = tz === localTz;

          return (
            <div
              key={id}
              className={cn(
                "bg-surface border-2 rounded-3xl p-6 space-y-4 group transition-all duration-300",
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
                   <div className={cn("px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest", biz ? "bg-success/10 text-success" : "bg-text-4/10 text-text-4")}>
                    {biz ? "Open" : "Closed"}
                  </div>
                  <button onClick={() => removeClock(id)} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-error/10 text-text-4 hover:text-error rounded-lg transition-all" title="Remove clock">
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
          className="border-2 border-dashed border-border rounded-3xl p-6 flex flex-col items-center justify-center gap-4 text-text-4 hover:border-blue hover:text-blue transition-all group min-h-[180px]"
        >
          <div className="w-16 h-16 rounded-full bg-surface border-2 border-border flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ease-expo">
            <Plus className="w-8 h-8" />
          </div>
          <span className="text-sm font-black uppercase tracking-[0.2em]">Add Clock</span>
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
